"use client";

import { Truck, Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  const cikisYap = async () => {
    if (confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      await supabase.auth.signOut();
      router.push("/login");
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-blue-600 text-white p-4 shadow-md flex justify-between items-center transition-all">
      {/* Sol: Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
          <Truck size={20} />
        </div>
        <span className="font-bold text-lg tracking-tight">LojistikCRM</span>
      </div>

      {/* Sağ: İkonlar */}
      <div className="flex items-center gap-3">
        <Link href="/bildirimler" className="relative p-2 hover:bg-white/10 rounded-full transition">
          <Bell size={22} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 border-2 border-blue-600 rounded-full"></span>
        </Link>

        <button 
          onClick={cikisYap} 
          className="p-2 hover:bg-red-500/20 rounded-full transition text-blue-100 hover:text-white"
          title="Çıkış Yap"
        >
          <LogOut size={22} />
        </button>
      </div>
    </div>
  );
}