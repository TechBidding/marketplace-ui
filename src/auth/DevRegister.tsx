import { useForm, SubmitHandler } from "react-hook-form"
import './auth.css'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { userHttp } from '@/utility/api'
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useState } from "react"



const devRegisterSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    userName: z.string().min(1, { message: "Username is required" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm password is required" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
})

type IDevRegisterInput = z.infer<typeof devRegisterSchema>

export const DevRegister = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<IDevRegisterInput>({
        resolver: zodResolver(devRegisterSchema)
    })
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const onSubmit: SubmitHandler<IDevRegisterInput> = (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match")
            return;
        }

        const { confirmPassword, ...rest } = data;
        setIsLoading(true)
        userHttp.post('auth/developer-register', rest).then(() => {
            setIsLoading(false)
            toast.success("Registration successful", {
                description: "Please verify your email to login"
            })
            navigate("/dev")
        }).catch((error) => {
            setIsLoading(false)
            console.error("Registration failed", error.response.data)
            toast.error("Registration Failed", {
                description: error.response.data.message
            })
        })
    }
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");


    return (

        <div className="">
            <div className="auth-header">
                <h1>Welcome to developer's marketplace</h1>
                <p>Please enter your details to register</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
                <div className="form-fields">
                    <div className="input-group">
                        <label>Name</label>
                        <input {...register("name")} placeholder="Enter your name" disabled={isLoading} />
                        {errors.name && (
                            <p className="error-message" role="alert">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input {...register("email", { required: true })} placeholder="Enter your email" type="email" disabled={isLoading} />
                        {errors.email && (
                            <p className="error-message" role="alert">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="input-group">
                        <label>Username</label>
                        <input {...register("userName", { required: true })} placeholder="Enter unique username" disabled={isLoading} />
                        {errors.userName && (
                            <p className="error-message" role="alert">{errors.userName.message}</p>
                        )}
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input {...register("phoneNumber", { required: true })} placeholder="Enter your phone number" type="tel" disabled={isLoading} />
                        {errors.phoneNumber && (
                            <p className="error-message" role="alert">{errors.phoneNumber.message}</p>
                        )}
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input {...register("password", { required: true })} placeholder="Enter your password" type="password" disabled={isLoading} />
                        {errors.password && (
                            <p className="error-message" role="alert">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input {...register("confirmPassword",
                            { required: true, validate: (value) => value === password || "Passwords do not match", })} placeholder="Confirm your password" type="password" disabled={isLoading} />
                        {errors.confirmPassword && (
                            <p className="error-message" role="alert">{errors.confirmPassword.message}</p>
                        )}
                        {password && confirmPassword && password !== confirmPassword && (
                            <p className="error-message" role="alert">Passwords do not match</p>
                        )}
                    </div>
                    <button type="submit" className="submit-button" disabled={isLoading}>Register</button>
                </div>
                <div className="form-footer">
                    <p>Already have an account? <a href="/dev/signin">Sign in</a></p>
                </div>
            </form>
        </div>

    )
}