import { CheckCircle2, AlertTriangle, Info, Clock, Languages, Target } from "lucide-react";
import TopBar from "../components/TopBar";
import StatCard from "../components/StatCard";
import LessonCard from "../components/LessonCard";
import {
  currentLesson,
  classStats,
  recentActivity,
  teachingTools,
} from "../data/demoData";

const ACTIVITY_ICON = {
  success: <CheckCircle2 size={15} color="var(--success)" />,
  warning: <AlertTriangle size={15} color="var(--warning)" />,
  info: <Info size={15} color="var(--accent)" />,
};

export default function TeacherDashboard({ onNavigate }) {
  return (
    <div className="app-main">
      <TopBar greeting="Good morning, Teacher" />

      <div className="app-content">
        {/* Primary CTA */}
        <button
          className="btn btn-primary"
          style={{ marginBottom: "var(--space-6)" }}
          onClick={() => onNavigate("classroom")}
        >
          Start Classroom
        </button>

        {/* Today's lesson */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Today's Lesson
        </div>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="heading-md" style={{ fontSize: 19 }}>
                {currentLesson.topic}
              </div>
              <div className="text-secondary" style={{ fontSize: 13, marginTop: 6, maxWidth: 480 }}>
                {currentLesson.outcome}
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(34, 197, 94, 0.12)",
                color: "var(--success)",
                letterSpacing: "0.03em",
              }}
            >
              {currentLesson.status.toUpperCase()}
            </span>
          </div>

          <hr className="divider" style={{ margin: "var(--space-4) 0" }} />

          <div className="flex gap-5" style={{ flexWrap: "wrap" }}>
            <div className="flex items-center gap-2 text-secondary" style={{ fontSize: 12.5 }}>
              <Clock size={14} /> {currentLesson.duration}
            </div>
            <div className="flex items-center gap-2 text-secondary" style={{ fontSize: 12.5 }}>
              <Languages size={14} /> {currentLesson.language}
            </div>
            <div className="flex items-center gap-2 text-secondary" style={{ fontSize: 12.5 }}>
              <Target size={14} /> Numbers 1–10
            </div>
          </div>
        </div>

        {/* Teaching tools */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Teaching Tools
        </div>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            marginBottom: "var(--space-6)",
          }}
        >
          {teachingTools.map((tool) => (
            <LessonCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              onClick={() => onNavigate(tool.route)}
            />
          ))}
        </div>

        {/* Class progress */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Class Progress
        </div>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            marginBottom: "var(--space-6)",
          }}
        >
          <StatCard label="Students" value={classStats.students} suffix="" />
          <StatCard label="Lesson Completion" value={classStats.lessonCompletion} tone="success" />
          <StatCard label="Correct Responses" value={classStats.correctResponses} tone="success" />
          <StatCard label="Participation" value={classStats.participation} tone="warning" />
        </div>

        {/* Recent activity */}
        <div className="label-uppercase" style={{ marginBottom: "var(--space-3)" }}>
          Recent Activity
        </div>
        <div className="card">
          {recentActivity.map((item, i) => (
            <div key={item.id}>
              <div className="flex items-center gap-3" style={{ padding: "var(--space-2) 0" }}>
                {ACTIVITY_ICON[item.type]}
                <span style={{ fontSize: 13 }}>{item.text}</span>
              </div>
              {i < recentActivity.length - 1 && (
                <hr className="divider" style={{ margin: "var(--space-2) 0" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}