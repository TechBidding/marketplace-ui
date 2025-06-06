import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDispatch, useSelector } from "react-redux";
import { CommonNavItems, DeveloperNavItems, ClientNavItems } from "@/utility/contants";
import { TbLayoutSidebarLeftExpandFilled, TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { HiOutlineLogout, HiOutlineUser, HiOutlineCog } from "react-icons/hi";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "./theme-provider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { userHttp } from "@/utility/api";
import { logout } from "@/store/AuthSlice";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const userDetails = useSelector((state: any) => state.auth.userDetails);
    const userType = useSelector((state: any) => state.auth.userType);
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const navigate = useNavigate()
    const isDark = theme === "dark"

    // Get navigation items based on user type
    const getNavigationItems = () => {
        const commonItems = CommonNavItems;
        const roleItems = userType === "client" ? ClientNavItems : DeveloperNavItems;
        return [...commonItems, ...roleItems];
    };

    const navigationItems = getNavigationItems();

    const handleLogout = () => {
        userHttp.post('developer/logout').then(() => {
            dispatch(logout())
            window.location.href = `${window.location.pathname}/signin`;
            toast.success('Logged out successfully');
        }).catch((err) => {
            toast.error('Error occurred while logging out', {
                description: err.response.data.message,
            });
        })
    };

    const handleProfile = () => {
        navigate(`/user/${userDetails.userName}`)
    }

    return (
        <nav className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-20'
            } ${isDark
                ? 'bg-gray-900/95 backdrop-blur-xl border-r border-gray-800'
                : 'bg-white/95 backdrop-blur-xl border-r border-gray-200'
            } shadow-xl`}>
            <div className="flex flex-col h-full p-4">
                {/* Logo Section */}
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    {expanded && (
                        <div className="flex flex-col">
                            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Marketplace
                            </span>
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Professional Platform
                            </span>
                        </div>
                    )}
                </div>

                {/* Navigation Items */}
                <div className="flex-1">
                    <ul className="space-y-2">
                        {navigationItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.link}
                                    className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${isDark
                                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                                        } relative overflow-hidden`}
                                >
                                    <div className={`p-2 rounded-lg transition-all duration-200 ${isDark
                                        ? 'bg-gray-800/50 group-hover:bg-indigo-600/20'
                                        : 'bg-gray-100/50 group-hover:bg-indigo-100'
                                        }`}>
                                        <item.icon className={`w-5 h-5 transition-colors duration-200 ${isDark ? 'group-hover:text-indigo-400' : 'group-hover:text-indigo-600'
                                            }`} />
                                    </div>
                                    {expanded && (
                                        <span className="font-medium whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    )}

                                    {/* Hover effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bottom Controls */}
                <div className="space-y-4">
                    {/* Theme Toggle & Expand Button */}
                    <div className={`flex items-center ${expanded ? 'justify-between' : 'flex-col gap-3'}`}>
                        <div className={`${expanded ? '' : 'order-2'}`}>
                            <ModeToggle />
                        </div>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className={`p-2 rounded-lg transition-all duration-200 ${isDark
                                ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white'
                                : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-900'
                                } ${expanded ? 'order-2' : 'order-1'}`}
                        >
                            {expanded ? (
                                <TbLayoutSidebarRightExpandFilled className="w-5 h-5" />
                            ) : (
                                <TbLayoutSidebarLeftExpandFilled className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* User Profile Section */}
                    <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-4`}>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isDark
                                ? 'hover:bg-gray-800/60 text-gray-300 hover:text-white'
                                : 'hover:bg-gray-100/60 text-gray-600 hover:text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}>
                                <Avatar className="w-10 h-10 ring-2 ring-white/20 shadow-lg">
                                    <AvatarImage
                                        src={userDetails?.profilePicture || "https://github.com/shadcn.png"}
                                        alt="Profile"
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                                        {userDetails?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                {expanded && (
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="font-semibold truncate">
                                            {userDetails?.userName || 'User'}
                                        </p>
                                        <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                            {userDetails?.name || 'Full Name'}
                                        </p>
                                    </div>
                                )}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className={`w-56 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} shadow-xl`}
                                align="end"
                                side="right"
                            >
                                <DropdownMenuLabel className="flex items-center gap-3 p-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={userDetails?.profilePicture || "https://github.com/shadcn.png"} />
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
                                            {userDetails?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{userDetails?.name || 'User'}</p>
                                        <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            @{userDetails?.userName || 'username'}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className={isDark ? 'bg-gray-800' : 'bg-gray-200'} />
                                <DropdownMenuItem
                                    className={`cursor-pointer flex items-center gap-3 p-3 ${isDark ? 'hover:bg-gray-800 focus:bg-gray-800' : 'hover:bg-gray-100 focus:bg-gray-100'
                                        }`}
                                    onClick={handleProfile}
                                >
                                    <HiOutlineUser className="w-4 h-4" />
                                    <span>View Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`cursor-pointer flex items-center gap-3 p-3 ${isDark ? 'hover:bg-gray-800 focus:bg-gray-800' : 'hover:bg-gray-100 focus:bg-gray-100'
                                        }`}
                                >
                                    <HiOutlineCog className="w-4 h-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className={isDark ? 'bg-gray-800' : 'bg-gray-200'} />
                                <DropdownMenuItem
                                    className={`cursor-pointer flex items-center gap-3 p-3 text-red-600 dark:text-red-400 ${isDark ? 'hover:bg-red-900/20 focus:bg-red-900/20' : 'hover:bg-red-50 focus:bg-red-50'
                                        }`}
                                    onClick={handleLogout}
                                >
                                    <HiOutlineLogout className="w-4 h-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    )
}
