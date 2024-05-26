import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { NavBar } from "@/components/nav-bar";
import { Search } from "@/components/search";

import Link from "next/link";
import Image from "next/image";

export default function Main() {
  return (
    <div className="hidden flex-col md:flex z-10 w-full ">
      <NavBar />
      <div className="flex-1 space-y-4 p-8 pt-6"></div>
    </div>
  );
}
