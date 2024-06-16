import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_CTX_API_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_CTX_API_KEY as string;
const API_SECRET = process.env.NEXT_PUBLIC_CTX_API_SECRET as string;
const API_ACCESS_TOKEN =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6Inl4bG9menVtUGxPQ0ZNSG00NTlZaGtWZHFHV2x6RkFmIiwidHlwIjoiYXQrand0In0.eyJhdWQiOlsiRGFzaFdhbGxldEFwcFJlc291cmNlIiwiaHR0cHM6Ly9hdXRoLmN0eC5jb20vcmVzb3VyY2VzIl0sImNsaWVudF9pZCI6ImJkMzBiOTNkLWMyYmYtNGM4OC05MjNjLWZiODJmMGZkZjBiMyIsImV4cCI6MTcxODU2MzUxOSwiaWF0IjoxNzE4NTM0NzE5LCJpc3MiOiJodHRwczovL2F1dGguY3R4LmNvbSIsImp0aSI6IlFQVTRQNzJPOFpIMVZaMkxNUFBYTTdCN0NOUlRKNkNXIiwibmJmIjoxNzE4NTM0NzE5LCJzY29wZSI6WyJkYXNoX3dhbGxldCJdfQ.FFvI2GNTbI6v-EiGo2vszWabh9ZiLpYAwR6zwq1DUetOcxXs9p7Y5HohmqpH_Bd39jTeja2cSlqqAx2clyDH-Y7ES_-9v1CRO_C0Vc8GU2jhjlcXG7XKrXisGpdGjpFB48ALUQDabvR_E2o5EKdjbFFzA1HI5KtUzfA5MnNziXamFOr_KFLmNChERxfa5eWfUBvBchwYSymq9Q39-EnX3uxEg8pzL7XthUzWU9T3rtmIHWbqeMq-_7zU1xzw9ziKyKniFtdhYWxdw1UiaHSG-zvx8_DMdaKYZ8Q_vCwLgnogoyjJlZLVMNukM9sRSwLs6-h0azeoWQEk1sydP-MwnA";

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
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
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
                Authorization: `Bearer ${API_ACCESS_TOKEN}`,
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
                brandLogo: null,
                info: {
                  minimumCardPurchase: merchantDetail.minimumCardPurchase,
                  maximumCardPurchase: merchantDetail.maximumCardPurchase,
                  savingsPercentage: merchantDetail.savingsPercentage ?? 0,
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
      }).finally(() => {
        setIsloading(false)
      });
  }, []);

  // Return the data, loading status, and error
  return { merchants, isLoading, error };
};

export default useMerchants;
