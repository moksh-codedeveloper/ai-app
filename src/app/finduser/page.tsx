"use client";
import React from "react";
import axios from "axios";
import Link from "next/link";

export default function FindUserPage() {
    const [buttonLink, setButtonLink] = React.useState(false);
    const [email, setEmail]: any = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const findUser = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/userExist", {email});
            if(response.status === 200) {
                setButtonLink(true);
                return (
                    <Link href={"/forgotpassword"}>Change your Password</Link>
                )
            }
        } catch (error:any) {
            console.log("there is something wrong and error is :" + error.message);
        } finally{
            setLoading(false)
        }
    }
    return (
        <div className="flex flex-col min-h-screen text-white bg-black p-2 m-2">
            <div className="items-center justify-center text-center text-2xl">
                <h2>{loading ? "processing...." : "Find user"}</h2>
                <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email.."
                className="rounded-lg bg-transparent text-white p-1"
                type="text"/>
                <button
                onClick={findUser}
                className="rounded-lg p-2 mt-1 bg-blue-600 text-black hover:bg-blue-500 hover:text-white"
                >
                    Confirm user
                </button>
                {
                    buttonLink ? <Link href={"/forgotpassword"}>click here to reset your password</Link> : ""
                }
            </div> 
        </div>
    )
}