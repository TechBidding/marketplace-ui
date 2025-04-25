import React from "react";
import { useTheme } from "../theme-provider";
import { HiOutlineCalendar } from "react-icons/hi";

export interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  deadline: string; // ISO date string
  status: "In Progress" | "Completed" | "Draft";
  onClick?: () => void;
}

const DUMMY_PROJECT = {
  title: "Build a Mobile App",
  status: "In Progress",
  description:
    "Design an iOS and Android fintech application with a focus on user-friendly design and performance. Design an iOS and Android fintech application with a focus on user-friendly design and performance.",
  requirements: ["Experience in React Native or Flutter", "UI/UX design skills"],
  skills: ["React Native", "Flutter", "UI/UX Design"],
  budget: "$10,000",
  deadline: "2024-05-01",
  serviceType: ["Mobile App Development", "UI/UX Design"],
  milestones: [
    { id: 1, title: "Milestone 1", done: true },
    { id: 2, title: "Milestone 2", done: true },
    { id: 3, title: "Milestone 3", done: false },
    { id: 4, title: "Milestone 4", done: false },
  ],
  developer: {
    name: "Jacob Jones",
    role: "Senior Developer",
    rate: "$80.00/hr",
  },
  bids: [
    { id: 1, title: "Bid 1", description: "Bid 1 description", amount: "$1000", status: "Accepted", createdAt: "2024-01-01", developerId: 1 },
    { id: 2, title: "Bid 2", description: "Bid 2 description", amount: "$2000", status: "Pending", createdAt: "2024-01-01", developerId: 2 },
    { id: 3, title: "Bid 3", description: "Bid 3 description", amount: "$3000", status: "Pending", createdAt: "2024-01-01", developerId: 3 },
    { id: 4, title: "Bid 4", description: "Bid 4 description", amount: "$4000", status: "Rejected", createdAt: "2024-01-01", developerId: 4 },
  ],
};

const statusColors = {
  light: {
    "In Progress": "bg-orange-100 text-orange-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Draft: "bg-gray-200 text-gray-600",
  },
  dark: {
    "In Progress": "bg-orange-800/40 text-orange-200",
    Completed: "bg-emerald-800/40 text-emerald-200",
    Draft: "bg-neutral-700 text-neutral-300",
  },
} as const;

export const ProjectCard = () => {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const badgeCls = statusColors[dark ? "dark" : "light"][DUMMY_PROJECT.status as keyof typeof statusColors[keyof typeof statusColors]];
  const border = dark ? "border-neutral-700" : "border-gray-200";
  const bg = dark ? "bg-neutral-900 hover:bg-neutral-750" : "bg-white hover:bg-gray-50";
  const textMain = dark ? "text-gray-200" : "text-gray-900";
  const textSub = dark ? "text-gray-400" : "text-gray-600";

  return (
    <button
      // onClick={onClick}
      className={`flex w-full flex-col items-start gap-3 rounded-xl border ${border} ${bg} p-6 text-left transition`}
    >
      <div className="flex items-start justify-between w-full gap-4">
        <div>
          <h3 className={`text-lg font-semibold ${textMain}`}>{DUMMY_PROJECT.title}</h3>
          <p className={`text-xs uppercase tracking-wide ${textSub}`}>{DUMMY_PROJECT.serviceType[0]} {DUMMY_PROJECT.serviceType.length > 1 ? `+ ${DUMMY_PROJECT.serviceType.length - 1}` : ""}</p>
        </div>
        <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${badgeCls}`}>{DUMMY_PROJECT.status}</span>
      </div>

      <p className={`line-clamp-2 text-sm ${textSub}`}>{DUMMY_PROJECT.description}</p>
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-wrap gap-2 mt-2">
          {DUMMY_PROJECT.skills.map((skill) => (
            <SkillBadge key={skill} skill={skill} />
          ))}
        </div>
        
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-indigo-500">
          <HiOutlineCalendar className="h-4 w-4" />
          {new Date(DUMMY_PROJECT.deadline).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div>
            <p>{DUMMY_PROJECT.budget}</p>
        </div>
      </div>

    </button>
  );
};




interface SkillBadgeProps {
  skill: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-blue-500 text-white text-xs font-medium px-2 py-1 mr-2">
      {skill}
    </span>
  );
};

export default SkillBadge;
