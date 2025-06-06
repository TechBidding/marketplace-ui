"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../../components/theme-provider";

import {
    CalendarIcon,
    DollarSign,
    Loader2,
    CheckCircle2,
    Clock,
    AlertCircle,
    CreditCard,
    Wallet,
    User,
    Shield
} from "lucide-react";
import {
    HiOutlineClipboardList,
    HiOutlineCurrencyDollar,
    HiOutlineCalendar,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineExclamationCircle,
    HiOutlineShieldCheck,
    HiOutlineUser
} from "react-icons/hi";
import { FaProjectDiagram, FaMoneyBillWave, FaHandshake } from "react-icons/fa";
import { format } from "date-fns";
import { projectHttp } from "@/utility/api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useSelector } from "react-redux";
import { AuthStateState } from "@/store/AuthSlice";

interface Amount {
    currency: string;
    value: number;
}

interface Milestone {
    _id: string;
    projectId: string;
    clientId: string;
    developerId: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    amount: Amount;
    position: number;
    createdAt: string;
    updatedAt: string;
}

interface EscrowData {
    _id: string;
    milestoneId: string;
    projectId: string;
    clientId: string;
    developerId: string;
    processor: string;
    externalId: string;
    amount: Amount;
    status: string;
    heldAt: string;
    releasedAt?: string;
    refundedAt?: string;
}

