"use client";

import Loading from "@/app/components/Loading";
import { supabase } from "@/app/lib/supabaseClient";
import { useEffect, useState } from "react";

const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    RoleId: "",
  });
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        setFetching(false); // Set fetching to false in case of error
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
            password: "",
            email: data.email,
            RoleId: data.RoleId,
          });
        }

        if (error) {
          console.error("Error fetching profile:", error);
        }
      }
      setFetching(false); // Set fetching to false after data is fetched
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
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error fetching user:", userError);
      setLoading(false);
      return;
    }
    if (user) {
      const { data, error } = await supabase
        .from("users")
        .update({
          name: profile.name,
          username: profile.username,
          email: profile.email,
          RoleId: profile.RoleId,
          updatedAt: new Date(),
        })
        .eq("auth_id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
      } else {
        setSuccessMessage("Profile updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      {fetching ? (
        <div className="flex justify-center items-center h-96">
          <Loading />
        </div>
      ) : (
        <>
          {successMessage && (
            <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
              {successMessage}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="RoleId"
                value={profile.RoleId}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className={`w-full p-2 bg-blue-500 text-white rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ProfileForm;
