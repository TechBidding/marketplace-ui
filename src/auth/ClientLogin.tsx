import { useForm, SubmitHandler } from "react-hook-form"
import './auth.css'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { userHttp } from '@/utility/api'
import { Link, useNavigate } from "react-router-dom"
import { login } from "@/store/AuthSlice"
import { useDispatch } from "react-redux"
import { toast } from "sonner"



const clientLoginSchema = z.object({
  identifier: z.string(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type IClientLoginInput = z.infer<typeof clientLoginSchema>

export const ClientLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IClientLoginInput>({
    resolver: zodResolver(clientLoginSchema)
  })
  const navigate = useNavigate()
  const dispatch= useDispatch()


  const onSubmit: SubmitHandler<IClientLoginInput> = (data) => {
      userHttp.post('auth/client-login', data).then(() => {
        dispatch(login())
        toast.success("Login successful")
        navigate("/client")

      }).catch((error) => {
        toast.error("Login failed. Please check your credentials.", {
          description: error.response.data.message,
        })
      })
  }

  return (
    <div className="">
      <div className="auth-header">
        <h1>Welcome to developer's marketplace</h1>
        <p>Please enter your details to login</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
        <div className="form-fields">
          <div className="input-group">
            <label>Username / Email / Phone</label>
            <input
              {...register("identifier", {
                required: "Please enter your email, username or phone number"
              })}
              placeholder="Enter your email, username or phone number"
              type="text"
            />
            {errors.identifier && (
              <p className="error-message" role="alert">{errors.identifier.message}</p>
            )}
          </div>
          <div className="input-group">
            <label>Password</label>
            <input {...register("password", { required: true })} placeholder="Enter your password" type="password" />
            {errors.password && (
              <p className="error-message" role="alert">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" className="submit-button">Sign In</button>
        </div>
        <div className="form-footer">
          <p>Don't have an account? <Link to="/client/signup">Sign up</Link></p>
        </div>
      </form>
    </div>

  )
}