import axios from "axios"
import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { UserContext } from "../UserContext"

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)
    const { setUser } = useContext(UserContext)

    async function handleLoginSubmit(e) {
        e.preventDefault()
        try {
            const { data } = await axios.post('http://localhost:4000/login', { email, password }, { withCredentials: true })
            setUser(data)
            setRedirect(true)
            alert('Login Successful')
        } catch (error) {
            console.error(error)
            alert('Login Failed')
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className="primary">Login</button>
                    <div className="py-1 text-center text-gray-500">Do not have an account? <Link className="underline text-black" to={'/register'}>Register Now</Link></div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
