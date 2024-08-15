import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_CTX_API_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_CTX_API_KEY as string;
const API_SECRET = process.env.NEXT_PUBLIC_CTX_API_SECRET as string;

const useMerchants: any = () => {
  // State to store the API data
  const [merchants, setMerchants] = useState<any[]>([]);

  // State to track loading status
  const [isLoadingMerchants, setIsLoading] = useState<boolean>(false);

  // State to track error status
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const cachedMerchants = localStorage.getItem("merchants");
    if (cachedMerchants) {
      setMerchants(JSON.parse(cachedMerchants));
      console.log("set the merchants");
      return;
    }

    const fetchAllMerchants = async () => {
      setIsLoading(true);
      let page = 1;
      let hasMore = true;
      let allMerchants: any[] = [];

      try {
        while (hasMore) {
          const response = await fetch(`${API_URL}/merchants?page=${page}`, {
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
          const merchantsData = responseData?.result || [];

          allMerchants = [...allMerchants, ...merchantsData];

          // Ensure uniqueness by merchantId
          const uniqueMerchants = Array.from(
            new Map(
              allMerchants.map((merchant: any) => [merchant.id, merchant])
            ).values()
          );

          setMerchants(uniqueMerchants);

          localStorage.setItem(
            "merchants",
            JSON.stringify([...uniqueMerchants])
          );

          hasMore = page < responseData.pagination.pages;
          page++;
        }
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMerchants();
  }, []);

  return { merchants, isLoadingMerchants, error };
};

export default useMerchants;
