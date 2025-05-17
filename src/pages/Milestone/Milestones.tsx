import { projectHttp } from '@/utility/api'
import { useTheme } from "../../components/theme-provider"; 
import { MdOutlinePlaylistAdd, MdPlaylistAddCheck } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useEffect, useState } from 'react';

export const Milestones = () => {
    const [allMilestones, setAllMilestones] = useState<any>()
    const params = useParams();

    const { theme } = useTheme();
    const isDark = theme === "dark";
    const borderClr = isDark ? "border-neutral-700" : "border-gray-300";
    const hoverClr = isDark ? "hover:bg-neutral-800" : "hover:bg-gray-50";

    useEffect(() => {
        projectHttp.get(`project/${params.id}/milestone`)
            .then((res) => {
                setAllMilestones(res.data.data);
            })
            .catch((error) => {
                toast.error("Error fetching project milestones", {
                    description: error.response.data.message
                });
            })
    }, [])
    return (
        <div className={`mt-8 space-y-4`}>
            {allMilestones && allMilestones.map((m: any) => (
                <Link to={`milestone/${m._id}`}>
                <div
                    key={m._id}
                    className={`flex items-center justify-between rounded-lg border px-5 py-4 cursor-pointer ${hoverClr} ${borderClr}`}
                >
                    <div className="flex items-center gap-3">
                        {m.status === 'completed' ? (
                            <MdPlaylistAddCheck className="h-5 w-5 text-emerald-600" />
                        ) : (
                            <MdOutlinePlaylistAdd className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="font-medium">{m.title}</span>
                    </div>
                    {m.status === "completed" && <span className="text-sm text-emerald-600">Completed</span>}
                </div>
                </Link>
            ))}
        </div>
    )
}
