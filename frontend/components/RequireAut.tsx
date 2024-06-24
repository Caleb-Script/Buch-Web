

'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth ({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/"); // Redirect to login if token is not present
    }
  }, [router]);

  return <>{children}</>;
};
