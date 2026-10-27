# Pınar Yalçın – Kişisel Web Sitesi

Tamamen statik (HTML + CSS + az miktarda JavaScript), tek sayfalık kişisel tanıtım sitesi. Şu an hukuk fakültesi mezunu profiline göre düzenlenmiştir; ruhsat alındıktan sonra yapılacak değişiklikler için "Hukuki / etik notlar" bölümüne bakın. Derleme adımı, framework veya veritabanı gerektirmez; GitHub Pages üzerinde ücretsiz yayınlanır.

## Dosya yapısı

```
├── index.html              Ana sayfa (tüm bölümler)
├── kvkk.html               KVKK aydınlatma metni
├── 404.html                "Sayfa bulunamadı" sayfası
├── css/style.css           Tüm stiller (renkler en üstteki :root içinde)
├── js/main.js              Menü, animasyon, SSS, harita, form doğrulama
├── assets/
│   ├── pinar-yalcin.jpg         Profil fotoğrafı (sitede kullanılan)
│   ├── img1.jpeg                Orijinal fotoğraf (sitede kullanılmıyor)
│   ├── profil-placeholder.svg   Yedek yer tutucu (silinebilir)
│   ├── favicon.ico / favicon.svg / favicon-48.png / favicon-96.png / favicon-192.png
│   │                            PY logosu simgeleri (tarayıcı sekmesi ve Google arama sonuçları)
│   ├── apple-touch-icon.png     iPhone ana ekran simgesi
│   └── og-image.png             Paylaşım önizleme görseli (1200×630)
├── sitemap.xml
├── robots.txt
├── CNAME                   GitHub Pages'e alan adını bildirir (avpinaryalcin.com)
└── .nojekyll               GitHub Pages'in Jekyll işlemesini kapatır
```

## Yerelde önizleme

Proje klasöründe bir terminal açıp şunu çalıştırın:

```bash
python -m http.server 8000
```

Ardından tarayıcıda **http://localhost:8000** adresini açın. Durdurmak için terminalde `Ctrl + C` tuşlarına basın.

> `index.html` dosyasına çift tıklayarak da açabilirsiniz, ancak form ve bazı tarayıcı özellikleri yerel sunucuda daha doğru çalışır.

---

## Değiştirilecek yerler

Editörünüzde (ör. VS Code) **Ctrl + Shift + F** ile tüm projede aratıp değiştirin. Tüm yer tutucular `[KÖŞELİ PARANTEZ]` içinde ya da aşağıdaki özel biçimlerde yazılmıştır.

