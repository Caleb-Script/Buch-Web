"use client";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

type RequireAuthProps = {
  children: ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/"); // Redirect to login if token is not present
    }
  }, [router]);

  return <>{children}</>;
}
