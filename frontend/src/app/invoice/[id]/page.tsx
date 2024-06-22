"use client";
import Footer from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import useMerchants from "@/hooks/use-merchants";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { Button } from "@/components/ui/button";

export default function InvoicePage() {
  const { merchants } = useMerchants();
  const { id } = useParams();
  const [giftCardInfo, setGiftCardInfo] = useState<any>(null);

  useEffect(() => {
    // Retrieve giftCardInfo from session storage
    const data = sessionStorage.getItem("giftCardInfo");
    if (data) {
      setGiftCardInfo(JSON.parse(data));
    }
  }, []);

  if (!giftCardInfo) {
    return <div>Loading...</div>;
  }

  const paymentUrl = giftCardInfo?.paymentUrls["DASH.DASH"];

  const handlePayButtonClick = () => {
    window.open(paymentUrl, "_blank");
  };

  return (
    <div className="flex flex-col h-screen">
      <NavBar merchants={merchants} />
      <main className="flex-grow flex flex-col items-center justify-start pt-32 px-4">
        <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">Invoice {id}</h1>
          <div className="mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">
                Gift Card Information
              </h2>
              <p className="mb-2">
                <span className="font-semibold">Fiat Amount:</span> $
                {giftCardInfo?.cardFiatAmount}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Crypto Amount:</span>{" "}
                {giftCardInfo?.paymentCryptoAmount}{" "}
                {giftCardInfo.paymentCryptoCurrency}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Discount:</span>{" "}
                {giftCardInfo?.percentDiscount}%
              </p>
              <p className="mb-2">
                <span className="font-semibold">Status:</span>{" "}
                {giftCardInfo?.status}
              </p>
            </div>
            <hr className="my-4" />
            <div className="mb-4">
              <Button
                onClick={handlePayButtonClick}
                className="text-white px-6 py-3 rounded-md  transition duration-300"
              >
                Pay with DASH
              </Button>
              <div className="flex justify-center mt-4">
                <QRCode value={paymentUrl} size={200} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
