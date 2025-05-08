import React, { useState } from "react";
import { useTheme } from "../../components/theme-provider";
import { projectHttp } from "@/utility/api";
import { toast } from "sonner";
import { UserBidType } from "./ProjectDetails";

interface BidProps {
    close: () => void;
    userId: string;
    projectId: string;
    type: "update" | "create"
    data?: UserBidType
}

const BidPopup: React.FC<BidProps> = ({ close, userId, projectId , type, data}) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const bgCard = isDark ? "bg-neutral-900" : "bg-white/90";
    const textClr = isDark ? "text-gray-200" : "text-gray-800";
    const borderClr = isDark ? "border-neutral-700" : "border-gray-300";
    const bg = isDark ? "bg-black/80" : "bg-black/50"

    const [formData, setFormData] = useState({
        proposedBudget: data?.proposedBudget,
        timeline: data?.timeline,
        descripttion: data?.description
    });
    console.log("data: ", data)
    console.log("FormData: ", formData)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (type === 'create') {
            projectHttp.post(`project/${projectId}/bid`, formData)
                .then((res) => {
                    toast.success("Bid created successfully");
                })
                .catch((error) => {
                    toast.error("Failed to create the bid", {
                        description: error.response.data.message,
                    })
                })
                .finally(() => {
                    close();
                })
        }
        else if (type === 'update' && data) {
            projectHttp.patch(`project/${projectId}/bid/${data._id}`, formData)
                .then((res) => {
                    toast.success("Bid Updated successfully");
                })
                .catch((error) => {
                    toast.error("Failed to update the bid", {
                        description: error.response.data.message,
                    })
                })
                .finally(() => {
                    close();
                })
        }

    };

    return (
        <div className={`fixed inset-0 w-full h-full ${bg} flex justify-center items-center z-100 p-4`}>
            <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${bgCard} ${borderClr}`}>
                <button onClick={close} className="absolute top-2 right-2 text-white">X</button>
                <h2 className={`text-xl font-bold mb-4 ${textClr}`}>
                    {type === 'create' ? "Submit Bid" : "Update Bid"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className={`block text-sm font-medium mb-1 ${textClr}`} htmlFor="proposedBudget">
                            Proposed Budget
                        </label>
                        <input
                            type="number"
                            id="proposedBudget"
                            name="proposedBudget"
                            value={formData.proposedBudget}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md ${borderClr} ${textClr}`}
                        />
                    </div>
                    <div className="mb-4">
                        <label className={`block text-sm font-medium mb-1 ${textClr}`} htmlFor="timeline">
                            Timeline
                        </label>
                        <input
                            type="date"
                            id="timeline"
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md ${borderClr} ${textClr}`}
                        />
                    </div>
                    <div className="mb-4">
                        <label className={`block text-sm font-medium mb-1 ${textClr}`} htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            onChange={handleChange}
                            value={formData.descripttion}
                            className={`w-full px-3 py-2 border rounded-md ${borderClr} ${textClr}`}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        {/* Submit Bid */}
                        {type === 'create' ? "Submit Bid" : "Update Bid"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BidPopup;