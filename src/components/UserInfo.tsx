import { userHttp } from '@/utility/api'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { EditProfile } from './EditProfile'
import { MdOutlineEmail, MdEdit, MdBusiness } from "react-icons/md"
import { FaPhoneAlt, FaUser } from "react-icons/fa"
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineOfficeBuilding } from "react-icons/hi"
import { useTheme } from './theme-provider'
import { toast } from 'sonner'

export const UserInfo = () => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const userDetails = useSelector((state: any) => state.auth.userDetails)
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn)
    const params = useParams()
    const [userData, setUserData] = useState<any>(null)
    const [isProfileEditing, setIsProfileEditing] = useState(false)

    const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl"
    const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50"
    const textClr = isDark ? "text-gray-100" : "text-gray-900"
    const subtleText = isDark ? "text-gray-400" : "text-gray-600"

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
        <div className={`${bgCard} rounded-3xl border ${borderClr} shadow-xl overflow-hidden sticky top-6`}>
            {!isProfileEditing ? (
                <div className="p-8">
                    {/* Profile Header */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block group">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl">
                                <img
                                    src={userData?.profilePicture || 'https://github.com/shadcn.png'}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    alt="Profile"
                                />
                            </div>
                            {/* Status indicator */}
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg"></div>
                        </div>

                        <div className="mt-6">
                            <h1 className={`text-3xl font-bold ${textClr} mb-2`}>
                                {userData?.name}
                            </h1>
                            <p className={`text-lg ${subtleText} mb-1`}>
                                @{userData?.userName}
                            </p>
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                <HiOutlineUser className="w-4 h-4 mr-1" />
                                {userData?.userType === 'developer' ? 'Developer' : 'Client'}
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    {userData?.bio && (
                        <div className="mb-8">
                            <div className={`p-6 rounded-2xl bg-gradient-to-r ${isDark ? 'from-gray-800/50 to-gray-700/50' : 'from-gray-50 to-white'} border ${borderClr}`}>
                                <h3 className={`text-sm font-semibold ${subtleText} uppercase tracking-wide mb-3`}>About</h3>
                                <p className={`${textClr} leading-relaxed`}>
                                    {userData.bio}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="space-y-4 mb-8">
                        <h3 className={`text-sm font-semibold ${subtleText} uppercase tracking-wide mb-4`}>Contact Information</h3>

                        <div className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${isDark ? 'from-blue-900/20 to-indigo-900/20' : 'from-blue-50 to-indigo-50'}`}>
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <HiOutlineMail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm ${subtleText}`}>Email</p>
                                <p className={`font-medium ${textClr}`}>{userData?.email}</p>
                            </div>
                        </div>

                        <div className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${isDark ? 'from-emerald-900/20 to-green-900/20' : 'from-emerald-50 to-green-50'}`}>
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                <HiOutlinePhone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm ${subtleText}`}>Phone</p>
                                <p className={`font-medium ${textClr}`}>{userData?.phoneNumber}</p>
                            </div>
                        </div>

                        {userData?.company && (
                            <div className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${isDark ? 'from-purple-900/20 to-violet-900/20' : 'from-purple-50 to-violet-50'}`}>
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                    <HiOutlineOfficeBuilding className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm ${subtleText}`}>Company</p>
                                    <p className={`font-medium ${textClr}`}>{userData.company}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {isLoggedIn && userDetails?.userName === params.username && (
                        <div className="space-y-3">
                            <button
                                onClick={() => setIsProfileEditing(true)}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <MdEdit className="w-5 h-5" />
                                Edit Profile
                            </button>
                        </div>
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
    )
}