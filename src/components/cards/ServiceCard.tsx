import { useTheme } from "../theme-provider";
import {
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineCurrencyDollar,
    HiOutlineStar,
    HiOutlineCode,
    HiOutlineBriefcase,
    HiOutlineSparkles
} from "react-icons/hi";

export const ServiceCard = ({ service, onEdit, onDelete }: {
    service: any;
    onEdit?: (service: any) => void;
    onDelete?: (service: any) => void;
}) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
    const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
    const textClr = isDark ? "text-gray-100" : "text-gray-900";
    const subtleText = isDark ? "text-gray-400" : "text-gray-600";

    return (
        <div className={`group ${bgCard} rounded-3xl border ${borderClr} shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
            {/* Service Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={service.imgUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop'}
                    alt={`${service.name} preview`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-3 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold">
                        <HiOutlineCurrencyDollar className="w-4 h-4" />
                        <span>{service.pricing.amount} {service.pricing.currency}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(service)}
                            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all duration-200 hover:scale-110"
                            title="Edit Service"
                        >
                            <HiOutlinePencil className="w-4 h-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(service)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md rounded-full text-white transition-all duration-200 hover:scale-110"
                            title="Delete Service"
                        >
                            <HiOutlineTrash className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Service Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                        {service.name}
                    </h3>
                </div>
            </div>

            {/* Service Content */}
            <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                    <p className={`${subtleText} text-sm leading-relaxed line-clamp-3`}>
                        {service.description}
                    </p>
                </div>

                {/* Skills Section */}
                {service.skills && service.skills.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <HiOutlineCode className={`w-4 h-4 ${subtleText}`} />
                            <h4 className={`text-sm font-semibold ${textClr}`}>Skills & Expertise</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {service.skills.slice(0, 4).map((skill: any, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-full"
                                >
                                    {typeof skill === 'string' ? skill : skill.name}
                                </span>
                            ))}
                            {service.skills.length > 4 && (
                                <span className={`px-3 py-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} ${subtleText} text-xs rounded-full`}>
                                    +{service.skills.length - 4} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {service.projectIds && service.projectIds.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <HiOutlineBriefcase className={`w-4 h-4 ${subtleText}`} />
                            <h4 className={`text-sm font-semibold ${textClr}`}>Related Projects</h4>
                        </div>
                        <div className="space-y-2">
                            {service.projectIds.slice(0, 2).map((project: any, index: number) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} border ${borderClr}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${textClr} truncate`}>
                                            {typeof project === 'string' ? project : project.name}
                                        </span>
                                        {project.status && (
                                            <span className={`px-2 py-1 text-xs rounded-full ${project.status === 'completed'
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {project.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {service.projectIds.length > 2 && (
                                <p className={`text-xs ${subtleText} text-center`}>
                                    +{service.projectIds.length - 2} more projects
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Empty States */}
                {(!service.skills || service.skills.length === 0) && (!service.projectIds || service.projectIds.length === 0) && (
                    <div className={`p-6 rounded-xl border-2 border-dashed ${borderClr} text-center`}>
                        <HiOutlineSparkles className={`w-8 h-8 ${subtleText} mx-auto mb-2`} />
                        <p className={`text-sm ${subtleText}`}>
                            Add skills and projects to make this service more attractive
                        </p>
                    </div>
                )}

                {/* Service Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <HiOutlineStar className="w-4 h-4 text-yellow-500" />
                            <span className={`text-sm font-medium ${textClr}`}>4.8</span>
                        </div>
                        <div className={`text-sm ${subtleText}`}>
                            {Math.floor(Math.random() * 50) + 5} orders
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;