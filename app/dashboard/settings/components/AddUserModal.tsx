import React, { useState } from "react";
import { createNewUser } from "@/app/services/dataManagement.service";
import Loading from "@/app/components/Loading";

interface AddUserModalProps {
  onClose: () => void;
  onSuccessCreateUser: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  onClose,
  onSuccessCreateUser,
}) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [roleId, setRoleId] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createNewUser({
        name: name,
        RoleId: roleId,
        email: email,
        username: username,
        password: password,
        isActive: true,
      });
      onSuccessCreateUser();
      setIsSaving(false);
    } catch (error) {
      console.error("Failed to create new user:", error);
      setError(`Error : ${error}`);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        {error && (
          <div className="mb-4 bg-red-300 ring-1 ring-red-500 rounded-md p-2 text-black text-center ">
            {error}
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Fullname</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Role</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value={1}>Admin</option>
            <option value={2}>Editor</option>
            <option value={3}>Viewer</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loading size="w-5 h-5" strokeWidth="border-2 border-t-2" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
