import React, { useState } from "react";
import { ProjectCard } from "@/components/project/ProjectCard";
import { useTheme } from "@/components/theme-provider";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineAdjustments
} from "react-icons/hi";

export const DevHome = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const userDetails = useSelector((state: any) => state.auth.userDetails);
  const isDark = theme === "dark";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const bgPage = isDark ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 via-white to-gray-100";
  const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
  const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
  const textClr = isDark ? "text-gray-100" : "text-gray-900";
  const subtleText = isDark ? "text-gray-400" : "text-gray-600";

  // Mock data - replace with actual API calls
  const stats = {
    activeBids: 8,
    wonProjects: 24,
    totalEarnings: 45000,
    avgRating: 4.8
  };

  const categories = [
    { value: "all", label: "All Projects" },
    { value: "web-development", label: "Web Development" },
    { value: "mobile-apps", label: "Mobile Apps" },
    { value: "ui-ux-design", label: "UI/UX Design" },
    { value: "backend", label: "Backend" },
    { value: "fullstack", label: "Full Stack" }
  ];

  const budgetRanges = [
    { value: "all", label: "Any Budget" },
    { value: "0-1000", label: "$0 - $1,000" },
    { value: "1000-5000", label: "$1,000 - $5,000" },
    { value: "5000-10000", label: "$5,000 - $10,000" },
    { value: "10000+", label: "$10,000+" }
  ];

  const sortOptions = [
    { value: "latest", label: "Latest Posted" },
    { value: "budget-high", label: "Highest Budget" },
    { value: "budget-low", label: "Lowest Budget" },
    { value: "deadline", label: "Closest Deadline" }
  ];

  const StatCard = ({ icon, title, value, subtitle, color }: any) => (
    <div className={`${bgCard} rounded-2xl p-6 border ${borderClr}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className={`text-2xl font-bold ${textClr}`}>{value}</p>
          <p className={`text-sm font-medium ${textClr}`}>{title}</p>
          {subtitle && <p className={`text-xs ${subtleText}`}>{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const FilterDropdown = ({ label, value, onChange, options }: any) => (
    <div>
      <label className={`text-sm font-medium ${textClr} block mb-2`}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${isDark
          ? 'bg-gray-800/50 border-gray-700 focus:border-indigo-500 text-gray-100'
          : 'bg-white border-gray-200 focus:border-indigo-500 text-gray-900'
          } focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className={`min-h-screen ${bgPage} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Hero Section */}
        <div className={`${bgCard} rounded-3xl border ${borderClr} shadow-xl overflow-hidden mb-8`}>
          <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 px-8 py-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <HiOutlineSparkles className="h-8 w-8 text-white/80" />
                    <span className="text-white/80 font-medium">Developer Dashboard</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    Find Your Next Project
                  </h1>
                  <p className="text-white/90 text-lg max-w-2xl">
                    Discover exciting opportunities, showcase your skills, and build your freelance career with clients who value quality work.
                  </p>
                  <div className="flex items-center gap-6 text-white/90 mt-6">
                    <div className="flex items-center gap-2">
                      <HiOutlineBriefcase className="h-5 w-5" />
                      <span className="font-semibold">150+ Active Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiOutlineTrendingUp className="h-5 w-5" />
                      <span>Growing Marketplace</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/services")}
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <HiOutlineEye className="h-6 w-6" />
                  Manage Services
                </button>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<HiOutlineClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            title="Active Bids"
            value={stats.activeBids}
            color="blue"
          />
          <StatCard
            icon={<HiOutlineCheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
            title="Won Projects"
            value={stats.wonProjects}
            color="emerald"
          />
          <StatCard
            icon={<HiOutlineCurrencyDollar className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
            title="Total Earnings"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            color="purple"
          />
          <StatCard
            icon={<HiOutlineTrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
            title="Average Rating"
            value={`${stats.avgRating}/5`}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${bgCard} rounded-2xl border ${borderClr} p-6 sticky top-6`}>
              <div className="flex items-center gap-3 mb-6">
                <HiOutlineAdjustments className={`w-5 h-5 ${textClr}`} />
                <h2 className={`text-lg font-bold ${textClr}`}>Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className={`text-sm font-medium ${textClr} block mb-2`}>Search Projects</label>
                  <div className="relative">
                    <HiOutlineSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${subtleText}`} />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 ${isDark
                        ? 'bg-gray-800/50 border-gray-700 focus:border-indigo-500 text-gray-100'
                        : 'bg-white border-gray-200 focus:border-indigo-500 text-gray-900'
                        } focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
                    />
                  </div>
                </div>

                <FilterDropdown
                  label="Category"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories}
                />

                <FilterDropdown
                  label="Budget Range"
                  value={selectedBudget}
                  onChange={setSelectedBudget}
                  options={budgetRanges}
                />

                <FilterDropdown
                  label="Sort By"
                  value={sortBy}
                  onChange={setSortBy}
                  options={sortOptions}
                />

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedBudget("all");
                    setSortBy("latest");
                  }}
                  className="w-full px-4 py-3 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${textClr}`}>Available Projects</h2>
              <div className="flex items-center gap-4">
                <span className={`text-sm ${subtleText}`}>12 projects found</span>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                  <HiOutlineFilter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Multiple ProjectCard instances */}
              {[1, 2, 3, 4, 5].map((index) => (
                <ProjectCard key={index} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Load More Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
