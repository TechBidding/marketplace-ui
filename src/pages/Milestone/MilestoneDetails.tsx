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
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

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

const stripePromise = loadStripe("pk_test_51RPo6QPMtzL2tarJuOxlonEQZz1eWtPi8zjckd723w1yxcdQbVIzsueNMylT0Cgbv4HuJz6qQugogWL9bLMJCcHy00otb4Bw7M");

export const MilestoneDetails = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const bgPage = isDark ? "bg-neutral-950" : "bg-gray-100";
    const bgCard = isDark ? "bg-neutral-900" : "bg-white";
    const borderClr = isDark ? "border-neutral-700" : "border-gray-300";
    const ringClr = isDark ? "ring-neutral-800" : "ring-gray-100";
    const textClr = isDark ? "text-gray-200" : "text-gray-800";
    const subtleText = isDark ? "text-gray-400" : "text-gray-500";

    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const { id, milestoneId } = useParams();

    useEffect(() => {
        const fetchMilestoneAndSecret = async () => {
            if (!id || !milestoneId) return;
            setLoading(true);
            try {
                const res = await projectHttp.get(`project/${id}/milestone/${milestoneId}`);
                const milestoneData = res.data.data.milestone;
                setMilestone(milestoneData);

                // Fetch clientSecret after milestone is loaded
                const amountCents = Math.round(milestoneData.amount.value * 100);
                const { data } = await projectHttp.post('/payments/intent', {
                    milestoneId,
                    amount: amountCents,
                    currency: 'usd',
                    devAccountId: id
                });
                setClientSecret(data.clientSecret);
                toast.success("Milestone and payment intent loaded");
            } catch (err: any) {
                toast.error("Error fetching milestone or payment intent", {
                    description: err?.response?.data?.message ?? err.message,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMilestoneAndSecret();
    }, [id, milestoneId]);

    const handleClick = async () => {
        const { data } = await projectHttp.post('payments/connect');
        window.location.href = data.onboardingUrl;
    };

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
                className={`w-full md:w-3/4 rounded-2xl shadow-sm ${ringClr} px-6 md:px-10 py-6 md:py-8`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between pb-6 border-b ${borderClr}`}>
                    <h1 className={`text-3xl font-bold tracking-tight ${textClr}`}>
                        {milestone.title}
                    </h1>
                    <StatusBadge status={milestone.status} />
                </div>

                <button
                    className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                    onClick={handleClick}
                >
                    Set-up payouts
                </button>

                {/* Stripe Payment */}
                {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm
                            milestone={milestone}
                            milestoneId={milestoneId!}
                            id={id!}
                        />
                    </Elements>
                )}

                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 text-sm font-medium">
                    {/* Main content */}
                    <div className="space-y-8 md:col-span-2">
                        <section>
                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p className={`${subtleText}`}>{milestone.description}</p>
                        </section>
                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Due Date: {format(new Date(milestone.dueDate), "PPP")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span>
                                    Budget: {milestone.amount.value} {milestone.amount.currency}
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
                                    <span className={subtleText}>
                                        Created: {format(new Date(milestone.createdAt), "PPP")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span className={subtleText}>
                                        Updated: {format(new Date(milestone.updatedAt), "PPP")}
                                    </span>
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
};

const PaymentForm = ({ milestone, milestoneId, id }: {
    milestone: Milestone | null;
    milestoneId: string;
    id: string;
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const pay = async () => {
        try {
            if (!stripe || !elements) {
                toast.error('Stripe has not been initialized');
                return;
            }

            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/milestone/${milestoneId}`,
                }
            });

            if (error) {
                console.log("Error: ", error);
                toast.error('Payment failed', {
                    description: error.message
                });
            }
        } catch (err) {
            console.error("Error: ", err);
            toast.error('Payment failed', {
                description: err instanceof Error ? err.message : 'Unknown error occurred'
            });
        }
    };

    return (
        <div className="space-y-4 mt-6">
            <PaymentElement />
            <button
                onClick={pay}
                className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            >
                Pay ${milestone?.amount.value}
            </button>
        </div>
    );
};
