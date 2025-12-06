"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, User, Phone, Save, Clock, Briefcase, ChevronDown, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

// SHADCN
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function FirmaDetaySayfasi() {
  const params = useParams();
  const [firma, setFirma] = useState<any>(null);
  const [yeniNot, setYeniNot] = useState("");
  const [yukleniyor, setYukleniyor] = useState(true);
  const [guncelleniyor, setGuncelleniyor] = useState(false);

  useEffect(() => {
    async function firmayiGetir() {
      if (!params.id) return;
      const { data } = await supabase.from("firmalar").select("*").eq("id", params.id).single();
      if (data) {
        if (!data.notlar) data.notlar = [];
        setFirma(data);
      }
      setYukleniyor(false);
    }
    firmayiGetir();
  }, [params.id]);

  const durumDegistir = async (yeniDurum: string) => {
    setGuncelleniyor(true);
    const { error } = await supabase.from("firmalar").update({ durum: yeniDurum }).eq("id", firma.id);
    if (!error) setFirma({ ...firma, durum: yeniDurum });
    setGuncelleniyor(false);
  };

  const notEkle = async () => {
    if (!yeniNot.trim()) return;
    const notObjesi = {
      id: Date.now(),
      tarih: new Date().toLocaleDateString("tr-TR") + " " + new Date().toLocaleTimeString("tr-TR").slice(0,5),
      metin: yeniNot
    };
    const guncelNotlar = [notObjesi, ...(firma.notlar || [])];
    await supabase.from("firmalar").update({ notlar: guncelNotlar }).eq("id", firma.id);
    setFirma({ ...firma, notlar: guncelNotlar });
    setYeniNot("");
  };

  if (yukleniyor) return <div className="p-10 text-center animate-pulse">Yükleniyor...</div>;
  if (!firma) return <div className="p-10 text-center text-red-500">Bulunamadı!</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24 space-y-6">
      <Link href="/firmalar">
        <Button variant="ghost" className="pl-0 text-muted-foreground hover:pl-2 transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" /> Listeye Dön
        </Button>
      </Link>

      {/* ÜST BİLGİ KARTI */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{firma.ad}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                 <Briefcase size={14} /> {firma.sektor || "Sektör Yok"}
              </div>
            </div>
            
            {/* DURUM SEÇİCİ */}
            <Select onValueChange={durumDegistir} defaultValue={firma.durum} disabled={guncelleniyor}>
              <SelectTrigger className="w-[140px] h-8 text-xs font-bold bg-gray-50">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Potansiyel">Potansiyel</SelectItem>
                <SelectItem value="Görüşülüyor">Görüşülüyor</SelectItem>
                <SelectItem value="Teklif Verildi">Teklif Verildi</SelectItem>
                <SelectItem value="Müşteri Oldu">Müşteri Oldu</SelectItem>
                <SelectItem value="Olumsuz">Olumsuz</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
             <div className="flex items-center gap-2">
                <User className="text-blue-500 h-4 w-4" />
                <span className="font-medium">{firma.yetkili}</span>
             </div>
             <div className="flex items-center gap-2">
                <MapPin className="text-blue-500 h-4 w-4" />
                <span>{firma.sehir}</span>
             </div>
             <div className="col-span-2 flex items-center gap-2 bg-green-50 p-2 rounded-md text-green-700">
                <Phone className="h-4 w-4" />
                <a href={`tel:${firma.telefon}`} className="font-bold hover:underline">{firma.telefon}</a>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* NOT EKLEME ALANI */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" /> Görüşme Notu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea 
            placeholder="Bugünkü görüşmede neler konuşuldu?" 
            className="min-h-[100px] text-base resize-none"
            value={yeniNot} onChange={(e) => setYeniNot(e.target.value)}
          />
          <Button onClick={notEkle} className="w-full" disabled={!yeniNot.trim()}>
            <Save className="mr-2 h-4 w-4" /> Notu Kaydet
          </Button>
        </CardContent>
      </Card>

      {/* GEÇMİŞ HAREKETLER */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-gray-800 ml-1">Geçmiş Hareketler</h3>
        
        <div className="space-y-4 relative border-l-2 border-gray-200 ml-3 pl-6 pb-2">
          {(!firma.notlar || firma.notlar.length === 0) ? (
            <p className="text-gray-400 text-sm italic">Henüz hareket yok.</p>
          ) : (
            firma.notlar.map((not: any) => (
              <div key={not.id} className="relative group">
                {/* Zaman Çizelgesi Noktası */}
                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-white border-2 border-blue-400 group-hover:bg-blue-400 transition-colors"></div>
                
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="text-xs font-bold text-blue-600 mb-1">{not.tarih}</div>
                  <p className="text-gray-700 text-sm leading-relaxed">{not.metin}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}