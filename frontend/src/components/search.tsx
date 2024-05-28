import { Input } from "@/components/ui/input";
import { searchMerchants } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Search(props: any) {
  const [value, setValue] = useState<string>("");
  const [suggestedMerchants, setSuggestedMerchants] = useState<string[]>([]);

  useEffect(() => {
    const _suggestedMerchants = searchMerchants(
      !!props.merchants ? props.merchants : [],
      value
    );
    setSuggestedMerchants(_suggestedMerchants);
  }, [value, props.merchants]);

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>
      <div>
        <Input
          className="pl-10 pr-4 rounded-md border border-gray-300 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white md:w-[300px] lg:w-[525px]"
          placeholder="Search for your favourite brands"
          type="search"
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>
      {value.length > 1 && suggestedMerchants.length > 0 && (
        <div className="absolute left-0 z-10 mt-2 w-full rounded-md bg-white shadow-lg dark:bg-gray-800 md:w-[100px] lg:w-[525px]">
          <ul className="py-1">
            {suggestedMerchants.map((merchant: any) =>
              SuggestionItem(merchant)
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SuggestionItem(merchant: any) {
  return (
    <Link href={`/merchant/${merchant.merchantId}`}>
      <ul className="flex items-center space-x-4 px-4 py-2">
        <div className="flex-shrink-0">
          <Image
            src={merchant.brandLogo ?? "/merchant.png"}
            alt={`${merchant.name} logo`}
            width={64}
            height={40}
            className="rounded-md"
          />
        </div>
        <div className="ml-4">
          <p className="text-lg">{merchant.name}</p>
        </div>
      </ul>
    </Link>
  );
}
