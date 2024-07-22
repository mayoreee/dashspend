"use client";
import Footer from "@/components/footer";
import Main from "@/components/main";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import useMerchants from "@/hooks/use-merchants";
config.autoAddCss = false;

export default function Home() {
  const { merchants, isLoading, error, page } = useMerchants();

  return (
    <>
      <main className="flex flex-col">
        <Main merchants={merchants} isLoading={isLoading} page={page} />
      </main>
      <Footer />
    </>
  );
}
