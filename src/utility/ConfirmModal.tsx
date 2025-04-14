import { useTheme } from "@/components/theme-provider";

interface ConfirmModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal = ({ title, message, onConfirm, onCancel }: ConfirmModalProps) => {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-50 p-4">
            <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                } p-4 md:p-6 border rounded-2xl w-full max-w-[90%] md:max-w-[500px] shadow-lg`}>
                <div className="space-y-3">
                    <h1 className="text-lg md:text-xl font-bold text-center">{title}</h1>
                    <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        } text-sm md:text-base`}>
                        {message}
                    </p>
                </div>
                <div className="flex justify-center gap-3 mt-6">
                    <button
                        className={`${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                            } text-white py-2 px-4 rounded-lg text-sm md:text-base transition-colors`}
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className={`${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                            } text-white py-2 px-4 rounded-lg text-sm md:text-base transition-colors`}
                        onClick={onCancel}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}