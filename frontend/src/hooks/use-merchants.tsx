import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_CTX_API_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_CTX_API_KEY as string;
const API_SECRET = process.env.NEXT_PUBLIC_CTX_API_SECRET as string;

const useMerchants: any = () => {
  // State to store the API data
  const [merchants, setMerchants] = useState<any[]>([]);

  // State to track loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State to track error status
  const [error, setError] = useState<any>(null);

  // Stat to track api pagination
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);


  useEffect(() => {

    const cachedMerchants = localStorage.getItem("merchants");
    if (cachedMerchants) {
      setMerchants(JSON.parse(cachedMerchants));
      console.log('set the merchants')
      return;
    }
    
    const fetchMerchants = async () => {
      setIsLoading(true);
      try {
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

        const mergedMerchantList = [...merchants, ...merchantsData]

         // Ensure uniqueness by merchantId
         const uniqueMerchants = Array.from(
          new Map(
            mergedMerchantList.map((merchant: any) => [
              merchant.id,
              merchant,
            ])
          ).values()
        );
   

        setMerchants((_) => [
          ...uniqueMerchants,
        ]);
        localStorage.setItem(
          "merchants",
          JSON.stringify([...uniqueMerchants])
        );

        setHasMore(page < responseData.pagination.pages);
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (hasMore) {
      fetchMerchants();
    }
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      if (hasMore && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  return { merchants, isLoading, error, page };
};

export default useMerchants;
