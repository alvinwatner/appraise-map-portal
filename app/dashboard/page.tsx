"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async (): Promise<void> => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
      } catch (error: any) {
        router.push("/login");
      } finally {
        // setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  return <p>Dashboard Page</p>;
}
