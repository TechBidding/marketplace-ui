import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "./theme-provider";
import { toast } from "sonner";
import { projectHttp } from "@/utility/api";
import { useParams } from "react-router-dom";

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
    const bgCard = isDark ? "bg-neutral-900" : "bg-white";
    const textClr = isDark ? "text-gray-200" : "text-gray-800";
    const borderClr = isDark ? "border-neutral-700" : "border-gray-300";
    const inputBg = isDark ? "bg-neutral-800" : "bg-white";
    const primaryBtn = isDark
        ? "bg-neutral-700 hover:bg-neutral-600 text-emerald-200"
        : "bg-amber-100 hover:bg-amber-200 text-amber-700";
    const dangerBtn = isDark
        ? "bg-red-700 hover:bg-red-600 text-red-200"
        : "bg-red-100 hover:bg-red-200 text-red-700";

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

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>
            <div
                className={`relative z-10 w-full max-w-md p-6 rounded-xl shadow-lg ${bgCard} ${textClr} border ${borderClr}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">Create Milestone</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className="font-medium">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            {...register("title")}
                            className={`w-full rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none`}
                            placeholder="Enter milestone title"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description" className="font-medium">
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            {...register("description")}
                            className={`w-full rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none`}
                            placeholder="Enter milestone description"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Due Date */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="dueDate" className="font-medium">
                            Due Date
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            {...register("dueDate")}
                            className={`w-full rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none`}
                        />
                        {errors.dueDate && (
                            <p className="text-sm text-red-500">{errors.dueDate.message}</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col gap-2">
                        <label className="font-medium">Amount</label>
                        <div className="flex gap-2">
                            <select
                                id="currency"
                                {...register("amount.currency")}
                                className={`w-1/3 rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none`}
                            >
                                <option value="USD">USD</option>
                                <option value="INR">INR</option>
                                <option value="EUR">EUR</option>
                            </select>
                            <input
                                id="amountValue"
                                type="number"
                                step="0.01"
                                {...register("amount.value", { valueAsNumber: true })}
                                className={`w-2/3 rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none`}
                                placeholder="Value"
                            />
                        </div>
                        {errors.amount?.value && (
                            <p className="text-sm text-red-500">
                                {errors.amount.value.message}
                            </p>
                        )}
                        {errors.amount?.currency && (
                            <p className="text-sm text-red-500">
                                {errors.amount.currency.message}
                            </p>
                        )}
                    </div>

                    {/* Position */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="position" className="font-medium">
                            Position
                        </label>
                        <input
                            id="position"
                            type="number"
                            {...register("position", { valueAsNumber: true })}
                            className={`w-full rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none`}
                            placeholder="Enter position number"
                        />
                        {errors.position && (
                            <p className="text-sm text-red-500">
                                {errors.position.message}
                            </p>
                        )}
                    </div>

                    {/* Hidden Status - defaults to draft */}
                    <input type="hidden" {...register("status")} />

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded-md font-medium ${dangerBtn} cursor-pointer`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded-md font-medium ${primaryBtn} cursor-pointer`}
                        >
                            {isSubmitting ? "Creating..." : "Create Milestone"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};