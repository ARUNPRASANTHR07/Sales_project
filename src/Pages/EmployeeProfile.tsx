import { useState } from "react";
import {
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaTools,
  FaUsers,
} from "react-icons/fa";
import { IconType } from "react-icons";


/* ---------------- TYPES ---------------- */
type TabKey =
  | "basic"
  | "academic"
  | "work"
  | "skills"
  | "family";

type Tab = {
  key: TabKey;
  label: string;
  icon: IconType;
};

/* ---------------- TAB CONFIG ---------------- */
const tabs: Tab[] = [
  { key: "basic", label: "Basic Info", icon: FaUser },
  { key: "academic", label: "Academic Info", icon: FaGraduationCap },
  { key: "work", label: "Work Experience", icon: FaBriefcase },
  { key: "skills", label: "Skills", icon: FaTools },
  { key: "family", label: "Family Info", icon: FaUsers },
];

/* ================= MAIN COMPONENT ================= */
export default function EmployeeProfile() {
  const [activeTab, setActiveTab] = useState<TabKey>("basic");

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ---------- TAB HEADER ---------- */}
      <div className="flex justify-between border-b mb-6">
        {tabs.map(({ key, label, icon:Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-col items-center px-4 py-3 text-sm font-medium transition-all
              ${
                activeTab === key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
          >
           
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>

      {/* ---------- TAB CONTENT ---------- */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === "basic" && <BasicInfo />}
        {activeTab === "academic" && <AcademicInfo />}
        {activeTab === "work" && <WorkExperience />}
        {activeTab === "skills" && <Skills />}
        {activeTab === "family" && <FamilyInfo />}
      </div>
    </div>
  );
}

/* ================= TAB CONTENT ================= */

function BasicInfo() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Employee ID:</strong> EMP001</p>
        <p><strong>Email:</strong> john.doe@example.com</p>
        <p><strong>Phone:</strong> +1 234 567 890</p>
      </div>
    </section>
  );
}

function AcademicInfo() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>B.Tech – Computer Science</li>
        <li>M.Tech – Software Engineering</li>
      </ul>
    </section>
  );
}

function WorkExperience() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
      <div className="space-y-4 text-gray-700">
        <div>
          <p className="font-medium">Senior Developer</p>
          <p className="text-sm text-gray-500">ABC Corp (2021 – Present)</p>
        </div>
        <div>
          <p className="font-medium">Software Engineer</p>
          <p className="text-sm text-gray-500">XYZ Ltd (2018 – 2021)</p>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {["React", "TypeScript", "Tailwind CSS", "Node.js"].map(skill => (
          <span
            key={skill}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

function FamilyInfo() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Family Information</h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>Father:</strong> Robert Doe</p>
        <p><strong>Mother:</strong> Jane Doe</p>
        <p><strong>Marital Status:</strong> Single</p>
      </div>
    </section>
  );
}
