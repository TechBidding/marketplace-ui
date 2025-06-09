import React from "react";
import { useTheme } from "../theme-provider";
import {
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineEye,
  HiOutlineTrendingUp,
  HiOutlineChevronRight,
  HiOutlineBadgeCheck
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ClientInfo } from "../../utility/Schema/clientInfoSchema";

export interface ProjectCardProps {
  _id: string;
  title: string;
  description: string;
  pricing: {
    amount: number;
    currency: string;
  };
  serviceType: string[];
  requiredSkills: string[];
  requirements: string[];
  deadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalBids: number;
  clientInfo: ClientInfo;
}



const DUMMY_PROJECT = {
  title: "Build a Modern E-commerce Platform",
  status: "Open",
  description:
    "Looking for an experienced developer to build a comprehensive e-commerce platform with modern UI/UX, payment integration, inventory management, and admin dashboard. The project requires expertise in React, Node.js, and database design.",
  requirements: ["Experience in React and Node.js", "E-commerce development", "Payment gateway integration"],
  skills: ["React", "Node.js", "MongoDB", "Stripe API"],
  budget: "$12,500",
  timeframe: "3-4 months",
  deadline: "2024-05-15",
  serviceType: ["Web Development", "Full Stack"],
  location: "Remote",
  postedAt: "2024-03-10",
  bidsCount: 12,
  client: {
    name: "TechStart Inc.",
    rating: 4.9,
    projectsPosted: 15,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop"
  },
  urgency: "Medium",
  verified: true
};


const statusColors = {
  light: {
    "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
    "Completed": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Draft": "bg-gray-100 text-gray-600 border-gray-200",
    "Open": "bg-green-100 text-green-700 border-green-200",
  },
  dark: {
    "In Progress": "bg-blue-900/30 text-blue-400 border-blue-500/30",
    "Completed": "bg-emerald-900/30 text-emerald-400 border-emerald-500/30",
    "Draft": "bg-gray-800/50 text-gray-400 border-gray-600/30",
    "Open": "bg-green-900/30 text-green-400 border-green-500/30",
  },
} as const;

export const ProjectCard = ({ 
  _id,
  title,
  description,
  pricing,
  serviceType,
  requiredSkills,
  requirements,
  deadline,
  status,
  createdAt,
  updatedAt,
  totalBids,
  clientInfo
 }: ProjectCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();


  const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
  const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
  const textClr = isDark ? "text-gray-100" : "text-gray-900";
  const subtleText = isDark ? "text-gray-400" : "text-gray-600";
  const hoverBg = isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50/80";

  const statusStyle = statusColors[isDark ? "dark" : "light"][status as keyof typeof statusColors[keyof typeof statusColors]];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "text-red-600 dark:text-red-400";
      case "Medium": return "text-yellow-600 dark:text-yellow-400";
      case "Low": return "text-green-600 dark:text-green-400";
      default: return subtleText;
    }
  };

  const daysSincePosted = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 3600 * 24));

  const handleClick = () => {
    navigate(`/projects/${_id}`);
  }

  return (
    <div
      onClick={handleClick}
      className={`group ${bgCard} rounded-2xl border ${borderClr} p-6 transition-all duration-300 cursor-pointer ${hoverBg} hover:shadow-xl hover:-translate-y-1`}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>
              {status === "Open" && <span className="w-2 h-2 bg-current rounded-full mr-1.5 animate-pulse"></span>}
              {status}
            </span>
            {/* {project.verified && (
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <HiOutlineBadgeCheck className="w-4 h-4" />
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
            <span className={`text-xs ${getUrgencyColor(project.urgency)} font-medium`}>
              {project.urgency} Priority
            </span> */}
          </div>
          <h3 className={`text-xl font-bold ${textClr} mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors`}>
            {title}
          </h3>
        </div>
        <HiOutlineChevronRight className={`w-5 h-5 ${subtleText} group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0 ml-4`} />
      </div>

      {/* Description */}
      <p className={`${subtleText} text-sm leading-relaxed mb-4 line-clamp-3`}>
        {description}
      </p>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {requiredSkills?.slice(0, 4).map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-full"
          >
            {skill}
          </span>
        ))}
        {requiredSkills?.length > 4 && (
          <span className={`px-3 py-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} ${subtleText} text-xs rounded-full`}>
            +{requiredSkills.length - 4} more
          </span>
        )}
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <HiOutlineCurrencyDollar className={`w-4 h-4 ${subtleText}`} />
          <div>
            <p className={`text-sm font-semibold ${textClr}`}>{pricing?.amount} {pricing?.currency}</p>
            <p className={`text-xs ${subtleText}`}>Budget</p>
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <HiOutlineClock className={`w-4 h-4 ${subtleText}`} />
          <div>
            <p className={`text-sm font-semibold ${textClr}`}>{deadline ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}</p>
            <p className={`text-xs ${subtleText}`}>Duration</p>
          </div>
        </div> */}
        <div className="flex items-center gap-2">
          <HiOutlineCalendar className={`w-4 h-4 ${subtleText}`} />
          <div>
            <p className={`text-sm font-semibold ${textClr}`}>
              {new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p className={`text-xs ${subtleText}`}>Deadline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HiOutlineLocationMarker className={`w-4 h-4 ${subtleText}`} />
          <div>
            <p className={`text-sm font-semibold ${textClr}`}>Remote</p>
            <p className={`text-xs ${subtleText}`}>Location</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        {/* Client Info */}
        <div className="flex items-center gap-3">
          <img
            src={clientInfo?.profilePicture}
            alt={clientInfo?.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
          />
          <div>
            <p className={`text-sm font-semibold ${textClr}`}>{DUMMY_PROJECT.client.name}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className={`text-xs ${subtleText}`}>{DUMMY_PROJECT.client.rating}</span>
              </div>
              <span className={`text-xs ${subtleText}`}>•</span>
              <span className={`text-xs ${subtleText}`}>{DUMMY_PROJECT.client.projectsPosted} projects</span>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="flex items-center gap-4 text-right">
          <div className="flex items-center gap-1">
            <HiOutlineEye className={`w-4 h-4 ${subtleText}`} />
            <span className={`text-sm ${subtleText}`}>{totalBids} bids</span>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineTrendingUp className={`w-4 h-4 ${subtleText}`} />
            <span className={`text-sm ${subtleText}`}>{daysSincePosted}d ago</span>
          </div>
        </div>
      </div>

      {/* Hover Action Button */}
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
          View Project Details
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
