import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDispatch, useSelector } from "react-redux";
import { NavBarList } from "@/utility/contants";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
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




export const Navbar = () => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const userDetails = useSelector((state: any) => state.auth.userDetails);
    const dispatch = useDispatch();
    const { theme } = useTheme();

    console.log("Window location", window.location);

    const handleLogout = () => {
        userHttp.post('developer/logout').then(() => {
                dispatch(logout())
                window.location.href = `${window.location.pathname}/signin`;
                toast.success('Logged out successfully');
        }).catch((err) => {
            console.log(err);
            toast.error('Error occurred while logging out', {
                description: err.response.data.message,
            });
        })
    };
    

    return (
        <>
            <nav className={`p-4 flex flex-col ${theme === 'dark' || theme === 'system' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-800'}`}
                style={{
                    width: expanded ? '200px' : '60px',
                    height: '100vh',
                    transition: 'width 0.3s ease-in-out',
                    overflow: 'hidden',
                    position: 'fixed',
                    boxShadow: expanded ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                    borderRadius: expanded ? '0 0 0 10px' : '0 0 10px 0',
                    transitionDuration: '0.3s',
                    transitionTimingFunction: 'ease-in-out',
                    transitionProperty: 'width, padding, background-color',
                    transitionDelay: '0s',
                }}>
                
                {/* Logo */}
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-row items-center">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            {expanded && (
                                <span className=" ml-2 text-lg font-bold">Marketplace</span>
                            )}
                        </div>
                    </div>
                    

                    {/* Navbar List */}
                    <div>
                        <ul className="flex flex-col space-y-4 mt-20 gap-5">
                            {NavBarList.map((item, index) => (
                                <li key={index}>
                                    <a href={item.link} className="hover:text-gray-400">
                                        {expanded ? (
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex justify-center items-center gap-2">
                                                    <item.icon className="w-5 h-5" />
                                                    <span>{item.name}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>



                </div>
                
                {/* Toggle */}
                <div className={`mt-auto pb-4 mr-0.7 flex items-center ${expanded ? 'flex-row justify-end ' : 'flex-col'} gap-2`}>
                    <div className={`flex items-center ${expanded ? 'mr-auto' : 'justify-center'} ${theme === 'dark' ? 'text-white' : 'background-gray-800'} cursor-pointer`}>
                        <ModeToggle />
                    </div>
                    <button onClick={() => setExpanded(!expanded)} className={`flex items-center justify-center w-10 h-10 rounded-full transition duration-300 ${theme === 'light' ? "bg-gray-300" : "bg-gray-700"} cursor-pointer `}>
                        {expanded ? (
                            <TbLayoutSidebarRightExpandFilled className="w-5 h-5" />
                        ) : (
                            <TbLayoutSidebarLeftExpandFilled className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Bottom section */}
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mt-auto pt-4  border-t-2 border-gray-400 flex items-center flex-row gap-4 cursor-pointer">
                            <div className="mr-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                            {
                                expanded && (
                                    <div className="flex flex-col ">
                                        <div>
                                            <span className="text-s font-bold">{userDetails?.userName}</span>
                                        </div>
                                        <div>
                                            <span className={`text-s ${theme==='light' ? 'text-gray-700': 'text-gray-400'}`}>{userDetails?.name}</span>
                                        </div>
                                    </div>
                                )
                            }
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" >Profile</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </nav>
        </>
    )
}
