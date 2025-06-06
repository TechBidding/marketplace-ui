import React, { useEffect, useState } from 'react'
import { useTheme } from '../theme-provider'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  HiOutlineBriefcase,
  HiOutlineStar,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineTrendingUp,
  HiOutlineUserGroup,
  HiOutlineChat
} from 'react-icons/hi'
import { userHttp } from '@/utility/api'

export const Overview = () => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const params = useParams()
  const userDetails = useSelector((state: any) => state.auth.userDetails)

  const textClr = isDark ? "text-gray-100" : "text-gray-900"
  const subtleText = isDark ? "text-gray-400" : "text-gray-600"
  const cardBg = isDark ? "bg-gray-800/30" : "bg-white/60"
  const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50"

  const [userData, setUserData] = useState<any>(null)
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    avgRating: 0,
    totalEarnings: 0,
    joinDate: null
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await userHttp.get(`developer/${params.username}`)
        setUserData(res.data)
        // You would typically fetch stats from a separate endpoint
        setStats({
          totalProjects: Math.floor(Math.random() * 50) + 5,
          completedProjects: Math.floor(Math.random() * 40) + 3,
          avgRating: (Math.random() * 2 + 3).toFixed(1),
          totalEarnings: Math.floor(Math.random() * 50000) + 5000,
          joinDate: res.data.createdAt || new Date().toISOString()
        })
      } catch (err) {
        try {
          const res = await userHttp.get(`client/${params.username}`)
          setUserData(res.data.data)
          setStats({
            totalProjects: Math.floor(Math.random() * 30) + 2,
            completedProjects: Math.floor(Math.random() * 25) + 1,
            avgRating: (Math.random() * 2 + 3).toFixed(1),
            totalEarnings: Math.floor(Math.random() * 100000) + 10000,
            joinDate: res.data.data.createdAt || new Date().toISOString()
          })
        } catch (err) {
          console.error('Error fetching user data:', err)
        }
      }
    }

    fetchUserData()
  }, [params.username])

  const StatCard = ({ icon, title, value, subtitle, color }: any) => (
    <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className={`text-2xl font-bold ${textClr}`}>{value}</p>
          <p className={`text-sm font-medium ${textClr}`}>{title}</p>
          {subtitle && <p className={`text-xs ${subtleText}`}>{subtitle}</p>}
        </div>
      </div>
    </div>
  )

  const ActivityItem = ({ icon, title, description, time, color }: any) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 mt-1`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${textClr}`}>{title}</p>
        <p className={`text-sm ${subtleText} mt-1`}>{description}</p>
        <p className={`text-xs ${subtleText} mt-2`}>{time}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div>
        <h3 className={`text-lg font-bold ${textClr} mb-6`}>Profile Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<HiOutlineBriefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            title="Total Projects"
            value={stats.totalProjects}
            color="blue"
          />
          <StatCard
            icon={<HiOutlineCheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
            title="Completed"
            value={stats.completedProjects}
            subtitle={`${Math.round((stats.completedProjects / stats.totalProjects) * 100)}% success rate`}
            color="emerald"
          />
          <StatCard
            icon={<HiOutlineStar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />}
            title="Average Rating"
            value={`${stats.avgRating}★`}
            color="yellow"
          />
          <StatCard
            icon={<HiOutlineTrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
            title="Total Earnings"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            color="purple"
          />
        </div>
      </div>

      {/* Skills & Expertise */}
      {userData?.skills && userData.skills.length > 0 && (
        <div>
          <h3 className={`text-lg font-bold ${textClr} mb-6`}>Skills & Expertise</h3>
          <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
            <div className="flex flex-wrap gap-3">
              {userData.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h3 className={`text-lg font-bold ${textClr} mb-6`}>Recent Activity</h3>
        <div className={`${cardBg} rounded-2xl border ${borderClr} overflow-hidden`}>
          <div className="space-y-1">
            <ActivityItem
              icon={<HiOutlineCheckCircle className="w-4 h-4 text-emerald-600" />}
              title="Project Completed"
              description="Successfully delivered e-commerce website redesign"
              time="2 days ago"
              color="emerald"
            />
            <ActivityItem
              icon={<HiOutlineBriefcase className="w-4 h-4 text-blue-600" />}
              title="New Project Started"
              description="Mobile app development for startup client"
              time="1 week ago"
              color="blue"
            />
            <ActivityItem
              icon={<HiOutlineChat className="w-4 h-4 text-purple-600" />}
              title="Client Review Received"
              description="Received 5-star rating with excellent feedback"
              time="2 weeks ago"
              color="purple"
            />
            <ActivityItem
              icon={<HiOutlineUserGroup className="w-4 h-4 text-orange-600" />}
              title="Profile Updated"
              description="Added new skills and updated portfolio"
              time="3 weeks ago"
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div>
        <h3 className={`text-lg font-bold ${textClr} mb-6`}>Profile Completion</h3>
        <div className={`${cardBg} rounded-2xl p-6 border ${borderClr}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`font-medium ${textClr}`}>Profile Strength</span>
            <span className={`text-sm ${subtleText}`}>85%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
              <span className={subtleText}>Profile photo added</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
              <span className={subtleText}>Bio completed</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
              <span className={subtleText}>Contact info verified</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineClock className="w-4 h-4 text-yellow-500" />
              <span className={subtleText}>Portfolio needs update</span>
            </div>
          </div>
        </div>
      </div>

      {/* Member Since */}
      <div>
        <div className={`${cardBg} rounded-2xl p-6 border ${borderClr} text-center`}>
          <HiOutlineCalendar className={`w-8 h-8 ${subtleText} mx-auto mb-3`} />
          <p className={`text-sm ${subtleText} mb-1`}>Member since</p>
          <p className={`font-semibold ${textClr}`}>
            {stats.joinDate ? new Date(stats.joinDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            }) : 'Recently joined'}
          </p>
        </div>
      </div>
    </div>
  )
}
