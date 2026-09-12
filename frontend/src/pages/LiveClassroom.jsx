import { useState, useEffect, useRef } from "react";
import {
  Users,
  Clock,
  Wifi,
  WifiOff,
  Mic,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Settings,
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  X,
} from "lucide-react";
import {
  classInfo,
  currentLesson,
  classroomSession,
  teacherSpeech,
  classroomDisplay,
  studentResponse,
  pipelineStages,
  flowStages,
} from "../data/demoData";

export default function LiveClassroom({ onNavigate }) {
  // ---------- elapsed time ----------
  const [elapsedSeconds, setElapsedSeconds] = useState(
    classroomSession.elapsedStartMinutes * 60
  );
  useEffect(() => {
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  const secs = String(elapsedSeconds % 60).padStart(2, "0");

  // ---------- pipeline / flow state ----------
  const [pipelineIndex, setPipelineIndex] = useState(-1); // -1 = idle
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [flowStage, setFlowStage] = useState(0); // index into flowStages, -1 handled as 0 baseline
  const [answerState, setAnswerState] = useState("pending"); // pending | correct | incorrect
  const [questionRound, setQuestionRound] = useState(1);
  const [reviewOpen, setReviewOpen] = useState(false);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  // SPEAK: run teacher pipeline animation
  const handleSpeak = () => {
    clearTimers();
    setIsListening(true);
    setPipelineIndex(0);
    setFlowStage(0);
    pipelineStages.forEach((_, i) => {
      const t = setTimeout(() => setPipelineIndex(i), i * 500);
      timers.current.push(t);
    });
    const done = setTimeout(() => {
      setIsListening(false);
      setFlowStage(1); // AI Understands
    }, pipelineStages.length * 500 + 300);
    timers.current.push(done);
  };

  // PLAY SANTALI: reveal audio + advance flow toward assessment
  const handlePlaySantali = () => {
    clearTimers();
    setIsPlaying(true);
    setFlowStage((s) => Math.max(s, 2)); // Santali Audio
    const t1 = setTimeout(() => setIsPlaying(false), 1800);
    const t2 = setTimeout(() => setFlowStage(3), 2200); // Child Responds
    const t3 = setTimeout(() => setFlowStage(4), 3000); // AI Translates
    timers.current.push(t1, t2, t3);
  };

  const handleRepeat = () => {
    clearTimers();
    setFlowStage(2);
    handlePlaySantali();
  };

  const handleMarkUnderstood = () => {
    setAnswerState("correct");
    setFlowStage(5); // Assessment
  };

  const handleContinueLesson = () => {
    clearTimers();
    setQuestionRound((r) => r + 1);
    setAnswerState("pending");
    setFlowStage(0);
    setPipelineIndex(-1);
    setIsListening(false);
    setIsPlaying(false);
  };

  return (
    <div className="app-main" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ---------- HEADER ---------- */}
      <div className="classroom-header">
        <div>
          <div className="flex items-center gap-3" style={{ marginBottom: 4 }}>
            <h1 className="heading-lg" style={{ fontSize: 20 }}>
              LIVE CLASSROOM
            </h1>
            <span className="pill active">
              <span className="status-dot active" /> CLASS ACTIVE
            </span>
          </div>
          <div className="text-secondary" style={{ fontSize: 13 }}>
            {classInfo.grade} • {classInfo.subject} • {currentLesson.topic}
          </div>
        </div>

        <div className="flex items-center gap-3" style={{ flexWrap: "wrap" }}>
          <span className="pill">
            <Clock size={13} /> {mins}:{secs}
          </span>
          <span className="pill">
            <Users size={13} />
            {classroomSession.studentsPresent}/{classroomSession.studentsTotal}
          </span>
          <span className={`pill ${classroomSession.isOnline ? "active" : ""}`}>
            {classroomSession.isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            {classroomSession.isOnline ? "Connected" : "Offline"}
          </span>
        </div>
      </div>

      <div className="app-content" style={{ flex: 1 }}>
        {/* ---------- MAIN 3-COLUMN AREA ---------- */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "1fr 1.4fr 1fr",
            alignItems: "start",
            marginBottom: "var(--space-6)",
          }}
        >
          {/* LEFT — TEACHER */}
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
              Teacher
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: "var(--space-2)",
                lineHeight: 1.5,
              }}
            >
              {teacherSpeech.hindi}
            </div>
            <div className="text-muted" style={{ fontSize: 11.5, marginBottom: "var(--space-4)" }}>
              Hindi • Teacher speech
            </div>

            <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-3)" }}>
              <span
                className="status-dot"
                style={{ background: isListening ? "var(--accent)" : "var(--border)" }}
              />
              <span className="text-secondary" style={{ fontSize: 12 }}>
                {isListening ? "Teacher speech detected" : "Awaiting input"}
              </span>
            </div>

            <div className="label-uppercase" style={{ marginBottom: 6, fontSize: 10.5 }}>
              AI Understanding
            </div>
            <div className="pipeline">
              {pipelineStages.map((stage, i) => (
                <div
                  key={stage}
                  className={`pipeline-step ${
                    i < pipelineIndex ? "done" : i === pipelineIndex ? "active" : ""
                  }`}
                >
                  {i <= pipelineIndex && <CheckCircle2 size={12} />}
                  {stage}
                </div>
              ))}
            </div>
          </div>

          {/* CENTER — CLASSROOM DISPLAY */}
          <div className="card card-elevated" style={{ textAlign: "center" }}>
            <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
              Classroom Display
            </div>

            <div className="heading-md" style={{ fontSize: 18, marginBottom: 4 }}>
              {classroomDisplay.activityTitle}
            </div>
            <div className="text-muted" style={{ fontSize: 11.5 }}>
              Question {questionRound}
            </div>

            <div className="classroom-object-row">
              {Array.from({ length: classroomDisplay.objectCount }).map((_, i) => (
                <div key={i} className="classroom-object">🍎</div>
              ))}
            </div>

            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
              {classroomDisplay.olChiki}
            </div>
            <div className="text-secondary" style={{ fontSize: 13, marginBottom: "var(--space-5)" }}>
              {classroomDisplay.englishGloss}
            </div>

            <button
              className={`play-button ${isPlaying ? "playing" : ""}`}
              onClick={handlePlaySantali}
            >
              <Volume2 size={16} />
              {isPlaying ? "PLAYING SANTALI AUDIO…" : "PLAY SANTALI AUDIO"}
            </button>

            <div
              className="flex items-center justify-between text-muted"
              style={{ fontSize: 11, marginTop: "var(--space-3)" }}
            >
              <span>Santali Audio Ready</span>
              <span className="flex items-center gap-2">
                <span className="status-dot active" /> Speaker connected
              </span>
            </div>
          </div>

          {/* RIGHT — STUDENT RESPONSE */}
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
              Student Response
            </div>

            <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-3)" }}>
              <span className="status-dot active" />
              <span className="text-secondary" style={{ fontSize: 12 }}>
                Santali speech detected
              </span>
            </div>

            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              {studentResponse.olChiki}
            </div>
            <div className="text-secondary" style={{ fontSize: 13, marginBottom: "var(--space-4)" }}>
              Hindi meaning: <strong style={{ color: "var(--text)" }}>{studentResponse.hindiMeaning}</strong>
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>
              Confidence
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)", marginBottom: "var(--space-3)" }}>
              {studentResponse.confidence}%
            </div>

            {answerState === "correct" ? (
              <div className="flex items-center gap-2" style={{ color: "var(--success)", fontSize: 12.5, fontWeight: 600 }}>
                <CheckCircle2 size={15} /> Answer understood
              </div>
            ) : (
              <div className="text-muted" style={{ fontSize: 12 }}>
                Awaiting teacher confirmation
              </div>
            )}
          </div>
        </div>

        {/* ---------- INTERACTION FLOW ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Interaction Flow
        </div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="flow-bar">
            {flowStages.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                <div
                  className={`flow-node ${
                    i < flowStage ? "done" : i === flowStage ? "active" : ""
                  }`}
                >
                  {stage}
                </div>
                {i < flowStages.length - 1 && <ArrowRight size={14} className="flow-arrow" />}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- AI LEARNING ASSIST ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          AI Learning Assist
        </div>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "1.4fr 1fr", marginBottom: "var(--space-6)" }}
        >
          <div className="card">
            {answerState === "correct" ? (
              <>
                <div className="flex items-center gap-2" style={{ color: "var(--success)", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                  <CheckCircle2 size={16} /> Correct answer
                </div>
                <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-4)" }}>
                  Student understood the concept.
                </div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                  Awaiting response check
                </div>
                <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-4)" }}>
                  Mark the student's response once confirmed.
                </div>
              </>
            )}
            <button className="btn btn-primary btn-sm" onClick={handleContinueLesson}>
              Continue
            </button>
          </div>

          <div className="card" style={{ opacity: 0.8 }}>
            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 8 }}>
              If Incorrect
            </div>
            <div className="flex items-center gap-2 text-secondary" style={{ fontSize: 12, marginBottom: 6 }}>
              Simplify explanation <ArrowDown size={12} /> Show visual <ArrowDown size={12} /> Retry
            </div>
          </div>
        </div>

        {/* ---------- CONFIDENCE SHIELD ---------- */}
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 12 }}>
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} color="var(--accent)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>AI Confidence Shield</div>
                <div className="text-muted" style={{ fontSize: 11.5 }}>
                  Translation: {studentResponse.confidence}% confidence • Verified classroom phrase
                </div>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setReviewOpen(true)}>
              Review Translation
            </button>
          </div>
        </div>
      </div>

      {/* ---------- BOTTOM CONTROL BAR ---------- */}
      <div className="control-bar">
        <button className={`control-btn ${isListening ? "on" : ""}`} onClick={handleSpeak}>
          <Mic size={14} /> Speak
        </button>
        <button className={`control-btn ${isPlaying ? "on" : ""}`} onClick={handlePlaySantali}>
          <Volume2 size={14} /> Play Santali
        </button>
        <button className="control-btn" onClick={handleRepeat}>
          <RotateCcw size={14} /> Repeat
        </button>
        <button className="control-btn" onClick={handleMarkUnderstood}>
          <CheckCircle2 size={14} /> Mark Understood
        </button>
        <button className="control-btn" onClick={() => onNavigate && onNavigate("dashboard")}>
          <Settings size={14} /> Classroom
        </button>

        <div style={{ marginLeft: "auto" }}>
          <button className="btn btn-primary" onClick={handleContinueLesson}>
            Continue Lesson <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ---------- REVIEW TRANSLATION MODAL ---------- */}
      {reviewOpen && (
        <div className="modal-overlay" onClick={() => setReviewOpen(false)}>
          <div
            className="card modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
              <div className="heading-md">Review Translation</div>
              <X size={16} style={{ cursor: "pointer" }} onClick={() => setReviewOpen(false)} />
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>Hindi (Teacher)</div>
            <div style={{ fontSize: 13.5, marginBottom: "var(--space-4)" }}>{teacherSpeech.hindi}</div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>Santali (Ol Chiki)</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: "var(--space-4)" }}>
              {classroomDisplay.olChiki}
            </div>

            <div className="text-muted" style={{ fontSize: 11.5, marginBottom: "var(--space-5)" }}>
              AI confidence: {studentResponse.confidence}% — this is a demo phrase and has not been
              verified against a live linguistic database.
            </div>

            <div className="flex gap-3">
              <button className="btn btn-primary btn-sm" onClick={() => setReviewOpen(false)}>
                Approve
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setReviewOpen(false)}>
                Edit Translation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}