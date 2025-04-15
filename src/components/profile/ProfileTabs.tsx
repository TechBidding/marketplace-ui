import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Overview } from './Overview'
import { Projects } from './Projects'
import { useTheme } from '../theme-provider'

export const ProfileTabs = () => {
    const { theme } = useTheme()

    return (
        <div className="w-full px-4 sm:px-6 py-4">
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className={`
          grid w-full grid-cols-2 
          rounded-xl border-1 
          px-1 sm:p-4 mb-6
          transition-colors duration-300
          ${theme === "dark"
                        ? 'bg-green-950/90 border-green-900 shadow-green-900/20 border-0'
                        : 'bg-white'}
        `}>
                    <TabsTrigger
                        value="overview"
                        className={`
              px-4 py-2 rounded-lg text-sm sm:text-base font-medium
              transition-all duration-200 cursor-pointer
              data-[state=active]:shadow-sm
              ${theme === "dark"
                                ? 'text-gray-400 hover:text-gray-200 data-[state=active]:bg-green-900/60 data-[state=active]:text-white'
                                : 'text-gray-600 hover:text-gray-800 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900'}
            `}
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="projects"
                        className={`
              px-4 py-2 rounded-lg text-sm sm:text-base font-medium
              transition-all duration-200 cursor-pointer
              data-[state=active]:shadow-sm
              ${theme === "dark"
                                ? 'text-gray-400 hover:text-gray-200 data-[state=active]:bg-green-900/60 data-[state=active]:text-white'
                                : 'text-gray-600 hover:text-gray-800 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900'}
            `}
                    >
                        Projects
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value="overview"
                    className={`
            p-4 sm:p-6 rounded-xl min-h-[400px]
            transition-colors duration-300
            ${theme === "dark"
                            ? 'bg-green-950/30'
                            : 'bg-gray-50'}
          `}
                >
                    <Overview />
                </TabsContent>
                <TabsContent
                    value="projects"
                    className={`
            p-4 sm:p-6 rounded-xl min-h-[400px]
            transition-colors duration-300
            ${theme === "dark"
                            ? 'bg-green-950/30'
                            : 'bg-gray-50'}
          `}
                >
                    <Projects />
                </TabsContent>
            </Tabs>
        </div>
    )
}