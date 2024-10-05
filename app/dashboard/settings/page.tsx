"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton from shadcn-ui
import { BillingCoordinatesTab } from "./components/BillingCoordinatesTab";
import { UsersTab } from "./components/UsersTab";
import AddUserModal from "./components/AddUserModal";

const SettingsPage: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddUser = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const refreshUsersTable = () => {
    setRefreshTrigger((prev) => prev + 1);
    setModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <AddUserModal
          onClose={handleCloseModal}
          onSuccessCreateUser={refreshUsersTable}
        />
      )}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>
      <div>
        <div className="flex gap-4">
          <div className="w-full border border-inherit rounded-lg shadow-lg">
            <Tabs defaultValue="users">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users">List Users</TabsTrigger>
                <TabsTrigger value="billingCoordinates">
                  Billing & Coordinates
                </TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <UsersTab
                  onAddUser={handleAddUser}
                  refreshTrigger={refreshTrigger}
                />
              </TabsContent>
              <TabsContent value="billingCoordinates">
                <BillingCoordinatesTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
