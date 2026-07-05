import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const prompts = {
  milestones: (idea) => ({
    system:
      "You are an expert project manager. Generate a clear, structured list of project milestones. Format as a numbered list with brief descriptions. Each milestone should have an estimated duration.",
    user: `Create project milestones for this startup idea: ${idea}`,
  }),
  sprints: (idea) => ({
    system:
      "You are an experienced Agile coach. Create a 2-week sprint plan for a startup. Include sprint goals, key features to implement, and estimated story points. Format clearly with sections for each week.",
    user: `Design a sprint plan for: ${idea}`,
  }),
  tasks: (idea) => ({
    system:
      "You are a technical lead. Break down a project into granular, actionable tasks. Organize tasks by feature or epic. Include estimated effort (hours) and dependencies where relevant.",
    user: `Break down this startup idea into concrete development tasks: ${idea}`,
  }),
  timeline: (idea) => ({
    system:
      "You are a product strategist. Create a realistic project timeline with phases, milestones, and dependencies. Present as a clear roadmap with months and key deliverables.",
    user: `Create a comprehensive timeline for launching this startup: ${idea}`,
  }),
  risks: (idea) => ({
    system:
      "You are a risk management consultant. Analyze potential risks (technical, market, operational, financial, legal). For each risk, provide likelihood (low/medium/high), impact, and mitigation strategy.",
    user: `Identify and analyze risks for this startup idea: ${idea}`,
  }),
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { idea, mode } = req.body;

  if (!idea || !idea.trim()) {
    return res.status(400).json({ error: "Idea is required" });
  }

  if (!mode || !prompts[mode]) {
    return res
      .status(400)
      .json({ error: "Invalid mode. Must be one of: milestones, sprints, tasks, timeline, risks" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY is not set. Please configure it in .env.local",
    });
  }

  try {
    const { system, user } = prompts[mode](idea);

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      temperature: 0.5,
      system,
      messages: [
        {
          role: "user",
          content: user,
        },
      ],
    });

    const result =
      message.content[0].type === "text" ? message.content[0].text : "";

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Claude API error:", error);

    if (error.status === 401 || error.status === 403) {
      return res.status(error.status).json({
        error: "Authentication failed. Check your ANTHROPIC_API_KEY.",
      });
    }

    return res.status(500).json({
      error: error.message || "Failed to generate content",
    });
  }
}
