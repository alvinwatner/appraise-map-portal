"use client";

import React, { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

const useRedirectToDashboard = (session: Session | null) => {
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);
};

const LoginPage: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  useRedirectToDashboard(session);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData?.session ?? null);
    };

    fetchSession();

    const authListener = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session) {
          const user = session.user;
          // Check if user exists
          const { data: existingUser, error } = await supabase
            .from("users")
            .select("*")
            .eq("auth_id", user.id)
            .single();

          if (error && error.code === "PGRST116") {
            // If user doesn't exist, create one
            const { error: insertError } = await supabase.from("users").insert({
              auth_id: user.id,
              email: user.email,
              username: user.user_metadata.username || "",
              password: "",
              lastLogin: new Date(),
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              name: user.user_metadata.name || "",
            });

            if (insertError) {
              console.error("Error creating user:", insertError);
            }
          } else if (error) {
            console.error("Error fetching user:", error);
          } else {
            // Update last login and other details
            const { error: updateError } = await supabase
              .from("users")
              .update({
                lastLogin: new Date(),
                updatedAt: new Date(),
              })
              .eq("auth_id", user.id);

            if (updateError) {
              console.error("Error updating user:", updateError);
            }
          }
        }
      }
    );

    return () => authListener.data.subscription.unsubscribe();
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default LoginPage;
