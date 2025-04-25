import React, { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal, HiOutlineChatAlt2 } from "react-icons/hi";
import { MdEdit, MdPlaylistAddCheck, MdOutlinePlaylistAdd, MdMoreHoriz } from "react-icons/md";
import { useTheme } from "../../components/theme-provider"; // Added theme provider
import { projectHttp } from "@/utility/api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const DUMMY_PROJECT = {
  title: "Build a Mobile App",
  status: "In Progress",
  description:
    "Design an iOS and Android fintech application with a focus on user-friendly design and performance.",
  requirements: ["Experience in React Native or Flutter", "UI/UX design skills"],
  skills: ["React Native", "Flutter", "UI/UX Design"],
  budget: "$10,000",
  deadline: "2024-05-01",
  serviceType: ["Mobile App Development"],
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


  useEffect(() => {
    setLoading(true);
    projectHttp.get(`projects/${id}`).then((res) => {
      console.log(res.data);
      setProject(res.data);
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
            {DUMMY_PROJECT.title}
          </h1>
          <StatusBadge status={DUMMY_PROJECT.status} />
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
                activeTab === tab.id
                  ? "border-b-2 border-indigo-400 text-indigo-400 pb-2 cursor-pointer"
                  : `pb-2 hover:text-indigo-400 ${subtleText} cursor-pointer`
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
                    {DUMMY_PROJECT.description}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-2">Project Requirements</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {DUMMY_PROJECT.requirements.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-2">Project Details</h2>
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold">Budget:</span> {DUMMY_PROJECT.budget}
                    </p>
                    <p>
                      <span className="font-semibold">Service Type:</span>{" "}
                      {DUMMY_PROJECT.serviceType.join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold">Skills:</span>{" "}
                      {DUMMY_PROJECT.skills.join(", ")}
                    </p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">Milestones</h2>
                    <span className="text-sm">
                      {DUMMY_PROJECT.milestones.filter((m) => m.done).length} of{" "}
                      {DUMMY_PROJECT.milestones.length} completed
                    </span>
                  </div>
                  <div className={`divide-y rounded-md border ${borderClr}`}>
                    {DUMMY_PROJECT.milestones.map((m) => (
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
                </section>
              </div>
            )}

            {/* Milestones Tab */}
            {activeTab === "milestones" && (
              <div className="mt-8 space-y-4">
                {DUMMY_PROJECT.milestones.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-center justify-between rounded-lg border px-5 py-4 cursor-pointer ${hoverClr} ${borderClr}`}
                  >
                    <div className="flex items-center gap-3">
                      {m.done ? (
                        <MdPlaylistAddCheck className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <MdOutlinePlaylistAdd className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="font-medium">{m.title}</span>
                    </div>
                    {m.done && <span className="text-sm text-emerald-600">Completed</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Bids Tab */}
            {activeTab === "bids" && (
              <div className="mt-8 space-y-4">
                {DUMMY_PROJECT.bids.map((bid) => {
                  return (
                    <BidCard bid={bid} hoverClr={hoverClr} borderClr={borderClr} expanded={expanded} setExpanded={setExpanded} />
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="w-full md:w-1/3 space-y-6">
            <div className={`space-y-4 rounded-lg border ${borderClr} p-4`}>
              <SidebarAction icon={<MdEdit className="h-4 w-4" />} label="Edit Project" hoverClr={hoverClr} />
              <SidebarAction icon={<MdOutlinePlaylistAdd className="h-4 w-4" />} label="Create Milestone" hoverClr={hoverClr} />
              <SidebarAction icon={<HiOutlineChatAlt2 className="h-4 w-4" />} label="View Proposal" hoverClr={hoverClr} />
            </div>

            <div className={`space-y-4 rounded-lg border ${borderClr} p-4`}>
              <h3 className="font-medium">Chat</h3>
              <button className="flex items-center gap-2 text-sm text-indigo-400 hover:underline">
                <HiOutlineChatAlt2 className="h-4 w-4" /> Open chat
              </button>

              <h3 className="font-medium mt-4">Project Progress</h3>
              <ul className="space-y-1 text-sm">
                {DUMMY_PROJECT.milestones.slice(0, 2).map((m) => (
                  <li key={m.id} className="flex items-center gap-2">
                    {m.done ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full border border-gray-400" />
                    )}
                    {m.title}
                  </li>
                ))}
              </ul>

              <div className="rounded-lg border px-4 py-3 text-sm">
                <p className="font-medium">{DUMMY_PROJECT.developer.name}</p>
                <p className="text-gray-500">{DUMMY_PROJECT.developer.role}</p>
                <p className="font-medium mt-2">{DUMMY_PROJECT.developer.rate}</p>
              </div>
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
}
const SidebarAction: React.FC<ActionProps> = ({ icon, label, hoverClr }) => (
  <button className={`flex w-full items-center gap-3 rounded-md px-4 py-2 text-sm ${hoverClr} cursor-pointer`}>
    {icon}
    {label}
  </button>
);

interface BidProps {
  bid: any;
  hoverClr: string;
  borderClr: string;
  expanded: Record<number, boolean>;
  setExpanded: (expanded: Record<number, boolean>) => void;
}
const BidCard: React.FC<BidProps> = ({ bid, hoverClr, borderClr, expanded, setExpanded }) => {

  const handleBidAction = (bidId: number, action: string) => {
    console.log(bidId, action);
  }

  return (
    <div
      key={bid.id}
      className={`flex flex-col rounded-lg border px-5 py-4 transition-all duration-200 hover:shadow-lg ${hoverClr} ${borderClr}`}
    >
      <div className={`flex items-center justify-between w-full gap-5 ${expanded ? "mb-4" : ""}`}>
        <div className="flex items-center justify-between w-full cursor-pointer" onClick={() => setExpanded({ [bid.id]: !expanded[bid.id] })}>
          <div className="flex items-center gap-3">
            {bid.status === "Accepted" ? (
              <MdPlaylistAddCheck className="h-5 w-5 text-emerald-600" />
            ) : (
              <MdOutlinePlaylistAdd className="h-5 w-5 text-gray-400" />
            )}
            <span className="font-medium text-lg">{bid.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {bid.status === "Pending" && <span className="text-sm text-yellow-600 font-semibold">Pending</span>}
            {bid.status === "Rejected" && <span className="text-sm text-red-600 font-semibold">Rejected</span>}
            {bid.status === "Accepted" && <span className="text-sm text-green-600 font-semibold">Accepted</span>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MdMoreHoriz className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Bid Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBidAction(bid.id, "accept")} className="text-green-600 cursor-pointer">Accept</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBidAction(bid.id, "reject")} className="text-red-600 cursor-pointer">Reject</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </button>
        </div>
      </div>
      {expanded[bid.id] && (
        <div className="mt-4 w-full text-left text-sm ">
          <p className="mb-1"><span className="font-semibold">Description:</span> {bid.description}</p>
          <p className="mb-1"><span className="font-semibold">Amount:</span> {bid.amount}</p>
          <p className="mb-1"><span className="font-semibold">Created At:</span> {bid.createdAt}</p>
          <p className="mb-1"><span className="font-semibold">Developer ID:</span> {bid.developerId}</p>
        </div>
      )}
    </div>
  );
}