import React, { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "./theme-provider";
import { ServiceEnum, SkillEnum } from "../utility/contants";
import { createProjectSchema } from "@/utility/Schema/createProjectSchema";
import { projectHttp } from "@/utility/api";
import { toast } from "sonner";




export type ICreateProjectSchema = z.infer<typeof createProjectSchema>;

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    htmlFor?: string;
    error?: string;
    children: React.ReactNode;
}
const FormField: React.FC<FormFieldProps> = ({
    label,
    htmlFor,
    error,
    children,
    className = "",
    ...rest
}) => (
    <div className={`flex flex-col gap-2 ${className}`} {...rest}>
        <label htmlFor={htmlFor} className="font-medium leading-none">
            {label}
        </label>
        {children}
        {error && <p className="text-sm text-red-500">{error}</p>}
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

    /* ----------------------- theme utilities -------------------------- */
    const bgPage = isDark ? "bg-neutral-950" : "bg-gray-100";
    const bgCard = isDark ? "bg-neutral-900" : "bg-white";
    const inputBg = isDark ? "bg-neutral-800" : "bg-white";
    const borderClr = isDark ? "border-neutral-700" : "border-gray-300";
    const textClr = isDark ? "text-gray-200" : "text-gray-800";
    const subtleText = isDark ? "text-gray-400" : "text-gray-500";
    const primaryBtn = isDark
        ? "bg-neutral-700 hover:bg-neutral-600 text-emerald-200"
        : "bg-amber-100 hover:bg-amber-200 text-amber-700";
    const dangerBtn = isDark
        ? "bg-red-700 hover:bg-red-600 text-red-200"
        : "bg-red-100 hover:bg-red-200 text-red-700";
    
    
    

    async function onSubmit(data: ICreateProjectSchema) {
        if (!file) {
            alert("Choose an image first");
            return;
        }

        const fd = new FormData();

        /* -------------- primitives ---------------- */
        fd.append("title", data.title);
        fd.append("description", data.description);
        fd.append("deadline", data.deadline.toISOString());

        /* -------------- pricing (object) ---------- */
        // send as “dotted” keys so Nest turns it back into an object
        fd.append("pricing.currency", data.pricing.currency);
        fd.append("pricing.amount", data.pricing.amount.toString());

        /* -------------- arrays -------------------- */
        data.serviceType.forEach(s => fd.append("serviceType", s));
        data.requiredSkills.forEach(s => fd.append("requiredSkills", s));
        data.requirements?.forEach(r => fd.append("requirements", r));
        data.projectIds?.forEach(id => fd.append("projectIds", id));

        /* -------------- file ---------------------- */
        fd.append("image", file);      // “image” must match @FileInterceptor('image')

        try {
            const res = await projectHttp.post("/projects", fd);
            const resData = res.data;
            toast.success("Project created successfully");
        } catch (err: any) {
            toast.error("Error creating project", {
                description: err.response.data.message
            });
        }
    }


    const serviceOptions = Object.values(ServiceEnum);
    const skillOptions = Object.values(SkillEnum);


    return (
        <div className={`min-h-screen ${bgPage} flex justify-center py-8 px-4 sm:px-6 lg:px-8`}>
            <div className="w-full max-w-4xl space-y-8">
                <h1 className={`text-2xl font-semibold ${textClr}`}>Create New Project</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className={`p-6 ${bgCard} ${textClr} rounded-xl shadow-sm border ${borderClr} flex flex-col gap-6`}>
                        {/* Project Title */}
                        <FormField label="Project Title" htmlFor="title" error={errors.title?.message}>
                            <input
                                id="title"
                                type="text"
                                {...register("title")}
                                className={`w-full rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                placeholder="e.g., Build an E‑commerce Web App"
                            />
                        </FormField>

                        {/* Description */}
                        <FormField label="Description" htmlFor="description" error={errors.description?.message}>
                            <textarea
                                id="description"
                                rows={4}
                                {...register("description")}
                                className={`w-full rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                placeholder="Briefly describe your project goals…"
                            />
                        </FormField>

                        {/* Budget & Currency */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField
                                label="Budget Amount"
                                htmlFor="amount"
                                error={errors.pricing?.amount?.message}
                                className="sm:col-span-2"
                            >
                                <input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    {...register("pricing.amount", { valueAsNumber: true })}
                                    className={`w-full rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                    placeholder="1000"
                                />
                            </FormField>
                            <FormField
                                label="Currency"
                                htmlFor="currency"
                                error={errors.pricing?.currency?.message}
                            >
                                <select
                                    id="currency"
                                    {...register("pricing.currency")}
                                    className={`w-full rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                >
                                    <option value="">Select</option>
                                    {createProjectSchema.shape.pricing.shape.currency.options.map((cur) => (
                                        <option key={cur} value={cur}>{cur}</option>
                                    ))}
                                </select>
                            </FormField>
                        </div>
                    </div>

                    <div className={`p-6 ${bgCard} ${textClr} rounded-xl shadow-sm border ${borderClr} flex flex-col gap-8`}>
                        {/* Service Types */}
                        <FormField label="Service Types" error={errors.serviceType?.message}>
                            <div className="flex flex-wrap gap-3">
                                {serviceOptions.map((svc) => (
                                    <label key={svc} className={`flex items-center gap-2 text-sm ${subtleText}`}>
                                        <input type="checkbox" value={svc} {...register("serviceType")} className="accent-indigo-600" />
                                        {svc}
                                    </label>
                                ))}
                            </div>
                        </FormField>

                        {/* Required Skills */}
                        <FormField label="Required Skills" error={errors.requiredSkills?.message}>
                            <div className="flex flex-wrap gap-3">
                                {skillOptions.map((skill) => (
                                    <label key={skill} className={`flex items-center gap-2 text-sm ${subtleText}`}>
                                        <input type="checkbox" value={skill} {...register("requiredSkills")} className="accent-indigo-600" />
                                        {skill}
                                    </label>
                                ))}
                            </div>
                        </FormField>

                        {/* Additional Requirements */}
                        <FormField label="Additional Requirements">
                            <div className="space-y-2">
                                {fields.map((field, idx) => (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            {...register(`requirements.${idx}` as const)}
                                            className={`flex-1 rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                            placeholder={`Requirement #${idx + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => remove(idx)}
                                            className={`rounded-md px-3 py-1 text-sm transition ${dangerBtn}`}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => append("")}
                                    className={`mt-2 w-max rounded-md px-4 py-1 text-sm font-medium transition ${primaryBtn}`}
                                >
                                    + Add Requirement
                                </button>
                            </div>
                        </FormField>
                    </div>

                    <div className={`p-6 ${bgCard} ${textClr} rounded-xl shadow-sm border ${borderClr} flex flex-col gap-6`}>
                        <FormField label="Deadline" htmlFor="deadline" error={errors.deadline?.message}>
                            <input
                                id="deadline"
                                type="date"
                                {...register("deadline", { valueAsDate: true })}
                                className={`w-full rounded-md px-3 py-2 border ${borderClr} ${inputBg} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                            />
                        </FormField>

                        <FormField label="Project Image">
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={handleImageClick}
                                onKeyDown={(e) => e.key === "Enter" && handleImageClick()}
                                className={`relative w-full h-40 sm:h-52 md:h-60 flex items-center justify-center overflow-hidden rounded-md border-2 border-dashed ${borderClr} ${inputBg} text-gray-400 cursor-pointer`}
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
                                    <img src={image} alt="Project preview" className="absolute inset-0 h-full w-full object-cover" />
                                ) : (
                                    <span className="text-xs">Click or drag an image here</span>
                                )}
                            </div>
                        </FormField>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-2 text-white font-medium transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating…" : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

