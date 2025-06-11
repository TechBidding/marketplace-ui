import { MdClose } from "react-icons/md"
import { useTheme } from "../theme-provider"
import { Button } from "../ui/button"
import { ChatBox } from "./ChatBox"
import { ChatInput } from "./ChatInput"
import { projectHttp } from "@/utility/api"
import { useEffect, useState, useRef } from "react"
import { io, Socket } from 'socket.io-client';

export const Chat = ({ projectId, userId, onClick }: { projectId: string, userId: string, onClick: () => void }) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const [messages, setMessages] = useState<any[]>([])
    const [chatId, setChatId] = useState<string>("")
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        if (socketRef.current) return;
        socketRef.current = io("http://localhost:6002", {
            transports: ['websocket', 'polling'],
            timeout: 20000,
        })

        const socket = socketRef.current

        socket.on('connect', () => {
            console.log('Connected to socket server')
        })

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error)
        })

        socket.on('disconnect', (reason) => {
            console.log('Disconnected from socket server:', reason)
        })

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (!socketRef.current || !chatId) return

        const socket = socketRef.current

        // Join the specific chat room
        
        socket.emit('join_chat', { chatId, userId: userId, projectId: projectId })

        // Listen for messages in this chat room
        const handleMessage = (msg: any) => {
            console.log("Received:", msg);
            setMessages((prevMessages) => [...prevMessages, msg])
        }

        socket.on("message", handleMessage)

        // Cleanup listener when chatId changes or component unmounts
        return () => {
            socket.off("message", handleMessage)
            socket.emit('leave_chat', chatId)
        }
    }, [chatId, userId])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await projectHttp.get(`/chat/project/${projectId}`)
                setMessages(response.data.messages)
                setChatId(response.data.chat._id)
            } catch (error) {
                console.error('Error fetching messages:', error)
            }
        }
        fetchMessages()
    }, [projectId])

    const handleSend = async (message: string) => {
        if (!socketRef.current || !chatId) return

        const messageData = {
            message: message,
            messageType: "text",
            chatId: chatId
        }
        

        try {
            // Save message to database via API
            const response = await projectHttp.post(`/chat/${chatId}/message`, messageData)

            // Emit the saved message via socket (with full message data)
            setMessages((prevMessages) => [...prevMessages, response.data])
            socketRef.current.emit("message", { ...response.data })
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    return (
        <div
            className={`w-[30%] h-full fixed top-0 right-0 z-50 ${isDark
                ? 'bg-gray-900/95 backdrop-blur-xl border-l border-gray-800'
                : 'bg-white/95 backdrop-blur-xl border-l border-gray-200'
                } shadow-xl`}
        >
            <div className={`flex justify-between items-center p-6 border-b transition-colors duration-200 ${isDark ? 'border-gray-800' : 'border-gray-200'
                }`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 hover:shadow-xl">
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
                    className={`rounded-lg ${isDark
                        ? 'hover:bg-gray-800/60 text-gray-300 hover:text-white'
                        : 'hover:bg-gray-100/60 text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <MdClose className="w-5 h-5" />
                </Button>
            </div>

            {/* Chat content area */}
            <div className="flex flex-col h-[calc(100%-88px)]">
                {/* ChatBox - takes 80% of available height */}
                <div className="flex-1 h-[80%] p-4 overflow-hidden">
                    <div className={`rounded-xl h-full ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                        }`}>
                        <ChatBox messages={messages} />
                    </div>
                </div>

                {/* ChatInput - positioned at bottom, takes remaining 20% */}
                <div className="h-[20%] min-h-[100px] p-4 pt-0">
                    <div className={`rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'
                        }`}>
                        <ChatInput handleSend={handleSend} />
                    </div>
                </div>
            </div>
        </div>
    )
}
