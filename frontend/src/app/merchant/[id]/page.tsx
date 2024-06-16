"use client";
import Footer from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import useMerchants from "@/hooks/use-merchants";
import { useParams } from "next/navigation";
import styles from "./MerchantPage.module.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AmountInput from "@/components/ui/amountInput";
import { useState } from "react";
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

export default function MerchantPage() {
  const { merchants, error } = useMerchants();
  const { id } = useParams();

  const merchant = merchants.find(
    (merchant: any) => merchant.merchantId === id
  );

  const [purchaseAmount, setPurchaseAmount] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div>
      <NavBar merchants={merchants} />
      <div className={styles.body}>
        <main className="flex flex-col pt-24">
          <div className={styles.container}>
            <div className={styles.content}>
              <img
                src="/merchant_banner.png"
                alt="banner"
                className={styles.merchantImage}
              />
              <div className={styles.merchantDetails}>
                <h2>
                  {merchant?.name} Gift Card{" "}
                  <span className={styles.rewardsBadge}>
                    {merchant?.info?.savingsPercentage}% Rewards
                  </span>
                </h2>
                <p className={styles.description}>
                  {`Best Buy gift cards make it easy to enjoy all the latest technology.
                Whether you're looking for smart home devices, drone, or 4K Ultra HD
                TVs, Associates will help you make the right choice. Plus, Geek
                Squad® can help keep it all running right with installation, setup,
                support and repair.
                 Use Best Buy gift cards to get the tech you want and the
                  services you need in stores and at BestBuy.com®`}
                </p>
                <div className={styles.availability}>
                  <span>✓ Online</span>
                  <span>✓ In Store</span>
                </div>
                <div className={styles.purchaseSection}>
                  <label htmlFor="amount">Purchase Amount</label>
                  <AmountInput setPurchaseAmount={setPurchaseAmount} />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="mt-2"
                        disabled={
                          (purchaseAmount as number) <= 0 ? true : false
                        }
                      >
                        Buy Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Checkout</DialogTitle>
                        <DialogDescription>
                          {`Please confirm your email address.`}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="email"
                            placeholder="michaelscott@gmail.com"
                            className="col-span-3"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Confirm</Button>
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
      <Footer />
    </div>
  );
}
