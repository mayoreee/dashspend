import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_CTX_API_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_CTX_API_KEY as string;
const API_SECRET = process.env.NEXT_PUBLIC_CTX_API_SECRET as string;

const useMerchant: any = (merchantId: string) => {
  // State to store the API data
  const [merchant, setMerchant] = useState<any[]>([]);

  // State to track loading status
  const [isLoadingMerchant, setIsLoading] = useState<boolean>(false);

  // State to track error status
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchMerchants = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/merchants/${merchantId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": API_KEY,
            "X-Api-Secret": API_SECRET,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const responseData = await response.json();

        setMerchant(responseData);
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchants();
  }, [merchantId]);

  return { merchant, isLoadingMerchant, error };
};

export default useMerchant;
