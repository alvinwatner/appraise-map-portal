"use client";

import Loading from "@/app/components/Loading"
import { useEffect, useState } from "react";
import { BillingCoordinatesTab } from "./components/BillingCoordinatesTab";
import { UsersTab } from "./components/UsersTab";
import AddUserModal from "./components/AddUserModal";

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
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
              <Loading size="w-16 h-16" strokeWidth="border-4 border-t-4" />
            ) : (
              <div>
                {activeTab === "users" && (
                  <UsersTab onAddUser={handleAddUser} refreshTrigger={refreshTrigger} />
                )}
                {activeTab === "billingCoordinates" && (
                  <BillingCoordinatesTab />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
