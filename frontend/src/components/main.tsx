import { NavBar } from "@/components/nav-bar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Merchant } from "./merchant";
import { Icons } from "./ui/icons";
import { useEffect, useState } from "react";
import { Search } from "./search";

export default function Main(props: any) {
  // State to track the number of columns dynamically
  const [numCols, setNumCols] = useState<number>(2); // Default number of columns for small screens

  useEffect(() => {
    // Update number of columns based on screen width
    function handleResize() {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024) {
        setNumCols(5); // 5 columns for large screens
      } else if (screenWidth >= 640) {
        setNumCols(3); // 3 columns for medium screens
      } else {
        setNumCols(2); // 2 columns for small screens
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
    <div className="flex flex-col min-h-screen z-10 w-full">
      <NavBar merchants={props.merchants} />
      <main className="flex-1 px-8 mt-24">
        <div className="md:hidden mx-0 md:mx-0 w-full">
          <Search merchants={props.merchants} />
        </div>
        <h1 className="text-4xl font-bold mb-4 mt-12">
          Shop at thousands of locations with Dash
        </h1>
        <p className="text-muted-foreground mb-24">
          Instantly purchase gift cards from all your favourite merchants like
          Amazon, Uber, Walmart and Starbucks
        </p>

        <ScrollArea className="flex-1">
          {props.isLoading && props.page === 1 ? (
            <div className="flex items-top justify-center h-full">
              <Icons.spinner className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div
              className={`grid ${
                numCols === 2
                  ? "grid-cols-2"
                  : numCols === 3
                  ? "grid-cols-3"
                  : "grid-cols-5"
              } gap-8 justify-center mb-2 `}
            >
              {props.merchants.map((merchant: any) => (
                <Merchant
                  key={merchant.id}
                  id={merchant.id}
                  name={merchant.name}
                  brandLogo={merchant?.logoUrl ?? "https://placehold.co/200x200/png?text=."}
                  discount={merchant.savingsPercentage / 100 ?? 0}
                  minGiftCardValueUSD={merchant.denominations[0] ?? 0}
                  maxGiftCardValueUSD={merchant.denominations[1] ?? 0}
                  height={200}
                />
              ))}
            </div>
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </main>
    </div>
  );
}
