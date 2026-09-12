import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Minus,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Save,
  Eye,
  Printer,
  X,
  FileText,
} from "lucide-react";
import {
  classInfo,
  worksheetConfig,
  worksheetQuestions,
  worksheetSections,
  worksheetPipeline,
} from "../data/demoData";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export default function Worksheets({ onNavigate }) {
  const [difficulty, setDifficulty] = useState(worksheetConfig.difficulty);
  const [questionCount, setQuestionCount] = useState(worksheetConfig.questionCount);
  const [stage, setStage] = useState("idle"); // idle | generating | generated
  const [pipelineIndex, setPipelineIndex] = useState(-1);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const showToast = (message) => {
    setToast(message);
    const t = setTimeout(() => setToast(null), 2400);
    timers.current.push(t);
  };

  const handleGenerate = () => {
    clearTimers();
    setStage("generating");
    setPipelineIndex(0);
    worksheetPipeline.forEach((_, i) => {
      const t = setTimeout(() => setPipelineIndex(i), i * 350);
      timers.current.push(t);
    });
    const done = setTimeout(() => {
      setStage("generated");
      showToast("Worksheet generated");
    }, worksheetPipeline.length * 350 + 300);
    timers.current.push(done);
  };

  const visibleQuestions = worksheetQuestions.slice(0, questionCount);

  return (
    <div className="app-main">
      {/* ---------- HEADER ---------- */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "var(--space-4) var(--space-6)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-3)",
        }}
      >
        <div>
          <div className="flex items-center gap-3" style={{ marginBottom: 4 }}>
            <h1 className="heading-lg" style={{ fontSize: 22 }}>WORKSHEET FACTORY</h1>
            <span className="badge-ai"><Sparkles size={12} /> AI GENERATED</span>
            <span className="badge-draft">Draft</span>
          </div>
          <div className="text-secondary" style={{ fontSize: 13 }}>
            {classInfo.grade} • {classInfo.subject} • {worksheetConfig.topic} • {worksheetConfig.teachingLanguage}
          </div>
        </div>
      </div>

      <div className="app-content">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "0.85fr 1.4fr 0.85fr", alignItems: "start" }}
        >
          {/* ---------- LEFT PANEL: SETTINGS ---------- */}
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: "var(--space-4)" }}>
              Worksheet Settings
            </div>

            <div className="settings-field">
              <label>Grade</label>
              <input className="field-input" readOnly value={worksheetConfig.grade} />
            </div>
            <div className="settings-field">
              <label>Subject</label>
              <input className="field-input" readOnly value={worksheetConfig.subject} />
            </div>
            <div className="settings-field">
              <label>Topic</label>
              <input className="field-input" readOnly value={worksheetConfig.topic} />
            </div>
            <div className="settings-field">
              <label>Learning Outcome</label>
              <input className="field-input" readOnly value={worksheetConfig.outcome} />
            </div>
            <div className="settings-field">
              <label>Language</label>
              <input className="field-input" readOnly value={worksheetConfig.teachingLanguage} />
            </div>

            <div className="settings-field">
              <label>Difficulty</label>
              <div className="difficulty-toggle">
                {DIFFICULTIES.map((d) => (
                  <div
                    key={d}
                    className={`difficulty-pill ${difficulty === d ? "active" : ""}`}
                    onClick={() => setDifficulty(d)}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-field">
              <label>Worksheet Type</label>
              <input className="field-input" readOnly value={worksheetConfig.worksheetType} />
            </div>

            <div className="settings-field">
              <label>Questions</label>
              <div className="stepper-control">
                <button
                  className="stepper-btn"
                  onClick={() => setQuestionCount((n) => Math.max(1, n - 1))}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{questionCount}</span>
                <button
                  className="stepper-btn"
                  onClick={() => setQuestionCount((n) => Math.min(worksheetQuestions.length, n + 1))}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="settings-field">
              <label>Format</label>
              <input className="field-input" readOnly value={worksheetConfig.format} />
            </div>

            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleGenerate}>
              <Sparkles size={14} /> Generate Worksheet
            </button>

            {stage !== "idle" && (
              <div
                className="text-secondary"
                style={{ fontSize: 12, marginTop: "var(--space-3)", textAlign: "center" }}
              >
                {stage === "generating" ? "Generating worksheet…" : "Worksheet generated"}
              </div>
            )}
          </div>

          {/* ---------- CENTER: WORKSHEET PREVIEW ---------- */}
          <div className="worksheet-preview-shell">
            {stage === "idle" && (
              <div className="text-muted" style={{ textAlign: "center", padding: "var(--space-7) 0", fontSize: 13 }}>
                Configure settings on the left, then generate a worksheet to preview it here.
              </div>
            )}

            {stage === "generating" && (
              <div style={{ textAlign: "center", padding: "var(--space-7) 0" }}>
                <div className="text-secondary" style={{ fontSize: 13, marginBottom: "var(--space-3)" }}>
                  PALASH AI is assembling the worksheet…
                </div>
                <div className="progress-track" style={{ maxWidth: 240, margin: "0 auto" }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((pipelineIndex + 1) / worksheetPipeline.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {stage === "generated" && (
              <div className="worksheet-paper">
                <div className="worksheet-paper-header">
                  <div className="brand">PALASH MITRA</div>
                  <div className="topic">
                    {worksheetConfig.topic} • {worksheetConfig.teachingLanguage}
                  </div>
                </div>

                <div className="worksheet-name-date">
                  <span>Name: ____________________</span>
                  <span>Date: ____________</span>
                </div>

                {worksheetSections.map((section) => (
                  <div className="worksheet-section" key={section.id}>
                    <div className="worksheet-section-title">
                      {section.letter}. {section.title.toUpperCase()}
                    </div>
                    <div className="worksheet-section-desc">{section.description}</div>

                    {section.id === "count" &&
                      visibleQuestions.slice(0, 2).map((q) => (
                        <div className="worksheet-objects-row" key={q.id}>
                          {Array.from({ length: q.visualCount }).map((_, i) => (
                            <div key={i} className="worksheet-object">🍎</div>
                          ))}
                          <div className="worksheet-answer-box" />
                        </div>
                      ))}

                    {section.id === "match" &&
                      visibleQuestions.slice(2, 4).map((q) => (
                        <div
                          key={q.id}
                          className="flex items-center justify-between"
                          style={{ marginBottom: 8, fontSize: 12.5 }}
                        >
                          <span style={{ fontWeight: 700 }}>{q.visualCount}</span>
                          <div className="worksheet-objects-row" style={{ marginBottom: 0 }}>
                            {Array.from({ length: q.visualCount }).map((_, i) => (
                              <div key={i} className="worksheet-object">🍎</div>
                            ))}
                          </div>
                        </div>
                      ))}

                    {section.id === "trace" && (
                      <div className="worksheet-trace-row">1 2 3 4 5</div>
                    )}

                    {section.id === "answer" &&
                      visibleQuestions.slice(4, 6).map((q) => (
                        <div key={q.id} style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 12, marginBottom: 6 }}>{q.prompt}</div>
                          <div className="worksheet-objects-row">
                            {Array.from({ length: q.visualCount }).map((_, i) => (
                              <div key={i} className="worksheet-object">🍎</div>
                            ))}
                            <div className="worksheet-answer-box" />
                          </div>
                        </div>
                      ))}

                    <div className="worksheet-pending-note">
                      Santali • Ol Chiki instructions: translation pending verification
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---------- RIGHT PANEL: AI LOGIC ---------- */}
          <div>
            <div className="card" style={{ marginBottom: "var(--space-4)" }}>
              <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
                AI Worksheet Logic
              </div>
              <div className="pipeline-vertical">
                {worksheetPipeline.map((step, i) => (
                  <div
                    key={step}
                    className={`pipeline-vertical-step ${
                      i < pipelineIndex || stage === "generated"
                        ? "done"
                        : i === pipelineIndex
                        ? "active"
                        : ""
                    }`}
                  >
                    {(i < pipelineIndex || stage === "generated") && <CheckCircle2 size={12} />}
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginBottom: "var(--space-4)" }}>
              <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-3)" }}>
                <ShieldCheck size={16} color="var(--accent)" />
                <div className="heading-md" style={{ fontSize: 14 }}>Language Safety</div>
              </div>
              <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 3 }}>
                Translation Status
              </div>
              <div style={{ fontSize: 13, color: "var(--warning)", marginBottom: "var(--space-3)" }}>
                Pending teacher verification
              </div>
              <div className="text-secondary" style={{ fontSize: 12, marginBottom: "var(--space-4)" }}>
                Language content should be reviewed before classroom use.
              </div>
              <button className="btn btn-secondary" style={{ width: "100%" }} onClick={() => setReviewOpen(true)}>
                Review Language Content
              </button>
            </div>

            <div className="card">
              <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                <span className="tag">{questionCount} Questions</span>
                <span className="tag">{difficulty}</span>
                <span className="tag">Visual + Verbal</span>
                <span className="tag">{worksheetConfig.format}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- BOTTOM ACTION BAR ---------- */}
        <div className="card" style={{ marginTop: "var(--space-6)" }}>
          <div className="flex gap-3" style={{ flexWrap: "wrap" }}>
            <button
  className="btn btn-secondary"
  onClick={() => {
    if (stage !== "generated") {
      showToast("Generate the worksheet first");
      return;
    }
    showToast("Saved to lesson");
  }}
>
              <Save size={14} /> Save to Lesson
            </button>
            <button className="btn btn-secondary" onClick={() => setReviewOpen(true)}>
              <Eye size={14} /> Review
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (stage !== "generated") {
                  showToast("Generate the worksheet first");
                  return;
                }
                setPrintOpen(true);
              }}
            >
              <Printer size={14} /> Print Preview
            </button>
          </div>
        </div>

        {/* ---------- TRUST NOTE ---------- */}
        <div className="text-muted" style={{ fontSize: 11.5, margin: "var(--space-5) 0" }}>
          PALASH MITRA keeps educational content structured and puts language verification in the teacher's hands.
        </div>
      </div>

      {/* ---------- REVIEW LANGUAGE CONTENT MODAL ---------- */}
      {reviewOpen && (
        <div className="modal-overlay" onClick={() => setReviewOpen(false)}>
          <div className="card modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
              <div className="heading-md">Review Language Content</div>
              <X size={16} style={{ cursor: "pointer" }} onClick={() => setReviewOpen(false)} />
            </div>
            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>
              Worksheet Instructions
            </div>
            <div style={{ fontSize: 13, marginBottom: "var(--space-4)" }}>
              Santali • Ol Chiki translations for this worksheet's instructions and labels have not yet
              been verified by a teacher or native speaker.
            </div>
            <div className="status-banner pending" style={{ display: "inline-flex", marginBottom: "var(--space-5)" }}>
              Translation pending verification
            </div>
            <div className="flex gap-3">
              <button className="btn btn-secondary btn-sm" onClick={() => setReviewOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- PRINT PREVIEW MODAL ---------- */}
      {printOpen && (
        <div className="modal-overlay" onClick={() => setPrintOpen(false)}>
          <div
            className="modal-panel"
            style={{ width: 480 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: "var(--space-3)", color: "var(--text)" }}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span style={{ fontWeight: 700, fontSize: 14 }}>Print Preview</span>
              </div>
              <X size={16} style={{ cursor: "pointer" }} onClick={() => setPrintOpen(false)} />
            </div>

            <div className="worksheet-paper" style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <div className="worksheet-paper-header">
                <div className="brand">PALASH MITRA</div>
                <div className="topic">
                  {worksheetConfig.topic} • {worksheetConfig.teachingLanguage}
                </div>
              </div>
              <div className="worksheet-name-date">
                <span>Name: ____________________</span>
                <span>Date: ____________</span>
              </div>
              {worksheetSections.map((section) => (
                <div className="worksheet-section" key={section.id}>
                  <div className="worksheet-section-title">
                    {section.letter}. {section.title.toUpperCase()}
                  </div>
                  <div className="worksheet-section-desc">{section.description}</div>
                </div>
              ))}
              <div className="worksheet-pending-note">
                Full printable layout — actual PDF/print export not yet implemented.
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: "var(--space-4)" }}
              onClick={() => setPrintOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ---------- TOAST ---------- */}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={15} /> {toast}
        </div>
      )}
    </div>
  );
}