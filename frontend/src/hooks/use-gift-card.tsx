import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_CTX_API_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_CTX_API_KEY as string;
const API_SECRET = process.env.NEXT_PUBLIC_CTX_API_SECRET as string;

type UseGiftCard = {
  isLoadingGiftCard: boolean;
  errorGiftCard: string | null;
  paymentUrl: string | null;
  createGiftCard: (txData: any, accessToken: string) => Promise<void>;
  clearErrorGiftCard: () => void;
};

const UseGiftCard = (): UseGiftCard => {
  const [isLoadingGiftCard, setIsLoading] = useState<boolean>(false);
  const [errorGiftCard, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null> (null);

  const createGiftCard = async (txData: any, accessToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/gift-cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          "X-Api-Key": API_KEY,
          "X-Api-Secret": API_SECRET,
        },
        body: JSON.stringify(txData),
      });

      if (!response.ok) {
        throw new Error('Failed to create gift card. Please check and try again.');
      }

      const data = await response.json();
      console.log('Gift card created successfully:', data);

      if (data.paymentUrls) {
        const url =  extractUrl(data.paymentUrls['DASH.DASH'])
       setPaymentUrl(url)
      }

    } catch (error: any) {
      setError(error?.message || 'Failed to create gift card. Please check and try again.');
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
    paymentUrl,
    createGiftCard,
    clearErrorGiftCard,
  };
};

export default UseGiftCard;


const extractUrl = (input: string): string | null => {
  const params = new URLSearchParams(input.split('?')[1]);
  return params.get('r');
};