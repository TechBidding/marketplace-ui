import { userHttp } from '@/utility/api'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { EditProfile } from './EditProfile'
import { MdOutlineEmail } from "react-icons/md"
import { FaPhoneAlt } from "react-icons/fa"
import { useTheme } from './theme-provider'
import { toast } from 'sonner'

export const UserInfo = () => {
    const { theme } = useTheme()
    const userDetails = useSelector((state: any) => state.auth.userDetails)
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn)
    const params = useParams()
    const [userData, setUserData] = useState<any>(null)
    const [isProfileEditing, setIsProfileEditing] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await userHttp.get(`developer/${params.username}`);
                setUserData(res.data);
            } catch (err) {
                try {
                    const res = await userHttp.get(`client/${params.username}`);
                    setUserData(res.data.data);
                } catch (err: any) {
                    toast.error("Error fetching user data", {
                        description: err.response.data.message
                    });
                }
            }
        };

        fetchUserData();
    }, [params.username]);

    return (
        <div className={`
            w-full h-full p-4 md:p-6
            flex flex-col
            rounded-xl
            ${theme === "dark" ? '' : 'bg-white'}
            transition-colors duration-300
        `}>
            <div className="flex flex-col items-center md:items-start">
                {/* Profile Image */}

                {!isProfileEditing ? (
                    <div className="w-full space-y-6 mt-6">
                        {/* Name and Username */}
                        <div className="group w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300 overflow-hidden">
                            <img
                                src={userData?.profilePicture || 'https://github.com/shadcn.png'}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                alt="Profile"
                            />
                        </div>
                        <div className="text-left">
                            <h1 className={`text-2xl font-bold ${theme === "dark" ? 'text-white' : 'text-gray-900'}`}>
                                {userData?.name}
                            </h1>
                            <p className={`${theme === "dark" ? 'text-gray-400' : 'text-gray-500'}`}>
                                @{userData?.userName}
                            </p>
                        </div>

                        {/* Bio */}
                        <div className="text-left">
                            <p className={`${theme === "dark" ? 'text-gray-300' : 'text-gray-600'}`}>
                                {userData?.bio}
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className={`
                            flex flex-col gap-4 py-5
                            ${theme === "dark" ? 'text-gray-300' : 'text-gray-600'}
                        `}>
                            <div className="flex items-center gap-3">
                                <MdOutlineEmail className={theme === "dark" ? 'text-gray-400' : 'text-gray-500'} />
                                <span>{userData?.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaPhoneAlt className={theme === "dark" ? 'text-gray-400' : 'text-gray-500'} />
                                <span>{userData?.phoneNumber}</span>
                            </div>
                            {userData?.company && (
                                <div className="flex items-center gap-3">
                                    <FaPhoneAlt className={theme === "dark" ? 'text-gray-400' : 'text-gray-500'} />
                                    <span>{userData?.company}</span>
                                </div>
                            )}
                        </div>


                        {/* Edit Profile Button */}
                        {isLoggedIn && userDetails?.userName === params.username && (
                            <button
                                onClick={() => setIsProfileEditing(true)}
                                className={`
                                    w-full py-2.5 px-4 
                                    rounded-lg font-medium cursor-pointer
                                    transition-colors duration-200
                                    ${theme === "dark"
                                        ? 'bg-green-900/60 hover:bg-green-900 text-white'
                                        : 'bg-amber-500 hover:bg-amber-600 text-white'}
                                `}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                ) : (
                    <EditProfile
                        isProfileEditing={isProfileEditing}
                        setIsProfileEditing={setIsProfileEditing}
                        userData={userData}
                    />
                )}
            </div>
        </div>
    )
}