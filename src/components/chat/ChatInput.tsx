import React, { useState } from 'react'
import { useTheme } from '../theme-provider'
import { Button } from '../ui/button'
import { IoSend, IoAttach } from 'react-icons/io5'
import { projectHttp } from '@/utility/api'

export const ChatInput = ({ handleSend }: { handleSend: (message: string) => void }) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const [message, setMessage] = useState('')


    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend(message)
            setMessage('')
        }
    }

    return (
        <div className={`w-full py-2 border-t transition-colors duration-200 ${isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
            <div className={`flex items-end gap-3 p-3 rounded-xl transition-all duration-200 ${isDark
                ? 'bg-gray-800/50 border border-gray-700'
                : 'bg-white border border-gray-200'
                } shadow-sm focus-within:shadow-md focus-within:ring-2 ${isDark
                    ? 'focus-within:ring-indigo-500/20'
                    : 'focus-within:ring-indigo-500/20'
                }`}>

                {/* Message Input */}
                <div className="flex-1 min-h-[40px] max-h-[120px]">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className={`w-full min-h-[40px] max-h-[120px] resize-none border-none outline-none bg-transparent transition-colors duration-200 placeholder:transition-colors placeholder:duration-200 ${isDark
                            ? 'text-gray-200 placeholder:text-gray-500'
                            : 'text-gray-900 placeholder:text-gray-400'
                            }`}
                        rows={3}
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: isDark ? '#374151 transparent' : '#d1d5db transparent'
                        }}
                    />
                </div>

                {/* Send Button */}
                <Button
                    onClick={() => {
                        if (message.trim()) {
                            handleSend(message)
                            setMessage('')
                        }
                    }}
                    disabled={!message.trim()}
                    className={`shrink-0 transition-all duration-200 hover:scale-105 ${message.trim()
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                        : isDark
                            ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-200/50 text-gray-400 cursor-not-allowed'
                        }`}
                    size="icon"
                >
                    <IoSend className={`w-4 h-4 transition-transform duration-200 ${message.trim() ? 'translate-x-0.5' : ''
                        }`} />
                </Button>
            </div>

        </div>
    )
}
