import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    userName: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
    phoneNumber: z.string()
});

type FormValues = z.infer<typeof schema>;

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema)
    });

    const onSubmit =async (data: FormValues) => {
        console.log(data);
        const url = `http://localhost:6001/auth/developer-register`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        const res = await fetch(url, options);
        const json = await res.json();
        console.log(json);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <label htmlFor="Name">Name</label>
            <input {...register("name")} placeholder="Name" />
            <br />
            {errors.name && <p>{errors.name.message}</p>}

            <label htmlFor="userName">UserName</label>
            <input {...register("userName")} placeholder="Username" />
            <br />
            {errors.userName && <p>{errors.userName.message}</p>}

            <label htmlFor="Email">Email</label>
            <input {...register("email")} placeholder="Email" />
            <br />
            {errors.email && <p>{errors.email.message}</p>}

            <label htmlFor="Password">Password</label>
            <input {...register("password")} type="password" placeholder="Password" />
            <br />
            {errors.password && <p>{errors.password.message}</p>}

            <label htmlFor="Confirm Password">Confirm Password</label>
            <input {...register("confirmPassword")} type="password" placeholder="Confirm Password" />
            <br />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

            <label htmlFor="Phone Number">Phone Number</label>
            <input {...register("phoneNumber")} placeholder="Phone Number" />
            <br />

            <button type="submit">Submit</button>
        </form>
    );
};

