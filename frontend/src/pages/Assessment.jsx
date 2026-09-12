import { useState, useEffect, useRef } from "react";
import {
  ClipboardCheck,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Save,
  Download,
  Zap,
  X,
  BarChart3,
} from "lucide-react";
import {
  classInfo,
  currentLesson,
  assessmentSummary,
  assessmentQuestions,
  learningSignals,
  masteryBreakdown,
  adaptiveRecommendation,
} from "../data/demoData";

const SIGNAL_CLASS = { Strong: "strong", Watch: "watch", Reinforce: "reinforce" };

export default function Assessment({ onNavigate }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");
  const [verifiedTranslation, setVerifiedTranslation] = useState(null);
  const [recommendationApplied, setRecommendationApplied] = useState(false);
  const [toast, setToast] = useState(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const showToast = (message) => {
    setToast(message);
    const t = setTimeout(() => setToast(null), 2400);
    timers.current.push(t);
  };

  const question = assessmentQuestions[currentQuestion];
  const totalResponses = question.correct + question.incorrect + question.noResponse;
  const pct = (n) => Math.round((n / totalResponses) * 100);

  const openReview = () => {
    setVerificationInput("");
    setReviewOpen(true);
  };

  const markVerified = () => {
    if (!verificationInput.trim()) {
      showToast("Enter a verified translation first");
      return;
    }
    setVerifiedTranslation(verificationInput.trim());
    setReviewOpen(false);
    showToast("Marked as teacher verified");
  };

  const keepPending = () => setReviewOpen(false);

  const applyRecommendation = () => {
    setRecommendationApplied(true);
    showToast("Adaptive activity selected");
  };

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
          <h1 className="heading-lg" style={{ fontSize: 22, marginBottom: 4 }}>ASSESSMENT</h1>
          <div className="text-secondary" style={{ fontSize: 13, marginBottom: 6 }}>
            {classInfo.grade} • {classInfo.subject} • {currentLesson.topic}
          </div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            Check understanding, identify learning gaps, and decide what happens next.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className="tag" style={{ marginBottom: 6, display: "inline-block" }}>FORMATIVE CHECK</span>
          <div className="text-secondary" style={{ fontSize: 12.5 }}>
            {assessmentSummary.studentsAssessed} / {assessmentSummary.studentsTotal} students present
          </div>
        </div>
      </div>

      <div className="app-content">
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="flex items-center gap-5" style={{ flexWrap: "wrap" }}>
            <div className="text-secondary" style={{ fontSize: 12.5 }}>
              Learning outcome: <strong style={{ color: "var(--text)" }}>{currentLesson.outcome}</strong>
            </div>
            <span className="tag">Hindi Teacher → Santali • Ol Chiki</span>
          </div>
        </div>

        {/* ---------- SUMMARY ---------- */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: "var(--space-6)" }}
        >
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Students Assessed</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {assessmentSummary.studentsAssessed} / {assessmentSummary.studentsTotal}
            </div>
          </div>
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Mastery</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--success)" }}>{assessmentSummary.mastery}%</div>
          </div>
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Correct Responses</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--success)" }}>{assessmentSummary.correctResponses}%</div>
          </div>
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Needs Reinforcement</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--warning)" }}>{assessmentSummary.needsReinforcement} students</div>
          </div>
        </div>
        <div className="text-muted" style={{ fontSize: 11, marginTop: -12, marginBottom: "var(--space-6)" }}>
          Demo values for prototype purposes — not live classroom data.
        </div>

        {/* ---------- QUESTION AREA ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Question {currentQuestion + 1}
        </div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="heading-md" style={{ fontSize: 17, marginBottom: 6 }}>{question.title}</div>
          <div className="text-secondary" style={{ fontSize: 13, marginBottom: "var(--space-3)" }}>{question.prompt}</div>

          <div className="classroom-object-row" style={{ justifyContent: "flex-start" }}>
            {Array.from({ length: question.visualCount }).map((_, i) => (
              <div key={i} className="classroom-object">🍎</div>
            ))}
          </div>

          <div className="tag" style={{ marginBottom: "var(--space-5)" }}>Expected answer: {question.expectedAnswer}</div>

          <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 10 }}>Response Distribution</div>
          <div className="distribution-row">
            <div className="distribution-label">Correct</div>
            <div className="distribution-track">
              <div className="distribution-fill correct" style={{ width: `${pct(question.correct)}%` }} />
            </div>
            <div className="distribution-count">{question.correct} students</div>
          </div>
          <div className="distribution-row">
            <div className="distribution-label">Incorrect</div>
            <div className="distribution-track">
              <div className="distribution-fill incorrect" style={{ width: `${pct(question.incorrect)}%` }} />
            </div>
            <div className="distribution-count">{question.incorrect} students</div>
          </div>
          <div className="distribution-row">
            <div className="distribution-label">No response</div>
            <div className="distribution-track">
              <div className="distribution-fill no-response" style={{ width: `${pct(question.noResponse)}%` }} />
            </div>
            <div className="distribution-count">{question.noResponse} students</div>
          </div>

          <hr className="divider" />

          <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
            <Sparkles size={14} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: 13 }}>AI Observation</span>
          </div>
          <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: 6 }}>
            Most students identified the quantity correctly. A small group may need reinforcement with
            one-to-one counting.
          </div>
          <div className="text-muted" style={{ fontSize: 11 }}>
            Demo AI observation generated from mock response data.
          </div>
        </div>

        {/* ---------- LEARNING SIGNALS ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Learning Signals
        </div>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginBottom: "var(--space-2)" }}
        >
          {learningSignals.map((s) => (
            <div key={s.id} className="signal-card">
              <div className={`signal-tag ${SIGNAL_CLASS[s.label]}`}>
                {s.label === "Strong" && <CheckCircle2 size={12} />}
                {s.label === "Watch" && <AlertCircle size={12} />}
                {s.label === "Reinforce" && <Zap size={12} />}
                {s.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
              <div className="text-secondary" style={{ fontSize: 12 }}>{s.students} students</div>
            </div>
          ))}
        </div>
        <div className="text-muted" style={{ fontSize: 11, marginBottom: "var(--space-6)" }}>
          Demo signals generated from mock data.
        </div>

        {/* ---------- ADAPTIVE RECOMMENDATION ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Recommended Next Step
        </div>
        <div className="recommendation-card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="heading-md" style={{ fontSize: 16, marginBottom: 6 }}>
            {adaptiveRecommendation.title}
          </div>
          <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-4)" }}>
            {adaptiveRecommendation.reason}
          </div>

          <div className="flex gap-6" style={{ flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
            <div>
              <div className="label-uppercase" style={{ fontSize: 10, marginBottom: 3 }}>Current Activity</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{adaptiveRecommendation.currentActivity}</div>
            </div>
            <ArrowRight size={16} className="text-muted" style={{ marginTop: 16 }} />
            <div>
              <div className="label-uppercase" style={{ fontSize: 10, marginBottom: 3 }}>Recommended Activity</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
                {adaptiveRecommendation.recommendedActivity}
              </div>
            </div>
          </div>

          <div className="text-muted" style={{ fontSize: 11.5, marginBottom: "var(--space-4)" }}>
            Next: {adaptiveRecommendation.sequence}
          </div>

          {recommendationApplied && (
            <div className="status-banner verified" style={{ display: "inline-flex", marginBottom: "var(--space-4)" }}>
              <CheckCircle2 size={14} /> Adaptive activity selected
            </div>
          )}

          <div className="flex gap-3">
            <button className="btn btn-primary" onClick={applyRecommendation}>
              Apply Recommendation
            </button>
            <button className="btn btn-secondary" onClick={() => showToast("Activity details opened")}>
              Review Activity
            </button>
          </div>
        </div>

        {/* ---------- CLASS MASTERY ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Class Mastery
        </div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          {masteryBreakdown.map((m) => (
            <div key={m.id} className="mastery-row">
              <div className="mastery-label">{m.label}</div>
              <div className="mastery-track">
                <div className="mastery-fill" style={{ width: `${m.percentage}%` }} />
              </div>
              <div className="mastery-meta">{m.students} students • {m.percentage}%</div>
            </div>
          ))}
          <div className="text-muted" style={{ fontSize: 11.5, marginTop: 4 }}>
            Mastery is based on this formative assessment session.
          </div>
        </div>

        {/* ---------- QUESTION NAVIGATION ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Question Navigation
        </div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="question-nav">
            {assessmentQuestions.map((q, i) => (
              <div
                key={q.id}
                className={`question-nav-item ${i === currentQuestion ? "current" : ""}`}
                onClick={() => setCurrentQuestion(i)}
                title={q.title}
              >
                {q.id}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- LANGUAGE SAFETY ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Language Safety
        </div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-3)" }}>
            <ShieldCheck size={16} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>Language Safety</span>
          </div>
<div style={{ fontSize: 13, color: verifiedTranslation ? "var(--success)" : "var(--warning)", marginBottom: "var(--space-3)" }}>
  {verifiedTranslation ? "Content reviewed" : "Teacher verification required"}
</div>          <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-4)" }}>
            Assessment prompts can be generated in the classroom language, but unverified Santali • Ol Chiki
            content is never presented as confirmed.
          </div>
          {verifiedTranslation && (
  <div className="tag" style={{ marginBottom: "var(--space-4)" }}>
    Verified content: {verifiedTranslation}
  </div>
)}
          <button className="btn btn-secondary" onClick={openReview}>
            Review Language Content
          </button>
        </div>

        {/* ---------- TEACHER ACTIONS ---------- */}
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="flex gap-3" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-secondary" onClick={() => showToast("Assessment saved")}>
              <Save size={14} /> Save Assessment
            </button>
            <button className="btn btn-secondary" onClick={() => showToast("Report export is a prototype action")}>
              <Download size={14} /> Export Report
            </button>
            <button className="btn btn-primary" onClick={() => showToast("Reinforcement activity selected")}>
              <ClipboardCheck size={14} /> Start Reinforcement
            </button>
          </div>
        </div>

        {/* ---------- ANALYTICS CONNECTION ---------- */}
        <div className="card card-elevated" style={{ marginBottom: "var(--space-6)" }}>
          <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-3)" }}>
            <BarChart3 size={16} color="var(--primary-soft)" />
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>Feeds Progress Analytics</span>
          </div>
          <div className="flex gap-2" style={{ flexWrap: "wrap", marginBottom: "var(--space-3)" }}>
            <span className="tag">Class mastery</span>
            <span className="tag">Learning gaps</span>
            <span className="tag">Common misconceptions</span>
            <span className="tag">Reinforcement needs</span>
          </div>
          <div className="text-muted" style={{ fontSize: 11.5 }}>
            Assessment results can contribute to teacher progress views and future government-level
            learning analytics. This prototype does not connect to any real government system.
          </div>
        </div>
      </div>

      {/* ---------- REVIEW MODAL ---------- */}
      {reviewOpen && (
        <div className="modal-overlay" onClick={() => setReviewOpen(false)}>
          <div className="card modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
              <div className="heading-md">Santali • Ol Chiki Content Review</div>
              <X size={16} style={{ cursor: "pointer" }} onClick={() => setReviewOpen(false)} />
            </div>

            <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-4)" }}>
              Some assessment language is currently pending verification.
            </div>

            {verifiedTranslation ? (
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--success)", marginBottom: "var(--space-4)" }}>
                {verifiedTranslation}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "var(--warning)", marginBottom: "var(--space-3)" }}>
                Translation pending verification
              </div>
            )}

            {!verifiedTranslation && (
              <div className="field-group" style={{ marginBottom: "var(--space-5)" }}>
                <label className="field-label">Enter verified translation</label>
                <input
                  className="field-input"
                  placeholder="Enter verified translation"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-3">
              {!verifiedTranslation && (
                <>
                  <button className="btn btn-primary btn-sm" onClick={markVerified}>
                    Mark as Verified
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={keepPending}>
                    Keep Pending
                  </button>
                </>
              )}
              <button className="btn btn-secondary btn-sm" onClick={() => setReviewOpen(false)}>
                Close
              </button>
            </div>
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