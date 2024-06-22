import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_CTX_API_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_CTX_API_KEY as string;
const API_SECRET = process.env.NEXT_PUBLIC_CTX_API_SECRET as string;

type UseGiftCard = {
  isLoadingGiftCard: boolean;
  errorGiftCard: string | null;
  giftCardInfo: any;
  createGiftCard: (txData: any, accessToken: string) => Promise<void>;
  clearErrorGiftCard: () => void;
};

const useGiftCard = (): UseGiftCard => {
  const [isLoadingGiftCard, setIsLoading] = useState<boolean>(false);
  const [errorGiftCard, setError] = useState<string | null>(null);
  const [giftCardInfo, setGiftCardInfo] = useState<any>(null);

  const createGiftCard = async (txData: any, accessToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/gift-cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Api-Key": API_KEY,
          "X-Api-Secret": API_SECRET,
        },
        body: JSON.stringify(txData),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to create gift card. Please check and try again."
        );
      }

      const data = await response.json();
      console.log("Gift card created successfully:", data);

      setGiftCardInfo(data);
    } catch (error: any) {
      setError(
        error?.message ||
          "Failed to create gift card. Please check and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrorGiftCard = () => {
    setError(null);
  };

  return {
    isLoadingGiftCard,
    errorGiftCard,
    giftCardInfo,
    createGiftCard,
    clearErrorGiftCard,
  };
};

export default useGiftCard;
