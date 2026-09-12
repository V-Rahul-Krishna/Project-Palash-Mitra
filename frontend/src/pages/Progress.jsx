import { useState, useEffect, useRef } from "react";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  ClipboardCheck,
  BookOpen,
  Info,
  Languages,
} from "lucide-react";
import {
  classInfo,
  currentLesson,
  assessmentSummary,
  masteryBreakdown,
  learningSignals,
  adaptiveRecommendation,
  learningGaps,
  topicSkillProgress,
  learningLoopStages,
} from "../data/demoData";

const GAP_STATUS_CLASS = {
  "Needs Reinforcement": "needs-reinforcement",
  Watch: "watch",
  Developing: "developing",
};

const SIGNAL_NOTE = {
  strong: "Counts objects accurately.",
  watch: "Needs slower visual counting.",
  reinforce: "Confuses quantity and numeral.",
};

export default function Progress({ onNavigate }) {
  const [toast, setToast] = useState(null);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const showToast = (message) => {
    setToast(message);
    const t = setTimeout(() => setToast(null), 2400);
    timers.current.push(t);
  };

  const developing = masteryBreakdown.find((m) => m.id === "developing");
  const needsSupport = masteryBreakdown.find((m) => m.id === "support");

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
          <h1 className="heading-lg" style={{ fontSize: 22, marginBottom: 4 }}>Progress</h1>
          <div className="text-secondary" style={{ fontSize: 13 }}>
            Track learning, identify gaps and decide what to reinforce next.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="flex gap-2" style={{ justifyContent: "flex-end", flexWrap: "wrap", marginBottom: 6 }}>
            <span className="tag">{classInfo.grade}</span>
            <span className="tag">{classInfo.subject}</span>
            <span className="tag">{currentLesson.topic}</span>
          </div>
          <span className="demo-indicator"><Info size={11} /> Demo classroom data</span>
        </div>
      </div>

      <div className="app-content">
        {/* ---------- SECTION 1: CLASS OVERVIEW ---------- */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", marginBottom: "var(--space-6)" }}
        >
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Students</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {assessmentSummary.studentsAssessed} / {assessmentSummary.studentsTotal}
            </div>
          </div>
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Mastery</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--success)" }}>{assessmentSummary.mastery}%</div>
          </div>
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Developing</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>{developing.students} students</div>
          </div>
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Needs Support</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--warning)" }}>{needsSupport.students} students</div>
          </div>
        </div>

        {/* ---------- SECTION 2: MASTERY OVERVIEW ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>Class Mastery</div>
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
          <div className="text-secondary" style={{ fontSize: 12.5, marginTop: "var(--space-3)" }}>
            Most learners can count objects accurately. A smaller group needs reinforcement connecting
            quantity with the written numeral.
          </div>
          <div className="text-muted" style={{ fontSize: 11, marginTop: 4 }}>
            Demo observation, not a real AI-generated conclusion.
          </div>
        </div>

        {/* ---------- SECTION 3: LEARNING GAPS ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>Learning Gaps</div>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "var(--space-6)" }}
        >
          {learningGaps.map((gap) => (
            <div key={gap.id} className="gap-card">
              <div className={`gap-status ${GAP_STATUS_CLASS[gap.status]}`}>
                {gap.status === "Needs Reinforcement" && <ShieldAlert size={11} />}
                {gap.status === "Watch" && <AlertTriangle size={11} />}
                {gap.status === "Developing" && <TrendingUp size={11} />}
                {gap.status.toUpperCase()}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 6 }}>{gap.title}</div>
              <div className="text-secondary" style={{ fontSize: 12 }}>{gap.description}</div>
            </div>
          ))}
        </div>

        {/* ---------- SECTION 4: RECOMMENDED NEXT STEP ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>Recommended Next Step</div>
        <div className="recommendation-card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="heading-md" style={{ fontSize: 16, marginBottom: 6 }}>
            {adaptiveRecommendation.title}
          </div>
          <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-4)" }}>
            {adaptiveRecommendation.reason}
          </div>
          <div className="flex gap-6" style={{ flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
            <div>
              <div className="label-uppercase" style={{ fontSize: 10, marginBottom: 3 }}>Suggested Activity</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
                {adaptiveRecommendation.recommendedActivity}
              </div>
            </div>
          </div>
          <div className="text-muted" style={{ fontSize: 11.5, marginBottom: "var(--space-4)" }}>
            {adaptiveRecommendation.sequence}
          </div>
          <button className="btn btn-primary" onClick={() => showToast("Reinforcement activity selected")}>
            Start Reinforcement
          </button>
        </div>

        {/* ---------- SECTION 5: STUDENT SUPPORT GROUPS ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>Student Support Groups</div>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginBottom: "var(--space-6)" }}
        >
          {learningSignals.map((s) => (
            <div key={s.id} className="signal-card">
              <div className={`signal-tag ${s.id === "strong" ? "strong" : s.id === "watch" ? "watch" : "reinforce"}`}>
                {s.id === "strong" && <CheckCircle2 size={12} />}
                {s.id === "watch" && <AlertTriangle size={12} />}
                {s.id === "reinforce" && <ShieldAlert size={12} />}
                {s.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.students} students</div>
              <div className="text-secondary" style={{ fontSize: 12 }}>{SIGNAL_NOTE[s.id]}</div>
            </div>
          ))}
        </div>
        <div className="text-muted" style={{ fontSize: 11, marginTop: -12, marginBottom: "var(--space-6)" }}>
          Groups are anonymous and based on demo response data — no individual student data is shown.
        </div>

        {/* ---------- SECTION 6: TOPIC PROGRESS ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Topic Progress — {currentLesson.topic}
        </div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          {topicSkillProgress.map((skill) => (
            <div key={skill.id} className="skill-row">
              <div className="skill-label">{skill.label}</div>
              <div className="skill-track">
                <div className="skill-fill" style={{ width: `${skill.percentage}%` }} />
              </div>
              <div className="skill-pct">{skill.percentage}%</div>
            </div>
          ))}
          <div className="text-muted" style={{ fontSize: 11, marginTop: 4 }}>
            Illustrative skill-level breakdown — not measured real-world results.
          </div>
        </div>

        {/* ---------- SECTION 7: TEACHER ACTIONS ---------- */}
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="flex gap-3" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => showToast("Reinforcement activity selected")}>
              <TrendingUp size={14} /> Start Reinforcement
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate && onNavigate("assessment")}>
              <ClipboardCheck size={14} /> Open Assessment
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate && onNavigate("lesson-builder")}>
              <BookOpen size={14} /> View Lesson
            </button>
          </div>
        </div>

        {/* ---------- SECTION 8: LANGUAGE CONTEXT ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>Language Context</div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-3)" }}>
            <Languages size={16} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>Language Context</span>
          </div>
          <div className="flex gap-6" style={{ flexWrap: "wrap", marginBottom: "var(--space-3)" }}>
            <div>
              <div className="label-uppercase" style={{ fontSize: 10, marginBottom: 3 }}>Teaching Language</div>
              <div style={{ fontSize: 13 }}>Hindi</div>
            </div>
            <div>
              <div className="label-uppercase" style={{ fontSize: 10, marginBottom: 3 }}>Classroom Language</div>
              <div style={{ fontSize: 13 }}>Santali • Ol Chiki</div>
            </div>
            <div>
              <div className="label-uppercase" style={{ fontSize: 10, marginBottom: 3 }}>Example Translation</div>
              <div style={{ fontSize: 13, color: "var(--warning)" }}>Translation pending verification</div>
            </div>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--warning)" }}>
            Language content status: Teacher verification required
          </div>
        </div>

        {/* ---------- SECTION 9: LEARNING LOOP ---------- */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>Learning Loop</div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="loop-strip">
            {learningLoopStages.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                <div className="loop-node">{stage.toUpperCase()}</div>
                {i < learningLoopStages.length - 1 && <ArrowRight size={13} className="text-muted" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- TOAST ---------- */}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={15} /> {toast}
        </div>
      )}
    </div>
  );
}