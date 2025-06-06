import { projectHttp } from '@/utility/api'
import { useTheme } from "../../components/theme-provider";
import { MdOutlinePlaylistAdd, MdPlaylistAddCheck } from 'react-icons/md'
import { HiOutlineCalendar, HiOutlineCurrencyDollar, HiOutlineClipboardList } from 'react-icons/hi'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useEffect, useState } from 'react';

interface MilestoneType {
    _id: string;
    projectId: string;
    title: string;
    description: string;
    status: string;
    dueDate: Date;
    amount: {
        currency: string;
        value: number;
    };
    position: number;
}

export const Milestones = () => {
    const [allMilestones, setAllMilestones] = useState<MilestoneType[]>([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    const { theme } = useTheme();
    const isDark = theme === "dark";

    const borderClr = isDark ? "border-gray-600/50" : "border-gray-200/50";
    const hoverClr = isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50/80";
    const textClr = isDark ? "text-gray-100" : "text-gray-900";
    const subtleText = isDark ? "text-gray-400" : "text-gray-600";
    const cardBg = isDark ? "bg-gray-800/30" : "bg-white/60";

    useEffect(() => {
        setLoading(true);
        projectHttp.get(`project/${params.id}/milestone`)
            .then((res) => {
                setAllMilestones(res.data.data || []);
            })
            .catch((error) => {
                toast.error("Error fetching project milestones", {
                    description: error.response?.data?.message || "Failed to load milestones"
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [params.id]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
            case 'in-progress':
                return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
            default:
                return 'text-gray-600 bg-gray-100 dark:bg-gray-700/30';
        }
    };

    const getStatusIcon = (status: string) => {
        return status.toLowerCase() === 'completed' ? (
            <MdPlaylistAddCheck className="h-5 w-5 text-emerald-600" />
        ) : (
            <MdOutlinePlaylistAdd className="h-5 w-5 text-gray-400" />
        );
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={`animate-pulse p-6 ${cardBg} rounded-xl border ${borderClr}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                            </div>
                            <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!allMilestones || allMilestones.length === 0) {
        return (
            <div className={`${cardBg} rounded-xl p-12 border ${borderClr} text-center`}>
                <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg inline-block mb-4">
                    <MdOutlinePlaylistAdd className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto" />
                </div>
                <h3 className={`text-xl font-semibold ${textClr} mb-2`}>No Milestones Yet</h3>
                <p className={`${subtleText} max-w-md mx-auto`}>
                    Milestones help track project progress and manage payments. Create your first milestone to get started.
                </p>
            </div>
        );
    }

    const completedCount = allMilestones.filter(m => m.status.toLowerCase() === 'completed').length;
    const totalValue = allMilestones.reduce((sum, m) => sum + m.amount.value, 0);
    const completedValue = allMilestones
        .filter(m => m.status.toLowerCase() === 'completed')
        .reduce((sum, m) => sum + m.amount.value, 0);

    return (
        <div className="space-y-6">
            {/* Progress Overview */}
            <div className={`${cardBg} rounded-xl p-6 border ${borderClr}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${textClr}`}>Milestone Progress</h3>
                    <div className="flex items-center gap-4 text-sm">
                        <span className={`${subtleText}`}>
                            {completedCount} of {allMilestones.length} completed
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('progress')}`}>
                            {Math.round((completedCount / allMilestones.length) * 100)}% Complete
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                    <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(completedCount / allMilestones.length) * 100}%` }}
                    ></div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                        <p className={`text-sm ${subtleText} mb-1`}>Total Value</p>
                        <p className={`text-lg font-bold ${textClr}`}>
                            ${totalValue.toLocaleString()} {allMilestones[0]?.amount.currency}
                        </p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg">
                        <p className={`text-sm ${subtleText} mb-1`}>Completed Value</p>
                        <p className={`text-lg font-bold ${textClr}`}>
                            ${completedValue.toLocaleString()} {allMilestones[0]?.amount.currency}
                        </p>
                    </div>
                </div>
            </div>

            {/* Milestones List */}
            <div className="space-y-4">
                {allMilestones.map((milestone, index) => (
                    <Link
                        key={milestone._id}
                        to={`milestone/${milestone._id}`}
                        className="block group"
                    >
                        <div className={`${cardBg} rounded-xl border ${borderClr} p-6 transition-all duration-200 ${hoverClr} group-hover:border-indigo-300 dark:group-hover:border-indigo-700 group-hover:shadow-lg transform group-hover:-translate-y-0.5`}>
                            <div className="flex items-start gap-4">
                                {/* Status Icon */}
                                <div className="flex-shrink-0 pt-1">
                                    {getStatusIcon(milestone.status)}
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h4 className={`font-semibold ${textClr} group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1`}>
                                                {milestone.title}
                                            </h4>
                                            <p className={`text-sm ${subtleText} line-clamp-2`}>
                                                {milestone.description}
                                            </p>
                                        </div>
                                        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)} flex-shrink-0`}>
                                            {milestone.status}
                                        </span>
                                    </div>

                                    {/* Milestone Details */}
                                    <div className="flex flex-wrap items-center gap-4 mt-3">
                                        <div className="flex items-center gap-2">
                                            <HiOutlineCurrencyDollar className={`h-4 w-4 ${subtleText}`} />
                                            <span className={`text-sm font-medium ${textClr}`}>
                                                ${milestone.amount.value.toLocaleString()} {milestone.amount.currency}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <HiOutlineCalendar className={`h-4 w-4 ${subtleText}`} />
                                            <span className={`text-sm ${subtleText}`}>
                                                Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <HiOutlineClipboardList className={`h-4 w-4 ${subtleText}`} />
                                            <span className={`text-sm ${subtleText}`}>
                                                Position: {milestone.position}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow indicator */}
                                <div className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${subtleText}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
