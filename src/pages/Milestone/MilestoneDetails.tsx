"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "../../components/theme-provider";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { CalendarIcon, DollarSign, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { projectHttp } from "@/utility/api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface Amount {
    currency: string;
    value: number;
}

interface Milestone {
    _id: string;
    projectId: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    amount: Amount;
    position: number;
    createdAt: string;
    updatedAt: string;
}

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusMap: Record<string, string> = {
        draft: "bg-gray-500",
        pending: "bg-amber-500",
        completed: "bg-emerald-600",
        cancelled: "bg-red-600",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full ${statusMap[status] || "bg-gray-500"} px-3 py-1 text-sm font-medium text-white`}
        >
            {status}
        </span>
    );
};

export const MilestoneDetails = ()=> {

    const { theme } = useTheme();
    const isDark = theme === "dark";
    const bgPage = isDark ? "bg-neutral-950" : "bg-gray-100";
    const bgCard = isDark ? "bg-neutral-900" : "bg-white";
    const borderClr = isDark ? "border-neutral-700" : "border-gray-300";
    const ringClr = isDark ? "ring-neutral-800" : "ring-gray-100";
    const textClr = isDark ? "text-gray-200" : "text-gray-800";
    const subtleText = isDark ? "text-gray-400" : "text-gray-500";

    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [loading, setLoading] = useState(true);

    const { id, milestoneId} = useParams();

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        projectHttp
            .get(`project/${id}/milestone/${milestoneId}`)
            .then((res) => {
                setMilestone(res.data.data.milestone);
                toast.success("Milestone details fetched successfully");
            })
            .catch((err) => {
                toast.error("Error fetching milestone details", {
                    description: err?.response?.data?.message ?? err.message,
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        );
    }

    if (!milestone) return null;

    return (
        <div className={`min-h-screen ${bgPage} flex justify-center px-4 md:px-0`}>
            <div
                className={`w-full md:w-3/4 rounded-2xl  shadow-sm  ${ringClr} px-6 md:px-10 py-6 md:py-8`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between pb-6 border-b ${borderClr}`}>
                    <h1 className={`text-3xl font-bold tracking-tight ${textClr}`}>
                        {milestone.title}
                    </h1>
                    <StatusBadge status={milestone.status} />
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 text-sm font-medium">
                    {/* Main content */}
                    <div className="space-y-8 md:col-span-2">
                        {/* Description */}
                        <section>
                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p className={`${subtleText}`}>{milestone.description}</p>
                        </section>

                        {/* Details */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                <span>
                                    Due Date:&nbsp;
                                    {format(new Date(milestone.dueDate), "PPP")}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span>
                                    Budget:&nbsp;{milestone.amount.value} {milestone.amount.currency}
                                </span>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <Card className={`border ${borderClr} ${bgCard}`}>
                            <CardHeader>
                                <CardTitle>Milestone Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span className={subtleText}>Created:&nbsp;{format(new Date(milestone.createdAt), "PPP")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span className={subtleText}>Updated:&nbsp;{format(new Date(milestone.updatedAt), "PPP")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Position:</span> {milestone.position}
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    );
}
