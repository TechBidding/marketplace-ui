
export const Loadar = () => {
    return (
        <div className='fixed inset-0 w-full h-full bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm overflow-y-auto'>
            <div className="w-full max-w-[95%] sm:max-w-[80%] md:max-w-[600px] p-4 sm:p-6 md:p-8 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl">
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
            </div>
        </div>
    )
}
