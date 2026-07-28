import type { NodeTemplate, Workflow, WorkflowEdge, WorkflowNode } from "./types";

export const nodeTemplates: NodeTemplate[] = [
  // Triggers
  {
    type: "trigger",
    label: "Webhook",
    description: "Receive HTTP requests to trigger workflow",
    icon: "Webhook",
    color: "emerald",
    category: "triggers",
    configFields: [
      {
        key: "method",
        label: "HTTP Method",
        type: "select",
        options: ["GET", "POST", "PUT", "DELETE"],
        defaultValue: "POST",
      },
      { key: "path", label: "Path", type: "text", placeholder: "/api/webhook" },
      {
        key: "auth",
        label: "Auth Type",
        type: "select",
        options: ["None", "API Key", "Bearer Token"],
        defaultValue: "None",
      },
    ],
  },
  {
    type: "trigger",
    label: "Schedule",
    description: "Run on a cron schedule",
    icon: "Clock",
    color: "emerald",
    category: "triggers",
    configFields: [
      { key: "cron", label: "Cron Expression", type: "text", placeholder: "0 */6 * * *" },
      {
        key: "timezone",
        label: "Timezone",
        type: "select",
        options: ["UTC", "America/New_York", "Europe/London"],
        defaultValue: "UTC",
      },
    ],
  },
  {
    type: "trigger",
    label: "Manual",
    description: "Manually trigger this workflow",
    icon: "Hand",
    color: "emerald",
    category: "triggers",
    configFields: [],
  },

  // Browser Actions
  {
    type: "browser",
    label: "Navigate",
    description: "Navigate to a URL",
    icon: "Globe",
    color: "violet",
    category: "browser",
    configFields: [
      { key: "url", label: "URL", type: "text", placeholder: "https://example.com" },
      {
        key: "waitUntil",
        label: "Wait Until",
        type: "select",
        options: ["load", "domcontentloaded", "networkidle"],
        defaultValue: "load",
      },
      { key: "timeout", label: "Timeout (ms)", type: "number", defaultValue: 30000 },
    ],
  },
  {
    type: "browser",
    label: "Click Element",
    description: "Click on a page element",
    icon: "MousePointer",
    color: "violet",
    category: "browser",
    configFields: [
      { key: "selector", label: "CSS Selector", type: "text", placeholder: "#submit-button" },
      { key: "waitAfter", label: "Wait After (ms)", type: "number", defaultValue: 1000 },
    ],
  },
  {
    type: "browser",
    label: "Type Text",
    description: "Type text into an input field",
    icon: "Type",
    color: "violet",
    category: "browser",
    configFields: [
      { key: "selector", label: "CSS Selector", type: "text", placeholder: "input[name='email']" },
      { key: "text", label: "Text to Type", type: "text", placeholder: "hello@example.com" },
      { key: "delay", label: "Typing Delay (ms)", type: "number", defaultValue: 50 },
    ],
  },
  {
    type: "browser",
    label: "Extract Data",
    description: "Extract data from the page",
    icon: "Download",
    color: "violet",
    category: "browser",
    configFields: [
      { key: "selector", label: "CSS Selector", type: "text", placeholder: ".product-title" },
      {
        key: "attribute",
        label: "Attribute",
        type: "select",
        options: ["text", "href", "src", "innerHTML"],
        defaultValue: "text",
      },
      { key: "multiple", label: "Extract Multiple", type: "toggle", defaultValue: true },
    ],
  },
  {
    type: "browser",
    label: "Screenshot",
    description: "Take a screenshot of the page",
    icon: "Camera",
    color: "violet",
    category: "browser",
    configFields: [
      { key: "fullPage", label: "Full Page", type: "toggle", defaultValue: false },
      { key: "format", label: "Format", type: "select", options: ["png", "jpeg"], defaultValue: "png" },
      { key: "quality", label: "Quality", type: "number", defaultValue: 90 },
    ],
  },
  {
    type: "browser",
    label: "Wait For",
    description: "Wait for element or condition",
    icon: "Hourglass",
    color: "violet",
    category: "browser",
    configFields: [
      { key: "selector", label: "CSS Selector", type: "text", placeholder: ".loading" },
      { key: "timeout", label: "Timeout (ms)", type: "number", defaultValue: 10000 },
      { key: "hidden", label: "Wait for Hidden", type: "toggle", defaultValue: false },
    ],
  },

  // Logic
  {
    type: "condition",
    label: "If/Else",
    description: "Branch based on condition",
    icon: "GitBranch",
    color: "amber",
    category: "logic",
    configFields: [
      { key: "variable", label: "Variable", type: "text", placeholder: "{{step1.output}}" },
      {
        key: "operator",
        label: "Operator",
        type: "select",
        options: ["equals", "not equals", "contains", "greater than", "less than", "exists"],
      },
      { key: "value", label: "Value", type: "text", placeholder: "expected value" },
    ],
  },
  {
    type: "condition",
    label: "Loop",
    description: "Iterate over a collection",
    icon: "Repeat",
    color: "amber",
    category: "logic",
    configFields: [
      { key: "items", label: "Items Variable", type: "text", placeholder: "{{step1.output}}" },
      { key: "maxIterations", label: "Max Iterations", type: "number", defaultValue: 100 },
    ],
  },

  // AI
  {
    type: "agent",
    label: "AI Extract",
    description: "Use AI to extract structured data",
    icon: "Brain",
    color: "orange",
    category: "ai",
    configFields: [
      {
        key: "goal",
        label: "Extraction Goal",
        type: "textarea",
        placeholder: "Extract product name, price, and rating from the page",
      },
      {
        key: "model",
        label: "AI Model",
        type: "select",
        options: ["gpt-4o", "claude-3.5-sonnet", "gpt-4o-mini"],
        defaultValue: "gpt-4o-mini",
      },
      {
        key: "schema",
        label: "Output Schema (JSON)",
        type: "textarea",
        placeholder: '{"name": "string", "price": "number"}',
      },
    ],
  },
  {
    type: "agent",
    label: "AI Decide",
    description: "Let AI make a decision",
    icon: "Sparkles",
    color: "orange",
    category: "ai",
    configFields: [
      { key: "prompt", label: "Decision Prompt", type: "textarea", placeholder: "Should we proceed with this action?" },
      { key: "context", label: "Context Variables", type: "text", placeholder: "{{step1.output}}, {{step2.output}}" },
    ],
  },

  // Actions
  {
    type: "action",
    label: "HTTP Request",
    description: "Make an HTTP request",
    icon: "Send",
    color: "blue",
    category: "actions",
    configFields: [
      {
        key: "method",
        label: "Method",
        type: "select",
        options: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        defaultValue: "GET",
      },
      { key: "url", label: "URL", type: "text", placeholder: "https://api.example.com/data" },
      {
        key: "headers",
        label: "Headers (JSON)",
        type: "textarea",
        placeholder: '{"Content-Type": "application/json"}',
      },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    type: "action",
    label: "Set Variable",
    description: "Set a workflow variable",
    icon: "Variable",
    color: "blue",
    category: "actions",
    configFields: [
      { key: "name", label: "Variable Name", type: "text", placeholder: "myVariable" },
      { key: "value", label: "Value", type: "text", placeholder: "{{step1.output}}" },
    ],
  },
  {
    type: "action",
    label: "Delay",
    description: "Wait for a specified duration",
    icon: "Timer",
    color: "blue",
    category: "actions",
    configFields: [{ key: "duration", label: "Duration (ms)", type: "number", defaultValue: 1000 }],
  },
  {
    type: "action",
    label: "JavaScript Code",
    description: "Run custom JavaScript",
    icon: "Code",
    color: "blue",
    category: "actions",
    configFields: [{ key: "code", label: "Code", type: "textarea", placeholder: "return input.data.toUpperCase();" }],
  },

  // Output
  {
    type: "output",
    label: "Send Email",
    description: "Send an email notification",
    icon: "Mail",
    color: "slate",
    category: "output",
    configFields: [
      { key: "to", label: "To", type: "text", placeholder: "user@example.com" },
      { key: "subject", label: "Subject", type: "text", placeholder: "Workflow Complete" },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    type: "output",
    label: "Slack Message",
    description: "Send a Slack notification",
    icon: "MessageSquare",
    color: "slate",
    category: "output",
    configFields: [
      { key: "channel", label: "Channel", type: "text", placeholder: "#general" },
      { key: "message", label: "Message", type: "textarea", placeholder: "Workflow completed!" },
    ],
  },
  {
    type: "output",
    label: "Save to Database",
    description: "Save data to database",
    icon: "Database",
    color: "slate",
    category: "output",
    configFields: [
      { key: "table", label: "Table", type: "text", placeholder: "products" },
      { key: "data", label: "Data Variable", type: "text", placeholder: "{{step1.output}}" },
    ],
  },
];

export const sampleNodes: WorkflowNode[] = [
  {
    id: "1",
    type: "trigger",
    label: "Webhook Trigger",
    description: "Receives incoming HTTP POST requests",
    config: { method: "POST", path: "/api/scrape", auth: "API Key" },
    status: "idle",
    duration: "0ms",
  },
  {
    id: "2",
    type: "browser",
    label: "Navigate to Page",
    description: "Opens the target URL in a stealth browser",
    config: { url: "https://shop.example.com/products", waitUntil: "networkidle", timeout: 15000 },
    status: "idle",
    duration: "2.3s",
  },
  {
    id: "3",
    type: "browser",
    label: "Wait for Content",
    description: "Waits for product grid to load",
    config: { selector: ".product-grid", timeout: 10000 },
    status: "idle",
    duration: "1.1s",
  },
  {
    id: "4",
    type: "condition",
    label: "Has Products?",
    description: "Checks if any products were found",
    config: { variable: "{{step3.output}}", operator: "exists" },
    status: "idle",
  },
  {
    id: "5",
    type: "agent",
    label: "AI Extract Products",
    description: "Uses AI to extract structured product data",
    config: {
      goal: "Extract name, price, rating, and image URL for each product",
      model: "gpt-4o-mini",
      schema: '{"name": "string", "price": "number", "rating": "number"}',
    },
    status: "idle",
    duration: "4.2s",
  },
  {
    id: "6",
    type: "action",
    label: "Save to Database",
    description: "Stores extracted products in database",
    config: { table: "products", data: "{{step5.output}}" },
    status: "idle",
    duration: "0.8s",
  },
  {
    id: "7",
    type: "output",
    label: "Slack Notification",
    description: "Sends completion notification to Slack",
    config: { channel: "#scraping", message: "Successfully scraped {{step5.output.length}} products" },
    status: "idle",
    duration: "0.3s",
  },
];

export const sampleEdges: WorkflowEdge[] = [
  { id: "e1-2", source: "1", target: "2", type: "default" },
  { id: "e2-3", source: "2", target: "3", type: "default" },
  { id: "e3-4", source: "3", target: "4", type: "default" },
  { id: "e4-5", source: "4", target: "5", type: "yes", label: "yes" },
  { id: "e5-6", source: "5", target: "6", type: "default" },
  { id: "e6-7", source: "6", target: "7", type: "default" },
];

export const sampleWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Product Scraper",
    description: "Scrape product data from e-commerce sites with AI extraction",
    status: "active",
    nodes: sampleNodes,
    edges: sampleEdges,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    lastRun: "2 min ago",
    runCount: 142,
  },
  {
    id: "2",
    name: "Form Auto-Fill",
    description: "Automatically fill job applications using AI",
    status: "draft",
    nodes: [],
    edges: [],
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
    lastRun: "Never",
    runCount: 0,
  },
  {
    id: "3",
    name: "Price Monitor",
    description: "Track price changes across competitors daily",
    status: "paused",
    nodes: [],
    edges: [],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-19",
    lastRun: "1 hr ago",
    runCount: 89,
  },
  {
    id: "4",
    name: "Lead Enrichment",
    description: "Enrich leads with company data from LinkedIn",
    status: "active",
    nodes: [],
    edges: [],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-20",
    lastRun: "5 min ago",
    runCount: 234,
  },
];

