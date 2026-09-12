export default function StatCard({ label, value, suffix = "%", tone = "default" }) {
  const toneColor =
    tone === "success"
      ? "var(--success)"
      : tone === "warning"
      ? "var(--warning)"
      : "var(--text)";

  return (
    <div className="card">
      <div className="label-uppercase">{label}</div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginTop: "var(--space-2)",
          color: toneColor,
        }}
      >
        {value}
        <span style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 500 }}>
          {suffix}
        </span>
      </div>
    </div>
  );
}