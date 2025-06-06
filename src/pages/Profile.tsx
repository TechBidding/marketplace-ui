import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { UserInfo } from '@/components/UserInfo'
import { useTheme } from '@/components/theme-provider'

export const Profile = () => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const bgPage = isDark ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"

  return (
    <div className={`min-h-screen ${bgPage} p-4 md:p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* User Info Sidebar */}
          <div className="xl:col-span-4">
            <UserInfo />
          </div>

          {/* Profile Content */}
          <div className="xl:col-span-8">
            <ProfileTabs />
          </div>
        </div>
      </div>
    </div>
  )
}
