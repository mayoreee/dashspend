"use client";
import Footer from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import useMerchants from "@/hooks/use-merchants";
import { usePathname } from 'next/navigation';


export default function MerchantPage() {
  const { merchants, error } = useMerchants();
  const pathname = usePathname();

  return (
    <div>
      <NavBar merchants={merchants} />
      <main className="flex flex-col"></main>
      <Footer />
      <div className="justify-center"><h1>{JSON.stringify(merchants)}</h1></div>
    </div>
  );
}
