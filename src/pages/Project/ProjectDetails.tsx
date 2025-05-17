import React, { useCallback, useEffect, useState } from "react";
import { HiOutlineDotsHorizontal, HiOutlineChatAlt2 } from "react-icons/hi";
import { MdEdit, MdPlaylistAddCheck, MdOutlinePlaylistAdd } from "react-icons/md";
import { useTheme } from "../../components/theme-provider"; // Added theme provider
import { projectHttp } from "@/utility/api";
import {  useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useSelector } from "react-redux";
import BidPopup from "./BidPopup";
import { BidCard } from "./BidCard";

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
export interface MilestoneType{
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

export interface BidType{
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

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className="inline-flex items-center rounded-full bg-emerald-600/90 px-3 py-1 text-sm font-medium text-white">
    {status}
  </span>
);

export default function ProjectDetails() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bgPage = isDark ? "bg-neutral-950" : "bg-gray-100";
  const bgCard = isDark ? "bg-neutral-900" : "bg-white";
  const borderClr = isDark ? "border-neutral-700" : "border-gray-300";
  const ringClr = isDark ? "ring-neutral-800" : "ring-gray-100";
  const textClr = isDark ? "text-gray-200" : "text-gray-800";
  const subtleText = isDark ? "text-gray-400" : "text-gray-500";
  const hoverClr = isDark ? "hover:bg-neutral-800" : "hover:bg-gray-50";

  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "bids">("overview");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const user_type = useSelector((state: any) => state.auth.userType);
  const userDetails = useSelector((state: any) => state.auth.userDetails);

  const [showBid, setShowBid] = useState<boolean>(false);
  const [showMilestones, setShowMilestones] = useState<boolean>(false);

  const [userBid, setUserBid] = useState<UserBidType>();

  const [allBids, setAllBids] = useState<BidType[]>();
  const [allMilestones, setAllMilestones] = useState<MilestoneType[]>();
  const [isBidPopupOpen, setIsBidPopupOpen] = useState(false);

