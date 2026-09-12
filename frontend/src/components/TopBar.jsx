import { classInfo } from "../data/demoData";

export default function TopBar({ greeting }) {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "var(--space-4) var(--space-6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--bg)",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
    >
      <div>
        <h1 className="heading-lg">{greeting}</h1>
        <div className="text-secondary" style={{ fontSize: 13, marginTop: 2 }}>
          {classInfo.grade} • {classInfo.subject}
        </div>
      </div>
    </header>
  );
}