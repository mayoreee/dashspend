import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_CTX_API_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_CTX_API_KEY as string;
const API_SECRET = process.env.NEXT_PUBLIC_CTX_API_SECRET as string;

type UseEmailAuth = {
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  verifyEmail: (email: string) => Promise<void>;
  verifyToken: (email: string, token: string) => Promise<void>;
  clearError: () => void;
};

const useEmailAuth = (): UseEmailAuth => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const verifyEmail = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY,
          "X-Api-Secret": API_SECRET,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email. Please check and try again.");
      }

      // Simulate success message from API (optional)
      const data = await response.json();
      console.log("Email sent successfully:", data);
    } catch (error: any) {
      setError(
        error?.message || "Failed to send email. Please check and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async (email: string, token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY,
          "X-Api-Secret": API_SECRET,
        },
        body: JSON.stringify({ email, code: token }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify token. Please check and try again.");
      }

      // Simulate success message from API (optional)
      const data = await response.json();
      setAccessToken(data?.accessToken);
      setRefreshToken(data?.refreshToken);
      console.log("Token successfully verified:", data);
    } catch (error: any) {
      setError(
        error?.message || "Failed to verify token. Please check and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    accessToken,
    refreshToken,
    verifyEmail,
    verifyToken,
    clearError,
  };
};

export default useEmailAuth;
