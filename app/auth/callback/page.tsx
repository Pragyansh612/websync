"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error);
        router.push("/signup?error=authentication-failed");
        return;
      }
      
      if (data?.session) {
        // Check if user profile exists and create if needed
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        
        if (user) {
          router.push("/dashboard");
        } else {
          router.push("/signup?error=user-creation-failed");
        }
      } else {
        router.push("/signup");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Processing your sign in...</h2>
        <div className="mt-4 animate-pulse">Please wait while we complete your authentication</div>
      </div>
    </div>
  );
}