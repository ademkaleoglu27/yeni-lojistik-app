"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, [pathname]); // Her sayfa değişiminde kontrol et

  async function checkUser() {
    // 1. Supabase'e sor: Şu an giriş yapmış biri var mı?
    const { data: { session } } = await supabase.auth.getSession();

    // 2. Eğer giriş yoksa VE şu an zaten login sayfasında değilse -> Girişe at
    if (!session && pathname !== "/login") {
      router.push("/login");
    } 
    
    // 3. Eğer giriş varsa VE şu an login sayfasındaysa -> Ana sayfaya at (Tekrar girmesin)
    else if (session && pathname === "/login") {
      router.push("/");
    }

    setLoading(false);
  }

  // Yüklenirken bembeyaz ekran yerine dönen çark gösterelim
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  // Sorun yoksa sayfayı göster
  return <>{children}</>;
}