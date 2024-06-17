import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_MAP_SERVICE_URL as string;

const useCluster = (box: any, zoom: number) => {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/points?west=${box.west}&south=${box.south}&east=${box.east}&north=${box.north}&zoom=${zoom}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [box.west, box.south, box.east, box.north, zoom]);

  return { data, loading, error };
};

export default useCluster;
