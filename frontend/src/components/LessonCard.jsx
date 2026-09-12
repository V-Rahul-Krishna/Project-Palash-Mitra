import { Sparkles, MonitorPlay, Layers, FileText, ClipboardCheck, ArrowRight } from "lucide-react";

const ICONS = { Sparkles, MonitorPlay, Layers, FileText, ClipboardCheck };

export default function LessonCard({ title, description, icon, onClick }) {
  const Icon = ICONS[icon] || Sparkles;

  return (
    <div className="card card-hover" onClick={onClick} style={{ padding: "var(--space-4)" }}>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "var(--space-3)" }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "var(--radius-md)",
            background: "rgba(37, 99, 235, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={17} color="var(--primary-soft)" strokeWidth={2} />
        </div>
        <ArrowRight size={14} color="var(--text-muted)" />
      </div>
      <div className="heading-md">{title}</div>
      <div className="text-secondary" style={{ fontSize: 12.5, marginTop: 4 }}>
        {description}
      </div>
    </div>
  );
}