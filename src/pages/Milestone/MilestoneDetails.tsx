"use client";

import React, { useEffect, useState, useRef } from "react";
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

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
    const [paymentIntentLoading, setPaymentIntentLoading] = useState(false); // Prevent duplicate calls
    const paymentIntentTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Debounce ref

    const { id, milestoneId } = useParams();

    useEffect(() => {
        const fetchMilestoneAndSecret = async () => {
            if (!id || !milestoneId || paymentIntentLoading) return; // Prevent duplicate calls
            setLoading(true);
            try {
                const res = await projectHttp.get(`project/${id}/milestone/${milestoneId}`);
                const milestoneData = res.data.data.milestone;
                setMilestone(milestoneData);

                // Check if this is a return from successful payment
                const urlParams = new URLSearchParams(window.location.search);
                const paymentSuccess = urlParams.get('payment_success');

                if (paymentSuccess === 'true') {
                    toast.success("Payment processed successfully!");
                    // Clean up URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                // Only create a new payment intent if milestone is not already paid
                if (milestoneData.status !== 'completed' && !paymentIntentLoading) {
                    setPaymentIntentLoading(true); // Prevent duplicate calls
                    try {
                        // First, check if there's already an existing payment intent
                            const statusResponse = await projectHttp.get(`/payments/status/${milestoneId}`);

                        if (statusResponse.data.success && statusResponse.data.data?.stripe?.client_secret) {
                            // Use existing payment intent
                            setClientSecret(statusResponse.data.data.stripe.client_secret);
                            toast.success("Existing payment intent loaded");
                        } else {
                            // Create new payment intent only if none exists
                            const amountCents = Math.round(milestoneData.amount.value * 100);
                            const { data } = await projectHttp.post('/payments/intent', {
                                milestoneId,
                                amount: amountCents,
                                currency: 'usd',
                                devAccountId: id
                            });     
                            setClientSecret(data.clientSecret);
                            toast.success("New payment intent created");
                        }
                    } catch (paymentError) {
                        // Fallback: create new payment intent
                        try {
                            const amountCents = Math.round(milestoneData.amount.value * 100);
                            const { data } = await projectHttp.post('/payments/intent', {
                                milestoneId,
                                amount: amountCents,
                                currency: 'usd',
                                devAccountId: id
                            });
                            setClientSecret(data.clientSecret);
                            toast.success("Payment intent created (fallback)");
                        } catch (fallbackError) {
                            toast.error("Failed to create payment intent");
                        }
                    }
                } else {
                    toast.info("This milestone has already been completed");
                }
            } catch (err: any) {
                toast.error("Error fetching milestone or payment intent", {
                    description: err?.response?.data?.message ?? err.message,
                });
            } finally {
                setLoading(false);
                setPaymentIntentLoading(false); // Reset payment intent loading
            }
        };

        let isCancelled = false;

        fetchMilestoneAndSecret().then(() => {
            if (isCancelled) {
            }
        });

        // Cleanup function to prevent updates after unmount
        return () => {
            isCancelled = true;
            if (paymentIntentTimeoutRef.current) {
                clearTimeout(paymentIntentTimeoutRef.current);
            }
        };
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
                {clientSecret && milestone.status !== 'completed' && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm
                            milestone={milestone}
                            milestoneId={milestoneId!}
                            id={id!}
                        />
                    </Elements>
                )}

                {milestone.status === 'completed' && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <div className="text-green-600 font-medium">
                                ✅ This milestone has been completed and paid.
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons for Different User Types */}
                <MilestoneActions
                    milestone={milestone}
                    projectId={id!}
                    milestoneId={milestoneId!}
                />

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

const MilestoneActions = ({ milestone, projectId, milestoneId }: {
    milestone: Milestone;
    projectId: string;
    milestoneId: string;
}) => {
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<any>(null);

    useEffect(() => {
        fetchPaymentStatus();
    }, [milestoneId]);

    const fetchPaymentStatus = async () => {
        try {
            const response = await projectHttp.get(`/payments/status/${milestoneId}`);
            if (response.data.success) {
                setPaymentStatus(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch payment status:', error);
        }
    };

    const submitForReview = async () => {
        setLoading(true);
        try {
            const response = await projectHttp.post(`/project/${projectId}/milestone/${milestoneId}/submit`);
            if (response.data.success) {
                toast.success("Milestone submitted for review!");
                window.location.reload(); // Refresh to show updated status
            } else {
                toast.error("Failed to submit milestone for review");
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
                toast.success("Milestone completed and payment captured!");
                window.location.reload(); // Refresh to show updated status
            } else {
                toast.error("Failed to complete milestone");
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
                window.location.reload(); // Refresh to show updated status
            } else {
                toast.error("Failed to cancel payment");
            }
        } catch (error: any) {
            toast.error("Failed to cancel payment", {
                description: error?.response?.data?.message ?? error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    // Check if payment is actually ready for capture
    const isPaymentReady = paymentStatus?.stripe?.status === 'requires_capture';
    const paymentNotComplete = paymentStatus?.stripe?.status === 'requires_payment_method';

    // Show payment status info if available
    const PaymentStatusInfo = () => {
        if (!paymentStatus?.stripe) return null;

        const statusMessages: Record<string, { message: string; color: string }> = {
            'requires_payment_method': {
                message: 'Payment not completed yet. Customer needs to complete payment first.',
                color: 'text-amber-600 bg-amber-50 border-amber-200'
            },
            'requires_capture': {
                message: 'Payment completed and ready for capture.',
                color: 'text-green-600 bg-green-50 border-green-200'
            },
            'succeeded': {
                message: 'Payment successfully captured.',
                color: 'text-green-600 bg-green-50 border-green-200'
            },
            'canceled': {
                message: 'Payment was canceled.',
                color: 'text-red-600 bg-red-50 border-red-200'
            }
        };

        const statusInfo = statusMessages[paymentStatus.stripe.status] || {
            message: `Payment status: ${paymentStatus.stripe.status}`,
            color: 'text-gray-600 bg-gray-50 border-gray-200'
        };

        return (
            <div className={`mb-4 p-3 border rounded-lg ${statusInfo.color}`}>
                <p className="text-sm font-medium">
                    💳 {statusInfo.message}
                </p>
            </div>
        );
    };

    // Show different actions based on milestone status
    if (milestone.status === 'pending') {
        return (
            <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Developer Actions</h3>
                <PaymentStatusInfo />
                <p className="text-sm text-gray-600 mb-4">
                    Submit your completed work for client review.
                </p>
                <button
                    onClick={submitForReview}
                    disabled={loading}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Submitting...
                        </div>
                    ) : (
                        'Submit for Review'
                    )}
                </button>
            </div>
        );
    }

    if (milestone.status === 'review') {
        return (
            <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Client Actions</h3>
                <PaymentStatusInfo />
                <p className="text-sm text-gray-600 mb-4">
                    Review the submitted work and approve to release payment, or cancel to refund.
                </p>

                {paymentNotComplete && (
                    <div className="mb-4 p-3 border rounded-lg text-amber-600 bg-amber-50 border-amber-200">
                        <p className="text-sm font-medium">
                            ⚠️ Cannot capture payment - customer hasn't completed payment yet.
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={completeMilestone}
                        disabled={loading || !isPaymentReady}
                        className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Processing...
                            </div>
                        ) : (
                            'Approve & Release Payment'
                        )}
                    </button>
                    <button
                        onClick={cancelPayment}
                        disabled={loading}
                        className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Processing...
                            </div>
                        ) : (
                            'Cancel & Refund'
                        )}
                    </button>
                </div>

                {!isPaymentReady && !paymentNotComplete && (
                    <p className="text-sm text-gray-500 mt-2">
                        Payment capture is only available when payment status is "requires_capture"
                    </p>
                )}
            </div>
        );
    }

    return null; // No actions for other statuses
};

const PaymentForm = ({ milestone, milestoneId, id }: {
    milestone: Milestone | null;
    milestoneId: string;
    id: string;
}) => {

    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);


    const pay = async () => {
        try {
            if (!stripe || !elements) {
                toast.error('Stripe has not been initialized');
                return;
            }

            setIsProcessing(true);

            // Check if all required fields are filled
            const { error: submitError } = await elements.submit();

            if (submitError) {
                toast.error('Please fill in all payment details', {
                    description: submitError.message
                });
                setIsProcessing(false);
                return;
            }

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/project/${id}/milestone/${milestoneId}?payment_success=true`,
                },
                redirect: 'if_required' // Only redirect if 3D Secure or similar is needed
            });

            if (error) {
                // More specific error messages
                if (error.type === 'card_error') {
                    toast.error('Card Error', {
                        description: error.message
                    });
                } else if (error.type === 'validation_error') {
                    toast.error('Validation Error', {
                        description: error.message
                    });
                } else {
                    toast.error('Payment Failed', {
                        description: error.message
                    });
                }
            } else if (paymentIntent) {
                if (paymentIntent.status === 'requires_capture') {
                    toast.success('Payment successful! Ready for capture.');
                } else if (paymentIntent.status === 'succeeded') {
                    toast.success('Payment completed successfully!');
                } else {
                    toast.info(`Payment status: ${paymentIntent.status}`);
                }

                window.location.reload();
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
        <div className="space-y-4 mt-6">
            <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
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
                onClick={pay}
                disabled={!stripe || !elements || isProcessing}
                className="w-full rounded-md bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
                {isProcessing ? (
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing Payment...
                    </div>
                ) : (
                    `Pay $${milestone?.amount.value}`
                )}
            </button>
        </div>
    );
};
