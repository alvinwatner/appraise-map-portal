"use client";

import { supabase } from "@/app/lib/supabaseClient";
import { useEffect, useState } from "react";

interface Role {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingRoleName, setEditingRoleName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("role").select("*");

      if (error) {
        console.error("Error fetching roles:", error);
      } else if (data) {
        setRoles(data);
      }
      setLoading(false);
    };

    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("role")
      .insert({ name: newRoleName })
      .select(); // Make sure to select the inserted row(s)

    if (error) {
      console.error("Error adding role:", error);
    } else if (data) {
      setRoles([...roles, ...data]);
      setNewRoleName("");
    }
    setLoading(false);
  };

  const handleDeleteRole = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("role").delete().eq("id", id);

    if (error) {
      console.error("Error deleting role:", error);
    } else {
      setRoles(roles.filter((role) => role.id !== id));
    }
    setLoading(false);
  };

  const handleEditRole = (id: string, name: string) => {
    setEditingRoleId(id);
    setEditingRoleName(name);
    setDropdownOpen(null); // Close the dropdown when editing
  };

  const handleSaveRole = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("role")
      .update({ name: editingRoleName, updatedAt: new Date() })
      .eq("id", id);

    if (error) {
      console.error("Error updating role:", error);
    } else {
      setRoles(
        roles.map((role) =>
          role.id === id ? { ...role, name: editingRoleName } : role
        )
      );
      setEditingRoleId(null);
      setEditingRoleName("");
      setDropdownOpen(null); // Close the dropdown after saving
    }
    setLoading(false);
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Roles Management</h1>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          placeholder="New role name"
          className="p-2 border border-gray-300 rounded-md flex-1"
        />
        <button
          onClick={handleAddRole}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md"
          disabled={loading || !newRoleName}
        >
          {loading ? "Adding..." : "Add Role"}
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Created At</th>
            <th className="border border-gray-300 p-2">Updated At</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td className="border border-gray-300 p-2">{role.id}</td>
              <td className="border border-gray-300 p-2">
                {editingRoleId === role.id ? (
                  <input
                    type="text"
                    value={editingRoleName}
                    onChange={(e) => setEditingRoleName(e.target.value)}
                    className="p-1 border border-gray-300 rounded-md"
                  />
                ) : (
                  role.name
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {new Date(role.createdAt).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 p-2">
                {new Date(role.updatedAt).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 p-2 relative">
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      onClick={() => toggleDropdown(role.id)}
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
                  {dropdownOpen === role.id && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <button
                          onClick={() =>
                            editingRoleId === role.id
                              ? handleSaveRole(role.id)
                              : handleEditRole(role.id, role.name)
                          }
                          className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                          role="menuitem"
                        >
                          {editingRoleId === role.id ? "Save" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
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
  );
};

export default RolesPage;
