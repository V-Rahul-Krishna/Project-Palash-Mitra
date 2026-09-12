import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  MonitorPlay,
  Layers,
  FileText,
  ClipboardCheck,
  TrendingUp,
  Languages,
} from "lucide-react";
import { navItems, teacher } from "../data/demoData";

const ICONS = {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  MonitorPlay,
  Layers,
  FileText,
  ClipboardCheck,
  TrendingUp,
};

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        flexShrink: 0,
        background: "var(--surface-deep)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "var(--space-5)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "var(--radius-sm)",
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            P
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: "0.02em" }}>
              PALASH MITRA
            </div>
            <div className="text-muted" style={{ fontSize: 10.5 }}>
              Mother Tongue • Better Learning
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "var(--space-4) var(--space-3)", overflowY: "auto" }}>
        {navItems.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "9px 12px",
                marginBottom: 2,
                borderRadius: "var(--radius-md)",
                border: "none",
                background: isActive ? "var(--surface-elevated)" : "transparent",
                borderLeft: isActive ? "2px solid var(--primary-soft)" : "2px solid transparent",
                color: isActive ? "var(--text)" : "var(--text-secondary)",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "var(--surface)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={16} strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom: language + profile */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "var(--space-4)" }}>
        <div
          className="flex items-center gap-2"
          style={{
            padding: "var(--space-3)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--space-3)",
          }}
        >
          <Languages size={15} color="var(--accent)" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Santali</div>
            <div className="text-muted" style={{ fontSize: 10.5 }}>Ol Chiki</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "var(--surface-elevated)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            T
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{teacher.name}</div>
            <div className="text-muted" style={{ fontSize: 10.5 }}>{teacher.medium}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}