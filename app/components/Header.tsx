import { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { IoIosNotifications } from "react-icons/io";
import { TiArrowSortedDown } from "react-icons/ti";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfileClick = () => {
    router.push("profile");
  };

  const handleRolesClick = () => {
    router.push("roles");
  };

  return (
    <header className="bg-c-light-blue p-2 flex justify-between items-center">
      <div className="flex-grow">
        {/* Placeholder for other header content, if any */}
      </div>
      <div className="flex relative">
        <IoIosNotifications size={30} className="mr-4" />
        <div onClick={handleClick} className="flex items-center cursor-pointer">
          <RxAvatar size={30} />
          <TiArrowSortedDown size={10} className="mr-4" />
        </div>
        {showDropdown && (
          <>
            <div
              onClick={handleProfileClick}
              className="z-10 absolute right-0 top-0 mt-9 w-48 bg-white border border-gray-300 rounded-md shadow-lg p-4 cursor-pointer"
            >
              Profile
            </div>
            <div
              onClick={handleRolesClick}
              className="z-10 absolute right-0 top-12 mt-9 w-48 bg-white border border-gray-300 rounded-b-md  p-4 cursor-pointer"
            >
              Roles
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
