import { NavBar } from "@/components/nav-bar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Merchant } from "./merchant";
import { Icons } from "./ui/icons";
import { useEffect, useState } from "react";

export default function Main(props: any) {
  // State to track the number of columns dynamically
  const [numCols, setNumCols] = useState<number>(2); // Default number of columns for small screens

  useEffect(() => {
    // Update number of columns based on screen width
    function handleResize() {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024) {
        setNumCols(6); // 6 columns for large screens
      } else if (screenWidth >= 640) {
        setNumCols(4); // 4 columns for medium screens
      } else {
        setNumCols(2); // 2 column for small screens
      }
    }

    // Initial call to set number of columns on load
    handleResize();

    // Event listener for window resize
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

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
            <div
              className={`grid ${
                numCols === 2
                  ? "grid-cols-2"
                  : numCols === 4
                  ? "grid-cols-4"
                  : "grid-cols-6"
              } gap-8 justify-center mb-2`}
            >
              {props.merchants.map((merchant: any) => (
                <Merchant
                  key={merchant.merchantId}
                  id={merchant.merchantId}
                  name={merchant.name}
                  brandLogo={merchant?.brandLogo ?? "/merchant.png"}
                  discount={merchant.info?.savingsPercentage ?? 0}
                  minGiftCardValueUSD={merchant.info?.minimumCardPurchase ?? 0}
                  maxGiftCardValueUSD={merchant.info?.maximumCardPurchase ?? 0}
                  className="w-full h-auto" // Adjust width and height as needed
                  width={286}
                  height={188}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Icons.spinner className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </main>
    </div>
  );
}
