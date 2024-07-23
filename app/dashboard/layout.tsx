"use client";
import React, { useState } from "react";

import Header from "../components/Header";
import SideNav from "../components/SideNav";

import { NotificationModal } from "./components/NotificationModal";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isShowNotifModal, showNotifModal] = useState(false);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* SideNav with toggling state passed down */}
      <SideNav isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={`flex-grow flex flex-col w-full`}>
        <Header
          onNotifClick={() => {
            showNotifModal(true);
          }}
        />
        <div className="flex-grow p-6 md:overflow-y-auto md:p-0">
          {children}
          {isShowNotifModal && (
            <NotificationModal
              onClose={() => {
                showNotifModal(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
