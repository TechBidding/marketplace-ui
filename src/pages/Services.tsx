import { ServiceCard } from "@/components/cards/ServiceCard"
import { CreateService } from "@/components/CreateService";
import { userHttp } from "@/utility/api";
import { ConfirmModal } from "@/utility/confirmModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";



export const Services = () => {
    const [showModal, setShowModal] = useState(false);
    const [operation, setOperation] = useState<"edit" | "delete" | undefined>(undefined);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [openCreateServiceModal, setOpenCreateServiceModal] = useState<boolean>(false);
    const [servicesList, setServicesList] = useState<any[]>([]);
    const userDetails = useSelector((state: any) => state.auth.userDetails)

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

    const navigate = useNavigate()

    useEffect(() => {
        userHttp.get(`/service?username=${userDetails.userName}`)
            .then((res) => {
                if (res.status === 200) {
                    setServicesList(res.data);
                    console.log("res.data", res.data);
                }
            }
            )
            .catch((err) => {
                console.log(err);
            }
            )
    }, [])




    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Services</h1>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setOpenCreateServiceModal(true)}
                >
                    Create Service
                </button>
            </div>

            <div className="flex gap-3 flex-wrap md:flex md:flex-row">
                {servicesList.map((service, index) => (
                    <ServiceCard
                        key={index}
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

            {showModal && (
                <ConfirmModal
                    title={`Are you sure you want to ${operation} this ${selectedService.name}?`}
                    message="This action cannot be undone."
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
                <CreateService onCancel={() => {
                    setOpenCreateServiceModal(false);
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
    )
}