// ---------------------------------------------------------------------------
// Hot-market pre-built workflow templates
// ---------------------------------------------------------------------------

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: "jobs" | "research" | "forms" | "booking" | "scraping";
  categoryLabel: string;
  categoryColor: string;
  icon: string;
  estimatedTime: string;
  useCases: string[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  // -------------------------------------------------------------------------
  // 1. Job Application Automation
  // -------------------------------------------------------------------------
  {
    id: "tpl-job-apply",
    name: "Job Application Bot",
    description:
      "Automatically submit your CV to hundreds of job postings. Reads job boards, filters by criteria, fills application forms, and tracks submissions.",
    category: "jobs",
    categoryLabel: "Career",
    categoryColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    icon: "Briefcase",
    estimatedTime: "~45s per application",
    useCases: [
      "Apply to LinkedIn Easy Apply jobs",
      "Submit CVs to recruitment portals",
      "Fill out multi-step application forms",
      "Track application status per company",
    ],
    nodes: [
      {
        id: "j1",
        type: "trigger",
        label: "Schedule: Daily 8AM",
        description: "Runs every morning to check for new matching jobs",
        config: { cron: "0 8 * * *", timezone: "Africa/Johannesburg" },
        status: "idle",
        duration: "0ms",
      },
      {
        id: "j2",
        type: "browser",
        label: "Open LinkedIn Jobs",
        description: "Navigates to LinkedIn job search with filters",
        config: {
          url: "https://www.linkedin.com/jobs/search/?keywords=software+engineer&location=South+Africa",
          waitUntil: "networkidle",
          timeout: 15000,
        },
        status: "idle",
        duration: "2.1s",
      },
      {
        id: "j3",
        type: "agent",
        label: "AI Extract Job Listings",
        description: "Extracts title, company, location, salary, and apply URL for each job",
        config: {
          goal: "Extract all job listings visible on the page including title, company, location, salary if shown, and the apply button URL",
          model: "gpt-4o-mini",
          schema: '[{"title":"string","company":"string","location":"string","applyUrl":"string","salary":"string"}]',
        },
        status: "idle",
        duration: "3.8s",
      },
      {
        id: "j4",
        type: "condition",
        label: "Filter: Easy Apply Only?",
        description: "Only proceed with Easy Apply jobs to maximise volume",
        config: {
          variable: "{{j3.easyApply}}",
          operator: "equals",
          value: "true",
        },
        status: "idle",
      },
      {
        id: "j5",
        type: "agent",
        label: "AI Fill Application",
        description: "Reads the form fields and fills them using your CV data",
        config: {
          goal: "Fill all visible form fields using the candidate profile. Match field labels to profile data (name, email, phone, experience, skills). Submit when all required fields are complete.",
          model: "gpt-4o",
          schema: '{"fieldsCompleted":"number","submitted":"boolean","jobTitle":"string"}',
        },
        status: "idle",
        duration: "8.4s",
      },
      {
        id: "j6",
        type: "action",
        label: "Log Submission",
        description: "Records the application in your tracking database",
        config: {
          table: "job_applications",
          data: "{{j5.output}}",
        },
        status: "idle",
        duration: "0.4s",
      },
      {
        id: "j7",
        type: "output",
        label: "Daily Summary Email",
        description: "Sends you a summary of all applications submitted today",
        config: {
          to: "you@example.com",
          subject: "Job Applications Summary — {{date}}",
          body: "Applied to {{j6.count}} jobs today. See attached report.",
        },
        status: "idle",
        duration: "0.2s",
      },
    ],
    edges: [
      { id: "ej1-2", source: "j1", target: "j2", type: "default" },
      { id: "ej2-3", source: "j2", target: "j3", type: "default" },
      { id: "ej3-4", source: "j3", target: "j4", type: "default" },
      { id: "ej4-5", source: "j4", target: "j5", type: "yes", label: "yes" },
      { id: "ej5-6", source: "j5", target: "j6", type: "default" },
      { id: "ej6-7", source: "j6", target: "j7", type: "default" },
    ],
  },

  // -------------------------------------------------------------------------
  // 2. Research Automation (Law / Consulting)
  // -------------------------------------------------------------------------
  {
    id: "tpl-research",
    name: "Deep Web Research Agent",
    description:
      "Autonomously researches any topic across multiple sources. Synthesises findings into a structured report. Used by law firms, consultancies, and analysts.",
    category: "research",
    categoryLabel: "Research",
    categoryColor: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    icon: "Search",
    estimatedTime: "~3-8 min per topic",
    useCases: [
      "Company due diligence reports",
      "Legal case background research",
      "Competitor intelligence gathering",
      "Academic literature summaries",
    ],
    nodes: [
      {
        id: "r1",
        type: "trigger",
        label: "Webhook: Research Request",
        description: "Receives research topic via API call",
        config: { method: "POST", path: "/api/research", auth: "API Key" },
        status: "idle",
        duration: "0ms",
      },
      {
        id: "r2",
        type: "agent",
        label: "AI Plan Research",
        description: "Breaks the topic into specific search queries and source targets",
        config: {
          goal: "Given a research topic, generate 5-8 specific search queries and identify the best sources to visit (news sites, databases, company sites). Return a structured research plan.",
          model: "gpt-4o",
          schema: '{"queries":["string"],"sources":["string"],"keyQuestions":["string"]}',
        },
        status: "idle",
        duration: "2.1s",
      },
      {
        id: "r3",
        type: "condition",
        label: "Loop: Each Query",
        description: "Iterates over each research query",
        config: {
          items: "{{r2.queries}}",
          maxIterations: 8,
        },
        status: "idle",
      },
      {
        id: "r4",
        type: "browser",
        label: "Search & Navigate",
        description: "Executes search and opens top results",
        config: {
          url: "https://www.google.com/search?q={{r3.currentItem}}",
          waitUntil: "domcontentloaded",
          timeout: 10000,
        },
        status: "idle",
        duration: "1.4s",
      },
      {
        id: "r5",
        type: "agent",
        label: "AI Extract Key Findings",
        description: "Extracts relevant facts, quotes, and data points from each page",
        config: {
          goal: "Extract all facts, statistics, quotes, and key findings relevant to the research topic. Ignore navigation and ads. Return structured findings with source URL and date.",
          model: "gpt-4o",
          schema: '{"findings":["string"],"source":"string","date":"string","credibility":"high|medium|low"}',
        },
        status: "idle",
        duration: "4.7s",
      },
      {
        id: "r6",
        type: "agent",
        label: "AI Synthesise Report",
        description: "Compiles all findings into a professional research report",
        config: {
          goal: "Synthesise all collected findings into a structured report with Executive Summary, Key Findings, Supporting Evidence, and Recommendations sections. Use professional language.",
          model: "gpt-4o",
          schema: '{"title":"string","executiveSummary":"string","keyFindings":["string"],"recommendations":["string"]}',
        },
        status: "idle",
        duration: "6.2s",
      },
      {
        id: "r7",
        type: "output",
        label: "Deliver Report",
        description: "Sends the completed research report",
        config: {
          to: "{{r1.requesterEmail}}",
          subject: "Research Report: {{r1.topic}}",
          body: "{{r6.report}}",
        },
        status: "idle",
        duration: "0.3s",
      },
    ],
    edges: [
      { id: "er1-2", source: "r1", target: "r2", type: "default" },
      { id: "er2-3", source: "r2", target: "r3", type: "default" },
      { id: "er3-4", source: "r3", target: "r4", type: "yes", label: "each" },
      { id: "er4-5", source: "r4", target: "r5", type: "default" },
      { id: "er5-3", source: "r5", target: "r3", type: "default", label: "next" },
      { id: "er3-6", source: "r3", target: "r6", type: "default", label: "done" },
      { id: "er6-7", source: "r6", target: "r7", type: "default" },
    ],
  },

  // -------------------------------------------------------------------------
  // 3. Form Filling / Data Entry Automation
  // -------------------------------------------------------------------------
  {
    id: "tpl-form-fill",
    name: "Bulk Form Submission Bot",
    description:
      "Reads structured data from a spreadsheet or database and fills web forms at scale. Handles multi-step forms, CAPTCHAs, and confirmations.",
    category: "forms",
    categoryLabel: "Data Entry",
    categoryColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    icon: "FileText",
    estimatedTime: "~15s per form",
    useCases: [
      "Government portal submissions",
      "Insurance claim forms",
      "Supplier onboarding portals",
      "Survey data entry at scale",
    ],
    nodes: [
      {
        id: "f1",
        type: "trigger",
        label: "Manual / Webhook",
        description: "Triggered manually or via API with the data batch",
        config: { method: "POST", path: "/api/form-fill", auth: "API Key" },
        status: "idle",
        duration: "0ms",
      },
      {
        id: "f2",
        type: "action",
        label: "Load Data Batch",
        description: "Fetches the records to be submitted from the data source",
        config: {
          method: "GET",
          url: "https://api.example.com/records?status=pending",
          headers: '{"Authorization": "Bearer {{env.API_TOKEN}}"}',
        },
        status: "idle",
        duration: "0.6s",
      },
      {
        id: "f3",
        type: "condition",
        label: "Loop: Each Record",
        description: "Processes each record in the batch",
        config: {
          items: "{{f2.records}}",
          maxIterations: 500,
        },
        status: "idle",
      },
      {
        id: "f4",
        type: "browser",
        label: "Open Form Page",
        description: "Navigates to the target form URL",
        config: {
          url: "{{f1.formUrl}}",
          waitUntil: "networkidle",
          timeout: 20000,
        },
        status: "idle",
        duration: "1.8s",
      },
      {
        id: "f5",
        type: "agent",
        label: "AI Map & Fill Fields",
        description: "Intelligently maps record data to form fields and fills them",
        config: {
          goal: "Analyse all form fields on the page. Map each field label to the corresponding data from the current record. Fill every required field. Handle dropdowns, checkboxes, and radio buttons. Do not submit yet.",
          model: "gpt-4o",
          schema: '{"fieldsMapped":"number","fieldsRequired":"number","allRequiredFilled":"boolean"}',
        },
        status: "idle",
        duration: "5.3s",
      },
      {
        id: "f6",
        type: "browser",
        label: "Screenshot & Verify",
        description: "Takes a screenshot for audit trail before submitting",
        config: { fullPage: false, format: "png", quality: 90 },
        status: "idle",
        duration: "0.4s",
      },
      {
        id: "f7",
        type: "browser",
        label: "Submit Form",
        description: "Clicks the submit button and waits for confirmation",
        config: {
          selector: "button[type='submit'], input[type='submit']",
          waitAfter: 2000,
        },
        status: "idle",
        duration: "2.1s",
      },
      {
        id: "f8",
        type: "action",
        label: "Mark Record Complete",
        description: "Updates the record status to submitted with confirmation number",
        config: {
          method: "PATCH",
          url: "https://api.example.com/records/{{f3.currentItem.id}}",
          body: '{"status":"submitted","confirmedAt":"{{now}}","screenshot":"{{f6.base64}}"}',
        },
        status: "idle",
        duration: "0.3s",
      },
    ],
    edges: [
      { id: "ef1-2", source: "f1", target: "f2", type: "default" },
      { id: "ef2-3", source: "f2", target: "f3", type: "default" },
      { id: "ef3-4", source: "f3", target: "f4", type: "yes", label: "each" },
      { id: "ef4-5", source: "f4", target: "f5", type: "default" },
      { id: "ef5-6", source: "f5", target: "f6", type: "default" },
      { id: "ef6-7", source: "f6", target: "f7", type: "default" },
      { id: "ef7-8", source: "f7", target: "f8", type: "default" },
      { id: "ef8-3", source: "f8", target: "f3", type: "default", label: "next" },
    ],
  },

  // -------------------------------------------------------------------------
  // 4. Booking Automation
  // -------------------------------------------------------------------------
  {
    id: "tpl-booking",
    name: "Appointment & Booking Agent",
    description:
      "Monitors availability and books appointments, tickets, or travel automatically. Handles authentication, seat selection, and confirmation extraction.",
    category: "booking",
    categoryLabel: "Booking",
    categoryColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    icon: "CalendarCheck",
    estimatedTime: "~30s per booking",
    useCases: [
      "Doctor / clinic appointment booking",
      "Flight and hotel reservations",
      "Event ticket purchasing",
      "Restaurant reservations at peak times",
    ],
    nodes: [
      {
        id: "b1",
        type: "trigger",
        label: "Schedule: Check Every 5min",
        description: "Polls for availability on a tight interval",
        config: { cron: "*/5 * * * *", timezone: "UTC" },
        status: "idle",
        duration: "0ms",
      },
      {
        id: "b2",
        type: "browser",
        label: "Open Booking Portal",
        description: "Navigates to the booking site and logs in if needed",
        config: {
          url: "{{env.BOOKING_URL}}",
          waitUntil: "networkidle",
          timeout: 20000,
        },
        status: "idle",
        duration: "2.4s",
      },
      {
        id: "b3",
        type: "agent",
        label: "AI Check Availability",
        description: "Scans the calendar or availability grid for open slots",
        config: {
          goal: "Check the booking calendar for available slots matching the target date range and preferences. Return available time slots with their selector paths.",
          model: "gpt-4o",
          schema: '{"available":["boolean"],"slots":[{"date":"string","time":"string","selector":"string"}]}',
        },
        status: "idle",
        duration: "2.9s",
      },
      {
        id: "b4",
        type: "condition",
        label: "Slot Available?",
        description: "Checks if any matching slot was found",
        config: {
          variable: "{{b3.available}}",
          operator: "equals",
          value: "true",
        },
        status: "idle",
      },
      {
        id: "b5",
        type: "agent",
        label: "AI Select & Book",
        description: "Selects the best available slot and completes the booking form",
        config: {
          goal: "Select the first available slot from the options. Fill in all required booking details (name, email, phone, preferences). Click confirm. Extract the confirmation number from the success page.",
          model: "gpt-4o",
          schema: '{"confirmationNumber":"string","date":"string","time":"string","venue":"string","totalCost":"string"}',
        },
        status: "idle",
        duration: "7.1s",
      },
      {
        id: "b6",
        type: "browser",
        label: "Screenshot Confirmation",
        description: "Captures the booking confirmation page as evidence",
        config: { fullPage: false, format: "png", quality: 95 },
        status: "idle",
        duration: "0.3s",
      },
      {
        id: "b7",
        type: "action",
        label: "Save Booking Record",
        description: "Stores booking details in the database",
        config: {
          table: "bookings",
          data: "{{b5.output}}",
        },
        status: "idle",
        duration: "0.2s",
      },
      {
        id: "b8",
        type: "output",
        label: "Confirmation Notification",
        description: "Sends confirmation details via email and Slack",
        config: {
          channel: "#bookings",
          message: "✅ Booking confirmed! {{b5.date}} at {{b5.time}} — Ref: {{b5.confirmationNumber}}",
        },
        status: "idle",
        duration: "0.2s",
      },
    ],
    edges: [
      { id: "eb1-2", source: "b1", target: "b2", type: "default" },
      { id: "eb2-3", source: "b2", target: "b3", type: "default" },
      { id: "eb3-4", source: "b3", target: "b4", type: "default" },
      { id: "eb4-5", source: "b4", target: "b5", type: "yes", label: "available" },
      { id: "eb4-1", source: "b4", target: "b1", type: "default", label: "retry" },
      { id: "eb5-6", source: "b5", target: "b6", type: "default" },
      { id: "eb6-7", source: "b6", target: "b7", type: "default" },
      { id: "eb7-8", source: "b7", target: "b8", type: "default" },
    ],
  },
];

export const templateCategories = [
  { id: "triggers", label: "Triggers", description: "Start your workflow" },
  { id: "browser", label: "Browser", description: "Browser automation" },
  { id: "logic", label: "Logic", description: "Flow control" },
  { id: "ai", label: "AI", description: "AI-powered actions" },
  { id: "actions", label: "Actions", description: "General actions" },
  { id: "output", label: "Output", description: "Send results" },
] as const;
