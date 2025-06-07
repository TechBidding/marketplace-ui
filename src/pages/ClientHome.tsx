import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiOutlinePlus,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineTrendingUp,
  HiOutlineEye,
  HiOutlineChat,
  HiOutlineSparkles
} from "react-icons/hi";
import { projectHttp } from "@/utility/api";

export const ClientHome = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const userDetails = useSelector((state: any) => state.auth.userDetails);
  const isDark = theme === "dark";
  const [isLoading, setIsLoading] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [recentProjects, setRecentProjects] = useState([]);

  const bgPage = isDark ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 via-white to-gray-100";
  const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
  const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
  const textClr = isDark ? "text-gray-100" : "text-gray-900";
  const subtleText = isDark ? "text-gray-400" : "text-gray-600";


  useEffect(() => {
    const fetchRecentProjects = async () => {
      setIsLoading(true);
      setIsProjectsLoading(true);
      try {
        const response = await projectHttp.get('/project/dashboard');
        const data = response.data.data;
        console.log(data);
        setRecentProjects(data);
      } catch (error) {
        console.error('Error fetching recent projects:', error);
      } finally {
        setIsProjectsLoading(false);
        setIsLoading(false);
      }
    };
    fetchRecentProjects();
  }, []);

  // Mock data - replace with actual API calls
  const stats = {
    activeProjects: 12,
    completedProjects: 48,
    totalSpent: 125000,
    avgProjectValue: 5200
  };

  // const recentProjects = [
  //   {
  //     id: 1,
  //     title: "E-commerce Platform Development",
  //     status: "in-progress",
  //     budget: 8000,
  //     developer: "John Smith",
  //     progress: 75,
  //     dueDate: "2024-04-15"
  //   },
  //   {
  //     id: 2,
  //     title: "Mobile App UI/UX Design",
  //     status: "review",
  //     budget: 3500,
  //     developer: "Sarah Johnson",
  //     progress: 90,
  //     dueDate: "2024-03-28"
  //   },
  //   {
  //     id: 3,
  //     title: "Website Redesign",
  //     status: "completed",
  //     budget: 4200,
  //     developer: "Mike Chen",
  //     progress: 100,
  //     dueDate: "2024-03-20"
  //   }
  // ];

  const quickActions = [
    {
      title: "Post New Project",
      description: "Create a new project and find the perfect developer",
      icon: <HiOutlinePlus className="w-6 h-6" />,
      action: () => navigate("/projects/create"),
      color: "from-indigo-600 to-purple-600"
    },
    {
      title: "Browse Talent",
      description: "Explore our network of skilled developers",
      icon: <HiOutlineUsers className="w-6 h-6" />,
      action: () => navigate("/browse"),
      color: "from-emerald-600 to-teal-600"
    },
    {
      title: "View Projects",
      description: "Track your project performance and manage ongoing work",
      icon: <HiOutlineChartBar className="w-6 h-6" />,
      action: () => navigate("/projects"),
      color: "from-orange-600 to-red-600"
    }
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

  const ProjectCard = ({ project }: { project: any }) => (
    <div className={`${bgCard} rounded-2xl p-6 border ${borderClr} hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${textClr} mb-2`}>{project.title}</h3>
          {project.status !== 'open' ?
            (<p className={`text-sm ${subtleText} mb-3`}>Developer: {project.developerInfo?.name}</p>)
            :
            (<p className={`text-sm ${subtleText} mb-3`}>No developer assigned</p>)
          }

        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'completed'
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          : project.status === 'review'
            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
          {project.status.replace('-', ' ')}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm ${subtleText}`}>Progress</span>
          <span className={`text-sm font-medium ${textClr}`}>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className={`${subtleText}`}>Budget: { project.pricing.currency} {project.pricing.amount.toLocaleString()}</span>
          <span className={`${subtleText}`}>Due: {new Date(project.deadline).toLocaleDateString()}</span>
        </div>
        <button
          onClick={() => navigate(`/projects/${project._id}`)}
          className="px-3 py-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg text-sm font-medium transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${bgPage} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Hero Section */}
        <div className={`${bgCard} rounded-3xl border ${borderClr} shadow-xl overflow-hidden mb-8`}>
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <HiOutlineSparkles className="h-8 w-8 text-white/80" />
                    <span className="text-white/80 font-medium">Client Dashboard</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    Welcome back, {userDetails?.name || 'Client'}!
                  </h1>
                  <p className="text-white/90 text-lg max-w-2xl">
                    Manage your projects, track progress, and connect with talented developers to bring your ideas to life.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/projects/create")}
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <HiOutlinePlus className="h-6 w-6" />
                  Start New Project
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
            icon={<HiOutlineBriefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            title="Active Projects"
            value={stats.activeProjects}
            color="blue"
          />
          <StatCard
            icon={<HiOutlineCheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
            title="Completed"
            value={stats.completedProjects}
            color="emerald"
          />
          <StatCard
            icon={<HiOutlineTrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
            title="Total Invested"
            value={`$${stats.totalSpent.toLocaleString()}`}
            color="purple"
          />
          <StatCard
            icon={<HiOutlineChartBar className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
            title="Avg Project Value"
            value={`$${stats.avgProjectValue.toLocaleString()}`}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className={`text-xl font-bold ${textClr} mb-6`}>Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`w-full p-6 rounded-2xl border ${borderClr} ${bgCard} hover:shadow-lg transition-all duration-300 text-left group`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${textClr} mb-1`}>{action.title}</h3>
                      <p className={`text-sm ${subtleText}`}>{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${textClr}`}>Recent Projects</h2>
              <button
                onClick={() => navigate("/projects")}
                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <HiOutlineEye className="w-4 h-4" />
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
              {recentProjects.length === 0 && (
                <div className={`${bgCard} rounded-2xl border ${borderClr} p-12 text-center`}>
                  <HiOutlineBriefcase className={`w-16 h-16 ${subtleText} mx-auto mb-4`} />
                  <h3 className={`text-lg font-semibold ${textClr} mb-2`}>No projects yet</h3>
                  <p className={`${subtleText} mb-6`}>Start your first project to see it here</p>
                  <button
                    onClick={() => navigate("/projects/create")}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create Your First Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
