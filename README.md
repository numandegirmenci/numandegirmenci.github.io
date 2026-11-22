# Numan Değirmenci — Kişisel Portfolyo

Yayın: **https://numandegirmenci.github.io/**

İdari işler ve operasyon deneyimini gerçek iş problemlerinden doğan dijital projelerle bir araya getiren kişisel web sitesi.

## Sürüm 5 — Görsel ve etkileşimli portfolyo

- **Koyu tema varsayılan.** Açık tema tercihi de desteklenir ve tarayıcıda saklanır.
- Görsel çalışma alanında dört projenin temsili ekran sunumu; **01–04** düğmelerine veya klavyede 1–4 tuşlarına basılarak değiştirilebilir.
- Dört proje için özgün `assets/*.svg` sunum görselleri. Bunlar gerçek uygulama ekran görüntüleri **değildir**.
- Filtrelenebilir, büyük görselli proje galerisi ve proje başına yerel `<dialog>` ayrıntı penceresi.
- Etkileşimli **Operasyon / Dijital üretim** bölümü.
- Mesleki deneyim, LinkedIn paylaşımları, GitHub profili ve sosyal bağlantılar.
- Kaydırma ilerleme göstergesi, hafif hareket efektleri ve azaltılmış hareket tercihine destek.
- Masaüstü, tablet ve mobil için duyarlı arayüz; küçük görsel varlıklar ve derlemesiz dağıtım.

## Dosyalar

- `index.html`: içerik, görsel galeri, proje detayları ve bağlantılar
- `styles.css`: koyu/açık tema, animasyonlar, responsive düzen
- `app.js`: tema, mobil menü, etkileşimler, filtreler, modaller
- `assets/gunizi.svg`: Günİzi sunum görseli
- `assets/ocr.svg`: Türkçe PDF OCR sunum görseli
- `assets/outlook.svg`: Outlook İş ve Yanıt Radarı sunum görseli
- `assets/pdf-tools.svg`: Windows PDF aracı sunum görseli
- `favicon.svg`: küçük site ikonu
- `robots.txt`, `sitemap.xml`: temel arama motoru keşfi

## Sosyal medya

- LinkedIn: https://www.linkedin.com/in/numandegirmencii/
- GitHub: https://github.com/numandegirmenci
- Instagram ve YouTube **tam URL'si doğrulanmadığı için** şu an görünmez. Adresleri `app.js` içindeki `SOCIAL_URLS` nesnesine ekleyip doğrulayınca görünür olurlar.

## İçerik doğrulama

Mesleki roller daha önce kullanıcı tarafından paylaşılan kariyer bilgisinden, uygulamaların işlevleri GitHub projelerinin README dosyalarından ve iki paylaşım herkese açık LinkedIn gönderilerinden derlendi. Doğrulanmamış işverenler, çalışma tarihleri, test edilmiş sürüm iddiaları veya performans verileri eklenmedi. Uygulamaların beta / test koşulları için ilgili GitHub deposundaki sürüm notları geçerlidir.

## Yayınlama ve alan adı

GitHub Pages `main` dalının kök dizinini yayınlar. Bu sürüm özel `.com` alan adı satın alınmadan çalışır. `numandegirmenci.com` henüz satın alınmamış veya DNS bağlantısı yapılmış olarak kabul edilmez. Özel alan adı edinildiğinde DNS ve Pages ayarları ayrıca yapılmalıdır.

## Gizlilik ve erişilebilirlik

İletişim formu, izleyici veya çerez analitiği yok. Dış bağlantılarda `noopener noreferrer` kullanılır. Google Fonts dış kaynaktan yüklenir; internet erişimi olmazsa sistem yazı tipleri devreye girer. Görsel hareketler `prefers-reduced-motion` ile azaltılır.