interface PaymentStatus {
    stripe?: {
        status: string;
        client_secret?: string;
    };
    escrow?: EscrowData;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'draft':
                return {
                    color: "bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-500/25",
                    icon: <HiOutlineClock className="w-3 h-3" />,
                    label: "Draft"
                };
            case 'pending':
                return {
                    color: "bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/25",
                    icon: <HiOutlineClock className="w-3 h-3" />,
                    label: "In Progress"
                };
            case 'review':
                return {
                    color: "bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-yellow-500/25",
                    icon: <HiOutlineExclamationCircle className="w-3 h-3" />,
                    label: "Under Review"
                };
            case 'paid':
                return {
                    color: "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25",
                    icon: <HiOutlineCheckCircle className="w-3 h-3" />,
                    label: "Completed & Paid"
                };
            case 'approved':
                return {
                    color: "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25",
                    icon: <HiOutlineCheckCircle className="w-3 h-3" />,
                    label: "Approved"
                };
            case 'disputed':
                return {
                    color: "bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/25",
                    icon: <HiOutlineExclamationCircle className="w-3 h-3" />,
                    label: "Disputed"
                };
            default:
                return {
                    color: "bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-500/25",
                    icon: <HiOutlineClock className="w-3 h-3" />,
                    label: "Draft"
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg ${config.color} backdrop-blur-sm`}>
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            {config.icon}
            <span className="ml-1">{config.label}</span>
        </span>
    );
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export const MilestoneDetails = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const bgPage = isDark ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 via-white to-gray-100";
    const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
    const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
    const textClr = isDark ? "text-gray-100" : "text-gray-900";
    const subtleText = isDark ? "text-gray-400" : "text-gray-600";
    const cardBg = isDark ? "bg-gray-800/30" : "bg-white/60";

    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [escrowData, setEscrowData] = useState<EscrowData | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentIntentLoading, setPaymentIntentLoading] = useState(false);

    const { id, milestoneId } = useParams();
    const userType = useSelector((state: { auth: AuthStateState }) => state.auth.userType);
    const userDetails = useSelector((state: { auth: AuthStateState }) => state.auth.userDetails);


    useEffect(() => {
        fetchMilestoneData();
    }, [id, milestoneId]);

    const fetchMilestoneData = async () => {
        if (!id || !milestoneId) return;
        setLoading(true);
        try {
            // Fetch milestone details
            const milestoneRes = await projectHttp.get(`project/${id}/milestone/${milestoneId}`);
            const milestoneData = milestoneRes.data.data.milestone;
            const escrowData = milestoneRes.data.data.escrow;

            setMilestone(milestoneData);
            setEscrowData(escrowData);

            // Fetch payment status
            try {
                const statusRes = await projectHttp.post(`/payments/status`, {
                    milestoneId: milestoneId
                });
                if (statusRes.data.success) {
                    setPaymentStatus(statusRes.data.data);

                    // IMPORTANT: If escrow data exists in payment status but not in milestone, use it
                    // This happens when milestone endpoint doesn't return escrow data
                    if (statusRes.data.data?.escrow && !escrowData) {
                        setEscrowData(statusRes.data.data.escrow);
                    }

                    // If there's an existing client secret, use it
                    if (statusRes.data.data?.stripe?.client_secret) {
                        setClientSecret(statusRes.data.data.stripe.client_secret);
                    }
                }
            } catch (statusError) {
                console.log("No existing payment status found");
            }

            // Handle success redirect
            const urlParams = new URLSearchParams(window.location.search);
            const paymentSuccess = urlParams.get('payment_success');
            if (paymentSuccess === 'true') {
                toast.success("Payment processed successfully!");
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (err: any) {
            toast.error("Error fetching milestone data", {
                description: err?.response?.data?.message ?? err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const createPaymentIntent = async () => {
        if (!milestone || paymentIntentLoading) return;

        setPaymentIntentLoading(true);
        try {
            const amountCents = Math.round(milestone.amount.value * 100);
            const { data } = await projectHttp.post('/payments/intent', {
                milestoneId,
                amount: amountCents,
                currency: 'usd',
                devAccountId: milestone.developerId
            });
            setClientSecret(data.clientSecret);
            toast.success("Payment intent created");
        } catch (error: any) {
            toast.error("Failed to create payment intent", {
                description: error?.response?.data?.message ?? error.message,
            });
        } finally {
            setPaymentIntentLoading(false);
        }
    };

    const handleSetupPayout = async () => {
        try {
            const { data } = await projectHttp.post('payments/connect');
            window.open(data.onboardingUrl, '_blank');
        } catch (error: any) {
            toast.error("Failed to setup payout", {
                description: error?.response?.data?.message ?? error.message,
            });
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${bgPage} flex justify-center items-center`}>
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className={`text-lg ${subtleText}`}>Loading milestone details...</p>
                </div>
            </div>
        );
    }

    if (!milestone) {
        return (
            <div className={`min-h-screen ${bgPage} flex justify-center items-center`}>
                <div className={`${cardBg} rounded-xl p-12 border ${borderClr} text-center max-w-md mx-4`}>
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg inline-block mb-4">
                        <HiOutlineExclamationCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto" />
                    </div>
                    <h2 className={`text-xl font-semibold ${textClr} mb-2`}>Milestone Not Found</h2>
                    <p className={`${subtleText}`}>The milestone you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    const isClient = userType === "client" && userDetails?._id.toString() === milestone.clientId;
    const isDeveloper = userType === "developer" && userDetails?._id.toString() === milestone.developerId;

    // Access control: Only allow client and developer to view milestone details
    if (!isClient && !isDeveloper) {
        return (
            <div className={`min-h-screen ${bgPage} flex justify-center items-center`}>
                <div className={`${cardBg} rounded-xl p-12 border ${borderClr} text-center max-w-md mx-4`}>
                    <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg inline-block mb-4">
                        <HiOutlineShieldCheck className="h-12 w-12 text-amber-600 dark:text-amber-400 mx-auto" />
                    </div>
                    <h2 className={`text-2xl font-bold ${textClr} mb-4`}>Access Restricted</h2>
                    <p className={`${subtleText} mb-6`}>
                        This milestone is only accessible to the project client and assigned developer.
                    </p>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">
                            🔒 Private milestone content
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Check if payment is held in escrow (any escrow status means payment is done)
    const isPaymentHeld = Boolean(escrowData && (escrowData.status === 'held' || escrowData.status === 'released'));
    const isPaymentCompleted = milestone.status === 'paid' || escrowData?.status === 'released';

    return (
        <div className={`min-h-screen ${bgPage} py-8 px-4`}>
            <div className="max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className={`relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl mb-8 px-8 py-12`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaProjectDiagram className="h-8 w-8 text-white/80" />
                                    <span className="text-white/80 font-medium">Milestone #{milestone.position}</span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                                    {milestone.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-white/90">
                                    <div className="flex items-center gap-2">
                                        <HiOutlineCurrencyDollar className="h-5 w-5" />
                                        <span className="font-semibold">${milestone.amount.value} {milestone.amount.currency}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <HiOutlineCalendar className="h-5 w-5" />
                                        <span>Due: {format(new Date(milestone.dueDate), "MMM dd, yyyy")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <HiOutlineUser className="h-5 w-5" />
                                        <span>{isClient ? "You are the Client" : "You are the Developer"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <StatusBadge status={milestone.status} />
                            </div>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Description */}
                        <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                    <HiOutlineClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h2 className={`text-xl font-bold ${textClr}`}>Milestone Description</h2>
                            </div>
                            <p className={`${textClr} leading-relaxed text-lg`}>
                                {milestone.description}
                            </p>
                        </div>

                        {/* Timeline Information */}
                        <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <HiOutlineCalendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className={`text-xl font-bold ${textClr}`}>Timeline & Progress</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                                    <p className={`text-sm ${subtleText} mb-1`}>Created</p>
                                    <p className={`font-semibold ${textClr}`}>
                                        {format(new Date(milestone.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                                    </p>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                                    <p className={`text-sm ${subtleText} mb-1`}>Due Date</p>
                                    <p className={`font-semibold ${textClr}`}>
                                        {format(new Date(milestone.dueDate), "MMM dd, yyyy")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section - Only show for clients when payment is NOT held/completed */}
                        {isClient && !isPaymentHeld && !isPaymentCompleted && (
                            <PaymentSection
                                milestone={milestone}
                                clientSecret={clientSecret}
                                paymentStatus={paymentStatus}
                                isPaymentHeld={isPaymentHeld}
                                onCreatePaymentIntent={createPaymentIntent}
                                paymentIntentLoading={paymentIntentLoading}
                            />
                        )}

                        {/* Payment Held Status - Show when payment is held but not yet released */}
                        {isClient && isPaymentHeld && !isPaymentCompleted && (
                            <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                        <HiOutlineCheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h2 className={`text-xl font-bold ${textClr}`}>Payment Secured</h2>
                                </div>
                                <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <HiOutlineCheckCircle className="h-6 w-6 text-emerald-600" />
                                        <p className="text-emerald-800 dark:text-emerald-300 font-semibold">
                                            Payment of ${milestone.amount.value} secured in escrow
                                        </p>
                                    </div>
                                    <p className="text-emerald-700 dark:text-emerald-400 text-sm">
                                        Your funds are safely held and will be released to the developer once the milestone is completed and approved.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Payment Details (when payment is completed/released) */}
                        {(isClient || isDeveloper) && isPaymentCompleted && escrowData && (
                            <PaymentDetailsSection escrowData={escrowData} />
                        )}

                        {/* Actions Section */}
                        <MilestoneActions
                            milestone={milestone}
                            projectId={id!}
                            milestoneId={milestoneId!}
                            isClient={isClient}
                            isDeveloper={isDeveloper}
                            paymentStatus={paymentStatus}
                            onRefresh={fetchMilestoneData}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* User Role Info */}
                        <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                    <HiOutlineUser className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className={`text-lg font-semibold ${textClr}`}>Your Role</h3>
                            </div>
                            {isClient && (
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                                    <HiOutlineShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <p className="font-semibold text-blue-900 dark:text-blue-100">Project Client</p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">You can fund and approve milestones</p>
                                    </div>
                                </div>
                            )}
                            {isDeveloper && (
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg">
                                    <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    <div>
                                        <p className="font-semibold text-emerald-900 dark:text-emerald-100">Assigned Developer</p>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-300">You can complete and submit work</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Financial Summary */}
                        <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                    <FaMoneyBillWave className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className={`text-lg font-semibold ${textClr}`}>Financial Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                                    <p className={`text-sm ${subtleText} mb-1`}>Milestone Value</p>
                                    <p className={`text-2xl font-bold ${textClr}`}>
                                        ${milestone.amount.value.toLocaleString()}
                                    </p>
                                    <p className={`text-sm ${subtleText}`}>
                                        {milestone.amount.currency.toUpperCase()}
                                    </p>
                                </div>
                                {escrowData && (
                                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg">
                                        <p className={`text-sm ${subtleText} mb-1`}>Escrow Status</p>
                                        <p className={`font-semibold ${textClr} capitalize`}>
                                            {escrowData.status}
                                        </p>
                                        {escrowData.heldAt && (
                                            <p className={`text-sm ${subtleText}`}>
                                                Secured: {format(new Date(escrowData.heldAt), "MMM dd, yyyy")}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Developer Payout Setup */}
                        {isDeveloper && (
                            <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className={`text-lg font-semibold ${textClr}`}>Payout Setup</h3>
                                </div>
                                <p className={`${subtleText} text-sm mb-4`}>
                                    Configure your payout method to receive payments when milestones are completed.
                                </p>
                                <button
                                    onClick={handleSetupPayout}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <Wallet className="h-4 w-4" />
                                    Setup Payout Account
                                </button>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                    <FaHandshake className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className={`text-lg font-semibold ${textClr}`}>Quick Actions</h3>
                            </div>
                            <div className="space-y-3">
                                <button className={`w-full text-left p-3 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                                    <p className={`font-medium ${textClr}`}>Contact Support</p>
                                    <p className={`text-sm ${subtleText}`}>Get help with this milestone</p>
                                </button>
                                <button className={`w-full text-left p-3 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                                    <p className={`font-medium ${textClr}`}>View Project</p>
                                    <p className={`text-sm ${subtleText}`}>Go back to project details</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Payment Section Component - Only shows when payment is NOT yet held/completed
const PaymentSection: React.FC<{
    milestone: Milestone;
    clientSecret: string | null;
    paymentStatus: PaymentStatus | null;
    isPaymentHeld: boolean;
    onCreatePaymentIntent: () => void;
    paymentIntentLoading: boolean;
}> = ({ milestone, clientSecret, paymentStatus, isPaymentHeld, onCreatePaymentIntent, paymentIntentLoading }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const cardBg = isDark ? "bg-gray-800/30" : "bg-white/60";
    const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
    const textClr = isDark ? "text-gray-100" : "text-gray-900";

    // Safety check: If payment status shows payment is already completed, don't show payment form
    if (paymentStatus?.stripe?.status === 'requires_capture' || paymentStatus?.stripe?.status === 'succeeded') {
        return (
            <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <HiOutlineCheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className={`text-xl font-bold ${textClr}`}>Payment Complete</h2>
                </div>
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <HiOutlineCheckCircle className="h-6 w-6 text-emerald-600" />
                        <p className="text-emerald-800 dark:text-emerald-300 font-semibold">
                            Payment has been processed successfully
                        </p>
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-400 text-sm">
                        Status: {paymentStatus.stripe.status.replace('_', ' ').toUpperCase()}
                    </p>
                </div>
            </div>
        );
    }

    // If no client secret, show button to create payment intent
    if (!clientSecret) {
        return (
            <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className={`text-xl font-bold ${textClr}`}>Secure Payment</h2>
                </div>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <HiOutlineShieldCheck className="h-6 w-6 text-blue-600" />
                        <p className="text-blue-800 dark:text-blue-300 font-semibold">
                            Escrow Protection Available
                        </p>
                    </div>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                        Your payment will be securely held until milestone completion. This protects both you and the developer.
                    </p>
                </div>
                <button
                    onClick={onCreatePaymentIntent}
                    disabled={paymentIntentLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {paymentIntentLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Setting up payment...
                        </>
                    ) : (
                        <>
                            <HiOutlineShieldCheck className="w-5 h-5" />
                            Hold ${milestone.amount.value} in Escrow
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className={`text-xl font-bold ${textClr}`}>Complete Payment</h2>
            </div>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm milestone={milestone} />
            </Elements>
        </div>
    );
};

// Payment Details Section (for completed payments)
const PaymentDetailsSection: React.FC<{ escrowData: EscrowData }> = ({ escrowData }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const cardBg = isDark ? "bg-gray-800/30" : "bg-white/60";
    const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
    const textClr = isDark ? "text-gray-100" : "text-gray-900";
    const subtleText = isDark ? "text-gray-400" : "text-gray-600";

    return (
        <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <HiOutlineCheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className={`text-xl font-bold ${textClr}`}>Payment Transaction</h2>
            </div>
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <p className={`text-sm ${subtleText} mb-1`}>Amount Paid</p>
                            <p className={`text-2xl font-bold ${textClr}`}>
                                ${escrowData.amount.value} {escrowData.amount.currency.toUpperCase()}
                            </p>
                        </div>
                        <div>
                            <p className={`text-sm ${subtleText} mb-1`}>Payment Status</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                {escrowData.status.charAt(0).toUpperCase() + escrowData.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className={`text-sm ${subtleText} mb-1`}>Transaction Date</p>
                            <p className={`font-semibold ${textClr}`}>
                                {format(new Date(escrowData.releasedAt || escrowData.heldAt), "MMM dd, yyyy 'at' HH:mm")}
                            </p>
                        </div>
                        <div>
                            <p className={`text-sm ${subtleText} mb-1`}>Transaction ID</p>
                            <p className={`font-mono text-sm ${textClr} bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded`}>
                                {escrowData.externalId.slice(0, 24)}...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Payment Form Component
const PaymentForm: React.FC<{ milestone: Milestone }> = ({ milestone }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const { id, milestoneId } = useParams();

    const handlePayment = async () => {
        if (!stripe || !elements) {
            toast.error('Payment system not ready');
            return;
        }

        setIsProcessing(true);

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                toast.error('Please fill in all payment details', {
                    description: submitError.message
                });
                return;
            }

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/project/${id}/milestone/${milestoneId}?payment_success=true`,
                },
                redirect: 'if_required'
            });

            if (error) {
                toast.error('Payment Failed', {
                    description: error.message
                });
            } else if (paymentIntent) {
                if (paymentIntent.status === 'requires_capture') {
                    toast.success('Payment successful! Funds are now held in escrow.');
                    setTimeout(() => window.location.reload(), 1500);
                } else if (paymentIntent.status === 'succeeded') {
                    toast.success('Payment completed successfully!');
                    setTimeout(() => window.location.reload(), 1500);
                }
            }
        } catch (err) {
            toast.error('Payment failed', {
                description: err instanceof Error ? err.message : 'Unknown error occurred'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                <PaymentElement
                    options={{
                        layout: 'accordion',
                        paymentMethodOrder: ['card'],
                        wallets: {
                            applePay: 'never',
                            googlePay: 'never'
                        }
                    }}
                />
            </div>
            <button
                onClick={handlePayment}
                disabled={!stripe || !elements || isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <HiOutlineShieldCheck className="w-5 h-5" />
                        Pay ${milestone.amount.value} (Held in Escrow)
                    </>
                )}
            </button>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
                <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">
                    🔒 Your payment will be securely held until milestone completion
                </p>
            </div>
        </div>
    );
};

// Milestone Actions Component
const MilestoneActions: React.FC<{
    milestone: Milestone;
    projectId: string;
    milestoneId: string;
    isClient: boolean;
    isDeveloper: boolean;
    paymentStatus: PaymentStatus | null;
    onRefresh: () => void;
}> = ({ milestone, projectId, milestoneId, isClient, isDeveloper, paymentStatus, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const cardBg = isDark ? "bg-gray-800/30" : "bg-white/60";
    const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
    const textClr = isDark ? "text-gray-100" : "text-gray-900";

    const submitForReview = async () => {
        setLoading(true);
        try {
            const response = await projectHttp.post(`/project/${projectId}/milestone/${milestoneId}/submit`);
            if (response.data.success) {
                toast.success("Milestone submitted for review!");
                onRefresh();
            }
        } catch (error: any) {
            toast.error("Failed to submit milestone for review", {
                description: error?.response?.data?.message ?? error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const completeMilestone = async () => {
        setLoading(true);
        try {
            const response = await projectHttp.post(`/project/${projectId}/milestone/${milestoneId}/complete`);
            if (response.data.success) {
                toast.success("Milestone completed and payment released!");
                onRefresh();
            }
        } catch (error: any) {
            toast.error("Failed to complete milestone", {
                description: error?.response?.data?.message ?? error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const cancelPayment = async () => {
        setLoading(true);
        try {
            const response = await projectHttp.post(`/project/${projectId}/milestone/${milestoneId}/cancel-payment`, {
                reason: "Client requested cancellation"
            });
            if (response.data.success) {
                toast.success("Payment canceled and refunded!");
                onRefresh();
            }
        } catch (error: any) {
            toast.error("Failed to cancel payment", {
                description: error?.response?.data?.message ?? error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isClient && !isDeveloper) return null;

    const isPaymentReady = paymentStatus?.stripe?.status === 'requires_capture';
    const isPaymentCompleted = milestone.status === 'paid';

    // Developer actions
    if (isDeveloper && milestone.status === 'pending') {
        return (
            <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <HiOutlineUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className={`text-xl font-bold ${textClr}`}>Developer Actions</h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                    Submit your completed work for client review and approval.
                </p>
                <button
                    onClick={submitForReview}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <HiOutlineCheckCircle className="w-5 h-5" />
                            Submit for Review
                        </>
                    )}
                </button>
            </div>
        );
    }

    // Client actions
    if (isClient && milestone.status === 'review') {
        return (
            <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <HiOutlineCheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className={`text-xl font-bold ${textClr}`}>Client Review</h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                    Review the submitted work and decide whether to approve and release payment, or request changes.
                </p>

                {!isPaymentReady && (
                    <div className="mb-6 p-4 border rounded-xl text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-2">
                            <HiOutlineExclamationCircle className="h-5 w-5" />
                            <p className="font-medium">Payment required before releasing funds</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={completeMilestone}
                        disabled={loading || !isPaymentReady}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <HiOutlineCheckCircle className="w-5 h-5" />
                                Approve & Release Payment
                            </>
                        )}
                    </button>
                    <button
                        onClick={cancelPayment}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <HiOutlineExclamationCircle className="w-5 h-5" />
                        Cancel & Refund
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
