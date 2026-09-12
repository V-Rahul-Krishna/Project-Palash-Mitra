import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  MonitorPlay,
  Save,
} from "lucide-react";
import {
  classInfo,
  flashcardSet,
  flashcards as initialFlashcards,
  practiceModes,
  adaptationPreview,
} from "../data/demoData";

export default function Flashcards({ onNavigate }) {
  const [cards, setCards] = useState(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState(4); // demo opens on card 5
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioMessage, setAudioMessage] = useState(null);
const [reviewOpen, setReviewOpen] = useState(false);
const [verificationInput, setVerificationInput] = useState("");
const [editingTranslation, setEditingTranslation] = useState(false);  const [selectedMode, setSelectedMode] = useState(null);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [adaptationOpen, setAdaptationOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const card = cards[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / cards.length) * 100);

  const showToast = (message) => {
    setToast(message);
    const t = setTimeout(() => setToast(null), 2400);
    timers.current.push(t);
  };

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(cards.length - 1, i + 1));

  const handlePlayAudio = () => {
    clearTimers();
    setIsPlaying(true);
    setAudioMessage("Playing audio…");
    const t = setTimeout(() => {
      setIsPlaying(false);
      setAudioMessage("Audio preview complete");
      const t2 = setTimeout(() => setAudioMessage(null), 1500);
      timers.current.push(t2);
    }, 1600);
    timers.current.push(t);
  };

  const openReview = () => {
  setVerificationInput("");
  setEditingTranslation(false);
  setReviewOpen(true);
};

const startEditTranslation = () => {
  setVerificationInput(card.olChiki);
  setEditingTranslation(true);
};

const markVerified = () => {
  if (!verificationInput.trim()) {
    showToast("Enter a verified translation first");
    return;
  }
  setCards((prev) =>
    prev.map((c, i) =>
      i === currentIndex
        ? { ...c, olChiki: verificationInput.trim(), verified: true }
        : c
    )
  );
  setReviewOpen(false);
  setEditingTranslation(false);
  showToast("Marked as teacher verified");
};

