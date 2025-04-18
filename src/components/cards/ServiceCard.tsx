import { useTheme } from "../theme-provider";

export const ServiceCard = ({ service, onEdit, onDelete }: {
    service: any;
    onEdit?: (service: any) => void;
    onDelete?: (service: any) => void;
}) => {
    const { theme } = useTheme();
    return (
        <div className={`
            relative
            flex flex-col md:flex-row
            w-full lg:w-[32.5%] h-[700px] md:h-[400px]
            p-4 gap-4
            rounded-xl
            transition-all duration-300 ease-in-out
            shadow-sm hover:shadow-lg
            ${theme === "dark"
                ? 'bg-green-950/90 hover:bg-green-950'
                : 'bg-white hover:bg-white'}
        `}>



            {/* Left Section - Image and Basic Info */}
            <div className={`
                flex flex-col gap-4
                w-full md:w-[55%] h-full
                p-2 rounded-lg shadow-sm
                ${theme === "dark" ? 'bg-green-900/20' : 'bg-white/50'}
            `}>
                {/* Title and Price */}
                <div className="space-y-2 h-[20%]">
                    <h1 className={`
                        text-l font-bold truncate
                        ${theme === "dark" ? 'text-gray-200' : 'text-gray-800'}
                    `}>
                        {service.name}
                    </h1>
                    <div className={`
                        inline-flex items-center px-3 py-1 rounded-full
                        ${theme === "dark"
                            ? 'bg-green-900/30 text-emerald-200'
                            : 'bg-amber-100 text-amber-700'}
                    `}>
                        <span className="font-medium">
                            {service.pricing.amount} {service.pricing.currency}
                        </span>
                    </div>
                </div>

                {/* Image */}
                <div className="relative group h-[80%]">
                    <div className="relative w-full h-full overflow-hidden rounded-lg shadow-md">
                        <img
                            src={service.imgUrl}
                            alt={`${service.name} preview`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                </div>
            </div>

            {/* Right Section - Description, Skills, and Projects */}
            <div className={`
                flex flex-col
                w-full md:w-[60%] h-[95%]
                gap-4 overflow-hidden
                ${theme === "dark" ? 'text-gray-300' : 'text-gray-600'}
            `}>
                {/* Description */}
                <div className={`
                    h-[25%] p-4 rounded-lg overflow-y-auto
                    ${theme === "dark" ? 'bg-green-900/10' : 'bg-gray-50'}
                `}>
                    <p className="font-light text-sm leading-relaxed">
                        {service.description}
                    </p>
                </div>

                {/* Skills */}
                <div className={`
                    h-[35%] px-4 rounded-lg overflow-y-auto
                    ${theme === "dark" ? 'bg-green-900/10' : 'bg-gray-50'}
                `}>
                    <h3 className={`
                        text-sm font-medium mb-3 sticky top-0 py-2
                        ${theme === "dark" ? 'text-gray-400 bg-green-900/10' : 'text-gray-500 bg-gray-50'}
                    `}>
                        Skills & Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {service.skills && service.skills.length === 0 && (
                            <div className={`
                                flex items-center justify-center
                                w-full h-full
                                p-4 rounded-lg
                                ${theme === "dark" ? 'bg-green-900/10' : 'bg-gray-50'}
                            `}>
                                <span className="text-sm font-light text-red-400">
                                    No skills available.
                                </span>
                            </div>
                        )}
                        {service.skills.map((skill: any, index: number) => (
                            <div
                                key={index}
                                className={`
                                    flex items-center gap-1.5
                                    px-3 py-1.5 
                                    rounded-full text-xs font-medium
                                    transition-colors duration-200
                                    ${theme === "dark"
                                                                ? 'bg-green-900/30 hover:bg-green-900/50 text-emerald-200'
                                                                : 'bg-amber-100 hover:bg-amber-200 text-amber-700'}
        `}
                            >
                                <span className="truncate max-w-[120px]">
                                    {typeof skill === 'string' ? skill : skill.name}
                                </span>
                                {skill.level && (
                                    <span className={`
                                        px-1.5 py-0.5 rounded-full text-[10px]
                                        ${theme === "dark"
                                                                    ? 'bg-green-800/50 text-green-200'
                                                                    : 'bg-amber-200/70 text-amber-700'}
                                    `}>
                                        {skill.level}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Projects */}
                <div className={`
                    h-[40%] px-4 rounded-lg overflow-y-auto
                    ${theme === "dark" ? 'bg-green-900/10' : 'bg-gray-50'}
                `}>
                    <h3 className={`
                        text-sm font-medium mb-3 sticky top-0 py-2
                        ${theme === "dark" ? 'text-gray-400 bg-green-900/10' : 'text-gray-500 bg-gray-50'}
                    `}>
                        Related Projects
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {service.projectIds && service.projectIds.length === 0 && (
                            <div className={`
                                flex items-center justify-center
                                w-full h-full
                                p-4 rounded-lg
                                ${theme === "dark" ? 'bg-green-900/10' : 'bg-gray-50'}
                            `}>
                                <span className="text-sm font-light text-red-400">
                                    No related projects available.
                                </span>
                            </div>
                        )}
                        {service.projectIds && service.projectIds.map((project: any, index: number) => (
                            <div
                                key={index}
                                className={`
            flex flex-col gap-1.5
            min-w-[120px] max-w-[150px]
            p-2.5 rounded-lg
            transition-all duration-200
            ${theme === "dark"
                                        ? 'bg-green-900/30 hover:bg-green-900/50'
                                        : 'bg-amber-100 hover:bg-amber-200'}
        `}
                            >
                                <span className="text-xs font-medium truncate">
                                    {typeof project === 'string' ? project : project.name}
                                </span>
                                {project.status && (
                                    <span className={`
                text-[10px] px-2 py-1 rounded-full w-fit
                ${theme === "dark"
                                            ? 'bg-green-800/50 text-green-200'
                                            : 'bg-amber-200/70 text-amber-700'}
            `}>
                                        {project.status}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-2 right-4 flex items-center gap-2 z-10">
                {onEdit && (
                    <button
                        onClick={() => onEdit(service)}
                        className={`
                            p-2 rounded-full
                            transition-all duration-200
                            ${theme === "dark"
                                ? 'bg-green-900/30 hover:bg-green-900/50 text-emerald-200'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-700'}
                        `}
                        title="Edit Service"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={() => onDelete(service)}
                        className={`
                            p-2 rounded-full
                            transition-all duration-200
                            ${theme === "dark"
                                ? 'bg-red-900/30 hover:bg-red-900/50 text-red-200'
                                : 'bg-red-100 hover:bg-red-200 text-red-700'}
                        `}
                        title="Delete Service"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ServiceCard;