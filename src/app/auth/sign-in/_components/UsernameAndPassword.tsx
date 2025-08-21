"use client";

import axios, { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/commons/Button";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";

function UsernameAndPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const isEmpty = username === "" || password === "";

  const router = useRouter();

  const handleSignIn = async () => {
    const _payload = {
      username,
      password,
    };

    try {
      setIsLoading(true);
      await axios.post("/api/v1/auth/sign-in/credential", _payload);
      router.push("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          router.push("/auth/sign-in?error=INVALID_CREDENTIAL");
          return;
        }
        router.push("/auth/sign-in?error=SOMETHING_WENT_WRONG");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="flex flex-col gap-4 w-full mt-4">
      <div className="space-y-3">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          value={username}
          className="bg-(--gray-1) focus-visible:ring-0"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          className="bg-(--gray-1) focus-visible:ring-0"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        variant="action"
        disabled={isLoading || isEmpty}
        onClick={handleSignIn}
        className="w-full mt-4 h-12"
      >
        {isLoading ? <LoaderCircle className="animate-spin" /> : "Sign In"}
      </Button>
    </form>
  );
}

export default UsernameAndPassword;
