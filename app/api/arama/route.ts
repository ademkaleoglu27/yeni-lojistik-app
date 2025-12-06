import { NextResponse } from 'next/server';

// ELİNDEKİ ANAHTARI TIRNAK İÇİNE YAPIŞTIR
const GOOGLE_API_KEY = "AIzaSyCw0bhZ2WTrZtThjgJBMsbjZ7IDh6QN0Og";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sektor, sehir } = body;

        // Google'a sorulacak soru: "Lojistik firmaları in Gaziantep"
        const textQuery = `${sektor} in ${sehir}`;

        // Google Places API'ye resmi istek atıyoruz
        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_API_KEY,
                // Sadece ihtiyacımız olan verileri istiyoruz (Fatura şişmesin)
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.location'
            },
            body: JSON.stringify({
                textQuery: textQuery,
                maxResultCount: 10 // Her aramada 10 firma getirir (Max 20 yapabilirsin)
            })
        });

        const data = await response.json();

        // Eğer sonuç yoksa hata döndür
        if (!data.places) {
            return NextResponse.json({ success: false, error: "Google sonuç döndürmedi. API Key veya kota kontrolü yapın." });
        }

        // Gelen veriyi bizim uygulamanın anlayacağı dile çevir
        const temizVeri = data.places.map((place: any) => ({
            ad: place.displayName?.text || "İsimsiz",
            adres: place.formattedAddress || "Adres yok",
            telefon: place.nationalPhoneNumber || "Yok",
            web: place.websiteUri || "Yok",
            puan: place.rating || 0,
        }));

        return NextResponse.json({ success: true, data: temizVeri });

    } catch (error) {
        console.error("Google API Hatası:", error);
        return NextResponse.json({ success: false, error: "Sunucu hatası oluştu" }, { status: 500 });
    }
}