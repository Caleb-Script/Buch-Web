"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FrontPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/buecher");
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
}
