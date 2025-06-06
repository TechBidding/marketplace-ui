import React, { useCallback, useEffect, useState } from "react";
import { HiOutlineDotsHorizontal, HiOutlineChatAlt2, HiOutlineCalendar, HiOutlineCurrencyDollar, HiOutlineUser, HiOutlineClipboardList } from "react-icons/hi";
import { MdEdit, MdPlaylistAddCheck, MdOutlinePlaylistAdd } from "react-icons/md";
import { FaCode, FaTools, FaProjectDiagram } from "react-icons/fa";
import { useTheme } from "../../components/theme-provider";
import { projectHttp } from "@/utility/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useSelector } from "react-redux";
import BidPopup from "./BidPopup";
import { BidCard } from "./BidCard";
import { CreateMilestone } from "@/components/CreateMilestone";
import { Milestones } from "../Milestone/Milestones";

type BidStatus = "pending" | "rejected" | "accepted";
export interface UserBidType {
  "projectId": string;
  "developerId": string;
  "proposedBudget": number;
  "timeline": string;
  "description": string;
  "status": BidStatus
  "createdAt": Date;
  "updatedAt": Date;
  "__v": number;
  "_id": number;
}
export interface MilestoneType {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date
  amount: {
    currency: string;
    value: number;
  };
  position: number
}

export interface BidType {
  _id: string;
  projectId: string;
  developerId: string;
  proposedBudget: number;
  timeline: Date | string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/25';
      case 'completed':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-yellow-500/25';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/25';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-500/25';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg ${getStatusColor(status)} backdrop-blur-sm`}>
      <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
      {status}
    </span>
  );
};

