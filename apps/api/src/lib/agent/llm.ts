/**
 * LLM service for the Cykani agent execution loop.
 *
 * Supports multiple providers via an OpenAI-compatible interface:
 *
 *   "hermes"     → NousResearch Hermes 3 via OpenRouter (free tier available).
 *                  MIT-licensed model. Users do not install anything — we host
 *                  or route via OpenRouter on the backend. Cykani handles the
 *                  API key; the user just picks "Hermes" in the UI.
 *                  Model ID: nousresearch/hermes-3-llama-3.1-405b
 *
 *   "groq"       → Groq inference (Llama 3.1 70B). Free tier: 14,400 req/day.
 *                  Fast, low-latency. Good default for most agent tasks.
 *
 *   "openai"     → OpenAI GPT-4o. Best quality, higher cost.
 *
 *   "anthropic"  → Anthropic Claude 3.5 Sonnet. Good reasoning.
 *
 *   "custom"     → Any OpenAI-compatible endpoint (self-hosted Ollama, vLLM, etc.)
 *
 * PROVIDER STRATEGY:
 *   Default: "hermes" via OpenRouter — zero infra cost until we self-host.
 *   Once AWS credits land: self-host Hermes 3 70B on EC2 for lower latency.
 *   Users never see or configure this — they just see model names in the UI.
 *
 * LICENSE NOTE:
 *   NousResearch/Hermes-3 is based on Llama 3.1 (Meta AI license — free for
 *   commercial use under 700M MAU threshold). No licensing risk for Cykani.
 */

export type LLMProvider = "hermes" | "groq" | "openai" | "anthropic" | "custom";

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export interface LLMChoice {
  message: {
    role: "assistant";
    content: string | null;
    tool_calls?: LLMToolCall[];
  };
  finish_reason: string;
}

export interface LLMResponse {
  id: string;
  choices: LLMChoice[];
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

// ---------------------------------------------------------------------------
// Provider defaults
// Provider endpoints that implement the OpenAI Chat Completions format.
// ---------------------------------------------------------------------------

const PROVIDER_DEFAULTS: Record<LLMProvider, { baseUrl: string; model: string }> = {
  // Hermes 3 405B via OpenRouter — MIT model, OpenAI-compatible API
  hermes: {
    baseUrl: "https://openrouter.ai/api/v1",
    model: "nousresearch/hermes-3-llama-3.1-405b",
  },
  // Groq — fastest inference, free tier, good for quick agent steps
  groq: {
    baseUrl: "https://api.groq.com/openai/v1",
    model: "llama-3.1-70b-versatile",
  },
  // OpenAI — highest quality, use for complex reasoning
  openai: {
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o",
  },
  // Anthropic — good alternative, mapped through OpenAI-compat shim
  anthropic: {
    baseUrl: "https://api.anthropic.com/v1",
    model: "claude-3-5-sonnet-20241022",
  },
  // Custom — caller provides everything
  custom: {
    baseUrl: "http://localhost:11434/v1",
    model: "llama3",
  },
};

// ---------------------------------------------------------------------------
// LLMService
// ---------------------------------------------------------------------------

export class LLMService {
  private readonly config: Required<LLMConfig>;

  constructor(config: LLMConfig) {
    const defaults = PROVIDER_DEFAULTS[config.provider];
    this.config = {
      provider: config.provider,
      apiKey: config.apiKey ?? "",
      baseUrl: config.baseUrl ?? defaults.baseUrl,
      model: config.model ?? defaults.model,
    };
  }

  /**
   * Call the LLM with a list of messages.
   * Returns the full response — callers extract content or tool_calls.
   */
  async complete(
    messages: LLMMessage[],
    tools?: Array<{
      type: "function";
      function: { name: string; description: string; parameters: object };
    }>,
  ): Promise<LLMResponse> {
    const url = `${this.config.baseUrl}/chat/completions`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.apiKey}`,
    };

    // OpenRouter requires a site URL and app name header for attribution
    if (this.config.provider === "hermes") {
      headers["HTTP-Referer"] = "https://cykani.com";
      headers["X-Title"] = "Cykani Browser Agent";
    }

    const body: Record<string, unknown> = {
      model: this.config.model,
      messages,
      temperature: 0.1,
      max_tokens: 4096,
    };

    if (tools && tools.length > 0) {
      body["tools"] = tools;
      body["tool_choice"] = "auto";
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => `HTTP ${res.status}`);
      throw new Error(
        `LLM request failed (${this.config.provider}/${this.config.model}): ${errText}`,
      );
    }

    return res.json() as Promise<LLMResponse>;
  }

  /**
   * Simple text completion — returns the assistant's text content.
   * Throws if the response has no text content.
   */
  async text(messages: LLMMessage[]): Promise<string> {
    const response = await this.complete(messages);
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error(`LLM returned empty content (${this.config.provider})`);
    }
    return content;
  }

  /**
   * Extract structured JSON from the LLM.
   * Wraps the prompt with explicit JSON formatting instructions.
   */
  async json<T = unknown>(
    messages: LLMMessage[],
    schema?: string,
  ): Promise<T> {
    const systemSuffix = schema
      ? `\nYou must respond with a valid JSON object matching this schema:\n${schema}\nReturn ONLY the JSON — no markdown, no explanation.`
      : "\nRespond with ONLY a valid JSON object. No markdown, no explanation.";

    const messagesWithInstruction: LLMMessage[] = [
      ...messages.slice(0, -1),
      {
        role: messages[messages.length - 1]?.role ?? "user",
        content: (messages[messages.length - 1]?.content ?? "") + systemSuffix,
      },
    ];

    const text = await this.text(messagesWithInstruction);

    // Strip markdown fences if present
    const stripped = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(stripped) as T;
  }

  get provider() { return this.config.provider; }
  get model() { return this.config.model; }
}

// ---------------------------------------------------------------------------
// Factory — creates LLM service from env or request config
// ---------------------------------------------------------------------------

export function createLLMService(overrides?: Partial<LLMConfig>): LLMService {
  // Default: Hermes via OpenRouter
  // Override via env vars or per-request config
  const provider = (overrides?.provider ?? process.env["LLM_PROVIDER"] ?? "hermes") as LLMProvider;

  const config: LLMConfig = {
    provider,
    apiKey: overrides?.apiKey ?? getLLMApiKey(provider),
    baseUrl: overrides?.baseUrl ?? process.env["LLM_BASE_URL"],
    model: overrides?.model ?? process.env["LLM_MODEL"],
  };

  return new LLMService(config);
}

function getLLMApiKey(provider: LLMProvider): string {
  switch (provider) {
    case "hermes":
      // Hermes uses OpenRouter — set OPENROUTER_API_KEY
      return process.env["OPENROUTER_API_KEY"] ?? process.env["LLM_API_KEY"] ?? "";
    case "groq":
      return process.env["GROQ_API_KEY"] ?? process.env["LLM_API_KEY"] ?? "";
    case "openai":
      return process.env["OPENAI_API_KEY"] ?? process.env["LLM_API_KEY"] ?? "";
    case "anthropic":
      return process.env["ANTHROPIC_API_KEY"] ?? process.env["LLM_API_KEY"] ?? "";
    case "custom":
      return process.env["LLM_API_KEY"] ?? "";
  }
}