const keepPending = () => {
  setReviewOpen(false);
  setEditingTranslation(false);
};

  const handleStartPractice = () => {
    if (!selectedMode) {
      showToast("Select a practice mode first");
      return;
    }
    setPracticeStarted(true);
  };

  const handleApplyAdaptation = () => {
    setAdaptationOpen(false);
    showToast("Adaptation applied to next activity");
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
          <h1 className="heading-lg" style={{ fontSize: 22, marginBottom: 4 }}>
            Flashcards
          </h1>
          <div className="text-secondary" style={{ fontSize: 13 }}>
            Visual practice for mother-tongue learning
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div className="flex gap-2" style={{ justifyContent: "flex-end", flexWrap: "wrap", marginBottom: 6 }}>
            <span className="tag">{classInfo.grade}</span>
            <span className="tag">{classInfo.subject}</span>
            <span className="tag">Numbers 1–10</span>
            <span className="tag">Santali • Ol Chiki</span>
          </div>
          <span className="badge-ai">
            <Sparkles size={12} /> AI-generated • Teacher verified where marked
          </span>
        </div>
      </div>

      <div className="app-content">
        {/* ---------- SET SUMMARY ---------- */}
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="heading-md" style={{ fontSize: 17, marginBottom: 4 }}>
                {flashcardSet.title}
              </div>
              <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-3)" }}>
                {flashcardSet.outcome}
              </div>
              <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                <span className="tag">{flashcardSet.cardCount} Cards</span>
                <span className="tag">{flashcardSet.mode}</span>
                <span className="tag">{flashcardSet.language}</span>
                <span className="tag">{flashcardSet.difficulty}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-secondary" onClick={() => showToast("Set preview opened")}>
                Preview Set
              </button>
              <button className="btn btn-primary" onClick={() => onNavigate && onNavigate("classroom")}>
                <MonitorPlay size={14} /> Use in Live Classroom
              </button>
            </div>
          </div>
        </div>

        {/* ---------- MAIN FLASHCARD + LANGUAGE LAYER ---------- */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "1.3fr 1fr", alignItems: "start", marginBottom: "var(--space-6)" }}
        >
          {/* Main card */}
          <div className="card">
            <div className="flashcard-main">
              <div className="label-uppercase" style={{ marginBottom: 6 }}>Number</div>
              <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 4 }}>{card.value}</div>

              <div className="flashcard-objects">
                {Array.from({ length: card.visualCount }).map((_, i) => (
                  <span key={i} style={{ fontSize: 22 }}>🍎</span>
                ))}
              </div>

              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                {card.olChiki}
              </div>
              <div className="text-secondary" style={{ fontSize: 13, marginBottom: "var(--space-3)" }}>
                English meaning: <strong style={{ color: "var(--text)" }}>{card.english}</strong>
              </div>

              <div
                className={`status-banner ${card.verified ? "verified" : "pending"}`}
                style={{ justifyContent: "center", marginBottom: "var(--space-4)" }}
              >
                {card.verified ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                {card.verified ? "Teacher verified" : "Language content needs verification"}
              </div>

              <div className="flex items-center justify-center gap-4" style={{ marginBottom: "var(--space-4)" }}>
                <button className="icon-btn-circle" onClick={goPrev} disabled={currentIndex === 0}>
                  <ChevronLeft size={18} />
                </button>
                <button
                  className={`play-button ${isPlaying ? "playing" : ""}`}
                  style={{ width: "auto", padding: "10px 20px" }}
                  onClick={handlePlayAudio}
                >
                  <Volume2 size={15} /> {audioMessage || "Play Audio"}
                </button>
                <button
                  className="icon-btn-circle"
                  onClick={goNext}
                  disabled={currentIndex === cards.length - 1}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="text-muted" style={{ fontSize: 11.5, marginBottom: 6 }}>
                Card {currentIndex + 1} of {cards.length}
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>

          {/* Language Layer */}
          <div className="card">
            <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-4)" }}>
              <ShieldCheck size={16} color="var(--accent)" />
              <div className="heading-md" style={{ fontSize: 14.5 }}>Language Layer</div>
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 3 }}>Teacher Language</div>
            <div style={{ fontSize: 13, marginBottom: "var(--space-3)" }}>Hindi — "{card.hindi}"</div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 3 }}>Classroom Language</div>
            <div style={{ fontSize: 13, marginBottom: "var(--space-3)" }}>Santali • Ol Chiki</div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 3 }}>Translation</div>
            <div style={{ fontSize: 13, marginBottom: "var(--space-3)", color: card.verified ? "var(--success)" : "var(--warning)" }}>
              {card.verified ? card.olChiki : "Translation pending verification"}
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 3 }}>Audio</div>
            <div className="text-muted" style={{ fontSize: 12.5, marginBottom: "var(--space-3)" }}>
              Audio preview unavailable
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 3 }}>Verification</div>
            <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-4)" }}>
              {card.verified ? "Reviewed by teacher" : "Teacher review required"}
            </div>

<button className="btn btn-secondary" style={{ width: "100%" }} onClick={openReview}>
  Review Translation
