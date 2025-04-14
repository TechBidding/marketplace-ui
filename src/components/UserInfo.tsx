
import { userHttp } from '@/utility/api'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export const UserInfo = () => {

    const userDetails = useSelector((state: any) => state.auth.userDetails)
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn)
    const params = useParams()
    const [userData, setUserData] = useState<any>(null)


    useEffect(() => {
        userHttp.get(`developer/${params.username}`).then((res) => {
            setUserData(res.data)
        }
        ).catch((err) => {
            console.log("Error while fetching user info: ", err);
        }
        )
    },[])

    return (
        <div className='border border-amber-400 w-75 h-full p-2 flex flex-col' >
            <div className='flex flex-col'>
                <div className='w-70 h-70 rounded-full bg-gray-300 mt-4'>
                    <img
                        src="https://github.com/shadcn.png"
                        className="w-70 h-70 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
                <div className='mt-4 text-left'>
                    <h1 className='text-2xl font-bold mt-4'>{userData?.name}</h1>
                    <p className='text-gray-500'>{userData?.userName}</p>
                </div>
            </div>

            <div className='mt-4 text-left'>
                <p className='text-gray-100'>Hello This is me Priyanshu. I am a software engineer @contentstack. and i love what i do.</p>
            </div>

            {isLoggedIn && userDetails?.userName === params.username && (
                <div className='mt-4 w-full bg-green-900/60 text-white font-bold py-2 rounded hover:bg-green-900'>
                    <button >
                        Edit Profile
                    </button>
                </div>
            ) }

        </div>
    )
}
