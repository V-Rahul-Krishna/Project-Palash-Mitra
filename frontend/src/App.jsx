import { useState } from "react";
import "./index.css";
import Sidebar from "./components/Sidebar";
import TeacherDashboard from "./pages/TeacherDashboard";
import LiveClassroom from "./pages/LiveClassroom";
import LessonBuilder from "./pages/LessonBuilder";
import Flashcards from "./pages/Flashcards";
import Worksheets from "./pages/Worksheets";
import Assessment from "./pages/Assessment";
import Lessons from "./pages/Lessons";
import Progress from "./pages/Progress";
export default function App() {
   
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {activePage === "dashboard" && (
        <TeacherDashboard onNavigate={setActivePage} />
      )}

      {/* Other pages (Lesson Builder, Live Classroom, Flashcards,
          Worksheets, Assessment, Progress) land here in the next increments. */}
{activePage === "classroom" && (
  <LiveClassroom onNavigate={setActivePage} />
)}
{activePage === "lesson-builder" && (
  <LessonBuilder onNavigate={setActivePage} />
)}
{activePage === "flashcards" && (
  <Flashcards onNavigate={setActivePage} />
)}
{activePage === "worksheets" && (
  <Worksheets onNavigate={setActivePage} />
)}

{activePage === "assessment" && (
  <Assessment onNavigate={setActivePage} />
)}

{activePage === "my-lessons" && (
  <Lessons onNavigate={setActivePage} />
)}

{activePage === "progress" && (
  <Progress onNavigate={setActivePage} />
)}

{activePage !== "dashboard" &&
  activePage !== "classroom" &&
  activePage !== "lesson-builder" &&
  activePage !== "flashcards" &&
  activePage !== "worksheets" &&
  activePage !== "assessment" &&
  activePage !== "my-lessons" &&
  activePage !== "progress" && (
    <div className="app-main">
      <div className="app-content">
        <div className="card" style={{ marginTop: "var(--space-6)" }}>
          <div className="label-uppercase" style={{ marginBottom: 8 }}>
            Coming Next
          </div>
          <div className="heading-md">
            "{activePage}" screen isn't built yet — say the word and we'll do it next.
          </div>
        </div>
      </div>
    </div>
  )}   </div>
  );
}