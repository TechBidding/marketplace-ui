import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { UserInfo } from '@/components/UserInfo'

export const Profile = () => {
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='w-full md:h-screen md:w-[30%] '>
        <UserInfo />
      </div>
      <div className='w-full md:h-screen md:w-[70%]'>
        <ProfileTabs />
      </div>
    </div>
  )
}
