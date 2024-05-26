"use client"

import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import Link from "next/link";
import Image from "next/image";


export function NavBar() {
  return (
    <div className="hidden flex-col md:flex z-10 w-full ">
      <div className="border-b">
        <div className="flex h-20 items-center px-8">
          <Link className="flex items-center" href="/">
            <Image
              alt="Logo"
              className="mr-2"
              height={35}
              width={119}
              src="/logo.svg"
            />
          </Link>
          <div className="mx-6">
            <Search />
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <MainNav className="mx-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
