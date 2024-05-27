import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { NavBar } from "@/components/nav-bar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search } from "@/components/search";

import Link from "next/link";
import Image from "next/image";
import { Merchant } from "./merchant";
import { merchants } from "@/lib/data";

export default function Main() {
  return (
    <div className="hidden flex-col md:flex z-10 w-full ">
      <NavBar />
      <main className="px-8">
        <h1 className="text-4xl font-bold mb-4 mt-6">
          Shop at thousands of locations with Dash
        </h1>
        <p className="text-muted-foreground mb-16">
          Instantly purchase gift cards from all your favourite merchants like
          Amazon, Uber, Walmart and Starbucks
        </p>

        <ScrollArea>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-8 flex justify-center">
            {merchants.map((merchant) => (
              <Merchant
                key={merchant.id}
                id={merchant.id}
                name={merchant.name}
                brandLogo={merchant.brandLogo}
                discount={merchant.discount}
                minGiftCardValueUSD={merchant.minGiftCardValueUSD}
                maxGiftCardValueUSD={merchant.maxGiftCardValueUSD}
                className="w-[286px]"
                width={286}
                height={188}
              />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </main>
    </div>
  );
}
