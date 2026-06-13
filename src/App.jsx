import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import Navbar from "./components/Navbar.jsx";
import routes from "./routes.jsx";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);

  const upsertStep = (step) =>
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === step.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = step;
        return next;
      }
      return [...prev, step];
    });

  const run = async () => {
    setSteps([]);
    setResult(null);

    const res = await fetch("http://localhost:8000/run-stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop();

      for (const part of parts) {
        const eventMatch = part.match(/^event: (\w+)/m);
        const dataMatch = part.match(/^data: (.+)/m);
        if (!eventMatch || !dataMatch) continue;

        const event = eventMatch[1];
        const data = JSON.parse(dataMatch[1]);

        if (event === "step") upsertStep(data);
        else if (event === "done") setResult(data);
      }
    }
  };

  const home = (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <div>
            <h2>Auto Dev Agent</h2>

            <div className="prompt-bar">
              <input
                className="prompt-input"
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe a feature or page..."
              />
              <button className="prompt-btn" onClick={run}>
                Generate
              </button>
            </div>

            {steps.length > 0 && (
              <div className="steps">
                {steps.map((step) => (
                  <div key={step.id} className={`step step--${step.status}`}>
                    <span className="step-icon">
                      {step.status === "done" && <span className="step-check">✓</span>}
                      {step.status === "running" && <span className="step-spinner" />}
                    </span>
                    <span className="step-label">{step.label}</span>
                  </div>
                ))}
              </div>
            )}

            {result && (
              <p className="step-result">
                ✦ <strong>{result.created}</strong> page created
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={home} />
        {routes
          .filter((r) => r.path !== "/")
          .map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
      </Routes>
    </>
  );
}

export default App;
