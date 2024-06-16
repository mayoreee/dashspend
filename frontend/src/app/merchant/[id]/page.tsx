"use client";
import Footer from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import useMerchants from "@/hooks/use-merchants";
import { useParams } from "next/navigation";

export default function MerchantPage() {
  const { merchants, error } = useMerchants();
  const { id } = useParams();

  const merchant = merchants.find(
    (merchant: any) => (merchant.merchantId === id)
  );

  return (
    <div>
      <NavBar merchants={merchants} />
      <main className="flex flex-col"></main>
      <Footer />
    </div>
  );
}
