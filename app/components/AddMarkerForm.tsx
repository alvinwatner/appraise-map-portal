import { IoClose } from "react-icons/io5";

interface AddMarkerFormProps {
  onClose: () => void;
}

export const AddMarkerForm: React.FC<AddMarkerFormProps> = ({onClose} : AddMarkerFormProps) => {
  return (
    <div className="relative w-full z-10 px-12 ">
      <button onClick={onClose}>
        <IoClose
          className="absolute right-5 top-6 z-0 "
          color="grey"
          size={25}
        />
      </button>

      <h3 className="text-xl font-medium">Add</h3>

      <h3 className="text-sm font-medium">Add</h3>

    </div>
  );
};
