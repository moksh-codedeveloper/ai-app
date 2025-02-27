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
        <div></div>
    )
}