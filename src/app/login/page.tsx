"use client";
import React from "react"
import axios from "axios"
import Link from "next/link";
import { useRouter } from "next/router";


export default function LoginPage() {
    const [user, setUser] = React.useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = React.useState(false);
    const [buttonDisabled, setButtonDisabled] = React.useState(false)

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", {user});
            console.log(response.data);
        } catch (error: any) {
            console.log(error.message);
        } finally{
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0){
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true)
        }
    }, [user]);

    return (
        <div className="flex flex-col flex-wrap mt-1 p-3 min-h-screen">
            <h1>{loading ? "Processing..." : "Login"}</h1>
            <form>
                <label htmlFor="email">Email</label>
                <input 
                type="email" 
                onChange={(e) => setUser({...user, email: e.target.value})}
                placeholder="Email...."
                value={user.email}
                className="bg-black text-white text-4xl p-1 m-1 hover:bg-white"
                />
                <label htmlFor="password">Password</label>
                <input 
                type="password" 
                value={user.password}
                className="bg-black text-white text-4xl p-1 m-1 hover:bg-white"
                placeholder="password...."
                onChange={(e) => setUser({...user, password: e.target.value})}
                />
                {
                    buttonDisabled ? <p>Disabled</p> : <button
                    className="bg-blue-400 p-2 mt-1 h-screen hover:bg-blue-500 text-black text-xl"
                    onClick={onLogin}
                    >Login</button> 
                }
            </form>
            <Link href={"/signup"}>Don't have an account!</Link>
            
        </div>
    )
}