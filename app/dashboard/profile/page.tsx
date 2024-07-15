"use client";

import ProfileForm from "./components/ProfileForm";

const ProfilePage: React.FC = () => {
  return (
    <div className="m-10">
      <div className="border border-inherit min-h-96 w-full mt-10 rounded-lg shadow-lg">
        <div className="p-8">
          <h1 className="text-2xl text-center font-bold mb-4">Profile</h1>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
