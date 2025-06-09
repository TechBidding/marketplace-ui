import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useTheme } from '../theme-provider';

export const ChatBox = ({ messages }: { messages: any[] }) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const user_type = useSelector((state: any) => state.auth.userType);
    const userDetails = useSelector((state: any) => state.auth.userDetails);
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className='h-full w-full flex flex-col'>
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? 'scrollbar-dark' : 'scrollbar-light'
                }`}
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: isDark ? '#374151 transparent' : '#d1d5db transparent'
                }}>
                {messages.length === 0 ? (
                    <div className={`flex items-center justify-center h-full ${isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        <div className="text-center">
                            <div className="text-4xl mb-2">💬</div>
                            <p className="text-sm">No messages yet</p>
                            <p className="text-xs mt-1">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <Message
                            key={message._id}
                            message={message}
                            isSender={message.senderId === userDetails._id}
                            isDark={isDark}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}

const Message = ({ message, isSender, isDark }: { message: any, isSender: boolean, isDark: boolean }) => {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom duration-300`}>
            <div className={`max-w-[70%] ${isSender ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-2 rounded-2xl transition-all duration-200 ${isSender
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
                    : isDark
                        ? 'bg-gray-700 text-gray-100 rounded-bl-md'
                        : 'bg-gray-200 text-gray-900 rounded-bl-md'
                    } shadow-sm hover:shadow-md`}>
                    <p className="text-sm leading-relaxed break-words">
                        {message.message}
                    </p>
                    {message.messageType !== 'text' && (
                        <div className={`mt-2 text-xs ${isSender ? 'text-white/80' : isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            📎 {message.fileName} ({message.fileSize})
                        </div>
                    )}
                </div>
                <div className={`text-xs px-2 ${isDark ? 'text-gray-400' : 'text-gray-500'
                    } ${isSender ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.createdAt)}
                </div>
            </div>
        </div>
    )
}