"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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

      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage users, roles, and system configurations
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="billingCoordinates">
              Billing & Coordinates
            </TabsTrigger>
          </TabsList>

          <Card className="mt-4">
            <TabsContent value="users" className="mt-0">
              <UsersTab
                onAddUser={handleAddUser}
                refreshTrigger={refreshTrigger}
              />
            </TabsContent>
            <TabsContent value="billingCoordinates" className="mt-0">
              <BillingCoordinatesTab />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </>
  );
};

export default SettingsPage;
