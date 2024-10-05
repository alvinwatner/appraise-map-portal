"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import Loading from "@/app/components/Loading";

export const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    RoleId: "",
    auth_id: "",
  });
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // Controls the skeleton loading

  useEffect(() => {
    const fetchProfile = async () => {
      const supabases = createClientComponentClient();
      const {
        data: { user },
        error,
      } = await supabases.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        setFetching(false);
        return;
      }
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", user.id)
          .single();

        if (data) {
          setProfile({
            name: data.name,
            username: data.username,
            email: data.email,
            RoleId: data.RoleId,
            auth_id: data.auth_id,
          });
        }

        if (error) {
          console.error("Error fetching profile:", error);
        }
      }
      setFetching(false);
    };

    const fetchRoles = async () => {
      const { data, error } = await supabase.from("role").select("id, name");
      if (error) {
        console.error("Error fetching roles:", error);
      } else {
        setRoles(data);
      }
    };

    fetchProfile();
    fetchRoles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .update({
        name: profile.name,
        username: profile.username,
        email: profile.email,
        RoleId: profile.RoleId,
        updatedAt: new Date(),
      })
      .eq("auth_id", profile.auth_id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      setSuccessMessage("Profile updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="h-full w-full">
      {fetching ? (
        <Card className="p-4">
          <CardContent className="space-y-4">
            {/* Skeleton Loader for Name Input */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Skeleton className="h-10 w-full mt-1" />
            </div>

            {/* Skeleton Loader for Username Input */}
            <div>
              <Label htmlFor="username">Username</Label>
              <Skeleton className="h-10 w-full mt-1" />
            </div>

            {/* Skeleton Loader for Email Input */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Skeleton className="h-10 w-full mt-1" />
            </div>

            {/* Skeleton Loader for Button */}
            <Skeleton className="h-10 w-full mt-1" />
          </CardContent>
        </Card>
      ) : (
        <>
          {successMessage && <Alert className="mb-4">{successMessage}</Alert>}
          <Card className="p-4">
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={profile.username}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 text-white w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <Loading size="w-5 h-5" strokeWidth="border-2 border-t-2" />
                  ) : (
                    "UPDATE PROFILE"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
