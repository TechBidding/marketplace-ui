import { set, useForm } from "react-hook-form"
import { useTheme } from "./theme-provider"
import { userHttp } from "@/utility/api";
import { toast } from "sonner";
import { ConfirmModal } from "@/utility/confirmModal";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface EditProfileProps {
    isProfileEditing: boolean;
    setIsProfileEditing: (value: boolean) => void;
    userData: {
        name: string;
        bio?: string
        email: string;
        phoneNumber: string;
        profilePicture?: string;
        company?: string;
    };
}

export const EditProfile = ({ isProfileEditing, setIsProfileEditing, userData }: EditProfileProps) => {
    const { theme } = useTheme();
    const {watch, register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: userData.name,
            bio: userData?.bio || '',
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            company: userData?.company || ""
        }
    });
    const userType = useSelector((state: any) => state.auth.userType)


    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string>(userData?.profilePicture || 'https://github.com/shadcn.png');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [hasFieldsChanged, setHasFieldsChanged] = useState(false);


    const name = watch("name");
    const email = watch("email");
    const phoneNumber = watch("phoneNumber");
    const bio = watch("bio");
    const company = watch("company");


    const initialDataRef = useRef({
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        profilePicture: userData?.profilePicture || 'https://github.com/shadcn.png',
        bio: userData?.bio || '',
        company: userData?.company || ""
    });


    useEffect(() => {
        const currentDataChanged = (
            name !== initialDataRef.current.name ||
            email !== initialDataRef.current.email ||
            phoneNumber !== initialDataRef.current.phoneNumber ||
            imagePreview !== initialDataRef.current.profilePicture ||
            bio !== initialDataRef.current.bio ||
            company !== initialDataRef.current.company
        );
        setHasFieldsChanged(currentDataChanged);
    }, [name, email, phoneNumber, imagePreview, bio, company]);



    const onSubmit = (data: any) => {
        delete data.email;
        //TODO: add email to the data object

        //Check for the changed fields


        const formData = new FormData();
        if (imageFile) {
            formData.append("image", imageFile);
        }
        
        let oldData = initialDataRef.current;
        oldData.name !== data.name && formData.append("name", data.name);
        oldData.phoneNumber !== data.phoneNumber && formData.append("phoneNumber", data.phoneNumber);
        oldData.bio !== data.bio && formData.append("bio", data.bio);
        oldData.company !== data.company && formData.append("company", data.company);
        
        setIsUpdating(true);
        setIsModalOpen(false)
        userHttp.put(`${userType === 'client'? "client": "developer"}`, formData)
            .then((res) => {
                toast.success("Profile updated successfully", {
                    description: res.data.message
                });
            })
            .catch((err) => {
                toast.error("Error updating profile", {
                    description: err.response.data.message
                });
            })
            .finally(() => {
                setIsProfileEditing(false)
                setIsUpdating(false);
        })
    }


    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);

            return () => URL.revokeObjectURL(imageUrl);
        }
    };

    if (isUpdating) {
        return (
            <div className="w-full py-6 px-2 rounded-xl bg-gray-100 mt-4 flex flex-col items-center">
                <div className="animate-spin w-10 h-10 border-4 border-gray-300 rounded-full border-t-transparent"></div>
                <p className="text-gray-500 mt-2">Updating...</p>
            </div>
        )
    }

    return (
        <div className={`
            w-full py-6 px-2 rounded-xl
            ${theme === "dark" ? 'bg-green-950/90' : 'bg-gray-100'}
            mt-4 flex flex-col items-center
        `}>
            <div className="relative group w-32 h-32 md:w-40 md:h-40">
                <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
                    <img
                        src={imagePreview}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        alt="Profile"
                    />
                </div>
                <div
                    onClick={handleImageClick}
                    className={`
                        absolute inset-0 
                        flex items-center justify-center
                        bg-black/50 opacity-0 group-hover:opacity-100
                        transition-opacity duration-300 cursor-pointer
                        rounded-full
                    `}
                >
                    <span className="text-4xl font-light text-white">+</span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </div>
            <form className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2 text-left">
                        <label
                            className={`text-sm font-medium
                                ${theme === "dark" ? 'text-gray-200' : 'text-gray-700'}
                            `}
                        >
                            Name
                        </label>
                        <input
                            {...register("name", { required: true })}
                            className={`
                                w-full px-4 py-2 rounded-lg
                                border focus:outline-none focus:ring-2
                                transition duration-200
                                ${theme === "dark"
                                    ? 'bg-green-900/30 border-green-800 focus:ring-green-700 text-gray-200'
                                    : 'bg-white border-gray-200 focus:ring-amber-500 text-gray-900'}
                            `}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="space-y-2 text-left">
                        <label
                            className={`text-sm font-medium
                                ${theme === "dark" ? 'text-gray-200' : 'text-gray-700'}
                            `}
                        >
                            Bio
                        </label>
                        <textarea
                            {...register("bio")}
                            className={`
                                w-full px-4 py-2 rounded-lg h-36
                                border focus:outline-none focus:ring-2
                                transition duration-200
                                ${theme === "dark"
                                    ? 'bg-green-900/30 border-green-800 focus:ring-green-700 text-gray-200'
                                    : 'bg-white border-gray-200 focus:ring-amber-500 text-gray-900'}
                            `}
                            placeholder="Update your bio"
                        />
                    </div>

                    <div className="space-y-2 text-left">
                        <label
                            className={`text-sm font-medium
                                ${theme === "dark" ? 'text-gray-200' : 'text-gray-700'}
                            `}
                        >
                            Email
                        </label>
                        <input
                            {...register("email", {
                                required: true,
                                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                            })}
                            type="email"
                            className={`
                                w-full px-4 py-2 rounded-lg
                                border focus:outline-none focus:ring-2
                                transition duration-200
                                ${theme === "dark"
                                    ? 'bg-green-900/30 border-green-800 focus:ring-green-700 text-gray-200'
                                    : 'bg-white border-gray-200 focus:ring-amber-500 text-gray-900'}
                            `}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="space-y-2 text-left">
                        <label
                            className={`text-sm font-medium
                                ${theme === "dark" ? 'text-gray-200' : 'text-gray-700'}
                            `}
                        >
                            Phone Number
                        </label>
                        <input
                            {...register("phoneNumber")}
                            className={`
                                w-full px-4 py-2 rounded-lg
                                border focus:outline-none focus:ring-2
                                transition duration-200
                                ${theme === "dark"
                                    ? 'bg-green-900/30 border-green-800 focus:ring-green-700 text-gray-200'
                                    : 'bg-white border-gray-200 focus:ring-amber-500 text-gray-900'}
                            `}
                            placeholder="Enter phone number"
                        />
                    </div>

                    {userType === 'client' && (
                        <div className="space-y-2 text-left">
                            <label
                                className={`text-sm font-medium
                                    ${theme === "dark" ? 'text-gray-200' : 'text-gray-700'}
                                `}
                            >
                                Company
                            </label>
                            <input
                                {...register("company")}
                                className={`
                                    w-full px-4 py-2 rounded-lg
                                    border focus:outline-none focus:ring-2
                                    transition duration-200
                                    ${theme === "dark"
                                        ? 'bg-green-900/30 border-green-800 focus:ring-green-700 text-gray-200'
                                        : 'bg-white border-gray-200 focus:ring-amber-500 text-gray-900'}
                                `}
                                placeholder="Enter company name"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => setIsProfileEditing(false)}
                        className={`
                            px-2 py-1 rounded-lg
                            transition duration-200 cursor-pointer
                            ${theme === "dark"
                                ? 'bg-green-900/50 hover:bg-green-900/70 text-gray-200'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                        `}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!hasFieldsChanged}
                        className={`
                            px-2 py-1 rounded-lg font-medium ${!hasFieldsChanged ? 'opacity-50 cursor-not-allowed' : ''}
                            ${!hasFieldsChanged ? 'cursor-not-allowed' : 'cursor-pointer'}
                            ${hasFieldsChanged ? 'hover:scale-105' : ''}
                            transition duration-200
                            ${theme === "dark"
                                ? 'bg-green-700 hover:bg-green-600 text-white'
                                : 'bg-amber-500 hover:bg-amber-600 text-white'}
                        `}
                        onClick={() => {
                            setIsModalOpen(true)
                        }
                        }
                    >
                        Save Changes
                    </button>
                </div>
                {isModalOpen && (
                    <ConfirmModal
                        title="Confirm Changes"
                        message="Are you sure you want to save these changes?"
                        onConfirm={handleSubmit(onSubmit)}
                        onCancel={() => {
                            setIsModalOpen(false)
                            setIsProfileEditing(false)
                        }}
                    />
                )}
            </form>
        </div>
    )
}