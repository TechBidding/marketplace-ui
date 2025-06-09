import { MdClose } from "react-icons/md"
import { useTheme } from "../theme-provider"
import { Button } from "../ui/button"
import { ChatBox } from "./ChatBox"
import { ChatInput } from "./ChatInput"
import { projectHttp } from "@/utility/api"
import { useEffect, useState } from "react"

export const Chat = ({ projectId, onClick }: { projectId: string, onClick: () => void }) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const [messages, setMessages] = useState<any[]>([])

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await projectHttp.get(`/chat/project/${projectId}`)
            console.log(response.data)
            setMessages(response.data.messages)
        }
        fetchMessages()
    }, [])

    return (
        <div
            className={`w-[30%] h-full fixed top-0 right-0 z-50 transform transition-all duration-500 ease-in-out animate-in slide-in-from-right ${isDark
                ? 'bg-gray-900/95 backdrop-blur-xl border-l border-gray-800'
                : 'bg-white/95 backdrop-blur-xl border-l border-gray-200'
                } shadow-xl`}
        >
            <div className={`flex justify-between items-center p-6 border-b transition-colors duration-200 ${isDark ? 'border-gray-800' : 'border-gray-200'
                }`}>
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-700 delay-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl">
                        <span className="text-white font-bold text-lg transition-transform duration-200">💬</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className={`text-xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Project Chat
                        </h2>
                        <span className={`text-sm transition-colors duration-200 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Discuss your project
                        </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    className={`rounded-lg transition-all duration-200 hover:scale-105 animate-in fade-in delay-300 ${isDark
                        ? 'hover:bg-gray-800/60 text-gray-300 hover:text-white'
                        : 'hover:bg-gray-100/60 text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <MdClose className="w-5 h-5 transition-transform duration-200 hover:rotate-90" />
                </Button>
            </div>

            {/* Chat content area */}
            <div className="flex flex-col h-[calc(100%-88px)] animate-in fade-in slide-in-from-bottom duration-600 delay-400">
                {/* ChatBox - takes 80% of available height */}
                <div className="flex-1 h-[80%] p-4 overflow-hidden">
                    <div className={`rounded-xl h-full transition-all duration-300 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                        }`}>
                        <ChatBox messages={messages} />
                    </div>
                </div>

                {/* ChatInput - positioned at bottom, takes remaining 20% */}
                <div className="h-[20%] min-h-[100px] p-4 pt-0">
                    <div className={`rounded-xl transition-all duration-300 ${isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'
                        }`}>
                        <ChatInput />
                    </div>
                </div>
            </div>
        </div>
    )
}
