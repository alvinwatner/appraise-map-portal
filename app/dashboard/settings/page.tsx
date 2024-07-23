"use client";

import Loading from "@/app/components/Loading";
import { supabase } from "@/app/lib/supabaseClient";
import { User } from "@/app/types/types";
import { useEffect, useState } from "react";
import { BillingCoordinatesTab } from "./components/BillingCoordinatesTab";

const SettingsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");


  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("users").select("*");

      if (error) {
        console.error("Error fetching users:", error);
      } else if (data) {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
    } else {
      setUsers(users.filter((user) => user.id !== id));
    }
    setLoading(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    setEditingUser(user);
    setDropdownOpen(null); // Close the dropdown when editing
  };

  const handleSaveUser = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("users")
      .update({
        name: editingUser?.name,
        username: editingUser?.username,
        email: editingUser?.email,
        isActive: editingUser?.isActive,
        RoleId: editingUser?.RoleId,
      })
      .eq("id", editingUser?.id);

    if (error) {
      console.error("Error updating user:", error);
    } else {
      setUsers(
        users.map((user) =>
          user.id === editingUser?.id ? { ...user, ...editingUser } : user
        )
      );
      setEditingUserId(null);
      setEditingUser(null);
      setDropdownOpen(null); // Close the dropdown after saving
    }
    setLoading(false);
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const renderUsersTab = () => (
    <div className="p-8">
      <div
        className="table-container"
        style={{ maxHeight: "60vh", maxWidth: "140vh" }}
      >
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Fullname</th>
              <th className="border border-gray-300 p-2">Username</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 p-2">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editingUser?.name}
                      onChange={(e) =>
                        setEditingUser((prevUser) => ({
                          ...prevUser!,
                          name: e.target.value,
                        }))
                      }
                      className="p-1 border border-gray-300 rounded-md"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editingUser?.username}
                      onChange={(e) =>
                        setEditingUser((prevUser) => ({
                          ...prevUser!,
                          username: e.target.value,
                        }))
                      }
                      className="p-1 border border-gray-300 rounded-md"
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editingUser?.email}
                      onChange={(e) =>
                        setEditingUser((prevUser) => ({
                          ...prevUser!,
                          email: e.target.value,
                        }))
                      }
                      className="p-1 border border-gray-300 rounded-md"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingUserId === user.id ? (
                    <select
                      value={editingUser?.isActive ? "active" : "inactive"}
                      onChange={(e) =>
                        setEditingUser((prevUser) => ({
                          ...prevUser!,
                          isActive: e.target.value === "active",
                        }))
                      }
                      className="p-1 border border-gray-300 rounded-md"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-sm font-semibold ${
                        user.isActive
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingUserId === user.id ? (
                    <select
                      value={editingUser?.RoleId}
                      onChange={(e) =>
                        setEditingUser((prevUser) => ({
                          ...prevUser!,
                          RoleId: parseInt(e.target.value),
                        }))
                      }
                      className="p-1 border border-gray-300 rounded-md"
                    >
                      <option value={1}>Super Admin</option>
                      <option value={2}>Admin</option>
                      <option value={3}>User</option>
                    </select>
                  ) : user.RoleId === 1 ? (
                    "Super Admin"
                  ) : user.RoleId === 2 ? (
                    "Admin"
                  ) : user.RoleId === 3 ? (
                    "User"
                  ) : (
                    "Unknown"
                  )}
                </td>
                <td className="border border-gray-300 p-2 relative">
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        onClick={() => toggleDropdown(user.id)}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                      >
                        Actions
                        <svg
                          className="-mr-1 ml-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    {dropdownOpen === user.id && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <button
                            onClick={() =>
                              editingUserId === user.id
                                ? handleSaveUser()
                                : handleEditUser(user)
                            }
                            className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                            role="menuitem"
                          >
                            {editingUserId === user.id ? "Save" : "Edit"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                            role="menuitem"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <div className="m-10">
        <h1 className="text-3xl font-semibold mt-4">
          {activeTab === "users" ? "List Users" : "Billing & Coordinates"}
        </h1>
        <div className="flex gap-4">
          <div className="w-1/5 mt-10">
            <nav className="flex flex-col space-y-2">
              <button
                className={`p-2 text-left ${
                  activeTab === "users"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } rounded-md`}
                onClick={() => setActiveTab("users")}
              >
                List Users
              </button>
              <button
                className={`p-2 text-left ${
                  activeTab === "billingCoordinates"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } rounded-md`}
                onClick={() => setActiveTab("billingCoordinates")}
              >
                Billing & Coordinates
              </button>
            </nav>
          </div>
          <div className="w-4/5 border border-inherit mt-10 rounded-lg shadow-lg">
            {loading ? (
              <Loading />
            ) : (
              <div>
                {activeTab === "users" && renderUsersTab()}
                {activeTab === "billingCoordinates" &&
                  <BillingCoordinatesTab/>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
