"use client";

import React from "react";
import { ProfileForm } from "./components/ProfileForm";

const ProfilePage: React.FC = () => {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <ProfileForm />
      </div>
    </>
  );
};

export default ProfilePage;
