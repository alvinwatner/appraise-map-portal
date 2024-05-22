import { RxAvatar } from "react-icons/rx";
import { IoIosNotifications } from "react-icons/io";

export default function Header() {
  return (
    <header className="bg-c-light-blue p-4 flex justify-between items-center">
      <div className="flex-grow">
        {/* Placeholder for other header content, if any */}
      </div>
      <div className="flex">
        <IoIosNotifications size={40} className="mr-4" />
        <RxAvatar size={40} className="mr-4" />
      </div>
    </header>
  );
}
