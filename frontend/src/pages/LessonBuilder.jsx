import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  ArrowDown,
  FileText,
  Layers,
  Save,
  PlayCircle,
} from "lucide-react";
import {
  lessonBuilderForm,
  lessonPipelineStages,
  generatedLesson,
  builderActivity,
  builderQuestions,
  worksheetItems,
  flashcardPreview,
  lessonIncludes,
} from "../data/demoData";

export default function LessonBuilder({ onNavigate }) {
  const [form] = useState(lessonBuilderForm);
  const [stage, setStage] = useState("idle"); // idle | generating | done
  const [pipelineIndex, setPipelineIndex] = useState(-1);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [worksheetOpen, setWorksheetOpen] = useState(false);
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [adaptiveState, setAdaptiveState] = useState("idle"); // idle | struggling | simplified
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
    lessonPipelineStages.forEach((_, i) => {
      const t = setTimeout(() => setPipelineIndex(i), i * 450);
      timers.current.push(t);
    });
    const done = setTimeout(() => setStage("done"), lessonPipelineStages.length * 450 + 400);
    timers.current.push(done);
  };

  const handlePlayAudio = () => {
    clearTimers();
    setIsPlaying(true);
    const t = setTimeout(() => setIsPlaying(false), 1800);
    timers.current.push(t);
  };

  const handlePreviewAdaptation = () => {
    clearTimers();
    setAdaptiveState("struggling");
    const t = setTimeout(() => setAdaptiveState("simplified"), 1600);
    timers.current.push(t);
  };

  const goToClassroom = () => onNavigate && onNavigate("classroom");

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
            <h1 className="heading-lg" style={{ fontSize: 22 }}>AI LESSON BUILDER</h1>
            <span className="badge-ai"><Sparkles size={12} /> PALASH AI • READY</span>
          </div>
          <div className="text-secondary" style={{ fontSize: 13 }}>
            Turn curriculum into a mother-tongue classroom lesson.
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn btn-secondary" onClick={() => showToast("Draft saved")}>
            <Save size={14} /> Save Draft
          </button>
          <button className="btn btn-primary" onClick={handleGenerate}>
            <Sparkles size={14} /> Generate Lesson
          </button>
        </div>
      </div>

      <div className="app-content">
        {/* ---------- SECTION 1: LESSON FOUNDATION ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Lesson Foundation
        </div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
          >
            <div className="field-group">
              <label className="field-label">Class</label>
              <input className="field-input" readOnly value={form.grade} />
            </div>
            <div className="field-group">
              <label className="field-label">Subject</label>
              <input className="field-input" readOnly value={form.subject} />
            </div>
            <div className="field-group">
              <label className="field-label">Topic</label>
              <input className="field-input" readOnly value={form.topic} />
            </div>
            <div className="field-group">
              <label className="field-label">Teaching Language</label>
              <input className="field-input" readOnly value={form.teachingLanguage} />
            </div>
            <div className="field-group">
              <label className="field-label">Classroom Language</label>
              <input className="field-input" readOnly value={form.classroomLanguage} />
            </div>
            <div className="field-group">
              <label className="field-label">Lesson Duration</label>
              <input className="field-input" readOnly value={form.duration} />
            </div>
          </div>

          <div className="field-group" style={{ marginTop: "var(--space-4)" }}>
            <label className="field-label">Learning Outcome</label>
            <input className="field-input" readOnly value={form.outcome} />
          </div>

          <button
            className="btn btn-primary"
            style={{ marginTop: "var(--space-5)" }}
            onClick={handleGenerate}
          >
            <Sparkles size={14} /> Generate with PALASH AI
          </button>
        </div>

        {/* ---------- SECTION 2: PIPELINE ---------- */}
        {stage !== "idle" && (
          <div className="card" style={{ marginBottom: "var(--space-6)", textAlign: "center" }}>
            <div className="flow-bar" style={{ justifyContent: "center" }}>
              {lessonPipelineStages.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`flow-node ${
                      i < pipelineIndex || stage === "done"
                        ? "done"
                        : i === pipelineIndex
                        ? "active"
                        : ""
                    }`}
                  >
                    {s}
                  </div>
                  {i < lessonPipelineStages.length - 1 && (
                    <ArrowRight size={14} className="flow-arrow" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-secondary" style={{ fontSize: 12.5, marginTop: "var(--space-3)" }}>
              {stage === "generating"
                ? "PALASH AI is building your lesson..."
                : "Lesson generated successfully."}
            </div>
          </div>
        )}

        {/* Everything below only appears once generation is done */}
        {stage === "done" && (
          <>
            {/* ---------- SECTION 3: GENERATED LESSON ---------- */}
            <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
              Generated Lesson
            </div>
            <div className="card" style={{ marginBottom: "var(--space-6)" }}>
              <div className="heading-md" style={{ fontSize: 18, marginBottom: 4 }}>
                {generatedLesson.title}
              </div>
              <div className="text-secondary" style={{ fontSize: 13, marginBottom: "var(--space-4)" }}>
                {generatedLesson.outcome}
              </div>

              <hr className="divider" style={{ margin: "var(--space-4) 0" }} />

              <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 6 }}>
                Teacher Explanation — Hindi
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: "var(--space-4)" }}>
                {generatedLesson.teacherHindi}
              </div>

              <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 6 }}>
                Santali • Ol Chiki
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: "var(--space-4)" }}>
                {generatedLesson.teacherSantali}
              </div>

              <div className="flex gap-3" style={{ flexWrap: "wrap" }}>
                <button
                  className={`play-button ${isPlaying ? "playing" : ""}`}
                  style={{ width: "auto", padding: "10px 18px" }}
                  onClick={handlePlayAudio}
                >
                  <Volume2 size={15} />
                  {isPlaying ? "Playing…" : "Play Santali Audio"}
                </button>
                <button className="btn btn-secondary" onClick={() => setReviewOpen(true)}>
                  Review Translation
                </button>
              </div>
            </div>

            {/* ---------- SECTION 4: CLASSROOM ACTIVITY ---------- */}
            <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
              Classroom Activity
            </div>
            <div className="card" style={{ marginBottom: "var(--space-6)" }}>
              <div className="heading-md" style={{ marginBottom: "var(--space-3)" }}>
                {builderActivity.title}
              </div>

              <div className="classroom-object-row" style={{ justifyContent: "flex-start" }}>
                {Array.from({ length: builderActivity.objectCount }).map((_, i) => (
                  <div key={i} className="classroom-object">🍎</div>
                ))}
              </div>

              <div className="text-secondary" style={{ fontSize: 13, margin: "var(--space-3) 0" }}>
                Teacher: "{builderActivity.instructionTeacher}"
              </div>

              <div className="flex gap-3" style={{ flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
                <span className="tag">Expected Answer: {builderActivity.expectedAnswer}</span>
                <span className="tag">{builderActivity.type}</span>
                <span className="tag">{builderActivity.difficulty}</span>
              </div>

              <button className="btn btn-secondary" onClick={goToClassroom}>
                <PlayCircle size={14} /> Preview in Live Classroom
              </button>
            </div>

            {/* ---------- SECTION 5: QUESTIONS ---------- */}
            <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
              Check Understanding
            </div>
            <div className="card" style={{ marginBottom: "var(--space-6)" }}>
              {builderQuestions.map((q, i) => (
                <div key={q.id} className="question-item">
                  <div>
                    <strong style={{ color: "var(--text)" }}>{i + 1}. {q.question}</strong>
                    <div className="text-muted" style={{ marginTop: 2 }}>Answer: {q.answer}</div>
                  </div>
                  <div className="question-meta">
                    <span className="tag">{q.difficulty}</span>
                    <span className="tag">{q.language}</span>
                  </div>
                </div>
              ))}
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: "var(--space-4)" }}
                onClick={() => showToast("Question added")}
              >
                <Plus size={13} /> Add Question
              </button>
            </div>

            {/* ---------- SECTION 6: ADAPTIVE LEARNING ---------- */}
            <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
              Adaptive Learning
            </div>
            <div className="card" style={{ marginBottom: "var(--space-6)" }}>
              <div className="text-secondary" style={{ fontSize: 13, marginBottom: "var(--space-4)" }}>
                PALASH adapts the next interaction based on student understanding.
              </div>

              <div className="adaptive-diagram">
                <div className="adaptive-node">Student Answer</div>
                <ArrowDown size={14} className="text-muted" />
                <div className="adaptive-node">Correct?</div>
                <div className="adaptive-branches">
                  <div className="adaptive-branch-col">
                    <div className="adaptive-node yes">YES</div>
                    <ArrowDown size={13} className="text-muted" />
                    <div className="adaptive-node yes">Continue</div>
                  </div>
                  <div className="adaptive-branch-col">
                    <div className="adaptive-node no">NO</div>
                    <ArrowDown size={13} className="text-muted" />
                    <div className="adaptive-node no">Simplify</div>
                    <ArrowDown size={13} className="text-muted" />
                    <div className="adaptive-node no">Visual Aid</div>
                    <ArrowDown size={13} className="text-muted" />
                    <div className="adaptive-node no">Retry</div>
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {adaptiveState === "idle" && (
                <div className="text-muted" style={{ fontSize: 12.5, marginBottom: "var(--space-4)" }}>
                  No adaptation triggered yet.
                </div>
              )}
              {adaptiveState === "struggling" && (
                <div style={{ color: "var(--warning)", fontSize: 13, fontWeight: 600, marginBottom: "var(--space-4)" }}>
                  Student needs support…
                </div>
              )}
              {adaptiveState === "simplified" && (
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <div style={{ color: "var(--success)", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    AI simplified the explanation
                  </div>
                  <div className="text-secondary" style={{ fontSize: 12.5 }}>
                    "Let's make it easier." → 1. Show visual objects 2. Simplify explanation 3. Ask again
                  </div>
                </div>
              )}

              <button className="btn btn-secondary" onClick={handlePreviewAdaptation}>
                Preview Adaptation
              </button>
            </div>

            {/* ---------- SECTION 7: WORKSHEET + FLASHCARDS ---------- */}
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "1fr 1fr", marginBottom: "var(--space-6)" }}
            >
              <div className="card">
                <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-3)" }}>
                  <FileText size={16} color="var(--primary-soft)" />
                  <div className="heading-md" style={{ fontSize: 15 }}>Worksheet</div>
                </div>
                <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-3)" }}>
                  Generated from this lesson.
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--text-secondary)" }}>
                  {worksheetItems.map((item) => (
                    <li key={item} style={{ marginBottom: 4 }}>{item}</li>
                  ))}
                </ul>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: "var(--space-4)" }}
                  onClick={() => setWorksheetOpen(true)}
                >
                  Preview Worksheet
                </button>
              </div>

              <div className="card">
                <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-3)" }}>
                  <Layers size={16} color="var(--primary-soft)" />
                  <div className="heading-md" style={{ fontSize: 15 }}>Flashcards</div>
                </div>
                <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-3)" }}>
                  Generated learning cards.
                </div>
                <div className="flex gap-2">
                  {flashcardPreview.map((f) => (
                    <div key={f.id} className="classroom-object" style={{ width: 40, height: 40, fontSize: 15, fontWeight: 700 }}>
                      {f.label}
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: "var(--space-4)" }}
                  onClick={() => setFlashcardOpen(true)}
                >
                  Preview Flashcards
                </button>
              </div>
            </div>

            {/* ---------- SECTION 8: LESSON SUMMARY ---------- */}
            <div className="card card-elevated" style={{ marginBottom: "var(--space-6)" }}>
              <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-3)" }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <div className="heading-md" style={{ fontSize: 16 }}>Lesson Ready</div>
              </div>

              <div className="flex gap-5" style={{ flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
                <div className="text-secondary" style={{ fontSize: 12.5 }}>Class: <strong style={{ color: "var(--text)" }}>{form.grade.replace("Class ", "")}</strong></div>
                <div className="text-secondary" style={{ fontSize: 12.5 }}>Subject: <strong style={{ color: "var(--text)" }}>{form.subject}</strong></div>
                <div className="text-secondary" style={{ fontSize: 12.5 }}>Topic: <strong style={{ color: "var(--text)" }}>{form.topic}</strong></div>
                <div className="text-secondary" style={{ fontSize: 12.5 }}>Duration: <strong style={{ color: "var(--text)" }}>{form.duration}</strong></div>
                <div className="text-secondary" style={{ fontSize: 12.5 }}>Language: <strong style={{ color: "var(--text)" }}>Hindi → Santali</strong></div>
              </div>

              <div className="checklist" style={{ marginBottom: "var(--space-5)" }}>
                {lessonIncludes.map((item) => (
                  <div key={item} className="checklist-item">
                    <CheckCircle2 size={13} color="var(--success)" /> {item}
                  </div>
                ))}
              </div>

              <div className="flex gap-3" style={{ flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={goToClassroom}>
                  Start Live Class <ArrowRight size={14} />
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => showToast("Saved to Lesson Library")}
                >
                  Save to Lesson Library
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ---------- REVIEW TRANSLATION MODAL ---------- */}
      {reviewOpen && (
        <div className="modal-overlay" onClick={() => setReviewOpen(false)}>
          <div className="card modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
              <div className="heading-md">Review Translation</div>
              <X size={16} style={{ cursor: "pointer" }} onClick={() => setReviewOpen(false)} />
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>Hindi Source</div>
            <div style={{ fontSize: 13.5, marginBottom: "var(--space-4)" }}>{generatedLesson.teacherHindi}</div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>Santali Translation</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: "var(--space-4)" }}>
              {generatedLesson.teacherSantali}
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>Confidence</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)", marginBottom: "var(--space-3)" }}>
              {generatedLesson.confidence}%
            </div>

            <div className="text-muted" style={{ fontSize: 11.5, marginBottom: "var(--space-5)" }}>
              AI-generated translation. Teacher verification recommended.
            </div>

            <div className="flex gap-3">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { setReviewOpen(false); showToast("Translation confirmed"); }}
              >
                Confirm
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setReviewOpen(false)}>
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- WORKSHEET PREVIEW MODAL ---------- */}
      {worksheetOpen && (
        <div className="modal-overlay" onClick={() => setWorksheetOpen(false)}>
          <div className="card modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
              <div className="heading-md">Worksheet Preview</div>
              <X size={16} style={{ cursor: "pointer" }} onClick={() => setWorksheetOpen(false)} />
            </div>
            <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-3)" }}>
              {form.grade} • {form.subject} • {form.topic}
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
              {worksheetItems.map((item) => (
                <li key={item} style={{ marginBottom: 6 }}>{item}</li>
              ))}
            </ul>
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: "var(--space-5)" }}
              onClick={() => setWorksheetOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ---------- FLASHCARD PREVIEW MODAL ---------- */}
      {flashcardOpen && (
        <div className="modal-overlay" onClick={() => setFlashcardOpen(false)}>
          <div className="card modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
              <div className="heading-md">Flashcards Preview</div>
              <X size={16} style={{ cursor: "pointer" }} onClick={() => setFlashcardOpen(false)} />
            </div>
            <div className="flex gap-3" style={{ marginBottom: "var(--space-5)" }}>
              {flashcardPreview.map((f) => (
                <div key={f.id} style={{ textAlign: "center" }}>
                  <div className="classroom-object" style={{ width: 56, height: 56, fontSize: 24, marginBottom: 6 }}>
                    {"🍎".repeat(f.count).length > 5 ? "🍎" : "🍎"}
                  </div>
                  <div style={{ fontWeight: 700 }}>{f.label}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setFlashcardOpen(false)}>
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