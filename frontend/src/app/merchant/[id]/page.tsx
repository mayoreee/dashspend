"use client";
import Footer from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import useMerchants from "@/hooks/use-merchants";

export default function MerchantPage() {
  const { merchants, error } = useMerchants();
  return (
    <div>
      <NavBar merchants={merchants} />
      <main className="flex flex-col"></main>
      <Footer />
    </div>
  );
}