</button>          </div>
        </div>

        {/* ---------- MINI CARD STRIP ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Card Navigation
        </div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="mini-card-strip">
            {cards.map((c, i) => (
              <div
                key={c.id}
                className={`mini-card ${i === currentIndex ? "current" : ""}`}
                onClick={() => setCurrentIndex(i)}
              >
                {c.value}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- PRACTICE MODE ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Practice Mode
        </div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: "var(--space-4)" }}
          >
            {practiceModes.map((mode) => (
              <div
                key={mode.id}
                className={`mode-option ${selectedMode === mode.id ? "selected" : ""}`}
                onClick={() => { setSelectedMode(mode.id); setPracticeStarted(false); }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{mode.title}</div>
                <div className="text-secondary" style={{ fontSize: 12 }}>{mode.description}</div>
              </div>
            ))}
          </div>

          {practiceStarted ? (
            <div className="status-banner verified" style={{ display: "inline-flex" }}>
              <CheckCircle2 size={14} /> Ready for classroom practice
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleStartPractice}>
              Start Practice
            </button>
          )}

          {practiceStarted && (
            <button
              className="btn btn-secondary"
              style={{ marginLeft: "var(--space-3)" }}
              onClick={() => onNavigate && onNavigate("classroom")}
            >
              Begin
            </button>
          )}
        </div>

        {/* ---------- ADAPTIVE LEARNING ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Adaptive Learning
        </div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-4)" }}>
            PALASH uses response patterns to adjust practice difficulty.
          </div>

          <div className="flex gap-5" style={{ flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
            <div className="flex items-center gap-2" style={{ fontSize: 12.5 }}>
              <span className="tag" style={{ color: "var(--success)" }}>Correct</span>
              <ChevronRight size={13} className="text-muted" />
              <span className="text-secondary">Increase difficulty</span>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: 12.5, flexWrap: "wrap" }}>
              <span className="tag" style={{ color: "var(--warning)" }}>Incorrect</span>
              <ChevronRight size={13} className="text-muted" />
              <span className="text-secondary">Show visual again → Simplify prompt → Retry</span>
            </div>
          </div>

          <button className="btn btn-secondary" onClick={() => setAdaptationOpen(true)}>
            Preview Adaptation
          </button>
        </div>

        {/* ---------- LIVE CLASSROOM CTA ---------- */}
        <div className="card card-elevated" style={{ marginBottom: "var(--space-4)" }}>
          <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="heading-md" style={{ fontSize: 16, marginBottom: 4 }}>
                Ready for the classroom?
              </div>
              <div className="text-secondary" style={{ fontSize: 12.5, maxWidth: 420 }}>
                Use this flashcard set on the shared classroom display and let students respond verbally.
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-primary" onClick={() => onNavigate && onNavigate("classroom")}>
                <MonitorPlay size={14} /> Open Live Classroom
              </button>
              <button className="btn btn-secondary" onClick={() => showToast("Saved to lesson")}>
                <Save size={14} /> Save to Lesson
              </button>
            </div>
          </div>
        </div>

        {/* ---------- FOOTER TRUST NOTE ---------- */}
        <div className="text-muted" style={{ fontSize: 11.5, marginBottom: "var(--space-6)" }}>
          Language content marked verified has passed teacher or native-speaker review.
        </div>
      </div>

      {/* ---------- REVIEW TRANSLATION MODAL ---------- */}
{reviewOpen && (
  <div className="modal-overlay" onClick={() => setReviewOpen(false)}>
    <div className="card modal-panel" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
        <div className="heading-md">Review Language Content</div>
        <X size={16} style={{ cursor: "pointer" }} onClick={() => setReviewOpen(false)} />
      </div>

      <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>Source — Hindi</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: "var(--space-4)" }}>{card.hindi}</div>

      <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>
        Target — Santali • Ol Chiki
      </div>

      {card.verified && !editingTranslation ? (
        <>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--success)", marginBottom: "var(--space-3)" }}>
            {card.olChiki}
          </div>
          <div className="status-banner verified" style={{ display: "inline-flex", marginBottom: "var(--space-4)" }}>
            <CheckCircle2 size={14} /> Teacher verified
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 14, color: "var(--warning)", marginBottom: "var(--space-3)" }}>
            Translation pending verification
          </div>

          <div className="field-group" style={{ marginBottom: "var(--space-4)" }}>
            <label className="field-label">Verified Santali • Ol Chiki</label>
            <input
              className="field-input"
              placeholder="Enter verified translation"
              value={verificationInput}
              onChange={(e) => setVerificationInput(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="text-secondary" style={{ fontSize: 12, marginBottom: "var(--space-5)" }}>
        Teacher / native speaker verification is required before this phrase becomes part of the verified language pack.
      </div>

      <div className="flex gap-3" style={{ flexWrap: "wrap" }}>
        {card.verified && !editingTranslation ? (
          <>
            <button className="btn btn-secondary btn-sm" onClick={startEditTranslation}>
              Edit Translation
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setReviewOpen(false)}>
              Close
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-primary btn-sm" onClick={markVerified}>
              Mark as Verified
            </button>
            {!editingTranslation && (
              <button className="btn btn-secondary btn-sm" onClick={keepPending}>
                Keep Pending
              </button>
            )}
            <button className="btn btn-secondary btn-sm" onClick={() => setReviewOpen(false)}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  </div>
)}
      {/* ---------- ADAPTATION PREVIEW MODAL ---------- */}
      {adaptationOpen && (
        <div className="modal-overlay" onClick={() => setAdaptationOpen(false)}>
          <div className="card modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
              <div className="heading-md">Adaptation Preview</div>
              <X size={16} style={{ cursor: "pointer" }} onClick={() => setAdaptationOpen(false)} />
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>Student Response</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--warning)", marginBottom: "var(--space-4)" }}>
              {adaptationPreview.studentResponse}
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>AI Recommendation</div>
            <div style={{ fontSize: 13, marginBottom: "var(--space-4)" }}>{adaptationPreview.recommendation}</div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>Next Activity</div>
            <div style={{ fontSize: 13, marginBottom: "var(--space-5)" }}>{adaptationPreview.nextActivity}</div>

            <div className="flex gap-3">
              <button className="btn btn-primary btn-sm" onClick={handleApplyAdaptation}>
                Apply
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setAdaptationOpen(false)}>
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