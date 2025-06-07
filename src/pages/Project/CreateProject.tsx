import React, { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "../../components/theme-provider";
import { ServiceEnum, SkillEnum } from "../../utility/contants";
import { createProjectSchema } from "@/utility/Schema/createProjectSchema";
import { projectHttp } from "@/utility/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
    HiOutlineClipboardList,
    HiOutlineCurrencyDollar,
    HiOutlineCalendar,
    HiOutlinePhotograph,
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineTag,
    HiOutlineCode
} from "react-icons/hi";
import { FaProjectDiagram, FaTools } from "react-icons/fa";
import { Loader2 } from "lucide-react";

export type ICreateProjectSchema = z.infer<typeof createProjectSchema>;

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    htmlFor?: string;
    error?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    htmlFor,
    error,
    children,
    icon,
    className = "",
    ...rest
}) => (
    <div className={`space-y-2 ${className}`} {...rest}>
        <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {icon && <span className="text-indigo-500">{icon}</span>}
            {label}
        </label>
        {children}
        {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {error}
            </div>
        )}
    </div>
);

export default function CreateProjectPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ICreateProjectSchema>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            serviceType: [],
            requiredSkills: [],
            requirements: [],
            projectIds: [],
        },
    });
    const { fields, append, remove } = useFieldArray({ name: "requirements", control });

    /* ----------------------------- image ------------------------------ */
    const imgRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const handleImageClick = () => imgRef.current?.click();
    const navigate = useNavigate();

    /* ----------------------- theme utilities -------------------------- */
    const bgPage = isDark ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 via-white to-gray-100";
    const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
    const inputBg = isDark ? "bg-gray-700/50" : "bg-white";
    const borderClr = isDark ? "border-gray-600/50" : "border-gray-200/50";
    const textClr = isDark ? "text-gray-100" : "text-gray-900";
    const subtleText = isDark ? "text-gray-400" : "text-gray-600";
    const cardBg = isDark ? "bg-gray-800/30" : "bg-white/60";

    async function onSubmit(data: ICreateProjectSchema) {
        if (!file) {
            toast.error("Please select a project image");
            return;
        }

        const fd = new FormData();

        /* -------------- primitives ---------------- */
        fd.append("title", data.title);
        fd.append("description", data.description);
        fd.append("deadline", data.deadline.toISOString());

        /* -------------- pricing (object) ---------- */
        fd.append("pricing.currency", data.pricing.currency);
        fd.append("pricing.amount", data.pricing.amount.toString());

        /* -------------- arrays -------------------- */
        data.serviceType.forEach(s => fd.append("serviceType", s));
        data.requiredSkills.forEach(s => fd.append("requiredSkills", s));
        data.requirements?.forEach(r => fd.append("requirements", r));
        data.projectIds?.forEach(id => fd.append("projectIds", id));

        /* -------------- file ---------------------- */
        fd.append("image", file);

        try {
            const res = await projectHttp.post("/project", fd);
            const resData = res.data;
            navigate(`/projects/${resData.data._id}`);
            toast.success("Project created successfully!", {
                description: "Your project is now live and ready for bids."
            });
        } catch (err: any) {
            toast.error("Failed to create project", {
                description: err.response?.data?.message || "Please try again"
            });
        }
    }

    const serviceOptions = Object.values(ServiceEnum);
    const skillOptions = Object.values(SkillEnum);

    return (
        <div className={`min-h-screen ${bgPage} py-8 px-4`}>
            <div className="max-w-5xl mx-auto">
                {/* Hero Header */}
                <div className={`relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl mb-8 px-8 py-12`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <FaProjectDiagram className="h-8 w-8 text-white/80" />
                            <span className="text-white/80 font-medium">New Project</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                            Create Your Project
                        </h1>
                        <p className="text-white/90 text-lg max-w-2xl">
                            Tell us about your project and connect with talented developers ready to bring your vision to life.
                        </p>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Information */}
                    <div className={`${bgCard} rounded-2xl shadow-xl border ${borderClr} overflow-hidden`}>
                        <div className="px-8 py-6 border-b border-gray-200/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                    <HiOutlineClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h2 className={`text-xl font-bold ${textClr}`}>Basic Information</h2>
                            </div>
                            <p className={`mt-2 ${subtleText}`}>Start with the fundamentals of your project</p>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Project Title */}
                            <FormField
                                label="Project Title"
                                htmlFor="title"
                                error={errors.title?.message}
                                icon={<HiOutlineClipboardList className="h-4 w-4" />}
                            >
                                <input
                                    id="title"
                                    type="text"
                                    {...register("title")}
                                    className={`w-full rounded-xl px-4 py-3 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                                    placeholder="e.g., Build a Modern E‑commerce Platform"
                                />
                            </FormField>

                            {/* Description */}
                            <FormField
                                label="Project Description"
                                htmlFor="description"
                                error={errors.description?.message}
                                icon={<HiOutlineClipboardList className="h-4 w-4" />}
                            >
                                <textarea
                                    id="description"
                                    rows={5}
                                    {...register("description")}
                                    className={`w-full rounded-xl px-4 py-3 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none`}
                                    placeholder="Describe your project in detail. What are your goals, requirements, and expectations?"
                                />
                            </FormField>

                            {/* Budget & Currency */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    label="Budget Amount"
                                    htmlFor="amount"
                                    error={errors.pricing?.amount?.message}
                                    className="md:col-span-2"
                                    icon={<HiOutlineCurrencyDollar className="h-4 w-4" />}
                                >
                                    <div className="relative">
                                        <HiOutlineCurrencyDollar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            {...register("pricing.amount", { valueAsNumber: true })}
                                            className={`w-full rounded-xl pl-10 pr-4 py-3 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                                            placeholder="Enter your budget"
                                        />
                                    </div>
                                </FormField>
                                <FormField
                                    label="Currency"
                                    htmlFor="currency"
                                    error={errors.pricing?.currency?.message}
                                >
                                    <select
                                        id="currency"
                                        {...register("pricing.currency")}
                                        className={`w-full rounded-xl px-4 py-3 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                                    >
                                        <option value="">Select Currency</option>
                                        {createProjectSchema.shape.pricing.shape.currency.options.map((cur) => (
                                            <option key={cur} value={cur}>{cur}</option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>
                        </div>
                    </div>

                    {/* Skills & Services */}
                    <div className={`${bgCard} rounded-2xl shadow-xl border ${borderClr} overflow-hidden`}>
                        <div className="px-8 py-6 border-b border-gray-200/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                    <FaTools className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h2 className={`text-xl font-bold ${textClr}`}>Skills & Services</h2>
                            </div>
                            <p className={`mt-2 ${subtleText}`}>Define what expertise you're looking for</p>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Service Types */}
                            <FormField
                                label="Service Types"
                                error={errors.serviceType?.message}
                                icon={<HiOutlineTag className="h-4 w-4" />}
                            >
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {serviceOptions.map((svc) => (
                                        <label key={svc} className={`flex items-center gap-3 p-4 border ${borderClr} rounded-xl cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700/50 transition-colors`}>
                                            <input
                                                type="checkbox"
                                                value={svc}
                                                {...register("serviceType")}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span className={`text-sm font-medium ${textClr}`}>{svc}</span>
                                        </label>
                                    ))}
                                </div>
                            </FormField>

                            {/* Required Skills */}
                            <FormField
                                label="Required Skills"
                                error={errors.requiredSkills?.message}
                                icon={<HiOutlineCode className="h-4 w-4" />}
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {skillOptions.map((skill) => (
                                        <label key={skill} className={`flex items-center gap-3 p-4 border ${borderClr} rounded-xl cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700/50 transition-colors`}>
                                            <input
                                                type="checkbox"
                                                value={skill}
                                                {...register("requiredSkills")}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span className={`text-sm font-medium ${textClr}`}>{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </FormField>

                            {/* Additional Requirements */}
                            <FormField
                                label="Additional Requirements"
                                icon={<HiOutlinePlus className="h-4 w-4" />}
                            >
                                <div className="space-y-3">
                                    {fields.map((field, idx) => (
                                        <div key={field.id} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                {...register(`requirements.${idx}` as const)}
                                                className={`flex-1 rounded-xl px-4 py-3 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                                                placeholder={`Requirement #${idx + 1}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => remove(idx)}
                                                className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                                            >
                                                <HiOutlineTrash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => append("")}
                                        className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                    >
                                        <HiOutlinePlus className="h-4 w-4" />
                                        Add Requirement
                                    </button>
                                </div>
                            </FormField>
                        </div>
                    </div>

                    {/* Timeline & Media */}
                    <div className={`${bgCard} rounded-2xl shadow-xl border ${borderClr} overflow-hidden`}>
                        <div className="px-8 py-6 border-b border-gray-200/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <HiOutlineCalendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className={`text-xl font-bold ${textClr}`}>Timeline & Media</h2>
                            </div>
                            <p className={`mt-2 ${subtleText}`}>Set your deadline and add project visuals</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <FormField
                                label="Project Deadline"
                                htmlFor="deadline"
                                error={errors.deadline?.message}
                                icon={<HiOutlineCalendar className="h-4 w-4" />}
                            >
                                <input
                                    id="deadline"
                                    type="date"
                                    {...register("deadline", { valueAsDate: true })}
                                    className={`w-full rounded-xl px-4 py-3 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all`}
                                />
                            </FormField>

                            <FormField
                                label="Project Image"
                                icon={<HiOutlinePhotograph className="h-4 w-4" />}
                            >
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={handleImageClick}
                                    onKeyDown={(e) => e.key === "Enter" && handleImageClick()}
                                    className={`relative w-full h-64 flex items-center justify-center overflow-hidden rounded-xl border-2 border-dashed ${borderClr} ${inputBg} cursor-pointer hover:border-indigo-400 transition-colors group`}
                                >
                                    <input
                                        ref={imgRef}
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            setImage(file ? URL.createObjectURL(file) : null);
                                            file ? setFile(file) : setFile(null);
                                        }}
                                    />
                                    {image ? (
                                        <div className="relative w-full h-full">
                                            <img src={image} alt="Project preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white font-medium">Click to change image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <HiOutlinePhotograph className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className={`text-lg font-medium ${textClr} mb-2`}>Upload Project Image</p>
                                            <p className={`text-sm ${subtleText}`}>Click or drag an image here to showcase your project</p>
                                        </div>
                                    )}
                                </div>
                            </FormField>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Creating Project...
                                </>
                            ) : (
                                <>
                                    <FaProjectDiagram className="h-5 w-5" />
                                    Create Project
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

