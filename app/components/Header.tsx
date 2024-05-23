import { RxAvatar } from "react-icons/rx";
import { IoIosNotifications } from "react-icons/io";
import { TiArrowSortedDown } from "react-icons/ti";

export default function Header() {
  return (
    <header className="bg-c-light-blue p-2 flex justify-between items-center">
      <div className="flex-grow">
        {/* Placeholder for other header content, if any */}
      </div>
      <div className="flex">
        <IoIosNotifications size={30} className="mr-4" />
        <div className="flex items-center">
          <RxAvatar size={30}/>
          <TiArrowSortedDown size={10} className="mr-4" />
        </div>
      </div>
    </header>
  );
}
