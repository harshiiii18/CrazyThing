// AI listing-assistant abstraction. Uses the Anthropic API when AI_API_KEY
// is configured; otherwise falls back to a clearly-labeled rule-based mock
// so the Sell flow is still testable without credentials. Never presented
// to the seller as final — the frontend always requires manual confirmation
// before anything from here is published.

const hasApiKey = !!process.env.AI_API_KEY;

const CONDITIONS = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "USED"];

function buildPrompt(rawInput, categoryNames) {
  return `You are a marketplace listing assistant. A seller typed this rough note about an item they want to sell:

"${rawInput}"

Available categories: ${categoryNames.join(", ")}

Respond with ONLY a JSON object (no markdown, no preamble) in this exact shape:
{
  "title": "a clean, professional listing title under 70 characters",
  "description": "a 2-4 sentence honest, professional description based on what the seller wrote",
  "category": "the single best-matching category name from the list above",
  "condition": "one of NEW, LIKE_NEW, GOOD, FAIR, USED based on what the seller described",
  "tags": ["3-5 short lowercase search keywords"],
  "priceMin": <a reasonable minimum resale price in INR as a number, based on typical secondhand prices for this kind of item>,
  "priceMax": <a reasonable maximum resale price in INR as a number>
}`;
}

async function callAnthropic(rawInput, categoryNames) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.AI_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 500,
      messages: [{ role: "user", content: buildPrompt(rawInput, categoryNames) }],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI service returned ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

// Deterministic, rule-based fallback — clearly a mock, not a real model call.
function mockSuggestion(rawInput, categoryNames) {
  const words = rawInput.trim().split(/\s+/);
  const title = words.slice(0, 8).join(" ").replace(/[.,]$/, "");

  const lower = rawInput.toLowerCase();
  let condition = "GOOD";
  if (lower.includes("new") && !lower.includes("like new")) condition = "NEW";
  else if (lower.includes("like new")) condition = "LIKE_NEW";
  else if (lower.includes("fair") || lower.includes("worn")) condition = "FAIR";
  else if (lower.includes("used") || lower.includes("old")) condition = "USED";

  const category =
    categoryNames.find((c) => lower.includes(c.toLowerCase())) || categoryNames[0] || "Other";

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description: `${rawInput.trim()}. Sold as described — message the seller for more photos or details.`,
    category,
    condition,
    tags: words.slice(0, 5).map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean),
    priceMin: 500,
    priceMax: 2000,
    isMock: true,
  };
}

exports.generateListingSuggestions = async ({ rawInput, categoryNames }) => {
  if (!hasApiKey) {
    return mockSuggestion(rawInput, categoryNames);
  }

  try {
    const result = await callAnthropic(rawInput, categoryNames);
    return { ...result, isMock: false };
  } catch (err) {
    console.error("AI service error, falling back to mock:", err.message);
    return mockSuggestion(rawInput, categoryNames);
  }
};

exports.isMockMode = !hasApiKey;