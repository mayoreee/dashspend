import Image from "next/image";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface MerchantProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  name: string;
  brandLogo: string;
  discount: number;
  minGiftCardValueUSD: number;
  maxGiftCardValueUSD: number;
  width?: number;
  height?: number;
}

export function Merchant({
  id,
  name,
  brandLogo,
  discount,
  minGiftCardValueUSD,
  maxGiftCardValueUSD,
  width,
  height,
  className,
  ...props
}: MerchantProps) {
  return (
    <Link href={`/merchant/${id}`}>
      <div className={cn("space-y-3 relative", className)} {...props}>
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-black opacity-30 text-white text-[12px] py-0 px-1 rounded">
            Save {discount}%
          </div>
        )}
        <div className="overflow-hidden rounded-md">
          <Image
            src={brandLogo}
            alt={name}
            width={width}
            height={height}
            className={cn(
              "h-auto w-auto object-cover transition-all hover:scale-105",
              "aspect-[3/2]"
            )}
          />
        </div>

        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none">{name}</h3>
          <p className="text-xs text-muted-foreground">{`$${minGiftCardValueUSD}-$${maxGiftCardValueUSD}`}</p>
        </div>
      </div>
    </Link>
  );
}
