import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTheme } from './theme-provider'
import { IoCloudUploadOutline } from "react-icons/io5"
import { userHttp } from '@/utility/api'
import { toast } from 'sonner'

const createServiceSchema = z.object({
    name: z.enum(["Web Development", "Mobile Development", "Data Science", "DevOps"], {
        errorMap: () => ({ message: "Invalid service name" })
    }),
    description: z.string({ errorMap: () => ({ message: "Description is required" }) }).min(1, { message: "Description is required" }),
    pricing: z.object({
        currency: z.enum(["USD", "INR", "EUR"], {
            errorMap: () => ({ message: "Invalid currency" })
        }),
        amount: z.string()
    }),
    skills: z.array(z.enum(["JavaScript", "Python", "Java", "NodeJS", "React"], {
        errorMap: () => ({ message: "Invalid skill" })
    })).min(1, { message: "At least one skill is required" }),
    projectIds: z.array(z.string()).optional(),
})


type ICreateServiceSchema = z.infer<typeof createServiceSchema>

export const CreateService = ({ onCancel, setServicesList, setOpenCreateServiceModal, selectedService, operation, setOperation, setSelectedService }: { onCancel: () => void, setServicesList: any, setOpenCreateServiceModal: any, selectedService?: any, operation?: any, setOperation?: any, setSelectedService?: any }) => {

    if (!operation || operation !== 'edit') {
        setSelectedService(null)
    }

    const { theme } = useTheme()
    const { register, handleSubmit, formState: { errors }, watch } = useForm<ICreateServiceSchema>({
        resolver: zodResolver(createServiceSchema),
        defaultValues: {
            name: selectedService?.name || "",
            description: selectedService?.description || "",
            pricing: {
                currency: selectedService?.pricing?.currency || "",
                amount: selectedService?.pricing?.amount || ""
            },
            skills: selectedService?.skills || [],
            projectIds: selectedService?.projectIds || []
        }
    })
    const [imageUrl, setImageUrl] = useState<string | null>(selectedService?.imgUrl || null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const imgRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hasFieldsChanged, setHasFieldsChanged] = useState(false)


    const name = watch("name")
    const description = watch("description")
    const pricing = watch("pricing")
    const skills = watch("skills")
    const projectIds = watch("projectIds")
    const currency = watch("pricing.currency")
    const amount = watch("pricing.amount")

    const initialValuesRef = useRef({
        name: selectedService?.name || "",
        description: selectedService?.description || "",
        pricing: {
            currency: selectedService?.pricing?.currency || "",
            amount: selectedService?.pricing?.amount || ""
        },
        skills: selectedService?.skills || [],
        projectIds: selectedService?.projectIds || [],
        imgUrl: selectedService?.imgUrl || null
    })

    useEffect(() => {
        const currentDataChanged = (
            name !== initialValuesRef.current.name ||
            description !== initialValuesRef.current.description ||
            pricing.currency !== initialValuesRef.current.pricing.currency ||
            pricing.amount !== initialValuesRef.current.pricing.amount ||
            skills.length !== initialValuesRef.current.skills.length ||
            imageUrl !== initialValuesRef.current.imgUrl
        )
        setHasFieldsChanged(currentDataChanged)
    }, [name, description, pricing, skills, projectIds, currency, amount, imageUrl])


    const onSubmit = async (data: ICreateServiceSchema) => {

        if (operation === "edit") {
            let formData = new FormData()
            initialValuesRef.current.name !== data.name && formData.append("name", data.name)
            initialValuesRef.current.description !== data.description && formData.append("description", data.description)
            initialValuesRef.current.pricing !== data.pricing && formData.append("pricing", JSON.stringify(data.pricing))
            initialValuesRef.current.skills !== data.skills && formData.append("skills", JSON.stringify(data.skills))
            initialValuesRef.current.projectIds !== data.projectIds && formData.append("projectIds", JSON.stringify(data.projectIds))
            if (imageFile)
                initialValuesRef.current.imgUrl !== imageUrl && formData.append("image", imageFile)


            userHttp.put(`/service/${selectedService._id}`, formData)
                .then((res) => {
                    setOpenCreateServiceModal(false)
                    setServicesList((prev: any) => {
                        const updatedServices = prev.filter((s:any)=> s._id !== selectedService._id).concat(res.data)
                        return updatedServices
                    })
                    setImageUrl(null)
                    setImageFile(null)
                    setOperation(undefined)
                    setSelectedService(null)
                    toast.success("Service updated successfully")
                }
                )
                .catch((err) => {
                    toast.error("Error while updating service", {
                        description: err.response.data.message
                    });
                }
                )
        }
        else {
            let formData = new FormData()
            formData.append("name", data.name)
            formData.append("description", data.description)
            formData.append("pricing", JSON.stringify(data.pricing))
            formData.append("skills", JSON.stringify(data.skills))
            if (imageFile) {
                formData.append("image", imageFile)
            }

            try {
                setIsLoading(true)
                const response = await userHttp.post('service/add', formData)
                let data = response.data;
                setOpenCreateServiceModal(false)
                setServicesList((prev: any) => [...prev, data])
                setImageUrl(null)
                setImageFile(null)
                setIsLoading(false)

                toast.success("Service created successfully")
            }
            catch (e: Error | any) {
                setIsLoading(false)
                toast.error("Error while creating service", {
                    description: e.response.data.message
                });
            }
        }

    }

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            let imgUrl = URL.createObjectURL(file)
            setImageUrl(imgUrl)
            setImageFile(file)
        }
    }

    const inputStyles = `
        w-full rounded-lg
        py-2.5 px-3
        transition-all duration-200
        ${theme === "dark"
            ? 'bg-gray-800 border-gray-700 text-gray-200'
            : 'bg-gray-50 border-gray-200 text-gray-900'}
        focus:ring-2 focus:ring-offset-2
        ${theme === "dark"
            ? 'focus:ring-green-500 focus:ring-offset-gray-900'
            : 'focus:ring-amber-500 focus:ring-offset-white'}
    `

    if (isLoading) {
        return (
            <div className='fixed inset-0 w-full h-full bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm overflow-y-auto'>
                <div className="w-full max-w-[95%] sm:max-w-[80%] md:max-w-[600px] p-4 sm:p-6 md:p-8 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl">
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='fixed inset-0 w-full h-full bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm overflow-y-auto'>
            <div className={`
                relative mt-36
                w-full max-w-[95%] sm:max-w-[80%] md:max-w-[600px]
                p-4 sm:p-6 md:p-8
                border rounded-2xl shadow-xl
                transition-colors duration-300
                ${theme === "dark"
                    ? 'bg-gray-900 border-gray-700'
                    : 'bg-white border-gray-200'}
                ${isLoading ? 'pointer-events-none' : ''}
            `}>
                {/* Upload Image Section */}
                <div
                    onClick={() => imgRef.current?.click()}
                    className={`
                        w-full h-40 sm:h-48 md:h-56
                        rounded-xl
                        flex flex-col justify-center items-center
                        cursor-pointer mb-6
                        transition-all duration-300
                        border-2 border-dashed
                        ${theme === "dark"
                            ? 'bg-gray-800/50 hover:bg-gray-800 border-gray-700'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-300'}
                    `}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Service"
                            className='w-full h-full object-cover rounded-lg'
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <IoCloudUploadOutline className={`
                                w-10 h-10 sm:w-12 sm:h-12
                                ${theme === "dark" ? 'text-gray-400' : 'text-gray-500'}
                            `} />
                            <span className={`
                                text-sm sm:text-base font-medium
                                ${theme === "dark" ? 'text-gray-400' : 'text-gray-500'}
                            `}>
                                Click to upload service image
                            </span>
                        </div>
                    )}
                    <input
                        ref={imgRef}
                        type="file"
                        className='hidden'
                        onChange={handleImage}
                        accept="image/*"
                    />
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Service Type */}
                    <div className="space-y-2">
                        <label className={`
                            text-sm sm:text-base font-medium
                            ${theme === "dark" ? 'text-gray-200' : 'text-gray-700'}
                        `}>
                            Service Type
                        </label>
                        <select
                            {...register("name")}
                            className={inputStyles}
                        >
                            <option value="">Select Service</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="DevOps">DevOps</option>
                        </select>
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className={`
                            text-sm sm:text-base font-medium
                            ${theme === "dark" ? 'text-gray-200' : 'text-gray-700'}
                        `}>
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            rows={4}
                            className={inputStyles}
                            placeholder="Enter service description"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                        <label className={`
                            text-sm sm:text-base font-medium
                            ${theme === "dark" ? 'text-gray-200' : 'text-gray-700'}
                        `}>
                            Pricing
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <select
                                    {...register("pricing.currency")}
                                    className={inputStyles}
                                >
                                    <option value="">Currency</option>
                                    <option value="USD">USD</option>
                                    <option value="INR">INR</option>
                                    <option value="EUR">EUR</option>
                                </select>
                                {errors.pricing?.currency && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.pricing.currency.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    {...register("pricing.amount")}
                                    className={inputStyles}
                                    placeholder="Amount"
                                />
                                {errors.pricing?.amount && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.pricing.amount.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                        <label className={`
                            text-sm sm:text-base font-medium
                            ${theme === "dark" ? 'text-gray-200' : 'text-gray-700'}
                        `}>
                            Skills
                        </label>
                        <select
                            {...register("skills")}
                            multiple
                            className={`${inputStyles} min-h-[120px]`}
                        >
                            <option value="JavaScript">JavaScript</option>
                            <option value="Python">Python</option>
                            <option value="Java">Java</option>
                            <option value="NodeJS">NodeJS</option>
                            <option value="React">React</option>
                        </select>
                        {errors.skills && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.skills.message}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onCancel}
                            className={`
                                px-4 py-2.5 rounded-lg
                                font-medium text-sm sm:text-base
                                transition-colors duration-200
                                ${theme === "dark"
                                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                            `}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!hasFieldsChanged}
                            className={`
                                px-4 py-2.5 rounded-lg
                                font-medium text-sm sm:text-base
                                ${hasFieldsChanged ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}
                                transition-colors duration-200
                                ${theme === "dark"
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-amber-500 hover:bg-amber-600 text-white'}
                            `}
                        >
                            {operation === "edit" ? "Update Service" : "Create Service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}