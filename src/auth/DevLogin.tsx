import { useForm, SubmitHandler } from "react-hook-form"
import './auth.css'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { userHttp } from '@/utility/api'
import { useNavigate } from "react-router-dom"
import { login, selectIsLoggedIn } from "@/store/AuthSlice"
import { useDispatch, useSelector } from "react-redux"
import { useAppSelector } from "@/store/Store"
import { toast } from "sonner"



const devLoginSchema = z.object({
  identifier: z.string(),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
})

type IDevLoginInput = z.infer<typeof devLoginSchema>

export const DevLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IDevLoginInput>({
    resolver: zodResolver(devLoginSchema)
  })
  const navigate = useNavigate()
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  console.log("isLoggedIn", isLoggedIn)
  const isLoggedIn2 = useAppSelector(selectIsLoggedIn);
  console.log("isLoggedIn2", isLoggedIn2)
  const dispatch = useDispatch()


  const onSubmit: SubmitHandler<IDevLoginInput> = (data) => {
      userHttp.post('auth/developer-login', data).then((res) => {
        console.log("res", res)
        dispatch(login())
        toast.success("Login successful")
        navigate("/dev")

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
          <p>Don't have an account? <a href="/dev/signup">Sign up</a></p>
        </div>
      </form>
    </div>

  )
}