import { ServiceCard } from "@/components/cards/ServiceCard"
import { ConfirmModal } from "@/utility/confirmModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

let services = [
    {
        name: "Service 1",
        description: "Description for Service 1 Description for Service1Descriptionfor Service1 Description for Service 1 Description for Service 1 Description for Service 1 Description for Service1 Description for Service 1",
        pricing: {
            "currency": "USD",
            "amount": 100
        },
        skills: [{ name: "skill 2", id: 1 }, { name: "skill 1", id: 2 }],
        projectIds: [{ name: "This si smy project name what about tyou 2", id: 1 }, { name: "this is amy project name 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }],
        imageUrl: "https://github.com/shadcn.png",
        id: 1
    },
    {
        name: "Service 2",
        description: "Description for Service 1 Description for Service1Descriptionfor Service1 Description for Service 1 Description for Service 1 Description for Service 1 Description for Service1 Description for Service 1",
        pricing: {
            "currency": "USD",
            "amount": 100
        },
        skills: [{ name: "skill 2", id: 1 }, { name: "skill 1", id: 2 }],
        projectIds: [{ name: "This si smy project name what about tyou 2", id: 1 }, { name: "this is amy project name 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }],
        imageUrl: "https://github.com/shadcn.png",
        id: 2
    },
    {
        name: "Service 3",
        description: "Description for Service 1 Description for Service1Descriptionfor Service1 Description for Service 1 Description for Service 1 Description for Service 1 Description for Service1 Description for Service 1",
        pricing: {
            "currency": "USD",
            "amount": 100
        },
        skills: [],
        projectIds: [],
        imageUrl: "https://github.com/shadcn.png",
        id: 3
    },
]


export const Services = () => {
    const [showModal, setShowModal] = useState(false);
    const [operation, setOperation] = useState<"edit" | "delete" | undefined>(undefined);
    const [selectedService, setSelectedService] = useState<any>(null);

    const handleDelete = (service: any) => {
        services = services.filter((s) => s.id !== service.id);
    };

    const navigate = useNavigate()


    return (
        <div className="p-4">
            <div className="flex gap-3 flex-wrap md:flex md:flex-row">
                {services.map((service, index) => (
                    <ServiceCard
                        key={index}
                        service={service}
                        onEdit={(service) => {
                            navigate(`/services/${service.id}/edit`)
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
        </div>
    )
}
