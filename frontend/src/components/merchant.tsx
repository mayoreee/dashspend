import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  width = 286,
  height = 188,
  className,
  ...props
}: MerchantProps) {
  return (
    <Link href={`/merchant/${id}`}>
      <div
        className={cn(
          "relative rounded-md overflow-hidden",
          "group shadow-md hover:shadow-lg transition-shadow duration-300",
          className
        )}
        {...props}
      >
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs py-0.5 px-1 rounded">
            Save {discount}%
          </div>
        )}
        <div className="aspect-w-3 aspect-h-2 overflow-hidden p-0">
          <Image
            src={brandLogo}
            alt={name}
            width={width}
            height={height}
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-3 space-y-1">
          <h3 className="font-medium text-sm leading-tight truncate">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground">
            ${minGiftCardValueUSD}-${maxGiftCardValueUSD}
          </p>
        </div>
      </div>
    </Link>
  );
}
