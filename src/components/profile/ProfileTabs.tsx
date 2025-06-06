import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Overview } from './Overview'
import { Projects } from './Projects'
import { useTheme } from '../theme-provider'
import { HiOutlineViewGrid, HiOutlineBriefcase } from 'react-icons/hi'

export const ProfileTabs = () => {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl"
    const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50"
    const textClr = isDark ? "text-gray-100" : "text-gray-900"
    const subtleText = isDark ? "text-gray-400" : "text-gray-600"

    return (
        <div className={`${bgCard} rounded-3xl border ${borderClr} shadow-xl overflow-hidden`}>
            <Tabs defaultValue="overview" className="w-full">
                {/* Tab Header */}
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <h2 className={`text-2xl font-bold ${textClr} mb-2`}>Profile Information</h2>
                    <p className={`${subtleText}`}>Manage your profile details and view your activity</p>
                </div>

                {/* Tab Navigation */}
                <TabsList className="flex w-full bg-transparent p-6 pb-0">
                    <div className="flex w-full bg-gray-100 dark:bg-gray-800/50 rounded-xl p-1">
                        <TabsTrigger
                            value="overview"
                            className={`
                                flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold
                                transition-all duration-200 cursor-pointer
                                data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
                                data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400
                                ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}
                            `}
                        >
                            <HiOutlineViewGrid className="w-4 h-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="projects"
                            className={`
                                flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold
                                transition-all duration-200 cursor-pointer
                                data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
                                data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400
                                ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}
                            `}
                        >
                            <HiOutlineBriefcase className="w-4 h-4" />
                            Projects
                        </TabsTrigger>
                    </div>
                </TabsList>

                {/* Tab Content */}
                <TabsContent
                    value="overview"
                    className="p-6 pt-6 focus:outline-none"
                >
                    <Overview />
                </TabsContent>
                <TabsContent
                    value="projects"
                    className="p-6 pt-6 focus:outline-none"
                >
                    <Projects />
                </TabsContent>
            </Tabs>
        </div>
    )
}