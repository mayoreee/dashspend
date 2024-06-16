import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { NavBar } from "@/components/nav-bar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search } from "@/components/search";

import Link from "next/link";
import Image from "next/image";
import { Merchant } from "./merchant";
import Spinner from "./ui/spinner";

export default function Main(props: any) {
  return (
    <div className="flex-col md:flex z-10 w-full ">
      <NavBar merchants={props.merchants} />
      <main className="px-8 mt-24">
        <h1 className="text-4xl font-bold mb-4 mt-6">
          Shop at thousands of locations with Dash
        </h1>
        <p className="text-muted-foreground mb-16">
          Instantly purchase gift cards from all your favourite merchants like
          Amazon, Uber, Walmart and Starbucks
        </p>

        <ScrollArea>
          {!props.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-8 justify-center">
              {props.merchants.map((merchant: any) => (
                <Merchant
                  key={merchant.merchantId}
                  id={merchant.merchantId}
                  name={merchant.name}
                  brandLogo={merchant?.brandLogo ?? "/merchant.png"}
                  discount={merchant.info?.savingsPercentage ?? 0}
                  minGiftCardValueUSD={merchant.info?.minimumCardPurchase ?? 0}
                  maxGiftCardValueUSD={merchant.info?.maximumCardPurchase ?? 0}
                  className="w-[286px] h-[188px]"
                  width={286}
                  height={188}
                />
              ))}
            </div>
          ) : (
            <Spinner />
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </main>
    </div>
  );
}
