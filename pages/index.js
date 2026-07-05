import { useState } from "react";

const modes = [
  { id: "milestones", label: "Generate Milestones" },
  { id: "sprints", label: "Sprint Planning" },
  { id: "tasks", label: "Task Breakdown" },
  { id: "timeline", label: "Timeline Estimation" },
  { id: "risks", label: "Risk Analysis" },
];

const resultOrder = ["milestones", "sprints", "tasks", "timeline", "risks"];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loadingMode, setLoadingMode] = useState(null);
  const [results, setResults] = useState({});
  const [errors, setErrors] = useState({});

  const isIdeaValid = idea.trim().length > 0;

  const generateContent = async (mode) => {
    setLoadingMode(mode);
    setErrors((prev) => ({ ...prev, [mode]: null }));

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim(), mode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors((prev) => ({
          ...prev,
          [mode]: data.error || "Failed to generate content",
        }));
      } else {
        setResults((prev) => ({ ...prev, [mode]: data.result }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [mode]: "Network error. Please try again.",
      }));
    } finally {
      setLoadingMode(null);
    }
  };

  const getSortedResults = () => {
    return resultOrder.filter((mode) => results[mode] || errors[mode]);
  };

  return (
    <div className="container">
      <header>
        <h1>AI Project Planner</h1>
        <p>Transform your startup idea into a detailed project plan</p>
      </header>

      <div className="input-section">
        <label htmlFor="idea-input">Describe your startup idea:</label>
        <textarea
          id="idea-input"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., A mobile app for scheduling yoga classes, integrating real-time availability and instructor ratings..."
        />

        <div className="buttons-section">
          {modes.map((mode) => (
            <button
              key={mode.id}
              className="primary"
              disabled={!isIdeaValid || loadingMode !== null}
              onClick={() => generateContent(mode.id)}
            >
              {loadingMode === mode.id && <span className="spinner"></span>}
              {loadingMode === mode.id ? "Generating..." : mode.label}
            </button>
          ))}
        </div>
      </div>

      {getSortedResults().length > 0 && (
        <div className="results-section">
          {getSortedResults().map((mode) => {
            const modeLabel = modes.find((m) => m.id === mode)?.label;
            const resultText = results[mode];
            const error = errors[mode];

            return (
              <div key={mode} className="result-card">
                <div className="result-card-title">
                  {modeLabel}
                  <button
                    className="regenerate-btn"
                    onClick={() => generateContent(mode)}
                    disabled={loadingMode !== null}
                  >
                    {loadingMode === mode ? "..." : "Regenerate"}
                  </button>
                </div>

                {error && <div className="error">{error}</div>}

                {resultText && (
                  <div className="result-card-content">{resultText}</div>
                )}

                {!resultText && !error && (
                  <div style={{ color: "#999" }}>Generating...</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
