"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// SHADCN Bileşenleri
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function YeniFirmaSayfasi() {
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState(false);

  const [formData, setFormData] = useState({
    ad: "",
    sehir: "",
    yetkili: "",
    telefon: "",
    sektor: "",
    durum: "Potansiyel"
  });

  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);

    const yeniFirma = {
      ...formData,
      notlar: [{
        id: Date.now(),
        tarih: new Date().toLocaleDateString("tr-TR"),
        metin: "Firma sisteme eklendi."
      }]
    };

    const { error } = await supabase.from("firmalar").insert([yeniFirma]);

    if (error) {
      alert("Hata: " + error.message);
      setYukleniyor(false);
    } else {
      router.push("/firmalar");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto pb-24">
      <Link href="/firmalar">
        <Button variant="ghost" className="mb-4 text-muted-foreground pl-0 hover:pl-2 transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" /> Listeye Dön
        </Button>
      </Link>

      <Card className="shadow-lg border-t-4 border-t-blue-600">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
               <Building2 size={24} />
            </div>
            <div>
              <CardTitle>Yeni Firma Ekle</CardTitle>
              <CardDescription>Portföyünüze yeni bir müşteri ekleyin.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={kaydet} className="space-y-4">
            
            {/* Durum Seçimi */}
            <div className="space-y-2">
              <Label>Müşteri Durumu</Label>
              <Select onValueChange={(deg) => setFormData({...formData, durum: deg})} defaultValue={formData.durum}>
                <SelectTrigger>
                  <SelectValue placeholder="Durum Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Potansiyel">Potansiyel</SelectItem>
                  <SelectItem value="Görüşülüyor">Görüşülüyor</SelectItem>
                  <SelectItem value="Teklif Verildi">Teklif Verildi</SelectItem>
                  <SelectItem value="Müşteri Oldu">✅ Müşteri Oldu</SelectItem>
                  <SelectItem value="Olumsuz">❌ Olumsuz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Firma Adı */}
            <div className="space-y-2">
              <Label>Firma Adı</Label>
              <Input 
                required 
                placeholder="Örn: Aras Lojistik A.Ş." 
                value={formData.ad} 
                onChange={(e) => setFormData({...formData, ad: e.target.value})} 
              />
            </div>

            {/* Sektör */}
            <div className="space-y-2">
              <Label>Sektör</Label>
              <Input 
                placeholder="Örn: Nakliyat, Gıda..." 
                value={formData.sektor} 
                onChange={(e) => setFormData({...formData, sektor: e.target.value})} 
              />
            </div>

            {/* Şehir ve Yetkili */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Şehir</Label>
                <Input 
                  required 
                  placeholder="İstanbul" 
                  value={formData.sehir} 
                  onChange={(e) => setFormData({...formData, sehir: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Yetkili Kişi</Label>
                <Input 
                  placeholder="Ad Soyad" 
                  value={formData.yetkili} 
                  onChange={(e) => setFormData({...formData, yetkili: e.target.value})} 
                />
              </div>
            </div>

            {/* Telefon */}
            <div className="space-y-2">
              <Label>Telefon Numarası</Label>
              <Input 
                type="tel" 
                placeholder="0532..." 
                value={formData.telefon} 
                onChange={(e) => setFormData({...formData, telefon: e.target.value})} 
              />
            </div>

            <Button type="submit" className="w-full font-bold text-md mt-4" disabled={yukleniyor}>
              {yukleniyor ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Kaydediliyor...</> : <><Save className="mr-2 h-4 w-4" /> Kaydet</>}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}