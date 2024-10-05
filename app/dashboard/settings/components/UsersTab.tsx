"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { User } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toast, ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface UsersTabProps {
  onAddUser: () => void;
  refreshTrigger: number;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  onAddUser,
  refreshTrigger,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Failed to fetch users",
        description: error.message,
        action: <ToastAction altText="Retry fetching users">Retry</ToastAction>,
      });
    } else if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const handleDeleteUser = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Failed to delete user",
        description: error.message,
        action: <ToastAction altText="Retry deleting user">Retry</ToastAction>,
      });
    } else {
      setUsers(users.filter((user) => user.id !== id));
      toast({
        title: "User deleted successfully",
        description: `User deleted at ${new Date().toLocaleString()}`,
        action: <ToastAction altText="Undo deleting user">Undo</ToastAction>,
      });
    }
    setLoading(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    setEditingUser(user);
    setDropdownOpen(null); // Close the dropdown when editing
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
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
      toast({
        title: "Failed to update user",
        description: `Error updating user at ${new Date().toLocaleString()}`,
        action: <ToastAction altText="Goto users to retry">Retry</ToastAction>,
      });
    } else {
      setUsers(
        users.map((user) =>
          user.id === editingUser?.id ? { ...user, ...editingUser } : user
        )
      );
      setEditingUserId(null);
      setEditingUser(null);
      setDropdownOpen(null);
      toast({
        title: "Updated: User",
        description: `User updated at ${new Date().toLocaleString()}`,
        action: <ToastAction altText="Goto users to undo">Undo</ToastAction>,
      });
    }
    setLoading(false);
  };

  return (
    <div className="pb-8 px-8 pt-4">
      <div className="flex justify-end mb-4">
        <Button
          onClick={onAddUser}
          className="bg-green-600 hover:bg-green-800 text-white"
        >
          CREATE USER
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex space-x-4">
              <Skeleton className="w-1/4 h-8" />
              <Skeleton className="w-1/4 h-8" />
              <Skeleton className="w-1/4 h-8" />
              <Skeleton className="w-1/4 h-8" />
              <Skeleton className="w-1/4 h-8" />
            </div>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
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
                      className="w-full p-1 border border-gray-300 rounded-md"
                    />
                  ) : (
                    user.name
                  )}
                </TableCell>
                <TableCell>
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
                      className="w-full p-1 border border-gray-300 rounded-md"
                    />
                  ) : (
                    user.username
                  )}
                </TableCell>
                <TableCell>
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
                      className="w-full p-1 border border-gray-300 rounded-md"
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>
                  {editingUserId === user.id ? (
                    <Select
                      value={editingUser?.isActive ? "active" : "inactive"}
                      onValueChange={(e) =>
                        setEditingUser((prevUser) => ({
                          ...prevUser!,
                          isActive: e === "active",
                        }))
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className={`inline-block px-2 py-1 rounded-md ${
                        user.isActive
                          ? "bg-green-800 text-white"
                          : "bg-red-800 text-white"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingUserId === user.id ? (
                    <Select
                      value={editingUser?.RoleId?.toString()}
                      onValueChange={(e) =>
                        setEditingUser((prevUser) => ({
                          ...prevUser!,
                          RoleId: parseInt(e),
                        }))
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="1">Admin</SelectItem>
                          <SelectItem value="2">Editor</SelectItem>
                          <SelectItem value="3">Viewer</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : user.RoleId === 1 ? (
                    "Admin"
                  ) : user.RoleId === 2 ? (
                    "Editor"
                  ) : user.RoleId === 3 ? (
                    "Viewer"
                  ) : (
                    "Unknown"
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="outline">Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          editingUserId === user.id
                            ? handleSaveUser()
                            : handleEditUser(user)
                        }
                      >
                        {editingUserId === user.id ? "Save" : "Edit"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="bg-red-600 hover:bg-red-800 text-white"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
