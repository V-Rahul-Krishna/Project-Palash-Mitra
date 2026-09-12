import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Clock,
  Languages,
  ShieldAlert,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import {
  lessonOverview,
  lessonFilterOptions,
  lessonLibrary,
} from "../data/demoData";

const STATUS_CLASS = {
  Ready: "ready",
  Draft: "draft",
  "Needs Review": "needs-review",
};

const DEFAULT_FILTERS = {
  grade: "All Grades",
  subject: "All Subjects",
  status: "All",
  language: "All Languages",
};

export default function Lessons({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [openLesson, setOpenLesson] = useState(null);

  const filteredLessons = useMemo(() => {
    const q = search.trim().toLowerCase();

    return lessonLibrary.filter((lesson) => {
      const matchesSearch =
        !q ||
        lesson.title.toLowerCase().includes(q) ||
        lesson.subject.toLowerCase().includes(q) ||
        lesson.topic.toLowerCase().includes(q) ||
        lesson.outcome.toLowerCase().includes(q);

      const matchesGrade = filters.grade === "All Grades" || lesson.grade === filters.grade;
      const matchesSubject = filters.subject === "All Subjects" || lesson.subject === filters.subject;
      const matchesStatus = filters.status === "All" || lesson.status === filters.status;
      const matchesLanguage =
        filters.language === "All Languages" || lesson.classroomLanguage === filters.language;

      return matchesSearch && matchesGrade && matchesSubject && matchesStatus && matchesLanguage;
    });
  }, [search, filters]);

  const clearFilters = () => {
    setSearch("");
    setFilters(DEFAULT_FILTERS);
  };

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

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
          <h1 className="heading-lg" style={{ fontSize: 22, marginBottom: 4 }}>Lessons</h1>
          <div className="text-secondary" style={{ fontSize: 13 }}>
            Build, review and reuse classroom lessons.
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate && onNavigate("lesson-builder")}>
          <Plus size={14} /> Create Lesson
        </button>
      </div>

      <div className="app-content">
        {/* ---------- OVERVIEW ---------- */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginBottom: "var(--space-6)" }}
        >
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Total Lessons</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{lessonOverview.total}</div>
          </div>
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Ready to Teach</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--success)" }}>{lessonOverview.readyToTeach}</div>
          </div>
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Needs Review</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--warning)" }}>{lessonOverview.needsReview}</div>
          </div>
          <div className="card">
            <div className="label-uppercase" style={{ marginBottom: 6 }}>Drafts</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-secondary)" }}>{lessonOverview.drafts}</div>
          </div>
        </div>
        <div className="text-muted" style={{ fontSize: 11, marginTop: -12, marginBottom: "var(--space-6)" }}>
          Demo values for prototype purposes.
        </div>

        {/* ---------- SEARCH + FILTERS ---------- */}
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="lesson-search-bar" style={{ marginBottom: "var(--space-4)" }}>
            <Search size={15} color="var(--text-muted)" />
            <input
              placeholder="Search lessons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
          >
            <select
              className="filter-select"
              value={filters.grade}
              onChange={(e) => updateFilter("grade", e.target.value)}
            >
              {lessonFilterOptions.grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filters.subject}
              onChange={(e) => updateFilter("subject", e.target.value)}
            >
              {lessonFilterOptions.subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              {lessonFilterOptions.statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filters.language}
              onChange={(e) => updateFilter("language", e.target.value)}
            >
              {lessonFilterOptions.languages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ---------- LESSON GRID / EMPTY STATE ---------- */}
        {filteredLessons.length === 0 ? (
          <div className="card empty-state">
            <BookOpen size={28} color="var(--text-muted)" style={{ marginBottom: "var(--space-3)" }} />
            <div className="heading-md" style={{ marginBottom: 6 }}>No lessons found</div>
            <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: "var(--space-4)" }}>
              Try a different search or clear the filters.
            </div>
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="lesson-grid">
            {filteredLessons.map((lesson) => (
              <div key={lesson.id} className="card lesson-library-card">
                <div className="flex items-center justify-between" style={{ marginBottom: 8, gap: 8 }}>
                  <div className="heading-md" style={{ fontSize: 15 }}>{lesson.title}</div>
                  <span className={`status-badge ${STATUS_CLASS[lesson.status]}`}>
                    {lesson.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-secondary" style={{ fontSize: 12, marginBottom: 4 }}>
                  {lesson.grade} • {lesson.subject} • {lesson.topic}
                </div>
                <div className="text-muted" style={{ fontSize: 11.5, marginBottom: 10 }}>
                  {lesson.outcome}
                </div>

                <div className="lesson-meta-row">
                  <span className="tag"><Clock size={11} style={{ marginRight: 4 }} />{lesson.duration}</span>
                  <span className="tag"><Languages size={11} style={{ marginRight: 4 }} />{lesson.classroomLanguage}</span>
                </div>

                <div
                  className="flex items-center gap-2"
                  style={{
                    fontSize: 11.5,
                    color: lesson.languageStatus === "Pending verification" ? "var(--warning)" : "var(--text-muted)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  {lesson.languageStatus === "Pending verification" && <ShieldAlert size={12} />}
                  {lesson.languageStatus}
                </div>

                <div className="text-muted" style={{ fontSize: 11, marginBottom: "var(--space-4)" }}>
                  Updated {lesson.updated}
                </div>

                <div className="flex gap-3" style={{ marginTop: "auto" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setOpenLesson(lesson)}>
                    Open
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onNavigate && onNavigate("lesson-builder")}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- LESSON DETAILS MODAL ---------- */}
      {openLesson && (
        <div className="modal-overlay" onClick={() => setOpenLesson(null)}>
          <div className="card modal-panel" style={{ width: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
              <div className="heading-md">{openLesson.title}</div>
              <X size={16} style={{ cursor: "pointer" }} onClick={() => setOpenLesson(null)} />
            </div>

            <div className="flex gap-2" style={{ flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
              <span className="tag">{openLesson.grade}</span>
              <span className="tag">{openLesson.subject}</span>
              <span className="tag">{openLesson.topic}</span>
              <span className={`status-badge ${STATUS_CLASS[openLesson.status]}`}>
                {openLesson.status.toUpperCase()}
              </span>
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>Learning Outcome</div>
            <div style={{ fontSize: 13, marginBottom: "var(--space-4)" }}>{openLesson.outcome}</div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 6 }}>Lesson Structure</div>
            <div className="flex gap-2" style={{ flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
              <span className="tag">Explanation</span>
              <span className="tag">Activity</span>
              <span className="tag">Questions</span>
              <span className="tag">Assessment</span>
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>Language Status</div>
            <div
              className="flex items-center gap-2"
              style={{
                fontSize: 13,
                color: openLesson.languageStatus === "Pending verification" ? "var(--warning)" : "var(--text-secondary)",
                marginBottom: "var(--space-4)",
              }}
            >
              {openLesson.languageStatus === "Pending verification" && <ShieldAlert size={13} />}
              {openLesson.languageStatus}
            </div>

            <div className="label-uppercase" style={{ fontSize: 10.5, marginBottom: 4 }}>Teaching → Classroom Language</div>
            <div className="text-secondary" style={{ fontSize: 13, marginBottom: "var(--space-5)" }}>
              {openLesson.teachingLanguage} → {openLesson.classroomLanguage}
            </div>

            <div className="flex gap-3">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { setOpenLesson(null); onNavigate && onNavigate("lesson-builder"); }}
              >
                <Sparkles size={13} /> Open in Lesson Builder
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setOpenLesson(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}