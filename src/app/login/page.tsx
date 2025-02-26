import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

export default async function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
//   const [username, setUsername] = React.useState("");
  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      const response: any = await axios.post("/api/users/signup", {
        email,
        password,
        // username,
      });
      if(response.status == 200){
        router.push("/");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* <input
          className="text-xl"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        /> */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>
          Signup
        </button>
      </form>
      {error && <p>{error}</p>}
      <Link href="/signup">
        <a>Don't have an account, Signup</a>
      </Link>
    </div>
  );
}