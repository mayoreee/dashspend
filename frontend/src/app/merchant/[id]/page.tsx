"use client";

import Footer from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import useMerchants from "@/hooks/use-merchants";
import { useParams, useRouter } from "next/navigation";
import styles from "./MerchantPage.module.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AmountInput from "@/components/ui/amountInput";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import useEmailAuth from "@/hooks/use-email-auth";
import { Icons } from "@/components/ui/icons";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Toast from "@/components/Toast";
import useGiftCard from "@/hooks/use-gift-card";

export default function MerchantPage() {
  const { merchants } = useMerchants();
  const { id } = useParams();
  const router = useRouter();

  const merchant = merchants.find(
    (merchant: any) => merchant.id === id
  );

  const [checkoutStatus, setCheckoutStatus] = useState<
    "default" | "valid_email" | "valid_token"
  >("default");

  const [purchaseAmount, setPurchaseAmount] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const {
    isLoading,
    error,
    accessToken,
    verifyEmail,
    verifyToken,
    clearError,
  } = useEmailAuth();

  const {
    isLoadingGiftCard,
    errorGiftCard,
    giftCardInfo,
    createGiftCard,
    clearErrorGiftCard,
  } = useGiftCard();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    clearError(); // Clear error when input changes
  };

  const handleSubmit = async () => {
    if (checkoutStatus === "default") {
      await verifyEmail(email as string);

      if (error === null) {
        setCheckoutStatus("valid_email");
      }
    }

    if (checkoutStatus === "valid_email") {
      await verifyToken(email as string, token as string);

      if (error === null) {
        setCheckoutStatus("valid_token");
      }
    }

    if (checkoutStatus === "valid_token") {
      const txData = {
        cryptoCurrency: "DASH",
        fiatCurrency: "USD",
        fiatAmount: purchaseAmount,
        merchantId: merchant?.merchantId,
      };

      await createGiftCard(txData, accessToken as string);
      setOpen(false);
      setCheckoutStatus("default");
    }
  };

  useEffect(() => {
    if (errorGiftCard !== null || error !== null) {
      setShowErrorToast(true);
      setCheckoutStatus("default");
    }
  }, [error, errorGiftCard]);

  useEffect(() => {
    if (giftCardInfo?.id) {
      sessionStorage.setItem("giftCardInfo", JSON.stringify(giftCardInfo));
      router.push(`/invoice/${giftCardInfo.id}`, {});
    }
  }, [giftCardInfo?.id, router]);

  return (
    <div>
      <NavBar merchants={merchants} />
      <div className={styles.body}>
        <main className="flex flex-col pt-24 min-h-screen mb-2">
          <div className={`${styles.container} px-4 md:px-0`}>
            <div className={styles.content}>
              <img
                src={`${merchant?.cardImageUrl ?? `https://placehold.co/600x400/png?text=.`}`}
                alt="banner"
                className={`${styles.merchantImage} w-full object-cover`}
              />
              <div className={`${styles.merchantDetails} mt-4`}>
                <h2 className="text-2xl md:text-4xl">
                  {merchant?.name} Gift Card
                </h2>
                <span className={`${styles.rewardsBadge}`}>
                  {merchant?.savingsPercentage / 100}% Rewards
                </span>
                <p className="text-sm md:text-base mt-2">
                  {`Best Buy gift cards make it easy to enjoy all the latest technology.
                Whether you're looking for smart home devices, drone, or 4K Ultra HD
                TVs, Associates will help you make the right choice. Plus, Geek
                Squad® can help keep it all running right with installation, setup,
                support and repair.
                 Use Best Buy gift cards to get the tech you want and the
                  services you need in stores and at BestBuy.com®`}
                </p>
                <div className={`${styles.availability} mt-4`}>
                  {merchant?.type === "online" && <span>✓ Online</span>}
                  {merchant?.type === "physical" && <span>✓ In Store</span>}
                </div>
                <div className={`${styles.purchaseSection} mt-4`}>
                  <label htmlFor="amount" className="font-bold">
                    Purchase Amount
                  </label>
                  <AmountInput setPurchaseAmount={setPurchaseAmount} />
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="mt-2 w-full md:w-auto"
                        disabled={
                          (purchaseAmount as number) <= 0 ||
                          (purchaseAmount as number) <
                            merchant.denominations[0] ||
                          (purchaseAmount as number) >
                            merchant.denominations[1]
                        }
                      >
                        Buy Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Checkout</DialogTitle>
                        <DialogDescription>
                          {checkoutStatus === "default" &&
                            `Please confirm your email address.`}
                          {checkoutStatus === "valid_email" &&
                            `Enter the OTP sent to your email address`}
                          {checkoutStatus === "valid_token" &&
                            `Please confirm the purchase details below`}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {checkoutStatus === "default" && (
                          <div className="grid grid-cols-1 gap-4">
                            <Label htmlFor="email" className="text-left">
                              Email
                            </Label>
                            <Input
                              id="email"
                              placeholder="michaelscott@gmail.com"
                              className="w-full"
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                        {checkoutStatus === "valid_email" && (
                          <div className="flex justify-center">
                            <InputOTP
                              maxLength={6}
                              onChange={(value) => {
                                setToken(value);
                              }}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        )}
                        {checkoutStatus === "valid_token" && (
                          <div className="flex justify-left">
                            <div className="grid gap-4 py-4">
                              <p>
                                <strong>Purchase Item:</strong>{" "}
                                {`${merchant?.name} Gift Card`}
                              </p>
                              <p>
                                <strong>Purchase Amount:</strong>{" "}
                                {`$${purchaseAmount}.00`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={handleSubmit}
                          className="w-full md:w-[120px]"
                        >
                          {" "}
                          {!isLoading ? (
                            "Confirm"
                          ) : (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {/* <div className={styles.terms}>
                  <h3>Terms & Conditions</h3>
                  <p>
                    Visit BestBuy.com to find your nearest store location. To
                    check your balance, visit{" "}
                    <a href="https://www.bestbuy.com/gift-card-balance">
                      https://www.bestbuy.com/gift-card-balance
                    </a>{" "}
                    or call 1-888-716-7994. For full Best Buy gift card Terms &
                    Conditions, visit{" "}
                    <a href="https://www.bestbuy.com/gcterms">
                      BestBuy.com/gcterms
                    </a>
                    .
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </main>
      </div>
      {showErrorToast && (
        <Toast
          showErrorToast={showErrorToast}
          setShowErrorToast={setShowErrorToast}
        />
      )}
      <Footer />
    </div>
  );
}
