import { set, useForm } from "react-hook-form"
import { useTheme } from "./theme-provider"
import { userHttp } from "@/utility/api";
import { toast } from "sonner";
import { ConfirmModal } from "@/utility/confirmModal";
import { useState } from "react";

interface EditProfileProps {
    isProfileEditing: boolean;
    setIsProfileEditing: (value: boolean) => void;
    userData: {
        name: string;
        email: string;
        phoneNumber: string;
    };
}

export const EditProfile = ({ isProfileEditing, setIsProfileEditing, userData }: EditProfileProps) => {
    const { theme } = useTheme();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: userData.name,
            email: userData.email,
            phoneNumber: userData.phoneNumber
        }
    });

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const onSubmit = (data: any) => {
        console.log("Form submitted: ", data)
        delete data.email;

        setIsModalOpen(true);

        userHttp.put('developer', JSON.stringify(data))
            .then((res) => {
                console.log("Profile updated successfully: ", res.data)
            })
            .catch((err) => {
                toast.error("Error updating profile", {
                    description: err.response.data.message
                });
            })
            .finally(() => {
                setIsProfileEditing(false)
        })
    }

    return (
        <div className={`
            w-full py-6 px-2 rounded-xl
            ${theme === "dark" ? 'bg-green-950/90' : 'bg-gray-100'}
            mt-4
        `}>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                        type="submit"
                        className={`
                            px-2 py-1 rounded-lg font-medium cursor-pointer
                            transition duration-200
                            ${theme === "dark"
                                ? 'bg-green-700 hover:bg-green-600 text-white'
                                : 'bg-amber-500 hover:bg-amber-600 text-white'}
                        `}
                    >
                        Save Changes
                    </button>
                </div>
            </form>
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
        </div>
    )
}