import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "./theme-provider";
import { toast } from "sonner";
import { projectHttp } from "@/utility/api";
import { useParams } from "react-router-dom";
import {
    HiOutlineSparkles,
    HiOutlineCalendar,
    HiOutlineCurrencyDollar,
    HiOutlineClipboardList,
    HiOutlineHashtag,
    HiOutlineDocumentText,
    HiOutlineX
} from "react-icons/hi";

const createMilestoneSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    dueDate: z.coerce.date({ required_error: "Due Date is required" }),
    status: z
        .enum(["draft", "approved", "pending", "review", "paid", "disputed"])
        .optional()
        .default("draft"),
    amount: z.object({
        currency: z.enum(["USD", "INR", "EUR"]),
        value: z.coerce.number().min(0, "Amount must be non-negative"),
    }),
    position: z.coerce.number({ invalid_type_error: "Position is required" }).min(0, "Position must be a non-negative number"),
});

export type ICreateMilestoneSchema = z.infer<typeof createMilestoneSchema>;

interface CreateMilestoneProps {
    onClose: () => void;
}

export const CreateMilestone = ({ onClose }: CreateMilestoneProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Modern color scheme matching DevHome
    const bgOverlay = isDark ? "bg-black/60 backdrop-blur-sm" : "bg-black/40 backdrop-blur-sm";
    const bgCard = isDark ? "bg-gray-800/95 backdrop-blur-xl" : "bg-white/95 backdrop-blur-xl";
    const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
    const textClr = isDark ? "text-gray-100" : "text-gray-900";
    const subtleText = isDark ? "text-gray-400" : "text-gray-600";
    const inputBg = isDark ? "bg-gray-900/50" : "bg-gray-50/50";
    const inputBorder = isDark ? "border-gray-700" : "border-gray-200";
    const inputFocus = "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ICreateMilestoneSchema>({
        resolver: zodResolver(createMilestoneSchema),
        defaultValues: {
            title: "",
            description: "",
            dueDate: new Date(),
            status: "draft",
            amount: {
                currency: "USD",
                value: 0,
            },
            position: 0,
        },
    });

    const params = useParams();

    async function onSubmit(data: ICreateMilestoneSchema) {
        try {
            await projectHttp.post(`project/${params.id}/milestone`, data);
            toast.success("Milestone created successfully");
            onClose();
        } catch (error: any) {
            toast.error("Error creating milestone", {
                description: error.response?.data?.message || error.message,
            });
        }
    }

    const FormField = ({ label, icon, error, children }: any) => (
        <div className="space-y-3">
            <label className={`flex items-center gap-2 text-sm font-medium ${textClr}`}>
                {icon}
                {label}
            </label>
            {children}
            {error && (
                <p className="flex items-center gap-1 text-sm text-red-500 font-medium">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {error}
                </p>
            )}
        </div>
    );

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${bgOverlay}`}>
            <div
                className={`relative w-full max-w-2xl ${bgCard} rounded-3xl border ${borderClr} shadow-2xl overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with gradient */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 px-8 py-6">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <HiOutlineSparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Create Milestone</h2>
                                <p className="text-white/80 text-sm">Define project deliverables and payment terms</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200 text-white/80 hover:text-white"
                        >
                            <HiOutlineX className="w-6 h-6" />
                        </button>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <FormField
                                    label="Milestone Title"
                                    icon={<HiOutlineClipboardList className="w-4 h-4 text-indigo-500" />}
                                    error={errors.title?.message}
                                >
                                    <input
                                        id="title"
                                        type="text"
                                        {...register("title")}
                                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${inputBg} ${inputBorder} ${inputFocus} ${textClr} placeholder-gray-400`}
                                        placeholder="e.g., Homepage Design Completion"
                                    />
                                </FormField>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <FormField
                                    label="Description"
                                    icon={<HiOutlineDocumentText className="w-4 h-4 text-emerald-500" />}
                                    error={errors.description?.message}
                                >
                                    <textarea
                                        id="description"
                                        rows={4}
                                        {...register("description")}
                                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${inputBg} ${inputBorder} ${inputFocus} ${textClr} placeholder-gray-400 resize-none`}
                                        placeholder="Describe what will be delivered in this milestone..."
                                    />
                                </FormField>
                            </div>

                            {/* Due Date */}
                            <FormField
                                label="Due Date"
                                icon={<HiOutlineCalendar className="w-4 h-4 text-orange-500" />}
                                error={errors.dueDate?.message}
                            >
                                <input
                                    id="dueDate"
                                    type="date"
                                    {...register("dueDate")}
                                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${inputBg} ${inputBorder} ${inputFocus} ${textClr}`}
                                />
                            </FormField>

                            {/* Position */}
                            <FormField
                                label="Milestone Order"
                                icon={<HiOutlineHashtag className="w-4 h-4 text-purple-500" />}
                                error={errors.position?.message}
                            >
                                <input
                                    id="position"
                                    type="number"
                                    min="0"
                                    {...register("position", { valueAsNumber: true })}
                                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${inputBg} ${inputBorder} ${inputFocus} ${textClr} placeholder-gray-400`}
                                    placeholder="1"
                                />
                            </FormField>

                            {/* Amount Section */}
                            <div className="md:col-span-2">
                                <FormField
                                    label="Payment Amount"
                                    icon={<HiOutlineCurrencyDollar className="w-4 h-4 text-green-500" />}
                                    error={errors.amount?.value?.message || errors.amount?.currency?.message}
                                >
                                    <div className="grid grid-cols-3 gap-3">
                                        <select
                                            {...register("amount.currency")}
                                            className={`px-4 py-3 rounded-xl border transition-all duration-200 ${inputBg} ${inputBorder} ${inputFocus} ${textClr}`}
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="INR">INR (₹)</option>
                                        </select>
                                        <div className="col-span-2">
                                            <input
                                                id="amountValue"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...register("amount.value", { valueAsNumber: true })}
                                                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${inputBg} ${inputBorder} ${inputFocus} ${textClr} placeholder-gray-400`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </FormField>
                            </div>
                        </div>

                        {/* Hidden Status */}
                        <input type="hidden" {...register("status")} />

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200/20">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${isDark
                                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-200'
                                    } transform hover:-translate-y-0.5 hover:shadow-lg`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:hover:transform-none disabled:hover:shadow-none disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <HiOutlineSparkles className="w-4 h-4" />
                                        Create Milestone
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};