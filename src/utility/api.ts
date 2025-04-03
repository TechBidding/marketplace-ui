import axios from 'axios';


export const http = (baseURL:string) => axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const userHttp = http(`${import.meta.env.VITE_USER_MANAGEMENT_API_URL}`);
export const projectHttp = http(`${import.meta.env.VITE_PROJECT_MANAGEMENT_API_URL}`);
export const notificationHttp = http(`${import.meta.env.VITE_NOTIFICATION_MANAGEMENT_API_URL}`);

