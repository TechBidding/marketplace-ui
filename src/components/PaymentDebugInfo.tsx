import React, { useState, useEffect } from "react";
import { projectHttp } from "@/utility/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentDebugInfoProps {
    milestoneId: string;
}

export const PaymentDebugInfo: React.FC<PaymentDebugInfoProps> = ({ milestoneId }) => {
    const [paymentStatus, setPaymentStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const fetchPaymentStatus = async () => {
        setLoading(true);
        try {
            const response = await projectHttp.get(`/payments/status/${milestoneId}`);
            if (response.data.success) {
                setPaymentStatus(response.data.data);
            }
        } catch (error: any) {
            toast.error("Failed to fetch payment status", {
                description: error?.response?.data?.message ?? error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const syncPaymentStatus = async () => {
        setSyncing(true);
        try {
            const response = await projectHttp.post(`/payments/sync/${milestoneId}`);
            if (response.data.success) {
                toast.success("Payment status synced successfully!");
                await fetchPaymentStatus(); // Refresh after sync
            } else {
                toast.error("Failed to sync payment status");
            }
        } catch (error: any) {
            toast.error("Failed to sync payment status", {
                description: error?.response?.data?.message ?? error.message,
            });
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchPaymentStatus();
    }, [milestoneId]);

    if (loading && !paymentStatus) {
        return (
            <Card className="mt-4">
                <CardContent className="p-4">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading payment status...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!paymentStatus) {
        return (
            <Card className="mt-4">
                <CardContent className="p-4">
                    <p className="text-gray-500">No payment status available</p>
                </CardContent>
            </Card>
        );
    }

    const getStatusBadge = (status: string, type: 'milestone' | 'escrow' | 'stripe') => {
        const colorMap: Record<string, string> = {
            // Milestone statuses
            draft: "bg-gray-500",
            pending: "bg-amber-500",
            review: "bg-blue-500",
            paid: "bg-green-500",
            completed: "bg-emerald-600",

            // Escrow statuses
            held: "bg-yellow-500",
            released: "bg-green-500",
            refunded: "bg-red-500",
            failed: "bg-red-600",

            // Stripe statuses
            requires_payment_method: "bg-amber-500",
            requires_capture: "bg-blue-500",
            succeeded: "bg-green-500",
            canceled: "bg-red-500"
        };

        // const color = colorMap[status] || "bg-gray-500";

        return (
            // <Badge className={`${color} text-white text-xs`}>
                {status}
            // {/* </Badge> */}
        );
    };

    return (
        <Card className="mt-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Payment Debug Information</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            onClick={fetchPaymentStatus}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                        </Button>
                        <Button
                            onClick={syncPaymentStatus}
                            disabled={syncing}
                            variant="outline"
                            size="sm"
                        >
                            {syncing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Syncing...
                                </>
                            ) : (
                                'Sync with Stripe'
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {/* Milestone Status */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">Milestone</h4>
                        {paymentStatus.milestone ? (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span>Status:</span>
                                    {/* {getStatusBadge(paymentStatus.milestone.status, 'milestone')} */}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Amount:</span>
                                    <span>{paymentStatus.milestone.amount?.value} {paymentStatus.milestone.amount?.currency}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>ID:</span>
                                    <span className="text-xs text-gray-500 truncate" title={paymentStatus.milestone.id}>
                                        {paymentStatus.milestone.id?.slice(-8)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No milestone data</p>
                        )}
                    </div>

                    {/* Escrow Status */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">Escrow</h4>
                        {paymentStatus.escrow ? (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span>Status:</span>
                                    {/* {getStatusBadge(paymentStatus.escrow.status, 'escrow')} */}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Amount:</span>
                                    <span>{paymentStatus.escrow.amount?.value} {paymentStatus.escrow.amount?.currency}</span>
                                </div>
                                {paymentStatus.escrow.heldAt && (
                                    <div className="flex items-center justify-between">
                                        <span>Held:</span>
                                        <span className="text-xs">{new Date(paymentStatus.escrow.heldAt).toLocaleString()}</span>
                                    </div>
                                )}
                                {paymentStatus.escrow.releasedAt && (
                                    <div className="flex items-center justify-between">
                                        <span>Released:</span>
                                        <span className="text-xs">{new Date(paymentStatus.escrow.releasedAt).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">No escrow data</p>
                        )}
                    </div>

                    {/* Stripe Status */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">Stripe</h4>
                        {paymentStatus.stripe ? (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span>Status:</span>
                                    {/* {getStatusBadge(paymentStatus.stripe.status, 'stripe')} */}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Capture:</span>
                                    <span className="text-xs">{paymentStatus.stripe.captureMethod}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Amount:</span>
                                    <span>{paymentStatus.stripe.amount / 100} {paymentStatus.stripe.currency?.toUpperCase()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Intent ID:</span>
                                    <span className="text-xs text-gray-500 truncate" title={paymentStatus.stripe.id}>
                                        {paymentStatus.stripe.id?.slice(-8)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No Stripe data</p>
                        )}
                    </div>
                </div>

                {/* Status Explanations */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-700 mb-2">Status Guide:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                            <strong>Stripe Status:</strong>
                            <ul className="mt-1 space-y-1">
                                <li>• requires_payment_method: Payment not completed</li>
                                <li>• requires_capture: Ready for capture</li>
                                <li>• succeeded: Payment captured</li>
                            </ul>
                        </div>
                        <div>
                            <strong>Expected Flow:</strong>
                            <ul className="mt-1 space-y-1">
                                <li>• Customer pays → requires_capture</li>
                                <li>• Work submitted → review status</li>
                                <li>• Client approves → capture payment</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 