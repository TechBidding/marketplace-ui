import { ServiceCard } from "@/components/cards/ServiceCard"

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
        imageUrl: "https://github.com/shadcn.png"
    },
    {
        name: "Service 1",
        description: "Description for Service 1 Description for Service1Descriptionfor Service1 Description for Service 1 Description for Service 1 Description for Service 1 Description for Service1 Description for Service 1",
        pricing: {
            "currency": "USD",
            "amount": 100
        },
        skills: [{ name: "skill 2", id: 1 }, { name: "skill 1", id: 2 }],
        projectIds: [{ name: "This si smy project name what about tyou 2", id: 1 }, { name: "this is amy project name 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }],
        imageUrl: "https://github.com/shadcn.png"
    },
    {
        name: "Service 1",
        description: "Description for Service 1 Description for Service1Descriptionfor Service1 Description for Service 1 Description for Service 1 Description for Service 1 Description for Service1 Description for Service 1",
        pricing: {
            "currency": "USD",
            "amount": 100
        },
        skills: [{ name: "skill 2", id: 1 }, { name: "skill 1", id: 2 }],
        projectIds: [{ name: "This si smy project name what about tyou 2", id: 1 }, { name: "this is amy project name 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }, { name: "project 2", id: 1 }, { name: "project 1", id: 2 }],
        imageUrl: "https://github.com/shadcn.png"
    },
]

export const Services = () => {
    return (
        <div className="p-4">
            <div className="flex gap-3 flex-wrap md:flex md:flex-row">
                {services.map((service, index) => (
                    <ServiceCard
                        key={index}
                        service={service}
                        onEdit={(service) => {
                            console.log('Edit service:', service);
                        }}
                        onDelete={(service) => {
                            console.log('Delete service:', service);
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
