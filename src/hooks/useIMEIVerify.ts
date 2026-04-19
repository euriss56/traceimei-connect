import { useState } from "react";
import { traceIMEIApi } from "@/services/traceimei-api";

export function useIMEIVerify() {
  const [result, setResult]     = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const verify = async (imei: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await traceIMEIApi.verifyIMEI(imei);
      setResult(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur de vérification";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { verify, result, isLoading, error, reset };
}
