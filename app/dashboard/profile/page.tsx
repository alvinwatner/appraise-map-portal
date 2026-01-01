"use client";

import React from "react";
import { ProfileForm } from "./components/ProfileForm";

const ProfilePage: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
      </div>
      <div className="flex flex-1 items-center justify-center mt-6">
        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;