| Yer tutucu | Açıklama | Bulunduğu dosyalar |
|---|---|---|
| `[TELEFON]` | Ekranda görünen telefon (ör. `0 (5XX) XXX XX XX`) | index.html, kvkk.html |
| `+90XXXXXXXXXX` | Tıklayınca arama yapan link. Boşluksuz, `+90` ile (ör. `+905321234567`) | index.html, kvkk.html |
| `90XXXXXXXXXX` | WhatsApp numarası. `+` ve boşluk olmadan (ör. `905321234567`) | index.html (`wa.me/` linki) |
| `[E-POSTA]` | E-posta adresi | index.html, kvkk.html |
| `YOUR_FORM_ID` | Formspree form kimliği (aşağıya bakın) | index.html |
| `[SAKLAMA SÜRESİ]` | KVKK metnindeki saklama süresi (metni değiştirdiğinizde "Son güncelleme" tarihini de güncelleyin) | kvkk.html |
| Adres ve harita | Adres, harita (`data-src`) ve "Google Haritalar'da Aç" linki doldurulmuş durumda. Değiştirmek için aşağıdaki harita adımlarına bakın | index.html, kvkk.html |
| Profil fotoğrafı | Şu an `assets/pinar-yalcin.jpg` kullanılıyor (`img1.jpeg`'den 4:5 oranında kırpıldı). Değiştirmek için yeni fotoğrafı `assets/` klasörüne koyup `index.html` içindeki yolu güncelleyin (dikey, 4:5 oran, ~700×875 px veya üzeri) | index.html |

**Kontrol:** Değişiklikten sonra `.html` dosyalarında `[` karakterini, `XXXXXXXXXX` ve `YOUR_FORM_ID` ifadelerini arattığınızda sonuç çıkmamalıdır.

> Yayın adresi (`https://avpinaryalcin.com/`) `index.html`, `kvkk.html`, `sitemap.xml`, `robots.txt` ve `CNAME` dosyalarına işlenmiş durumdadır. Alan adı değişirse bu dosyalardaki adresi güncelleyin.

### Renkleri değiştirme
`css/style.css` dosyasının en üstündeki değişkenleri düzenleyin. Marka renkleri (`--navy`, `--gold`) iki temada ortaktır. Açık tema renkleri `:root, [data-theme="light"]` bloğunda, koyu tema renkleri `[data-theme="dark"]` bloğunda tanımlıdır.

### Etkileşimli özellikler ve düzenleme
| Özellik | Nasıl düzenlenir / kapatılır |
|---|---|
| Hero'daki dönen ifadeler (daktilo efekti) | `index.html` içinde `.typer` öğesinin `data-words` değeri. İfadeleri `\|` ile ayırın |
| Altın parçacık ağı | `js/main.js` > 6. bölüm. `LINK` / `MOUSE_LINK` mesafeleri ayarlanabilir; istemezseniz `<canvas class="hero-canvas">` satırını silin |
| Adalet terazisi çizimi | `index.html` > `.hero-visual` bloğu |
| Kayan ilgi alanları şeridi | `index.html` > `.ribbon` bloğu. Kesintisiz kayması için liste iki kez yazılır |
| Kelime kelime aydınlanan alıntı | `index.html` > `.quote-band` içindeki metin |
| Fotoğraf rozetleri (2026 / HMGS) | `index.html` > `.photo-badge` blokları |
| Zaman çizelgesi | `index.html` > `.timeline`. Tamamlanan adıma `is-done` sınıfı ekleyin |
| Açık/koyu tema | Varsayılan olarak ziyaretçinin cihaz ayarını izler. Ziyaretçinin seçimi yalnızca kendi tarayıcısında (localStorage) saklanır; çerez değildir |
| Kartlarda 3D eğim | Kartlardaki `data-tilt` özniteliğini silerek kapatılır |
| Mıknatıs etkili butonlar | Butonlardaki `data-magnetic` özniteliğini silerek kapatılır |

Hareket hassasiyeti ayarı açık olan ziyaretçilerde (`prefers-reduced-motion`) tüm animasyonlar kendiliğinden kapanır. Dokunmatik cihazlarda eğim ve mıknatıs efektleri devre dışıdır. Parçacık animasyonu, hero ekranda değilken ve sekme arka plandayken durur.

---

## İletişim formu (Formspree) kurulumu

1. https://formspree.io adresine gidip ücretsiz hesap açın. Formların gönderileceği e-posta adresinizle kayıt olun ve adresinizi doğrulayın.
2. **+ New Form** butonuna tıklayıp forma bir ad verin (ör. "Web sitesi iletişim").
3. Oluşan formun **Endpoint** adresi `https://formspree.io/f/abcdwxyz` biçimindedir. Sondaki `abcdwxyz` kısmı form kimliğinizdir.
4. `index.html` içinde şu satırı bulun:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   `YOUR_FORM_ID` kısmını kendi kimliğinizle değiştirin.
5. Siteyi yayınladıktan sonra formu bir kez test edin. İlk gönderimde Formspree bir onay e-postası gönderebilir.
6. (Önerilir) Formspree panelinde **Settings > Domains** (veya "Restrict to domain") bölümünden formu yalnızca kendi alan adınızdan kabul edecek şekilde sınırlayın.

> Ücretsiz plan aylık sınırlı sayıda gönderim içerir. Güncel limitleri Formspree sitesinden kontrol edin.
> Formspree ABD merkezli bir hizmettir. Bu yüzden formdaki KVKK onay kutusunda yurt dışına aktarım için açık rıza alınır. Metni ihtiyacınıza göre gözden geçirin.

## Google Maps haritasını ekleme

Şu an harita "Nidakule Küçükyalı, Maltepe" araması üzerinden çalışıyor. Daha kesin bir konum için:

1. Google Haritalar'da adresi aratın.
2. **Paylaş > Harita yerleştir** sekmesine geçin ve **HTML'yi kopyala** butonuna tıklayın.
3. Kopyalanan kodda `src="..."` içindeki adresi (`https://www.google.com/maps/embed?pb=...`) alın.
4. `index.html` içinde harita alanının `data-src="..."` değerine yapıştırın.
5. **Paylaş > Bağlantı gönder** sekmesinden alacağınız linki "Google Haritalar'da Aç" butonunun `href` değerine yazın.

Harita, ziyaretçi **"Haritayı Göster"** butonuna tıklayana kadar yüklenmez. Bu sayede site varsayılan olarak hiçbir çerez kullanmaz ve çerez banner'ına gerek kalmaz. Haritayı doğrudan iframe olarak gömerseniz Google çerezleri devreye girer ve çerez bildirimi gerekebilir.

---

## Yayınlama: GitHub Pages + avpinaryalcin.com (adım adım)

Site **https://avpinaryalcin.com** adresinde yayınlanacak şekilde hazırlanmıştır. Proje kökündeki `CNAME` dosyası GitHub'a bu alan adını bildirir; silmeyin.

### 1. GitHub deposu oluşturun
1. https://github.com adresinde oturum açın (hesabınız yoksa ücretsiz açın).
2. Sağ üstteki **+ > New repository** seçeneğine tıklayın.
3. **Repository name** alanına `avpinaryalcin` yazın.
4. **Public** seçili olsun. Ücretsiz planda GitHub Pages yalnızca herkese açık depolarda çalışır.
5. "Add a README" kutusunu **işaretlemeyin** ve **Create repository** butonuna tıklayın.

### 2. Dosyaları gönderin (git komutları)
Proje klasöründe terminal açın ve sırasıyla çalıştırın (depo zaten oluşturulup bağlandıysa bu adımı atlayın):

```bash
git init
git add .
git commit -m "İlk sürüm: kişisel web sitesi"
git branch -M main
git remote add origin https://github.com/AbdullahKarakoc/avpinaryalcin.git
git push -u origin main
```

> İlk `git push` sırasında GitHub oturum açma penceresi açılabilir; tarayıcıdan onay vermeniz yeterlidir.

> İlk `git commit` öncesinde ad ve e-posta isterse:
> `git config --global user.name "Adınız"` ve `git config --global user.email "eposta@ornek.com"`

Sonraki güncellemelerde yalnızca şu komutları çalıştırmanız yeterli:

```bash
git add .
git commit -m "İçerik güncellendi"
git push
```

### 3. GitHub Pages'i açın
1. GitHub'da deponuza gidin: **Settings > Pages**.
2. **Build and deployment > Source** altında **Deploy from a branch** seçin.
3. **Branch:** `main`, klasör: `/ (root)` seçip **Save** butonuna tıklayın.
4. **Custom domain** alanında `avpinaryalcin.com` yazılı olmalıdır (`CNAME` dosyasından otomatik okunur). Yazılı değilse elle yazıp **Save** butonuna tıklayın.

### 4. DNS ayarları (alan adını aldığınız firmanın paneli)
Alan adını satın aldığınız firmanın (ör. Natro, İsimtescil, Turhost, GoDaddy, Namecheap) panelinde **DNS Yönetimi / DNS Kayıtları** bölümünü açın. Varsa eski A/CNAME kayıtlarını ve "park sayfası" / "URL yönlendirme" ayarlarını kaldırın, ardından şu kayıtları ekleyin:

| Tür | Ad / Host | Değer |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `abdullahkarakoc.github.io` *(GitHub kullanıcı adı; depo adı yazılmaz)* |
| AAAA *(isteğe bağlı, IPv6)* | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |

Bu ayarlarla `www.avpinaryalcin.com` adresine gelen ziyaretçiler GitHub tarafından otomatik olarak `avpinaryalcin.com` adresine yönlendirilir.

### 5. HTTPS'i açın
1. DNS kayıtlarının yayılmasını bekleyin. Genellikle birkaç dakika sürer, bazen 24 saate kadar uzayabilir.
2. **Settings > Pages** sayfasında "DNS check successful" mesajını görünce **Enforce HTTPS** kutusunu işaretleyin. Kutu hemen aktif olmazsa sertifikanın hazırlanmasını bekleyin; bu bir saati bulabilir.
3. https://avpinaryalcin.com adresini açarak kontrol edin.

### 6. (Önerilir) Alan adını GitHub'da doğrulayın
Başkasının alan adınızı kendi GitHub sitesine bağlamasını önlemek için: GitHub'da sağ üstteki profil resmi > **Settings > Pages > Add a domain** yolunu izleyin ve `avpinaryalcin.com` yazın. GitHub'ın verdiği **TXT** kaydını DNS paneline ekleyin, ardından **Verify** butonuna tıklayın.

### 7. (Önerilir) Google'a bildirin
https://search.google.com/search-console adresinden alan adını ekleyin ve `https://avpinaryalcin.com/sitemap.xml` adresini **Site haritaları** bölümüne gönderin.

### Sorun giderme
- **Site açılmıyor / "There isn't a GitHub Pages site here":** DNS kayıtları henüz yayılmamış olabilir. Ayrıca `CNAME` dosyasının depoda olduğunu ve Pages'in `main / (root)` ayarında açık olduğunu kontrol edin.
- **Tasarım bozuk görünüyor:** Tarayıcıda **Ctrl + F5** ile önbelleği temizleyerek yenileyin.
- **Güncelleme görünmüyor:** `git push` sonrası yayına alınması 1–2 dakika sürer. Deponun **Actions** sekmesinden durumu izleyebilirsiniz.

---

## Hukuki / etik notlar

### Mevcut durum: hukuk fakültesi mezunu (ruhsat yok)
Pınar Yalçın hukuk fakültesinden mezun olmuş ve HMGS'de başarılı olmuştur. Ancak henüz avukatlık stajını tamamlayıp baroya kaydolmamıştır. Bu nedenle site, avukatlık bürosu sitesi olarak değil **kişisel tanıtım sayfası** olarak düzenlenmiştir. Bu durum sürdükçe:

- "Av." unvanı veya "avukat" ifadesi kullanılmamalıdır. Bu unvanı yalnızca baro levhasına kayıtlı avukatlar kullanabilir.
- Randevu, ücret, dava takibi veya hukuki danışmanlık teklif eden içerik eklenmemelidir. Bu işler Avukatlık Kanunu m. 35 uyarınca avukatlara aittir.
- Footer'daki "avukatlık ruhsatı bulunmamaktadır" uyarısı kaldırılmamalıdır.
- Alan adındaki "av" öneki (`avpinaryalcin.com`) "Avukat" kısaltması olarak algılanabilir. Ruhsat alınana kadar alan adı kartvizit, e-posta imzası veya sosyal medyada "Av. Pınar Yalçın" şeklinde sunulmamalıdır.
- Staj başladıktan sonra da durum değişmez: stajyer avukatlar kendi adlarına iş kabul edemez ve büro açamaz. Hakkımda bölümündeki ve zaman çizelgesindeki metinler "avukatlık stajını sürdürmektedir" şeklinde güncellenebilir.

### Ruhsat alındıktan sonra (baroya kayıt)
Site, avukatlık bürosu sitesine şu adımlarla dönüştürülebilir:

1. "Pınar Yalçın" → "Av. Pınar Yalçın" (title, menü, footer, OG görseli, KVKK sayfası).
2. Hakkımda bölümüne baro adı ve sicil numarası eklenir; footer uyarısı yeniden "Bu internet sitesi bilgilendirme amaçlıdır; reklam, iş edinme veya yönlendirme amacı taşımamaktadır. Sitede yer alan bilgiler hukuki danışmanlık niteliği taşımaz." şeklinde düzenlenir.
3. "İlgi Alanları" → "Çalışma Alanları". İsteğe bağlı olarak randevu butonu, çalışma saatleri ve müvekkillere yönelik SSS bölümü eklenir.
4. JSON-LD'de `Person` yerine `LegalService` türü kullanılır.

O aşamada da TBB Reklam Yasağı Yönetmeliği'ne uyulmalıdır:

- "En iyi", "uzman", "garantili", "%100 başarı" gibi iddialı veya karşılaştırmalı ifadeler kullanılmamalıdır.
- Kazanılan dava sayısı, müvekkil yorumu/referansı, ücret veya indirim bilgisi eklenmemelidir.

### Genel
- `kvkk.html` örnek bir metindir; kendi veri işleme faaliyetlerinize göre gözden geçirin.
- Siteye Google Analytics gibi çerez kullanan bir araç eklerseniz bir çerez bildirimi/onay mekanizması da eklemeniz gerekir.

## Gizlilik ve performans notları

- Harici JavaScript kütüphanesi yoktur. Görseller `loading="lazy"` ile yüklenir.
- Yazı tipleri Google Fonts'tan gelir; bu sırada ziyaretçinin IP adresi Google'a iletilir. Bunu tamamen önlemek isterseniz yazı tiplerini indirip `assets/fonts/` altında kendiniz barındırabilirsiniz (ör. https://gwfh.mranftl.com/fonts aracıyla).
- Erişilebilirlik: klavye ile gezinme, "İçeriğe geç" bağlantısı, odak göstergeleri, `prefers-reduced-motion` desteği ve WCAG AA kontrastı gözetilmiştir.
