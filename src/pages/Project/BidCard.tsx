import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MdMoreHoriz, MdOutlinePlaylistAdd, MdPlaylistAddCheck, MdAccessTime, MdAttachMoney } from "react-icons/md";
import { HiOutlineUser, HiOutlineCalendar, HiOutlineChat, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { FaCode, FaUserTie } from "react-icons/fa";
import { useTheme } from "../../components/theme-provider";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface BidProps {
    bid: any;
    hoverClr: string;
    borderClr: string;
    expanded: Record<number, boolean>;
    setExpanded: (expanded: Record<number, boolean>) => void;
    handleBidAction: (bidId: string, action: 'accept' | 'reject') => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return {
                    bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
                    text: 'text-white',
                    icon: <HiOutlineCheckCircle className="h-4 w-4" />,
                    shadow: 'shadow-emerald-500/25'
                };
            case 'rejected':
                return {
                    bg: 'bg-gradient-to-r from-red-500 to-red-600',
                    text: 'text-white',
                    icon: <HiOutlineXCircle className="h-4 w-4" />,
                    shadow: 'shadow-red-500/25'
                };
            case 'pending':
                return {
                    bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
                    text: 'text-white',
                    icon: <MdAccessTime className="h-4 w-4" />,
                    shadow: 'shadow-yellow-500/25'
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
                    text: 'text-white',
                    icon: <MdOutlinePlaylistAdd className="h-4 w-4" />,
                    shadow: 'shadow-gray-500/25'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.text} shadow-lg ${config.shadow} backdrop-blur-sm`}>
            {config.icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export const BidCard: React.FC<BidProps> = ({ bid, hoverClr, borderClr, expanded, setExpanded, handleBidAction }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [isProcessing, setIsProcessing] = useState<'accept' | 'reject' | null>(null);

    const user_type = useSelector((state: any) => state.auth.userType);
    const userDetails = useSelector((state: any) => state.auth.userDetails);

    const cardBg = isDark ? "bg-gray-800/30 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
    const textClr = isDark ? "text-gray-100" : "text-gray-900";
    const subtleText = isDark ? "text-gray-400" : "text-gray-600";
    const isClient = user_type === 'client';

    const canShowActions = isClient && bid.status === 'pending';

    const handleAction = async (action: 'accept' | 'reject') => {
        setIsProcessing(action);
        try {
            await handleBidAction(bid._id, action);
            toast.success(`Bid ${action}ed successfully!`);
        } catch (error) {
            toast.error(`Failed to ${action} bid`);
        } finally {
            setIsProcessing(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`${cardBg} rounded-2xl border ${borderClr} p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] hover:border-indigo-300 dark:hover:border-indigo-700`}>
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                    {/* Developer Avatar Placeholder */}
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <FaUserTie className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold text-lg ${textClr}`}>
                                Developer Proposal
                            </h3>
                            <StatusBadge status={bid.status} />
                        </div>

                        {/* Key Metrics */}
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                    <MdAttachMoney className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className={`font-bold text-lg ${textClr}`}>
                                    {formatCurrency(bid.proposedBudget)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <HiOutlineCalendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className={`${subtleText} text-sm`}>
                                    {bid.timeline ? formatDate(bid.timeline) : 'Timeline not specified'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons for Clients */}
                {canShowActions && (
                    <div className="flex items-center gap-2 ml-4">
                        <button
                            onClick={() => handleAction('accept')}
                            disabled={isProcessing !== null}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing === 'accept' ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <HiOutlineCheckCircle className="h-4 w-4" />
                            )}
                            Accept
                        </button>

                        <button
                            onClick={() => handleAction('reject')}
                            disabled={isProcessing !== null}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing === 'reject' ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <HiOutlineXCircle className="h-4 w-4" />
                            )}
                            Reject
                        </button>
                    </div>
                )}

                {/* More Options Menu for non-pending bids or non-clients */}
                {!canShowActions && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={`p-2 ${hoverClr} rounded-lg transition-colors`}>
                                <MdMoreHoriz className={`h-5 w-5 ${subtleText}`} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={`${cardBg} border ${borderClr} rounded-lg shadow-xl p-2 min-w-[160px]`}>
                            <DropdownMenuLabel className={`px-3 py-2 text-sm font-semibold ${textClr}`}>
                                Bid Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className={`my-1 ${borderClr}`} />
                            <DropdownMenuItem className={`px-3 py-2 text-sm ${subtleText} hover:${hoverClr} rounded cursor-pointer flex items-center gap-2`}>
                                <HiOutlineChat className="h-4 w-4" />
                                Contact Developer
                            </DropdownMenuItem>
                            <DropdownMenuItem className={`px-3 py-2 text-sm ${subtleText} hover:${hoverClr} rounded cursor-pointer flex items-center gap-2`}>
                                <HiOutlineUser className="h-4 w-4" />
                                View Profile
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Expandable Content Toggle */}
            <button
                onClick={() => setExpanded({ [bid._id]: !expanded[bid._id] })}
                className={`w-full flex items-center justify-between p-3 ${hoverClr} rounded-lg transition-all duration-200 mb-4`}
            >
                <span className={`font-medium ${textClr}`}>
                    {expanded[bid._id] ? 'Hide Details' : 'View Details'}
                </span>
                <div className={`transform transition-transform duration-200 ${expanded[bid._id] ? 'rotate-180' : ''}`}>
                    <svg className={`w-4 h-4 ${subtleText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Expanded Content */}
            {expanded[bid._id] && (
                <div className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    {/* Proposal Description */}
                    <div className={`p-4 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50/80'} rounded-xl`}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <HiOutlineChat className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h4 className={`font-semibold ${textClr}`}>Proposal Description</h4>
                        </div>
                        <p className={`${textClr} leading-relaxed`}>
                            {bid.description || 'No description provided'}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Budget Information */}
                        <div className={`p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl border border-emerald-200 dark:border-emerald-800/30`}>
                            <div className="flex items-center gap-2 mb-2">
                                <MdAttachMoney className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <h5 className={`font-semibold ${textClr}`}>Budget Details</h5>
                            </div>
                            <p className={`text-2xl font-bold text-emerald-600 dark:text-emerald-400`}>
                                {formatCurrency(bid.proposedBudget)}
                            </p>
                            <p className={`text-sm ${subtleText} mt-1`}>Proposed Amount</p>
                        </div>

                        {/* Timeline Information */}
                        <div className={`p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800/30`}>
                            <div className="flex items-center gap-2 mb-2">
                                <HiOutlineCalendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <h5 className={`font-semibold ${textClr}`}>Timeline</h5>
                            </div>
                            <p className={`font-bold text-blue-600 dark:text-blue-400 text-lg`}>
                                {bid.timeline ? formatDate(bid.timeline) : 'Not specified'}
                            </p>
                            <p className={`text-sm ${subtleText} mt-1`}>Expected Completion</p>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className={`p-4 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'} rounded-xl`}>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <MdAccessTime className={`h-4 w-4 ${subtleText}`} />
                                <span className={`${subtleText}`}>
                                    Submitted: {formatDate(bid.createdAt)}
                                </span>
                            </div>
                            {bid.updatedAt && bid.updatedAt !== bid.createdAt && (
                                <div className="flex items-center gap-2">
                                    <span className={`${subtleText}`}>
                                        Updated: {formatDate(bid.updatedAt)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Success/Acceptance Message */}
                    {bid.status === 'accepted' && (
                        <div className="p-4 bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-xl border border-emerald-200 dark:border-emerald-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <HiOutlineCheckCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">Bid Accepted!</h4>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400">This proposal has been selected for the project.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rejection Message */}
                    {bid.status === 'rejected' && (
                        <div className="p-4 bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <HiOutlineXCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-red-700 dark:text-red-300">Bid Rejected</h4>
                                    <p className="text-sm text-red-600 dark:text-red-400">This proposal was not selected for the project.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};