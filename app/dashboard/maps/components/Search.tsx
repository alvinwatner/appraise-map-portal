import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";
import { IoSearchOutline } from "react-icons/io5";

export const Search: React.FC<{
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}> = ({ onSubmit }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        className="w-full lg:w-72 pl-10 pr-4 py-2.5 placeholder:text-sm placeholder:text-gray-400 rounded-lg ring-1 ring-gray-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
        type="text"
        placeholder="Search Property"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <IoSearchOutline className="absolute left-3 top-3 text-gray-400" size={18} />
    </form>
  );
};
