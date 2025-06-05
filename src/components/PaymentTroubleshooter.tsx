import React, { useState } from "react";
import { projectHttp } from "@/utility/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

interface PaymentTroubleshooterProps {
    milestoneId: string;
}

export const PaymentTroubleshooter: React.FC<PaymentTroubleshooterProps> = ({
    milestoneId
}) => {
    const [checking, setChecking] = useState(false);
    const [results, setResults] = useState<any>(null);

    const runDiagnostics = async () => {
        setChecking(true);
        try {
            // Get current payment status
            const statusResponse = await projectHttp.get(`/payments/status/${milestoneId}`);

            // Sync with Stripe
            const syncResponse = await projectHttp.post(`/payments/sync/${milestoneId}`);

            const diagnostics = {
                timestamp: new Date().toISOString(),
                paymentStatus: statusResponse.data.data,
                syncResult: syncResponse.data,
                issues: [],
                recommendations: []
            };

            // Analyze issues
            const stripe = diagnostics.paymentStatus?.stripe;
            const milestone = diagnostics.paymentStatus?.milestone;
            const escrow = diagnostics.paymentStatus?.escrow;

            if (!stripe) {
                diagnostics.issues.push("❌ No Stripe payment intent found");
                diagnostics.recommendations.push("Customer needs to attempt payment first");
            } else {
                if (stripe.status === 'requires_payment_method') {
                    diagnostics.issues.push("❌ Customer hasn't completed payment");
                    diagnostics.recommendations.push("Ask customer to fill out payment form and click 'Pay'");
                }

                if (stripe.status === 'requires_action') {
                    diagnostics.issues.push("⚠️ Payment requires additional authentication");
                    diagnostics.recommendations.push("Customer needs to complete 3D Secure or similar verification");
                }

                if (stripe.status === 'processing') {
                    diagnostics.issues.push("⏳ Payment is being processed");
                    diagnostics.recommendations.push("Wait for payment to complete processing");
                }

                if (stripe.status === 'requires_capture') {
                    diagnostics.issues.push("✅ Payment successful and ready for capture");
                }

                if (stripe.status === 'succeeded') {
                    diagnostics.issues.push("✅ Payment already captured");
                }
            }

            // Check webhook delivery
            if (stripe?.status === 'requires_capture' && milestone?.status !== 'pending') {
                diagnostics.issues.push("⚠️ Webhook may not have been received");
                diagnostics.recommendations.push("Check webhook endpoint configuration");
            }

            setResults(diagnostics);
        } catch (error: any) {
            toast.error("Diagnostics failed", {
                description: error?.response?.data?.message ?? error.message,
            });
        } finally {
            setChecking(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'requires_payment_method':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'requires_action':
            case 'processing':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'requires_capture':
            case 'succeeded':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Payment Troubleshooter
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-3">
                            If the customer clicked "Pay" but the payment status hasn't updated,
                            run diagnostics to identify the issue.
                        </p>

                        <Button
                            onClick={runDiagnostics}
                            disabled={checking}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {checking ? "Running Diagnostics..." : "Run Diagnostics"}
                        </Button>
                    </div>

                    {results && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Current Status */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-700">Current Status</h4>

                                    {results.paymentStatus?.stripe && (
                                        <div className="flex items-center gap-2 text-sm">
                                            {getStatusIcon(results.paymentStatus.stripe.status)}
                                            <span>
                                                Stripe: {results.paymentStatus.stripe.status}
                                            </span>
                                        </div>
                                    )}

                                    {results.paymentStatus?.milestone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                                                M
                                            </span>
                                            <span>
                                                Milestone: {results.paymentStatus.milestone.status}
                                            </span>
                                        </div>
                                    )}

                                    {results.paymentStatus?.escrow && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="w-5 h-5 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">
                                                E
                                            </span>
                                            <span>
                                                Escrow: {results.paymentStatus.escrow.status}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Issues Found */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-700">Issues Found</h4>
                                    {results.issues.length === 0 ? (
                                        <p className="text-sm text-green-600">No issues detected</p>
                                    ) : (
                                        <ul className="space-y-1 text-sm">
                                            {results.issues.map((issue: string, index: number) => (
                                                <li key={index} className="text-gray-700">
                                                    {issue}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Recommendations */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-700">Next Steps</h4>
                                    {results.recommendations.length === 0 ? (
                                        <p className="text-sm text-green-600">Everything looks good!</p>
                                    ) : (
                                        <ul className="space-y-1 text-sm">
                                            {results.recommendations.map((rec: string, index: number) => (
                                                <li key={index} className="text-gray-700">
                                                    • {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Common Solutions */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h5 className="font-semibold text-blue-800 mb-2">
                                    Common Solutions:
                                </h5>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• <strong>Customer sees error:</strong> Check card details, try different card</li>
                                    <li>• <strong>3D Secure popup:</strong> Customer must complete authentication</li>
                                    <li>• <strong>Processing stuck:</strong> Wait 1-2 minutes, then refresh</li>
                                    <li>• <strong>Webhook issues:</strong> Check server logs and Stripe dashboard</li>
                                    <li>• <strong>Status not updating:</strong> Use "Sync with Stripe" button</li>
                                </ul>
                            </div>

                            <div className="text-xs text-gray-500">
                                Last checked: {new Date(results.timestamp).toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}; 