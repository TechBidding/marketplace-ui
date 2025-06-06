import { set, useForm } from "react-hook-form"
import { useTheme } from "./theme-provider"
import { userHttp } from "@/utility/api";
import { toast } from "sonner";
import { ConfirmModal } from "@/utility/confirmModal";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    HiOutlineUser,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineOfficeBuilding,
    HiOutlineDocumentText,
    HiOutlineCamera,
    HiOutlineCheck,
    HiOutlineX
} from "react-icons/hi";
import { Loader2 } from "lucide-react";

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
    const isDark = theme === "dark";
    const { watch, register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: userData.name,
            bio: userData?.bio || '',
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            company: userData?.company || ""
        }
    });
    const userType = useSelector((state: any) => state.auth.userType)

    const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl"
    const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50"
    const textClr = isDark ? "text-gray-100" : "text-gray-900"
    const subtleText = isDark ? "text-gray-400" : "text-gray-600"

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
        userHttp.put(`${userType === 'client' ? "client" : "developer"}`, formData)
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
            <div className={`${bgCard} rounded-3xl border ${borderClr} p-12 text-center`}>
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                        <div className="absolute inset-0 rounded-full bg-indigo-600/20 animate-ping"></div>
                    </div>
                    <div>
                        <h3 className={`text-lg font-semibold ${textClr} mb-2`}>Updating Profile</h3>
                        <p className={`${subtleText}`}>Please wait while we save your changes...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`${bgCard} rounded-3xl border ${borderClr} p-8`}>
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold ${textClr} mb-2`}>Edit Profile</h2>
                <p className={`${subtleText}`}>Update your profile information and preferences</p>
            </div>

            {/* Profile Image Upload */}
            <div className="flex justify-center mb-8">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl">
                        <img
                            src={imagePreview}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            alt="Profile"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleImageClick}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                    >
                        <HiOutlineCamera className="w-8 h-8 text-white" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {imageFile && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <HiOutlineCheck className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
            </div>

            <form className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-semibold ${textClr} mb-2`}>
                        <HiOutlineUser className="w-4 h-4" />
                        Full Name
                    </label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${isDark
                            ? 'bg-gray-800/50 border-gray-700 focus:border-indigo-500 text-gray-100'
                            : 'bg-white border-gray-200 focus:border-indigo-500 text-gray-900'
                            } focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
                        placeholder="Enter your full name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                </div>

                {/* Bio Field */}
                <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-semibold ${textClr} mb-2`}>
                        <HiOutlineDocumentText className="w-4 h-4" />
                        Bio
                    </label>
                    <textarea
                        {...register("bio")}
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none ${isDark
                            ? 'bg-gray-800/50 border-gray-700 focus:border-indigo-500 text-gray-100'
                            : 'bg-white border-gray-200 focus:border-indigo-500 text-gray-900'
                            } focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
                        placeholder="Tell us about yourself..."
                    />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-semibold ${textClr} mb-2`}>
                        <HiOutlineMail className="w-4 h-4" />
                        Email Address
                    </label>
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        type="email"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${isDark
                            ? 'bg-gray-800/50 border-gray-700 focus:border-indigo-500 text-gray-100'
                            : 'bg-white border-gray-200 focus:border-indigo-500 text-gray-900'
                            } focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
                        placeholder="Enter your email address"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-semibold ${textClr} mb-2`}>
                        <HiOutlinePhone className="w-4 h-4" />
                        Phone Number
                    </label>
                    <input
                        {...register("phoneNumber")}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${isDark
                            ? 'bg-gray-800/50 border-gray-700 focus:border-indigo-500 text-gray-100'
                            : 'bg-white border-gray-200 focus:border-indigo-500 text-gray-900'
                            } focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
                        placeholder="Enter your phone number"
                    />
                </div>

                {/* Company Field (for clients) */}
                {userType === 'client' && (
                    <div className="space-y-2">
                        <label className={`flex items-center gap-2 text-sm font-semibold ${textClr} mb-2`}>
                            <HiOutlineOfficeBuilding className="w-4 h-4" />
                            Company
                        </label>
                        <input
                            {...register("company")}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${isDark
                                ? 'bg-gray-800/50 border-gray-700 focus:border-indigo-500 text-gray-100'
                                : 'bg-white border-gray-200 focus:border-indigo-500 text-gray-900'
                                } focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
                            placeholder="Enter your company name"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                    <button
                        type="button"
                        onClick={() => setIsProfileEditing(false)}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${isDark
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                            }`}
                    >
                        <HiOutlineX className="w-5 h-5" />
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!hasFieldsChanged}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${hasFieldsChanged
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-xl transform hover:-translate-y-0.5'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            }`}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <HiOutlineCheck className="w-5 h-5" />
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