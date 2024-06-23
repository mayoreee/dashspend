"use client";

import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import Link from "next/link";
import Image from "next/image";

export function NavBar(props: any) {
  return (
    <div className="flex flex-col md:flex-row z-10 w-full fixed top-0 bg-white">
      <div className="border-b border-gray-100 w-full">
        <div className="flex h-20 items-center px-4 md:px-8">
          <Link className="flex items-center" href="/">
            <Image
              alt="Logo"
              className="mr-2"
              height={35}
              width={119}
              src="/logo.svg"
            />
          </Link>
          <div className="hidden md:block mx-4">
            <Search merchants={props?.merchants} />
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <MainNav className="mx-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
