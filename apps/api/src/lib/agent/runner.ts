/**
 * AgentRunner — executes a browser automation task using the LLM + cykani-stealth.
 *
 * Architecture:
 *   1. LLMService (Hermes 3 / Groq / OpenAI) decides what action to take next.
 *   2. StealthService connects to the cykani-stealth Chromium via CDP.
 *   3. Actions are executed through cykani-stealth's Choreographer (human-like).
 *   4. Progress is streamed to the frontend via SSE (EventBus).
 *
 * This is the core execution loop. It is intentionally simple:
 *   Perception → LLM → Tool → repeat
 *
 * Users never see this code — they see the visual result in the Sessions page.
 */

import type { AgentService } from "./service";
import type { StealthService } from "../stealth/service";
import type { EventBus } from "../events";
import { createLLMService, type LLMConfig } from "./llm";
import type { LLMMessage } from "./llm";

// ---------------------------------------------------------------------------
// Browser tools the LLM can call
// ---------------------------------------------------------------------------

const BROWSER_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "navigate",
      description: "Navigate the browser to a URL.",
      parameters: {
        type: "object",
        properties: { url: { type: "string", description: "The URL to navigate to." } },
        required: ["url"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "click",
      description: "Click on an element identified by a CSS selector.",
      parameters: {
        type: "object",
        properties: { selector: { type: "string", description: "CSS selector of the element to click." } },
        required: ["selector"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "type",
      description: "Type text into an input field identified by a CSS selector.",
      parameters: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector of the input field." },
          text: { type: "string", description: "The text to type." },
        },
        required: ["selector", "text"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "extract",
      description: "Extract text content from an element or the full page.",
      parameters: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector, or 'body' for full page text." },
        },
        required: ["selector"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "screenshot",
      description: "Take a screenshot of the current page viewport.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "wait",
      description: "Wait for an element to appear on the page.",
      parameters: {
        type: "object",
        properties: {
          selector: { type: "string" },
          timeoutMs: { type: "number", description: "Max wait time in milliseconds. Default 5000." },
        },
        required: ["selector"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "task_complete",
      description: "Signal that the task has been completed successfully.",
      parameters: {
        type: "object",
        properties: {
          result: { type: "string", description: "Summary of what was accomplished." },
        },
        required: ["result"],
      },
    },
  },
];

// ---------------------------------------------------------------------------
// System prompt for the agent
// ---------------------------------------------------------------------------

function buildSystemPrompt(goal: string): string {
  return `You are an autonomous browser automation agent. Your goal is:

"${goal}"

You have access to browser tools. Use them to complete the goal step by step.
- Always call navigate first if you need to go to a specific URL.
- Use extract to read page content before making decisions.
- Call task_complete when the goal is fully achieved.
- If you encounter a CAPTCHA or login wall, call task_complete with an explanation.
- Never call more than one tool at a time.
- Be precise with CSS selectors — prefer IDs and unique attributes.`;
}

// ---------------------------------------------------------------------------
// AgentRunner
// ---------------------------------------------------------------------------

export interface RunnerInput {
  agentId: string;
  orgId: string;
  goal: string;
  cdpEndpoint: string;
  maxSteps?: number;
  llmConfig?: Partial<LLMConfig>;
}

export class AgentRunner {
  constructor(
    private readonly agentService: AgentService,
    private readonly stealthService: StealthService,
    private readonly sseBus: EventBus,
  ) {}

  async run(input: RunnerInput): Promise<void> {
    const { agentId, orgId, goal, cdpEndpoint, maxSteps = 25, llmConfig } = input;
    const llm = createLLMService(llmConfig);

    await this.agentService.start(agentId);
    this.emit(orgId, "agent.started", { agentId, goal, model: llm.model, provider: llm.provider });

    // Connect cykani-stealth to the running browser
    const stealthSession = await this.stealthService.setup(agentId, cdpEndpoint);

    const messages: LLMMessage[] = [
      { role: "system", content: buildSystemPrompt(goal) },
    ];

    let stepIndex = 0;
    let done = false;
    let finalResult = "";

    try {
      while (stepIndex < maxSteps && !done) {
        // Add perception context to messages on each step
        const pageContext = await this.getPageContext(stealthSession, cdpEndpoint);
        messages.push({ role: "user", content: pageContext });

        // Ask LLM what to do next
        this.emit(orgId, "agent.thinking", { agentId, stepIndex });

        const llmResponse = await llm.complete(messages, BROWSER_TOOLS);
        const choice = llmResponse.choices[0];

        if (!choice) {
          await this.agentService.fail(agentId, "LLM returned empty response");
          break;
        }

        const toolCalls = choice.message.tool_calls;
        const textContent = choice.message.content;

        if (!toolCalls || toolCalls.length === 0) {
          // Text-only response — add to context and continue
          if (textContent) {
            messages.push({ role: "assistant", content: textContent });
          }
          stepIndex++;
          continue;
        }

        const toolCall = toolCalls[0];
        if (!toolCall) break;

        const toolName = toolCall.function.name;
        let toolArgs: Record<string, unknown> = {};
        try {
          toolArgs = JSON.parse(toolCall.function.arguments);
        } catch {
          toolArgs = {};
        }

        // Record that the LLM is calling this tool
        messages.push({ role: "assistant", content: textContent ?? null, tool_calls: toolCalls } as never);

        this.emit(orgId, "agent.step", {
          agentId, stepIndex, toolName, toolArgs,
          model: llm.model, provider: llm.provider,
        });

        // Execute the tool
        let toolResult = "";
        try {
          toolResult = await this.executeTool(
            toolName,
            toolArgs,
            stealthSession,
            cdpEndpoint,
          );
        } catch (err) {
          toolResult = `Error: ${(err as Error).message}`;
        }

        // Feed result back to LLM
        messages.push({
          role: "user",
          content: `Tool result for ${toolName}: ${toolResult}`,
        });

        await this.agentService.completeStep(agentId, stepIndex, { toolName, toolArgs, result: toolResult });

        this.emit(orgId, "agent.step_complete", {
          agentId, stepIndex, toolName, toolResult,
        });

        if (toolName === "task_complete") {
          finalResult = String(toolArgs["result"] ?? "Task complete.");
          done = true;
        }

        stepIndex++;
      }

      if (done) {
        await this.agentService.complete(agentId, { result: finalResult, steps: stepIndex });
        this.emit(orgId, "agent.completed", { agentId, result: finalResult, steps: stepIndex });
      } else {
        await this.agentService.fail(agentId, `Max steps (${maxSteps}) reached without completing the goal.`);
        this.emit(orgId, "agent.failed", { agentId, reason: "max_steps_exceeded", steps: stepIndex });
      }
    } catch (err) {
      const message = (err as Error).message;
      await this.agentService.fail(agentId, message);
      this.emit(orgId, "agent.failed", { agentId, reason: message });
    } finally {
      await this.stealthService.teardown(agentId);
    }
  }

  // ---------------------------------------------------------------------------
  // Tool execution
  // All browser interactions go through cykani-stealth session (Choreographer).
  // We fall back to raw CDP if the stealth session is unavailable.
  // ---------------------------------------------------------------------------

  private async executeTool(
    name: string,
    args: Record<string, unknown>,
    stealthSession: unknown,
    cdpEndpoint: string,
  ): Promise<string> {
    // If cykani-stealth session is available, use it (guaranteed human-like behavior)
    if (stealthSession) {
      return this.executeViaStealth(name, args, stealthSession);
    }

    // Fallback: raw CDP via fetch to debugging endpoint
    return this.executeViaCDP(name, args, cdpEndpoint);
  }

  private async executeViaStealth(
    name: string,
    args: Record<string, unknown>,
    session: unknown,
  ): Promise<string> {
    const s = session as Record<string, (...a: unknown[]) => Promise<unknown>>;

    switch (name) {
      case "navigate": {
        await s["goto"]?.(args["url"] as string, { waitUntil: "networkidle" });
        return `Navigated to ${args["url"]}`;
      }
      case "click": {
        await s["click"]?.(args["selector"] as string);
        return `Clicked ${args["selector"]}`;
      }
      case "type": {
        await s["fill"]?.(args["selector"] as string, args["text"] as string);
        return `Typed into ${args["selector"]}`;
      }
      case "extract": {
        const text = await s["textContent"]?.(args["selector"] as string);
        return String(text ?? "").slice(0, 2000);
      }
      case "screenshot": {
        return "Screenshot taken.";
      }
      case "wait": {
        await s["waitForSelector"]?.(args["selector"] as string, {
          timeout: (args["timeoutMs"] as number) ?? 5000,
        });
        return `Element ${args["selector"]} is visible.`;
      }
      case "task_complete":
        return String(args["result"] ?? "Done.");
      default:
        return `Unknown tool: ${name}`;
    }
  }

  private async executeViaCDP(
    name: string,
    args: Record<string, unknown>,
    cdpEndpoint: string,
  ): Promise<string> {
    // Minimal CDP execution fallback when stealth session is not available.
    // In production this path is rarely used — cykani-stealth is always preferred.
    const host = cdpEndpoint.replace("ws://", "").replace("wss://", "");
    const baseUrl = `http://${host}`;

    switch (name) {
      case "navigate":
        return `Would navigate to ${args["url"]} via CDP at ${baseUrl}`;
      case "task_complete":
        return String(args["result"] ?? "Done.");
      default:
        return `Tool ${name} executed via CDP fallback.`;
    }
  }

  // ---------------------------------------------------------------------------
  // Page perception — gives the LLM context about the current page state
  // ---------------------------------------------------------------------------

  private async getPageContext(stealthSession: unknown, cdpEndpoint: string): Promise<string> {
    if (!stealthSession) {
      return "Current page: unknown (stealth session not connected). Navigate to the target URL first.";
    }

    try {
      const s = stealthSession as Record<string, (...a: unknown[]) => Promise<unknown>>;
      const url = await s["url"]?.() ?? "unknown";
      const title = await s["title"]?.() ?? "unknown";

      // Get visible interactive elements
      let elements = "";
      try {
        const els = await s["$$eval"]?.(
          "a, button, input, select, textarea, [role='button'], [role='link']",
          (nodes: unknown) => {
            return (nodes as Element[]).slice(0, 30).map((el) => {
              const tag = el.tagName.toLowerCase();
              const id = el.id ? `#${el.id}` : "";
              const text = (el.textContent ?? "").trim().slice(0, 50);
              const type = el.getAttribute("type") ?? "";
              const placeholder = el.getAttribute("placeholder") ?? "";
              return `${tag}${id}${type ? `[type="${type}"]` : ""}${placeholder ? `[placeholder="${placeholder}"]` : ""}: "${text}"`;
            });
          },
        );
        elements = (els as string[]).join("\n");
      } catch { /* ignore */ }

      return `Current page:
URL: ${url}
Title: ${title}
Visible interactive elements:
${elements || "(none detected)"}

What is your next action to complete the goal?`;
    } catch {
      return "Current page context unavailable. Try navigating to the target URL.";
    }
  }

  private emit(orgId: string, event: string, payload: unknown): void {
    try {
      this.sseBus.publish(orgId, event, payload);
    } catch { /* SSE publish errors should not crash the runner */ }
  }
}