  const openBidPopup = useCallback(() => {
    setIsBidPopupOpen(true);
  }, []);
  const closeBidPopup = useCallback(() => {
    setIsBidPopupOpen(false);
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
    if (user_type === 'client' && userDetails._id === project?.clientId) {
      setShowBid(true);
    } else {
      setShowBid(false);
    }

    if (userDetails?._id === project?.clientId || userDetails?._id === project?.developerId) {
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
      else if(action === 'reject') {
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
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  }

  return (
    <div className={`min-h-screen ${bgPage} flex justify-center`}>
      <div className={`w-full  rounded-2xl ${bgCard} shadow-sm ring-1 ${ringClr} px-10 py-4`}>
        {/* Top Bar */}
        <div className={`flex items-center justify-between p-6 border-b ${borderClr}`}>
          <div className="flex items-center gap-4">
            <select className={`rounded-md ${borderClr} text-sm font-medium focus:ring-indigo-500`}>
              <option>Client</option>
              <option>Developer</option>
            </select>
            <span className={`text-sm ${subtleText}`}>Details</span>
          </div>
          <HiOutlineDotsHorizontal className={`h-5 w-5 ${subtleText}`} />
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-8 px-6 pt-4 text-sm font-medium">
          <h1 className={`text-4xl font-bold tracking-tight ${textClr}`}>
            {project.title}
          </h1>
          <StatusBadge status={project.status} />
        </div>

        <div className="px-6 pt-4 flex gap-8 text-sm font-medium mt-5">
          {[
            { id: "overview", label: "Overview" },
            { id: "milestones", label: "Milestones" },
            { id: "bids", label: "Bids" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={
                `${activeTab === tab.id ? "border-b-2 border-indigo-400 text-indigo-400 pb-2 cursor-pointer" : `pb-2 hover:text-indigo-400 ${subtleText} cursor-pointer`} ${tab.id === 'bids' && !showBid ? "hidden" : "show"}
                ${tab.id === 'milestones' && !showMilestones ? "hidden" : "show"}
                `
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8 px-6 pt-6 pb-10">
          {/* Left Column */}
          <div className="w-full md:w-2/3">
            {/* Overview Content */}
            {activeTab === "overview" && (
              <div className={`mt-8 space-y-8 text-left ${textClr}`}>
                <section>
                  <h2 className="text-xl font-bold mb-2">Project Description</h2>
                  <p className="leading-relaxed">
                    {project.description}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-2">Project Requirements</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {project.requirements.map((req:string, index:number) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-2">Project Details</h2>
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold">Budget:</span> {project.pricing.amount} {project.pricing.currency}
                    </p>
                    <p>
                      <span className="font-semibold">Service Type:</span>{" "}
                      {project.serviceType.join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold">Skills:</span>{" "}
                      {project.requiredSkills.join(", ")}
                    </p>
                  </div>
                </section>

                {/* <section className={`${showMilestones?"show":"hidden"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">Milestones</h2>
                    <span className="text-sm">
                      {project.milestones.filter((m) => m.done).length} of{" "}
                      {project.milestones.length} completed
                    </span>
                  </div>
                  <div className={`divide-y rounded-md border ${borderClr}`}>
                    {project.milestones.map((m) => (
                      <div key={m.id} className={`flex items-center justify-between px-4 py-3 cursor-pointer ${hoverClr}`}>
                        <span>{m.title}</span>
                        {m.done ? (
                          <MdPlaylistAddCheck className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <MdOutlinePlaylistAdd className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </section> */}
              </div>
            )}

            {/* Milestones Tab */}
            {activeTab === "milestones" && (
              <div className="mt-8 space-y-4">
                {allMilestones && allMilestones.map((m) => (
                  <div
                    key={m._id}
                    className={`flex items-center justify-between rounded-lg border px-5 py-4 cursor-pointer ${hoverClr} ${borderClr}`}
                  >
                    <div className="flex items-center gap-3">
                      {m.status ==='completed' ? (
                        <MdPlaylistAddCheck className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <MdOutlinePlaylistAdd className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="font-medium">{m.title}</span>
                    </div>
                    {m.status === "completed" && <span className="text-sm text-emerald-600">Completed</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Bids Tab */}
            {activeTab === "bids" && (
              <div className="mt-8 space-y-4">
                {allBids && allBids.map((bid:BidType, index:number) => {
                  return (
                    <BidCard key={index} bid={bid} hoverClr={hoverClr} borderClr={borderClr} expanded={expanded} setExpanded={setExpanded} handleBidAction={handleBidAction} />
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="w-full md:w-1/3 space-y-6">
            <div className={`space-y-4 rounded-lg border ${borderClr} p-4`}>
              {user_type === 'client' && (
                <>
                  <SidebarAction icon={<MdEdit className="h-4 w-4" />} label="Edit Project" hoverClr={hoverClr} />
                  <SidebarAction icon={<MdOutlinePlaylistAdd className="h-4 w-4" />} label="Create Milestone" hoverClr={hoverClr} />
                  <SidebarAction icon={<HiOutlineChatAlt2 className="h-4 w-4" />} label="View Proposal" hoverClr={hoverClr} />
                </>
              )}
              {user_type === 'developer' && (<>
                {!userBid && (<>
                  <SidebarAction icon={<HiOutlineChatAlt2 className="h-4 w-4" />} label="Bid on this project" hoverClr={hoverClr} onClick={openBidPopup} />
                  {isBidPopupOpen && <BidPopup close={closeBidPopup} userId={userDetails._id} projectId={project._id} type="create" />}
                </>)}
                {
                  userBid && userBid?.status === 'pending' && (<>
                    <SidebarAction icon={<HiOutlineChatAlt2 className="h-4 w-4" />} label="Update Your Bid" hoverClr={hoverClr} onClick={openBidPopup} />
                    {isBidPopupOpen && <BidPopup close={closeBidPopup} userId={userDetails._id} projectId={project._id} type="update" data={userBid} />}
                  </>)
                }
                {
                  userBid && userBid?.status === 'accepted' && (<>
                    <SidebarAction icon={<HiOutlineChatAlt2 className="h-4 w-4" />} label="Your bid has been accepted" hoverClr={hoverClr} />
                  </>)
                }
                {
                  userBid && userBid?.status === 'rejected' && (<>
                    <SidebarAction icon={<HiOutlineChatAlt2 className="h-4 w-4" />} label="Your bid has been rejected" hoverClr={hoverClr} />
                  </>)
                }


              </>)}

            </div>

            <div className={`space-y-4 rounded-lg border ${borderClr} p-4`}>
              <h3 className="font-medium">Chat</h3>
              <button className="flex items-center gap-2 text-sm text-indigo-400 hover:underline">
                <HiOutlineChatAlt2 className="h-4 w-4" /> Open chat
              </button>

              <h3 className="font-medium mt-4">Project Progress</h3>
              {/* <ul className="space-y-1 text-sm">
                {project.milestones.slice(0, 2).map((m) => (
                  <li key={m.id} className="flex items-center gap-2">
                    {m.done ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full border border-gray-400" />
                    )}
                    {m.title}
                  </li>
                ))}
              </ul> */}

              {/* <div className="rounded-lg border px-4 py-3 text-sm">
                <p className="font-medium">{project.developer.name}</p>
                <p className="text-gray-500">{project.developer.role}</p>
                <p className="font-medium mt-2">{project.developer.rate}</p>
              </div> */}
            </div>
          </aside>
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
  <button className={`flex w-full items-center gap-3 rounded-md px-4 py-2 text-sm ${hoverClr} cursor-pointer`} onClick={onClick}>
    {icon}
    {label}
  </button>
);

