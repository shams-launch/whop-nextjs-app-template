"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Simple fetch wrapper to get Whop user role
async function getWhopRole() {
  const res = await fetch("/api/whop/me");
  if (!res.ok) return null;
  const data = await res.json();
  return data?.role || null;
}

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const role = await getWhopRole();

      if (role === "admin" || role === "creator") {
        router.push("/creator");
      } else if (role === "learner") {
        router.push("/learner");
      } else {
        router.push("/auth/login");
      }

      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  return null;
}
