import React, { useState } from "react";
import { useTheme } from "../../components/theme-provider";
import { projectHttp } from "@/utility/api";
import { toast } from "sonner";
import { UserBidType } from "./ProjectDetails";
import {
    HiOutlineX,
    HiOutlineCurrencyDollar,
    HiOutlineCalendar,
    HiOutlineClipboardList,
    HiOutlinePaperAirplane
} from "react-icons/hi";
import { Loader2 } from "lucide-react";

interface BidProps {
    close: () => void;
    userId: string;
    projectId: string;
    type: "update" | "create"
    data?: UserBidType
}

const BidPopup: React.FC<BidProps> = ({ close, userId, projectId, type, data }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const bgOverlay = isDark ? "bg-black/70 backdrop-blur-sm" : "bg-black/50 backdrop-blur-sm";
    const bgCard = isDark ? "bg-gray-800/95 backdrop-blur-xl" : "bg-white/95 backdrop-blur-xl";
    const textClr = isDark ? "text-gray-100" : "text-gray-900";
    const subtleText = isDark ? "text-gray-400" : "text-gray-600";
    const borderClr = isDark ? "border-gray-600/50" : "border-gray-200/50";
    const inputBg = isDark ? "bg-gray-700/50" : "bg-white";

    const [formData, setFormData] = useState({
        proposedBudget: data?.proposedBudget || "",
        timeline: data?.timeline ? new Date(data.timeline).toISOString().split('T')[0] : "",
        description: data?.description || ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validation
        if (!formData.proposedBudget || !formData.timeline || !formData.description) {
            toast.error("Please fill in all fields");
            setIsSubmitting(false);
            return;
        }

        try {
            if (type === 'create') {
                await projectHttp.post(`project/${projectId}/bid`, formData);
                toast.success("Bid submitted successfully! 🎉", {
                    description: "Your proposal has been sent to the client."
                });
            } else if (type === 'update' && data) {
                await projectHttp.patch(`project/${projectId}/bid/${data._id}`, formData);
                toast.success("Bid updated successfully! ✨", {
                    description: "Your proposal changes have been saved."
                });
            }
            close();
        } catch (error: any) {
            toast.error(`Failed to ${type} bid`, {
                description: error.response?.data?.message || "Please try again"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };

    return (
        <div
            className={`fixed inset-0 w-full h-full ${bgOverlay} flex justify-center items-center z-50 p-4`}
            onClick={handleBackdropClick}
        >
            <div className={`relative w-full max-w-2xl ${bgCard} rounded-2xl shadow-2xl border ${borderClr} overflow-hidden transform transition-all duration-300 scale-100`}>
                {/* Header */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-6">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {type === 'create' ? "Submit Your Bid" : "Update Your Bid"}
                            </h2>
                            <p className="text-white/80 mt-1">
                                {type === 'create'
                                    ? "Make a compelling proposal to win this project"
                                    : "Modify your existing proposal details"
                                }
                            </p>
                        </div>
                        <button
                            onClick={close}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <HiOutlineX className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Proposed Budget */}
                    <div className="space-y-2">
                        <label className={`flex items-center gap-2 text-sm font-semibold ${textClr}`} htmlFor="proposedBudget">
                            <span className="text-indigo-500">
                                <HiOutlineCurrencyDollar className="h-4 w-4" />
                            </span>
                            Proposed Budget
                        </label>
                        <div className="relative">
                            <HiOutlineCurrencyDollar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="number"
                                id="proposedBudget"
                                name="proposedBudget"
                                value={formData.proposedBudget}
                                onChange={handleChange}
                                className={`w-full rounded-xl pl-10 pr-4 py-3 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all ${textClr}`}
                                placeholder="Enter your budget proposal"
                                required
                            />
                        </div>
                        <p className={`text-sm ${subtleText}`}>
                            Specify your competitive rate for this project
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2">
                        <label className={`flex items-center gap-2 text-sm font-semibold ${textClr}`} htmlFor="timeline">
                            <span className="text-indigo-500">
                                <HiOutlineCalendar className="h-4 w-4" />
                            </span>
                            Expected Completion Date
                        </label>
                        <input
                            type="date"
                            id="timeline"
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            className={`w-full rounded-xl px-4 py-3 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all ${textClr}`}
                            required
                        />
                        <p className={`text-sm ${subtleText}`}>
                            When do you expect to complete this project?
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className={`flex items-center gap-2 text-sm font-semibold ${textClr}`} htmlFor="description">
                            <span className="text-indigo-500">
                                <HiOutlineClipboardList className="h-4 w-4" />
                            </span>
                            Proposal Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className={`w-full rounded-xl px-4 py-3 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none ${textClr}`}
                            placeholder="Describe your approach, experience, and why you're the right fit for this project..."
                            required
                        />
                        <p className={`text-sm ${subtleText}`}>
                            Share your expertise, approach, and what makes you the ideal candidate
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="button"
                            onClick={close}
                            className={`flex-1 px-6 py-3 border ${borderClr} rounded-xl font-medium transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} ${textClr}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    {type === 'create' ? 'Submitting...' : 'Updating...'}
                                </>
                            ) : (
                                <>
                                    <HiOutlinePaperAirplane className="h-5 w-5" />
                                    {type === 'create' ? "Submit Bid" : "Update Bid"}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            </div>
        </div>
    );
};

export default BidPopup;