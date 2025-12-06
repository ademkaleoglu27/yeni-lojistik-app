"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Truck, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const girisYap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Giriş Başarısız: " + error.message);
      setLoading(false);
    } else {
      // Başarılıysa Ana Sayfaya yönlendir
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      
      {/* ARKA PLAN EFEKTLERİ (Sinematik) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
          alt="Lojistik Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/50 mix-blend-multiply"></div>
      </div>

      {/* GİRİŞ KARTI (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
          
          {/* Logo Alanı */}
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
              <Truck size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">LojistikCRM</h1>
            <p className="text-blue-200 text-sm mt-2">Saha Satış Yönetim Paneli</p>
          </div>

          {/* Form */}
          <form onSubmit={girisYap} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <Input 
                  type="email" 
                  placeholder="E-posta Adresi" 
                  className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 transition-all"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <Input 
                  type="password" 
                  placeholder="Şifre" 
                  className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 transition-all"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50 transition-all mt-4">
              {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Giriş Yap <ArrowRight size={20}/></span>}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-400">
            <p>© 2025 LojistikCRM. Tüm hakları saklıdır.</p>
          </div>

        </div>
      </div>

    </div>
  );
}