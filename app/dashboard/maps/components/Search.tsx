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
        className="w-72 pl-8 py-2 rounded-lg placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
        type="text"
        placeholder="       Search Property"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <IoSearchOutline className="absolute left-2 top-2 " color="grey" />
    </form>
  );
};
