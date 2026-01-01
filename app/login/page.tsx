"use client";
import { useState, FormEvent } from "react";
import { login } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Loading from "../components/Loading";

// Define the structure of the login response
interface LoginResponse {
  error?: {
    message: string;
  };
}

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    // Retrieve form data and make sure it conforms to FormData
    const formData = new FormData(event.currentTarget);

    try {
      // Ensure the login function returns the expected shape of response
      const response = (await login(formData)) as LoginResponse;

      if (response?.error) {
        setError(`Error: ${response.error.message}`);
      }
    } catch (error) {
      // Add error handling for unexpected issues
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
          </div>

          {error && (
            <div className="mb-4 bg-red-300 ring-1 ring-red-500 rounded-md p-2 text-black text-center ">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loading size="w-5 h-5" strokeWidth="border-2 border-t-2" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden bg-muted lg:block">
        <Image
          src="/building.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginPage;
