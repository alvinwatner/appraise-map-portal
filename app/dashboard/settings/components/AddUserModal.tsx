import React, { useState } from "react";
import { createNewUser } from "@/app/services/dataManagement.service";
import Loading from "@/app/components/Loading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <div className="mb-4">
          <Label>Fullname</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label>Username</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label className="block text-sm font-medium">Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label className="block text-sm font-medium">Role</Label>
          <Select
            value={String(roleId)}
            onValueChange={(value) => setRoleId(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Admin</SelectItem>
              <SelectItem value="2">Editor</SelectItem>
              <SelectItem value="3">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            CANCEL
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-800 text-white w-full"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loading size="w-5 h-5" strokeWidth="border-2 border-t-2" />
            ) : (
              "SAVE"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
