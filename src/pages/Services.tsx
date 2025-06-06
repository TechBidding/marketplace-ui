import { ServiceCard } from "@/components/cards/ServiceCard"
import { CreateService } from "@/components/CreateService";
import { userHttp } from "@/utility/api";
import { ConfirmModal } from "@/utility/confirmModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import {
    HiOutlinePlus,
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlineBriefcase,
    HiOutlineCollection,
    HiOutlineSparkles
} from "react-icons/hi";
import { Loader2 } from "lucide-react";

export const Services = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [showModal, setShowModal] = useState(false);
    const [operation, setOperation] = useState<"edit" | "delete" | undefined>(undefined);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [openCreateServiceModal, setOpenCreateServiceModal] = useState<boolean>(false);
    const [servicesList, setServicesList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    const userDetails = useSelector((state: any) => state.auth.userDetails);
    const navigate = useNavigate();

    const bgPage = isDark ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 via-white to-gray-100";
    const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
    const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
    const textClr = isDark ? "text-gray-100" : "text-gray-900";
    const subtleText = isDark ? "text-gray-400" : "text-gray-600";

    const handleDelete = (service: any) => {
        userHttp.delete(`/service/${service._id}`)
            .then((res) => {
                toast.success("Service deleted successfully");
                setServicesList((prev) => prev.filter((s) => s._id !== service._id));
                setOperation(undefined);
                setSelectedService(null);
            })
            .catch((err) => {
                toast.error("Error while deleting service", {
                    description: err.response.data.message
                });
            })
    };

    useEffect(() => {
        setLoading(true);
        userHttp.get(`/service?username=${userDetails.userName}`)
            .then((res) => {
                if (res.status === 200) {
                    setServicesList(res.data);
                }
            })
            .catch((err) => {
                toast.error("Failed to load services");
            })
            .finally(() => {
                setLoading(false);
            })
    }, []);

    // Filter services based on search term
    const filteredServices = servicesList.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = ["all", "web-development", "mobile-apps", "design", "consulting"];

    if (loading) {
        return (
            <div className={`min-h-screen ${bgPage} flex justify-center items-center`}>
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className={`text-lg ${subtleText}`}>Loading your services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bgPage} py-8 px-4`}>
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className={`${bgCard} rounded-3xl border ${borderClr} shadow-xl overflow-hidden mb-8`}>
                    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-12">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <HiOutlineSparkles className="h-8 w-8 text-white/80" />
                                        <span className="text-white/80 font-medium">Service Portfolio</span>
                                    </div>
                                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                                        My Services
                                    </h1>
                                    <p className="text-white/90 text-lg max-w-2xl">
                                        Showcase your expertise and grow your business with professional service listings
                                    </p>
                                    <div className="flex items-center gap-6 text-white/90 mt-6">
                                        <div className="flex items-center gap-2">
                                            <HiOutlineCollection className="h-5 w-5" />
                                            <span className="font-semibold">{servicesList.length} Services</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <HiOutlineBriefcase className="h-5 w-5" />
                                            <span>Professional Portfolio</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setOpenCreateServiceModal(true)}
                                    className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <HiOutlinePlus className="h-6 w-6" />
                                    Create New Service
                                </button>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className={`${bgCard} rounded-2xl border ${borderClr} p-6 mb-8`}>
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <HiOutlineSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${subtleText}`} />
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 ${isDark
                                        ? 'bg-gray-800/50 border-gray-700 focus:border-indigo-500 text-gray-100'
                                        : 'bg-white border-gray-200 focus:border-indigo-500 text-gray-900'
                                        } focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
                                />
                            </div>
                        </div>

                        {/* Filter buttons could be added here */}
                        <div className="flex items-center gap-2">
                            <span className={`${subtleText} text-sm`}>
                                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                            </span>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                        {filteredServices.map((service, index) => (
                            <ServiceCard
                                key={service._id || index}
                                service={service}
                                onEdit={(service) => {
                                    setOperation("edit");
                                    setOpenCreateServiceModal(true);
                                    setSelectedService(service);
                                }}
                                onDelete={(service) => {
                                    setShowModal(true);
                                    setOperation("delete");
                                    setSelectedService(service);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={`${bgCard} rounded-2xl border ${borderClr} p-12 text-center`}>
                        <HiOutlineCollection className={`w-16 h-16 ${subtleText} mx-auto mb-4`} />
                        <h3 className={`text-xl font-semibold ${textClr} mb-2`}>
                            {searchTerm ? 'No services found' : 'No services yet'}
                        </h3>
                        <p className={`${subtleText} mb-6 max-w-md mx-auto`}>
                            {searchTerm
                                ? 'Try adjusting your search terms to find what you\'re looking for'
                                : 'Create your first service to start showcasing your expertise and attracting clients'
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setOpenCreateServiceModal(true)}
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
                            >
                                <HiOutlinePlus className="h-5 w-5" />
                                Create Your First Service
                            </button>
                        )}
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors mx-auto"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}

                {/* Modals */}
                {showModal && (
                    <ConfirmModal
                        title={`Delete ${selectedService?.name}?`}
                        message="This action cannot be undone. Are you sure you want to delete this service?"
                        onConfirm={() => {
                            setShowModal(false);
                            operation === "delete" && handleDelete(selectedService);
                            setOperation(undefined);
                            setSelectedService(null);
                        }}
                        onCancel={() => {
                            setShowModal(false);
                            setOperation(undefined);
                            setSelectedService(null);
                        }}
                    />
                )}

                {openCreateServiceModal && (
                    <CreateService
                        onCancel={() => {
                            setOpenCreateServiceModal(false);
                            setSelectedService(null);
                            setOperation(undefined);
                        }}
                        setServicesList={setServicesList}
                        setOpenCreateServiceModal={setOpenCreateServiceModal}
                        selectedService={selectedService}
                        operation={operation}
                        setOperation={setOperation}
                        setSelectedService={setSelectedService}
                    />
                )}
            </div>
        </div>
    )
}
