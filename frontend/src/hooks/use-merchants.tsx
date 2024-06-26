import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_CTX_API_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_CTX_API_KEY as string;
const API_SECRET = process.env.NEXT_PUBLIC_CTX_API_SECRET as string;

const useMerchants: any = () => {
  // State to store the API data
  const [merchants, setMerchants] = useState<any[]>([]);

  // State to track loading status
  const [isLoading, setIsloading] = useState<boolean>(false);

  // State to track error status
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const cachedMerchants = localStorage.getItem("merchants");

    if (cachedMerchants) {
      setMerchants(JSON.parse(cachedMerchants));
      return;
    }

    setIsloading(true);

    // Fetch data from the API endpoint
    fetch(`${API_URL}/merchants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": API_KEY,
        "X-Api-Secret": API_SECRET,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((responseData) => {
        const merchantsData = responseData?.result || [];
        // Ensure uniqueness by merchantId
        const uniqueMerchants = Array.from(
          new Map(
            merchantsData.map((merchant: any) => [
              merchant.merchantId,
              merchant,
            ])
          ).values()
        );

        // Fetch additional details for each merchant
        return Promise.all(
          uniqueMerchants.map((merchant: any) =>
            fetch(`${API_URL}/merchants/${merchant.merchantId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "X-Api-Key": API_KEY,
                "X-Api-Secret": API_SECRET,
              },
            })
              .then((detailsResponse) => {
                if (!detailsResponse.ok) {
                  throw new Error(
                    `Failed to fetch details for merchant id: ${merchant.merchantId}`
                  );
                }
               
                return detailsResponse.json();
              })
              .then((merchantDetail) => ({
                ...merchant,
                info: {
                  minimumCardPurchase: parseFloat(merchantDetail.denominations[0]),
                  maximumCardPurchase: parseFloat(merchantDetail.denominations[1]),
                  savingsPercentage: (parseInt(merchantDetail.savingsPercentage) / 100) ?? 0,
                },
              }))
              .catch((error) => {
                console.error(
                  `Error fetching details for merchant id: ${merchant.merchantId}`,
                  error
                );
                return merchant; // Return the original merchant data on error
              })
          )
        );
      })
      .then((merchantsWithDetails) => {
        // Store the data in state and cache
        setMerchants(merchantsWithDetails);
        localStorage.setItem("merchants", JSON.stringify(merchantsWithDetails));
      })
      .catch((error) => {
        // Handle errors
        setError(error);
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsloading(false);
      });
  }, []);

  // Return the data, loading status, and error
  return { merchants, isLoading, error };
};

export default useMerchants;