export default function ProjectDetails() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const bgPage = isDark ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 via-white to-gray-100";
  const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
  const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
  const ringClr = isDark ? "ring-gray-700/20" : "ring-gray-200/20";
  const textClr = isDark ? "text-gray-100" : "text-gray-900";
  const subtleText = isDark ? "text-gray-400" : "text-gray-600";
  const hoverClr = isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50/80";
  const cardBg = isDark ? "bg-gray-800/30" : "bg-white/60";

  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "bids">("overview");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const user_type = useSelector((state: any) => state.auth.userType);
  const userDetails = useSelector((state: any) => state.auth.userDetails);

  const [showBid, setShowBid] = useState<boolean>(false);
  const [showMilestones, setShowMilestones] = useState<boolean>(false);
  const [canAccessAllTabs, setCanAccessAllTabs] = useState<boolean>(false);

  const [userBid, setUserBid] = useState<UserBidType>();

  const [allBids, setAllBids] = useState<BidType[]>();
  const [allMilestones, setAllMilestones] = useState<MilestoneType[]>();
  const [isBidPopupOpen, setIsBidPopupOpen] = useState(false);
  const [openMilestoneMdoal, setOpenMilestoneMdoal] = useState(false);

  const openBidPopup = useCallback(() => {
    setIsBidPopupOpen(true);
  }, []);
  const closeBidPopup = useCallback(() => {
    setIsBidPopupOpen(false);
  }, []);

  const openCreateMilestoneModal = useCallback(() => {
    setOpenMilestoneMdoal(true)
  }, []);

  const closeCreateMilestoneModal = useCallback(() => {
    setOpenMilestoneMdoal(false)
  }, []);



  useEffect(() => {
    setLoading(true);
    projectHttp.get(`project/${id}`).then((res) => {
      console.log(res.data.data);
      setProject(res.data.data);
      toast.success("Project details fetched successfully");
    }).catch((err) => {
      console.log(err);
      toast.error("Error fetching project details", {
        description: err.response.data.message
      });
    }).finally(() => {
      setLoading(false);
    })
  }, [])

  useEffect(() => {
    // Check if user can access all tabs (only client and developer)
    const isClientOrDeveloper = user_type === 'client' || user_type === 'developer';
    setCanAccessAllTabs(isClientOrDeveloper);

    if (user_type === 'client' && userDetails._id === project?.clientId) {
      setShowBid(true);
    } else {
      setShowBid(false);
    }

    if ((userDetails?._id === project?.clientId || userDetails?._id === project?.acceptedBid?.developerId) && isClientOrDeveloper) {
      setShowMilestones(true);
    }
    else {
      setShowMilestones(false);
    }

    if (user_type === 'developer' && project) {
      let projectId = String(project?._id)
      projectHttp(`/project/${projectId}/bid/dev`)
        .then((res: any) => {
          setUserBid(res.data.data);
        })
    }

  }, [user_type, userDetails, project]);


  useEffect(() => {
    if (showBid && activeTab === 'bids') {
      projectHttp.get(`project/${project._id}/bid`)
        .then((res) => {
          setAllBids(res.data);
        })
        .catch((error) => {
          toast.error("Error fetching all bids", {
            description: error.response.data.message
          });
        })
    }
    if (showMilestones && activeTab === 'milestones') {
      projectHttp.get(`project/${project._id}/milestone`)
        .then((res) => {
          setAllMilestones(res.data.data);
        })
        .catch((error) => {
          toast.error("Error fetching project milestones", {
            description: error.response.data.message
          });
        })
    }
  }, [showBid, showMilestones, activeTab, project])

  const params = useParams()
  const handleBidAction = (bidId: string, action: 'accept' | 'reject') => {
    let url = `project/${params.id}/bid/${bidId}/${action}`

    projectHttp.put(url).then((res) => {
      toast.success(`Bid ${action}ed`);
      const updatedBid = res.data;
      if (action === 'accept') {
        let filteredBids = allBids?.filter((bid) => bid._id === bidId) ?? []
        let newAllBids = [...filteredBids, updatedBid];
        setAllBids(newAllBids)
      }
      else if (action === 'reject') {
        let filteredBids = allBids?.filter((bid) => bid._id === bidId) ?? [];
        setAllBids(filteredBids)
      }
    })
      .catch((err) => {
        toast.error(`Bid ${action} unsuccessfull`, {
          description: err.response.data.message
        })
      })
  }



  if (loading) {
    return (
      <div className={`min-h-screen ${bgPage} flex justify-center items-center`}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className={`text-lg ${subtleText}`}>Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgPage} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        <div className={`rounded-3xl ${bgCard} shadow-xl ring-1 ${ringClr} overflow-hidden`}>
          {/* Hero Header */}
          <div className={`relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-12`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <FaProjectDiagram className="h-8 w-8 text-white/80" />
                    <span className="text-white/80 font-medium">Project Details</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {project.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <HiOutlineCurrencyDollar className="h-5 w-5" />
                      <span className="font-semibold">{project.pricing.amount} {project.pricing.currency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiOutlineCalendar className="h-5 w-5" />
                      <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiOutlineUser className="h-5 w-5" />
                      <span>{project.serviceType.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={project.status} />
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </div>

          {/* Navigation Tabs */}
          <div className={`border-b ${borderClr} px-8`}>
            <nav className="flex gap-8 -mb-px">
              {[
                { id: "overview", label: "Overview", icon: <HiOutlineClipboardList className="h-4 w-4" /> },
                ...(canAccessAllTabs ? [
                  { id: "milestones", label: "Milestones", icon: <MdPlaylistAddCheck className="h-4 w-4" /> },
                  { id: "bids", label: "Bids", icon: <HiOutlineChatAlt2 className="h-4 w-4" /> }
                ] : [])
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : `border-transparent ${subtleText} hover:text-indigo-500 hover:border-indigo-300`
                    } ${(tab.id === 'bids' && !showBid) || (tab.id === 'milestones' && !showMilestones)
                      ? "hidden" : "flex"
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex flex-col xl:flex-row gap-8 p-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Overview Content */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Project Description */}
                  <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <HiOutlineClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h2 className={`text-xl font-bold ${textClr}`}>Project Description</h2>
                    </div>
                    <p className={`${textClr} leading-relaxed text-lg`}>
                      {project.description}
                    </p>
                  </div>

                  {/* Project Requirements */}
                  <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <FaTools className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h2 className={`text-xl font-bold ${textClr}`}>Project Requirements</h2>
                    </div>
                    <div className="grid gap-2">
                      {project.requirements.map((req: string, index: number) => (
                        <div key={index} className={`flex items-start gap-3 p-3 ${hoverClr} rounded-lg transition-colors`}>
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className={`${textClr}`}>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Budget & Timeline */}
                    <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <HiOutlineCurrencyDollar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className={`text-lg font-semibold ${textClr}`}>Budget & Timeline</h3>
                      </div>
                      <div className="space-y-3">
                        <div className={`flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg`}>
                          <span className={`font-medium ${subtleText}`}>Budget</span>
                          <span className={`font-bold text-lg ${textClr}`}>
                            {project.pricing.amount} {project.pricing.currency}
                          </span>
                        </div>
                        <div className={`flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg`}>
                          <span className={`font-medium ${subtleText}`}>Deadline</span>
                          <span className={`font-bold ${textClr}`}>
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skills & Services */}
                    <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <FaCode className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className={`text-lg font-semibold ${textClr}`}>Skills & Services</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className={`text-sm font-medium ${subtleText} mb-2 block`}>Required Skills</span>
                          <div className="flex flex-wrap gap-2">
                            {project.requiredSkills.map((skill: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className={`text-sm font-medium ${subtleText} mb-2 block`}>Service Type</span>
                          <div className="flex flex-wrap gap-2">
                            {project.serviceType.map((service: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-full">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Access Restriction Message for non-client/developer users */}
                  {!canAccessAllTabs && (
                    <div className={`${cardBg} rounded-2xl p-6 border ${borderClr} text-center`}>
                      <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg inline-block mb-4">
                        <HiOutlineUser className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto" />
                      </div>
                      <h3 className={`text-lg font-semibold ${textClr} mb-2`}>Limited Access</h3>
                      <p className={`${subtleText}`}>
                        Sign in as a client or developer to view milestones, bids, and additional project features.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Milestones Tab */}
              {activeTab === "milestones" && canAccessAllTabs && (
                <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                  <Milestones />
                </div>
              )}

              {/* Bids Tab */}
              {activeTab === "bids" && canAccessAllTabs && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-2xl font-bold ${textClr}`}>Project Bids</h2>
                    <span className={`px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium`}>
                      {allBids?.length || 0} bids received
                    </span>
                  </div>
                  <div className="space-y-4">
                    {allBids && allBids.map((bid: BidType, index: number) => {
                      return (
                        <div key={index} className={`${cardBg} rounded-xl border ${borderClr} overflow-hidden`}>
                          <BidCard
                            bid={bid}
                            hoverClr={hoverClr}
                            borderClr={borderClr}
                            expanded={expanded}
                            setExpanded={setExpanded}
                            handleBidAction={handleBidAction}
                          />
                        </div>
                      );
                    })}
                    {(!allBids || allBids.length === 0) && (
                      <div className={`${cardBg} rounded-xl p-8 border ${borderClr} text-center`}>
                        <HiOutlineChatAlt2 className={`h-12 w-12 ${subtleText} mx-auto mb-4`} />
                        <p className={`text-lg font-medium ${textClr} mb-2`}>No bids yet</p>
                        <p className={`${subtleText}`}>Developers can submit their proposals for this project.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Only show action buttons for client/developer */}
            {canAccessAllTabs && (
              <aside className="w-full xl:w-80 space-y-6">
                <div className={`${cardBg} rounded-2xl border ${borderClr} p-6`}>
                  <h3 className={`text-lg font-semibold ${textClr} mb-4`}>Actions</h3>
                  <div className="space-y-3">
                    {user_type === 'client' && (
                      <>
                        <SidebarAction
                          icon={<MdEdit className="h-4 w-4" />}
                          label="Edit Project"
                          hoverClr={hoverClr}
                          onClick={() => navigate(`/projects/${project._id}/edit`)}
                        />
                        <SidebarAction
                          icon={<MdOutlinePlaylistAdd className="h-4 w-4" />}
                          label="Create Milestone"
                          hoverClr={hoverClr}
                          onClick={openCreateMilestoneModal}
                        />
                        {openMilestoneMdoal && (
                          <CreateMilestone onClose={closeCreateMilestoneModal} />
                        )}
                        <SidebarAction
                          icon={<HiOutlineChatAlt2 className="h-4 w-4" />}
                          label="View Proposals"
                          hoverClr={hoverClr}
                        />
                      </>
                    )}
                    {user_type === 'developer' && (
                      <>
                        {!userBid && (
                          <>
                            <SidebarAction
                              icon={<HiOutlineChatAlt2 className="h-4 w-4" />}
                              label="Submit Bid"
                              hoverClr={hoverClr}
                              onClick={openBidPopup}
                            />
                            {isBidPopupOpen && <BidPopup close={closeBidPopup} userId={userDetails._id} projectId={project._id} type="create" />}
                          </>
                        )}
                        {userBid && userBid?.status === 'pending' && (
                          <>
                            <SidebarAction
                              icon={<MdEdit className="h-4 w-4" />}
                              label="Update Your Bid"
                              hoverClr={hoverClr}
                              onClick={openBidPopup}
                            />
                            {isBidPopupOpen && <BidPopup close={closeBidPopup} userId={userDetails._id} projectId={project._id} type="update" data={userBid} />}
                          </>
                        )}
                        {userBid && userBid?.status === 'accepted' && (
                          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-center">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                              <MdPlaylistAddCheck className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-emerald-700 dark:text-emerald-300 font-medium">Bid Accepted!</p>
                          </div>
                        )}
                        {userBid && userBid?.status === 'rejected' && (
                          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg text-center">
                            <p className="text-red-700 dark:text-red-300 font-medium">Bid was rejected</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className={`${cardBg} rounded-2xl border ${borderClr} p-6`}>
                  <h3 className={`text-lg font-semibold ${textClr} mb-4`}>Communication</h3>
                  <button className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-3 rounded-lg w-full transition-colors">
                    <HiOutlineChatAlt2 className="h-5 w-5" />
                    <span className="font-medium">Open Chat</span>
                  </button>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActionProps {
  icon: React.ReactNode;
  label: string;
  hoverClr: string;
  onClick?: () => void;
}

const SidebarAction: React.FC<ActionProps> = ({ icon, label, hoverClr, onClick }) => (
  <button
    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${hoverClr} border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800`}
    onClick={onClick}
  >
    <div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 rounded">
      {icon}
    </div>
    {label}
  </button>
);

