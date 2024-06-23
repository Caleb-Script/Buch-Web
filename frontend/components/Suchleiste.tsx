'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Suchleiste({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Suche... ${term}`);

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("titel", term);
    } else {
      params.delete("titel");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="input-group position-relative d-flex flex-grow-1 w-50">
      <label htmlFor="search" className="visually-hidden">
        Search
      </label>
      <input
        className="form-control rounded-md border border-gray-200 py-1 ps-5 text-sm w-100"
        type="search"
        id="search"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("titel")?.toString()}
      />
      <MagnifyingGlassIcon className=" text-dark position-absolute start-0 top-50 translate-middle-y h-75" />
    </div>
  );
}
