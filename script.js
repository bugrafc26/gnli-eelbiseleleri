document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM içeriği yüklendi. GNL İŞ ELBİSELERİ VE PROMOSYON ÜRÜNLERİ Scripti çalışmaya başladı.');

    // ----------------------------------------------
    // 1. Genel DOM Elementlerini Seçme
    // ----------------------------------------------
    const ctaButton = document.querySelector('.cta-button');
    const productListingSection = document.querySelector('.product-listing-section');
    const productGrid = document.querySelector('.product-grid');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfoSpan = document.querySelector('.page-info'); // ID yerine class ile seçildi
    const productSectionTitle = document.querySelector('.section-title'); // ID yerine class ile seçildi
    const backToTopBtn = document.querySelector('.back-to-top-btn'); // ID yerine class ile seçildi
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    // Yeni Modal Elementleri (geri eklendi)
    const productDetailModal = document.getElementById('productDetailModal');
    const closeModalBtn = document.querySelector('.modal .close-button');
    const modalProductImage = document.getElementById('modalProductImage');
    const modalProductTitle = document.getElementById('modalProductTitle');
    const modalProductDescription = document.getElementById('modalProductDescription');
    const modalProductDetails = document.getElementById('modalProductDetails');
    const modalProductMaterial = document.getElementById('modalProductMaterial');
    const modalProductFeatures = document.getElementById('modalProductFeatures');
    const modalProductUsage = document.getElementById('modalProductUsage');


    // Konsola eksik element uyarıları (güncellenmiş seçicilere göre)
    if (!ctaButton) console.warn('CTA butonu bulunamadı.');
    if (!productListingSection) console.error('Ürün listeleme bölümü (.product-listing-section) bulunamadı!');
    if (!productGrid) console.error('Ürün gridi (.product-grid) bulunamadı!');
    if (!prevPageBtn) console.error('Önceki sayfa butonu (#prevPage) bulunamadı!');
    if (!nextPageBtn) console.error('Sonraki sayfa butonu (#nextPage) bulunamadı!');
    if (!pageInfoSpan) console.error('Sayfa bilgisi spanı (.page-info) bulunamadı!');
    if (!productSectionTitle) console.error('Ürün bölüm başlığı (.section-title) bulunamadı!');
    if (!backToTopBtn) console.warn('Yukarı çık butonu (.back-to-top-btn) bulunamadı.');
    if (!navToggle) console.warn('Mobil navigasyon geçiş butonu (.nav-toggle) bulunamadı.');
    if (!mainNav) console.warn('Ana navigasyon (.main-nav) bulunamadı.');
    // Modal element uyarıları (geri eklendi)
    if (!productDetailModal) console.error('Ürün detay modalı (#productDetailModal) bulunamadı!');
    if (!closeModalBtn) console.warn('Modal kapatma butonu (.close-button) bulunamadı!');


    // ----------------------------------------------
    // 2. Header Navigasyon ve Mobil Menü İşlevselliği
    // ----------------------------------------------
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            console.log('Mobil navigasyon aç/kapa tıklandı.');
        });
    }

    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                // Eğer mobil menü açıksa, linke tıklanınca kapansın
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    console.log('Navigasyon linki tıklandı, mobil menü kapatıldı.');
                }
                // Aktif link sınıfını güncelle
                navLinks.forEach(item => item.classList.remove('active'));
                event.target.classList.add('active');
                console.log(`Navigasyon linki aktif edildi: ${event.target.textContent}`);

                // Sayfada ilgili bölüme sorunsuz kaydır
                const targetId = event.target.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        event.preventDefault(); // Varsayılan anchor davranışını engelle
                        const headerOffset = document.querySelector('.main-header') ? document.querySelector('.main-header').offsetHeight : 0;
                        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                        console.log(`"${targetId}" bölümüne kaydırılıyor.`);
                    }
                }
            });
        });
    }

    // İlk yüklendiğinde mevcut URL'ye göre aktif linki belirle
    const currentPath = window.location.hash;
    if (currentPath) {
        const activeLink = document.querySelector(`.main-nav ul li a[href="${currentPath}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            console.log(`Sayfa yüklendiğinde aktif link: ${currentPath}`);
        }
    } else { // Anasayfa veya başlangıç durumu
        const homeLink = document.querySelector('.main-nav ul li a[href="#hero-section"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }


    // ----------------------------------------------
    // 3. Hero Bölümü CTA Buton Kaydırma
    // ----------------------------------------------
    if (ctaButton && productListingSection) {
        ctaButton.addEventListener('click', () => {
            console.log('CTA butonu tıklandı, ürün bölümüne kaydırılıyor.');
            const headerOffset = document.querySelector('.main-header') ? document.querySelector('.main-header').offsetHeight : 0;
            const elementPosition = productListingSection.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    }

    // ----------------------------------------------
    // 4. Ürün Sayfalama (Pagination) Mantığı
    // ----------------------------------------------

    // Ürün Verileri (Tam ve doğru ID'ler ve detaylarla)
const allProducts = [
    {
        id: 1,
        img: "1.jpg",
        title: "Kırmızı Pamuklu Bisiklet Yaka Tişört",
        description: "Gündelik kullanım veya promosyonel etkinlikler için ideal, %100 pamuktan üretilmiş, rahat ve nefes alabilen kırmızı bisiklet yaka tişört. Logo baskısı için uygundur.",
        details: "Yüksek kaliteli pamuklu kumaş. Bisiklet yaka, kısa kollu. Nefes alabilen yapı. Makinede yıkanabilir. Kurumsal etkinlikler, fuarlar ve günlük kullanım için mükemmeldir. Farklı beden seçenekleri mevcuttur.",
        material: "%100 Pamuk",
        features: ["Nefes alabilen kumaş", "Yumuşak doku", "Dayanıklı dikişler", "Baskıya uygun yüzey"],
        usage: ["Promosyon", "Günlük Giyim", "Kurumsal Etkinlikler"]
    },
    {
        id: 2,
        img: "2.jpg",
        title: "Sarı Siyah Reglan Kollu Polo Yaka Tişört",
        description: "Şirket içi etkinlikler veya takım kıyafetleri için tasarlanmış, canlı sarı gövdesi ve kontrast oluşturan siyah reglan kollarıyla dikkat çeken polo yaka tişört.",
        details: "Pikeli kumaştan üretilmiş, reglan kesim kollara sahip polo yaka tişört. Terletmez ve hareket özgürlüğü sağlar. Şık tasarımıyla personel kıyafetleri için idealdir. Sol göğüste logo nakışına uygundur.",
        material: "Pike Kumaş (Pamuk & Polyester Karışımı)",
        features: ["Reglan kol tasarımı", "Nefes alabilir", "Yaka ve kol manşetlerinde ribana", "Dayanıklı yapı"],
        usage: ["Kurumsal Giyim", "Takım Kıyafetleri", "Personel Üniforması"]
    },
    {
        id: 3,
        img: "3.jpg",
        title: "Gri Reflektör Şeritli İş Tulumu",
        description: "Güvenlik ve konforu bir araya getiren gri renk iş tulumu. Yüksek görünürlük sağlayan reflektör şeritleri ile gece ve düşük ışık koşullarında maksimum güvenlik sunar. Sanayi ve inşaat gibi sektörler için uygundur.",
        details: "Gabardin kumaştan üretilmiş, çift reflektör şeritli güvenlik tulumu. Fermuarlı ön kapama, çoklu cep detayları. Sanayi, inşaat, yol çalışmaları gibi yüksek riskli alanlar için tasarlanmıştır. Ergonomik kesimi sayesinde rahat hareket imkanı sunar.",
        material: "Gabardin Kumaş",
        features: ["Yüksek görünürlüklü reflektörler", "Çoklu cepler", "Dayanıklı dikişler", "Ergonomik kesim"],
        usage: ["İnşaat", "Sanayi", "Yol Yapım", "Bakım Onarım"]
    },
    {
        id: 4,
        img: "4.jpg",
        title: "Lacivert Reflektörlü Kargo Cepli Kot İş Pantolonu",
        description: "Dayanıklı kot kumaşından üretilmiş, reflektör şerit detaylı ve kullanışlı kargo ceplerine sahip lacivert iş pantolonu. Hem rahatlık hem de güvenlik sunar.",
        details: "Ağır hizmet tipi kot kumaşından imal edilmiş, yırtılmaya karşı dirençli iş pantolonu. Yanlarda kargo cepleri ve alt kısımda reflektör şeritleri bulunmaktadır. Uzun süreli kullanıma uygun, dayanıklı yapısıyla öne çıkar.",
        material: "Kot Kumaş",
        features: ["Reflektör şeritler", "Kargo cepleri", "Güçlendirilmiş dikişler", "Rahat kalıp"],
        usage: ["Atölye", "Depo", "Montaj", "Mühendislik"]
    },
    {
        id: 5,
        img: "5.jpg",
        title: "Gri Reflektör Şeritli Gabardin İş Pantolonu",
        description: "Yüksek dayanıklılığa sahip gabardin kumaştan yapılmış, reflektör şeritleri ile iş güvenliğini artıran gri renkli iş pantolonu. Endüstriyel kullanıma uygundur.",
        details: "Su itici özellikli gabardin kumaştan üretilmiş, diz bölgeleri güçlendirilmiş, gri renk iş pantolonu. Reflektör şeritleri sayesinde gece görüşünü artırır. Çoklu cepleri ile alet taşıma kolaylığı sunar. Uzun çalışma saatleri için idealdir.",
        material: "Gabardin Kumaş",
        features: ["Su itici", "Diz güçlendirme", "Yüksek görünürlük", "Alet cepleri"],
        usage: ["Endüstriyel", "Şantiye", "Bakım"]
    },
    {
        id: 6,
        img: "6.jpg",
        title: "Lacivert Reflektörlü Gabardin İş Pantolonu",
        description: "Şık lacivert rengi ve dayanıklı gabardin kumaşıyla öne çıkan, reflektör şeritleri sayesinde görünürlüğü artıran iş pantolonu. Çalışma ortamlarında konfor ve güvenlik sağlar.",
        details: "Yırtılmaya dirençli lacivert gabardin kumaştan üretilmiş, alt paçalarda reflektör şerit detaylı iş pantolonu. Ergonomik kesimi ve esnek yapısıyla tüm gün konfor sunar. Ağır çalışma koşullarına dayanıklıdır.",
        material: "Gabardin Kumaş",
        features: ["Dayanıklı", "Esnek", "Reflektörlü", "Çok amaçlı cepler"],
        usage: ["Sanayi", "Lojistik", "Teknik Servis"]
    },
    {
        id: 7,
        img: "7.jpg",
        title: "Gri Uzun Kollu Cepli Polo Yaka Tişört",
        description: "Soğuk hava koşulları için ideal, kaliteli pamuklu kumaştan üretilmiş gri uzun kollu polo yaka tişört. Göğüs cebi ile fonksiyonellik sunar.",
        details: "Kalın ve yumuşak dokulu pamuklu kumaştan yapılmış, uzun kollu gri polo yaka tişört. Soğuk havalarda iç giyim veya tek başına giyim için idealdir. Düğmeli yaka ve sol göğüste fonksiyonel bir cep bulunur. Kurumsal baskılar için uygundur.",
        material: "%100 Pamuk",
        features: ["Uzun kollu", "Cepli tasarım", "Yumuşak doku", "Sıcak tutar"],
        usage: ["Kurumsal", "Ofis", "Günlük Kış Giyimi"]
    },
    {
        id: 8,
        img: "8.jpg",
        title: "Turkuaz Mavi Cepli Polo Yaka Tişört",
        description: "Klasik kesimli, canlı turkuaz mavi renkte polo yaka tişört. Gündelik giyim ve kurumsal etkinlikler için idealdir, sol göğüste pratik bir cep bulunur.",
        details: "Nefes alabilen pike kumaştan üretilmiş, canlı turkuaz mavi polo yaka tişört. Sol göğüste şık bir cep detayı bulunur. Yaz aylarında ve iç mekanlarda rahatlıkla kullanılabilir. Şirket tanıtım ve promosyonları için idealdir.",
        material: "Pike Kumaş",
        features: ["Canlı renk", "Nefes alabilir", "Cepli", "Logo işlemeye uygun"],
        usage: ["Promosyon", "Etkinlikler", "Günlük Giyim"]
    },
    {
        id: 9,
        img: "9.jpg",
        title: "Mavi Siyah Reflektörlü İş Yeleği",
        description: "Özellikle dış mekan çalışmaları için tasarlanmış, yüksek görünürlüklü reflektör şeritlere ve çoklu ceplere sahip mavi-siyah iş yeleği. Hem şık hem de koruyucu.",
        details: "Hafif ve dayanıklı polyester kumaştan üretilmiş, mavi ve siyah renk kombinasyonlu reflektörlü iş yeleği. Fermuarlı cepler, kimlik kartı cebi ve telefon cebi gibi çoklu bölmeleriyle kullanışlıdır. Gece ve gündüz yüksek görünürlük sağlar.",
        material: "Polyester Kumaş",
        features: ["Yüksek görünürlük", "Çoklu cepler", "Hafif yapı", "Suya dayanıklı"],
        usage: ["Dış Mekan İşleri", "Güvenlik", "Lojistik"]
    },
    {
        id: 10,
        img: "10.jpg",
        title: "Kırmızı Siyah Fermuarlı Softshell Yelek",
        description: "Soğuk ve rüzgarlı havalarda üstün koruma sağlayan, kırmızı ve siyah renk kombinasyonlu şık softshell yelek. Fermuarlı cepleriyle kullanışlıdır.",
        details: "Rüzgar ve suya dayanıklı softshell kumaştan üretilmiş, termal astarlı fermuarlı yelek. Kırmızı ve siyah renkleriyle modern bir görünüm sunar. Yanlarda fermuarlı cepler bulunur. Hafif yapısıyla hareket özgürlüğü sağlar.",
        material: "Softshell Kumaş",
        features: ["Rüzgar geçirmez", "Suya dayanıklı", "Nefes alabilir", "Termal astar"],
        usage: ["Açık Hava Aktiviteleri", "Kurumsal Giyim", "Saha Çalışmaları"]
    },
    {
        id: 11,
        img: "11.jpg",
        title: "Siyah Renkli Klasik İş Pantolonu",
        description: "Günlük ofis veya iş ortamı için uygun, rahat kesimli ve dayanıklı siyah kumaş pantolon. Hem şık hem de konforlu bir seçenektir.",
        details: "Kırışmaya dirençli özel karışım kumaştan üretilmiştir. Fermuarlı ve düğmeli ön kapama, kemer köprüleri ve yan cepler bulunur. Uzun süreli kullanıma uygun, bakımı kolay bir üründür.",
        material: "Polyester Karışım Kumaş",
        features: ["Rahat kalıp", "Kırışmaya dirençli", "Dayanıklı", "Kolay bakım"],
        usage: ["Ofis Giyim", "Kurumsal Toplantılar", "Günlük İş Kıyafeti"]
    },
    {
        id: 12,
        img: "12.jpg",
        title: "Kırmızı Reflektörlü Çok Cepli İş Yeleği",
        description: "Kırmızı renkte, yüksek görünürlüklü reflektör şeritlere ve birden fazla cebe sahip, iş güvenliği için tasarlanmış yelek.",
        details: "Nefes alabilen polyester kumaştan üretilmiş, önde fermuarlı, kimlik kartı cebi, kalemlik cebi ve çoklu fonksiyonel cepleri bulunan güvenlik yeleği. Yüksek görünürlük sağlayan geniş reflektör şeritleri ile gece ve düşük ışık koşullarında maksimum güvenlik sunar.",
        material: "Polyester Kumaş",
        features: ["Yüksek görünürlük", "Çoklu fonksiyonel cepler", "Hafif yapı", "Nefes alabilen"],
        usage: ["İnşaat", "Yol Çalışmaları", "Güvenlik Görevlisi", "Lojistik"]
    },
    {
        id: 13,
        img: "13.jpg",
        title: "Antrasit Fermuarlı Softshell Mont",
        description: "Rüzgar ve su geçirmez özelliklere sahip, fermuarlı cepleri ve kapüşonu bulunan, dış mekan kullanımı için ideal antrasit renk mont.",
        details: "Üç katmanlı softshell kumaş, su ve rüzgar geçirmezlik sağlar. Çıkarılabilir ve ayarlanabilir kapüşon, fermuarlı göğüs ve yan cepler mevcuttur. İç kısmı polar astarlıdır, soğuk havalarda ek sıcaklık sunar. Ergonomik kesimi ile hareket özgürlüğü sağlar.",
        material: "Softshell Kumaş (Polyester Dış Katman, Polar Astar)",
        features: ["Su ve rüzgar geçirmez", "Nefes alabilir", "Fermuarlı cepler", "Çıkarılabilir kapüşon"],
        usage: ["Dış Mekan Çalışmaları", "Doğa Sporları", "Günlük Kış Giyimi"]
    },
    {
        id: 14,
        img: "14.jpg",
        title: "Turuncu Cepli Polo Yaka Tişört",
        description: "Canlı turuncu renkte, polo yaka ve göğüs cebi detaylı, rahat kesim bir tişört. Günlük kullanım ve etkinlikler için uygundur.",
        details: "Yüksek kaliteli pike kumaştan üretilmiş, yaka ve kol manşetlerinde kontrast şerit detayları bulunan turuncu polo yaka tişört. Sol göğüste şık bir cep detayı bulunur. Yaz aylarında ve iç mekanlarda rahatlıkla kullanılabilir. Şirket tanıtım ve promosyonları için idealdir.",
        material: "Pike Kumaş",
        features: ["Canlı renk", "Nefes alabilir", "Cepli", "Yaka ve kol detayları"],
        usage: ["Promosyon", "Etkinlikler", "Günlük Giyim"]
    },
    {
        id: 15,
        img: "15.jpg",
        title: "Turuncu Reflektörlü Güvenlik Yeleği",
        description: "Yüksek görünürlük sağlayan turuncu renkte, iki yatay reflektör şeride sahip basit tasarımlı güvenlik yeleği.",
        details: "Hafif polyester file kumaştan üretilmiş, gece ve düşük ışık koşullarında optimum görünürlük sağlayan iki adet yatay reflektör şeridi bulunan güvenlik yeleği. Velcro (cırt cırt) kapama sistemi sayesinde kolayca giyilip çıkarılabilir. Geniş beden aralığında mevcuttur.",
        material: "Polyester File Kumaş",
        features: ["Yüksek görünürlük", "Hafif", "Nefes alabilen", "Kolay giyilip çıkarılabilir"],
        usage: ["İnşaat", "Yol Bakım", "Depo", "Bisiklet Sürme"]
    },
    {
        id: 16,
        img: "16.jpg",
        title: "Kraliyet Mavisi Polo Yaka Tişört",
        description: "Klasik polo yaka tasarımlı, canlı kraliyet mavisi renkte, kısa kollu rahat tişört.",
        details: "Yüksek kaliteli pamuklu pike kumaştan üretilmiş, nefes alabilen ve rahat bir yapıya sahip kraliyet mavisi polo yaka tişört. Üç düğmeli yaka ve standart kesim. Logo nakışına veya baskıya uygun yüzey sunar. Yaz ve bahar ayları için idealdir.",
        material: "Pike Kumaş",
        features: ["Canlı renk", "Nefes alabilir", "Yumuşak doku", "Baskıya uygun"],
        usage: ["Kurumsal Giyim", "Promosyon", "Günlük Giyim", "Etkinlikler"]
    },
    {
        id: 17,
        img: "17.jpg",
        title: "Gri Turuncu Çok Cepli İş Yeleği",
        description: "Gri ve turuncu renk kombinasyonlu, ön kısmında çok sayıda fonksiyonel cebi bulunan, iş sahası için tasarlanmış dayanıklı yelek.",
        details: "Dayanıklı gabardin kumaştan üretilmiş, gri ana renk ve turuncu detaylarla tasarlanmış çok cepli iş yeleği. Telefon cebi, kalemlik cebi, büyük kapaklı cepler gibi birçok fonksiyonel depolama alanı sunar. Fermuarlı ön kapama ve ergonomik kesimi ile işlevsellik ve konforu birleştirir.",
        material: "Gabardin Kumaş",
        features: ["Çoklu fonksiyonel cepler", "Dayanıklı", "Ergonomik tasarım", "Renk kontrastı"],
        usage: ["İnşaat", "Tamir", "Montaj", "Teknisyen"]
    },
    {
        id: 18,
        img: "18.jpg",
        title: "Kırmızı Siyah Reglan Kol Polo Yaka Tişört",
        description: "Kırmızı gövde ve siyah reglan kollarıyla dikkat çeken, göğüs cebi bulunan polo yaka tişört.",
        details: "Nefes alabilen pike kumaştan üretilmiş, kırmızı gövde ve kontrast siyah reglan kollara sahip spor kesim polo yaka tişört. Sol göğüste bir cep detayı ve yaka ile kol ağzında ince siyah biye detayı bulunur. Şirket spor takımları veya dinamik kurumsal kimlikler için idealdir.",
        material: "Pike Kumaş",
        features: ["Reglan kol", "Nefes alabilir", "Cepli", "Spor kesim"],
        usage: ["Spor Etkinlikleri", "Kurumsal Takım Giyimi", "Promosyon"]
    },
    {
        id: 19,
        img: "19.jpg",
        title: "Çok Renkli Promosyon Şapkaları",
        description: "Farklı renk seçeneklerinde, logo baskısına uygun, spor ve promosyon amaçlı kullanılabilecek bez şapkalar.",
        details: "Yüksek kaliteli pamuklu twill kumaştan üretilmiş, ayarlanabilir arka bandı bulunan standart beyzbol şapkaları. Geniş renk yelpazesi mevcuttur. Ön kısmına nakış veya baskı için geniş bir alan sunar. Kurumsal tanıtım ve etkinlikler için popüler bir promosyon ürünüdür.",
        material: "Pamuk Twill Kumaş",
        features: ["Çoklu renk seçeneği", "Ayarlanabilir", "Nakışa/baskıya uygun", "Dayanıklı"],
        usage: ["Promosyon", "Etkinlikler", "Günlük Kullanım"]
    },
    {
        id: 20,
        img: "20.jpg",
        title: "Siyah Renkli Klasik Polo Yaka Tişört",
        description: "Zamansız şıklık sunan, her ortamda kullanıma uygun, kaliteli siyah polo yaka tişört.",
        details: "Yüksek kaliteli pike kumaştan üretilmiş, klasik kesim ve üç düğmeli yaka detayına sahip siyah polo yaka tişört. Nefes alabilen yapısı ile gün boyu konfor sağlar. Sade ve şık tasarımı sayesinde hem günlük giyim hem de kurumsal etkinlikler için idealdir.",
        material: "Pike Kumaş",
        features: ["Klasik tasarım", "Nefes alabilen kumaş", "Yumuşak doku", "Çok yönlü kullanım"],
        usage: ["Kurumsal Giyim", "Günlük Giyim", "Etkinlikler", "Promosyon"]
    }
];

    const productsPerPage = 4;
    let currentPage = 1;
    const totalPages = allProducts.length > 0 ? Math.ceil(allProducts.length / productsPerPage) : 1;

    console.log(`Ürünler hazırlandı. Toplam: ${allProducts.length} ürün, ${productsPerPage} ürün/sayfa, Toplam sayfa: ${totalPages}`);

    function displayProducts(page) {
        console.log(`displayProducts fonksiyonu çağrıldı. Gösterilecek sayfa: ${page}`);

        if (productGrid) {
            productGrid.style.opacity = 0; // Ürünleri gizle
        }

        // Sayfa başlığı her zaman gösterilecek
        if (productSectionTitle) {
            productSectionTitle.style.display = 'block';
            console.log('Ürün bölüm başlığı her zaman gösteriliyor.');
        }

        setTimeout(() => {
            if (productGrid) {
                productGrid.innerHTML = ''; // Önceki ürünleri temizle

                const startIndex = (page - 1) * productsPerPage;
                const endIndex = Math.min(startIndex + productsPerPage, allProducts.length);
                const productsToShow = allProducts.slice(startIndex, endIndex);

                console.log(`Sayfa ${page} için ürün dilimi: ${startIndex} - ${endIndex}. Gösterilecek ${productsToShow.length} ürün.`);

                if (productsToShow.length === 0 && allProducts.length > 0) {
                    productGrid.innerHTML = '<p style="text-align: center; font-size: 1.2em; color: #555; margin-top: 50px;">Bu sayfada gösterilecek ürün bulunmuyor.</p>';
                    console.warn(`Uyarı: Sayfa ${page} için ürün bulunamadı. Dilimleme hatası olabilir.`);
                } else if (allProducts.length === 0) {
                    productGrid.innerHTML = '<p style="text-align: center; font-size: 1.5em; color: #555; margin-top: 50px;">Henüz görüntülenecek ürün bulunmuyor.</p>';
                    console.log('Ürün listesi boş, bilgilendirme mesajı gösterildi.');
                }

                productsToShow.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.classList.add('product-item');
                    // data-id özelliği ekleyerek ürünün id'sini taşıyoruz
                    productItem.setAttribute('data-id', product.id); // Product ID'yi data attribute olarak ekle
                    productItem.innerHTML = `
                        <img src="${product.img}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                        <div class="product-overlay">
                            <a href="#" class="view-details">Detayları Görüntüle</a>
                        </div>
                    `;
                    productGrid.appendChild(productItem);
                });
                console.log(`Sayfa ${page} için ${productsToShow.length} ürün DOM'a eklendi.`);

                updatePaginationControls();
                productGrid.style.opacity = 1; // Yeni ürünleri görünür yap
                console.log('Ürün gridi opacity 1 yapıldı.');

                // Yeni sayfaya geçildiğinde ürün bölümüne kaydır
                if (productListingSection) {
                    const headerOffset = document.querySelector('.main-header') ? document.querySelector('.main-header').offsetHeight : 0;
                    const elementPosition = productListingSection.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    console.log('Ürün listeleme bölümüne kaydırıldı.');
                }
            }
        }, 500); // CSS geçiş süresine yakın bir gecikme
    }

    function updatePaginationControls() {
        if (pageInfoSpan) {
            pageInfoSpan.textContent = `Sayfa ${currentPage} / ${totalPages}`;
            console.log(`Sayfa bilgisi güncellendi: ${pageInfoSpan.textContent}`);
        }

        if (prevPageBtn) {
            prevPageBtn.classList.toggle('disabled', currentPage === 1);
        }
        if (nextPageBtn) {
            nextPageBtn.classList.toggle('disabled', currentPage === totalPages);
        }
        console.log(`Sayfalama butonları güncellendi. Önceki: ${currentPage === 1 ? 'disabled' : 'active'}, Sonraki: ${currentPage === totalPages ? 'disabled' : 'active'}`);
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayProducts(currentPage);
                console.log(`'Önceki Sayfa' tıklandı. Yeni sayfa: ${currentPage}`);
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayProducts(currentPage);
                console.log(`'Sonraki Sayfa' tıklandı. Yeni sayfa: ${currentPage}`);
            }
        });
    }

    // Sayfa yüklendiğinde ilk ürün setini göster
    if (productGrid) {
        displayProducts(currentPage);
        console.log("displayProducts ilk çağrısı tamamlandı.");
    }


    // ----------------------------------------------
    // 5. Ürün Detay Modal İşlevselliği (geri eklendi)
    // ----------------------------------------------
    if (productGrid && productDetailModal) {
        productGrid.addEventListener('click', (event) => {
            const viewDetailsLink = event.target.closest('.view-details');
            if (viewDetailsLink) {
                event.preventDefault(); // Linkin varsayılan davranışını engelle

                const productItem = viewDetailsLink.closest('.product-item');
                if (productItem) {
                    const productId = parseInt(productItem.getAttribute('data-id'));
                    const product = allProducts.find(p => p.id === productId);

                    if (product) {
                        modalProductImage.src = product.img;
                        modalProductImage.alt = product.title;
                        modalProductTitle.textContent = product.title;
                        modalProductDescription.textContent = product.description;
                        modalProductDetails.textContent = product.details || "Detay bulunmamaktadır."; // Eğer detay yoksa varsayılan metin
                        modalProductMaterial.textContent = product.material || "Belirtilmemiş";

                        // Özellikler listesini doldur
                        modalProductFeatures.innerHTML = '';
                        if (product.features && product.features.length > 0) {
                            product.features.forEach(feature => {
                                const li = document.createElement('li');
                                li.textContent = feature;
                                modalProductFeatures.appendChild(li);
                            });
                        } else {
                            const li = document.createElement('li');
                            li.textContent = "Özellik bulunmamaktadır.";
                            modalProductFeatures.appendChild(li);
                        }

                        // Kullanım alanları listesini doldur
                        modalProductUsage.innerHTML = '';
                        if (product.usage && product.usage.length > 0) {
                            product.usage.forEach(use => {
                                const li = document.createElement('li');
                                li.textContent = use;
                                modalProductUsage.appendChild(li);
                            });
                        } else {
                            const li = document.createElement('li');
                            li.textContent = "Kullanım alanı belirtilmemiştir.";
                            modalProductUsage.appendChild(li);
                        }

                        productDetailModal.style.display = 'block'; // Modalı göster
                        document.body.style.overflow = 'hidden'; // Sayfayı kaydırmayı engelle
                        console.log(`Modal açıldı: ${product.title}`);
                    } else {
                        console.error(`Ürün ID'si bulunamadı: ${productId}`);
                    }
                }
            }
        });
    }

    // Modal Kapatma İşlevselliği (geri eklendi)
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            productDetailModal.style.display = 'none';
            document.body.style.overflow = ''; // Sayfa kaydırmayı geri aç
            console.log('Modal kapatıldı (kapatma butonu).');
        });
    }

    // Modal dışına tıklayınca kapatma (geri eklendi)
    if (productDetailModal) {
        window.addEventListener('click', (event) => {
            if (event.target === productDetailModal) {
                productDetailModal.style.display = 'none';
                document.body.style.overflow = '';
                console.log('Modal kapatıldı (dışarı tıklandı).');
            }
        });

        // ESC tuşuna basınca kapatma (geri eklendi)
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && productDetailModal.style.display === 'block') {
                productDetailModal.style.display = 'none';
                document.body.style.overflow = '';
                console.log('Modal kapatıldı (ESC tuşu).');
            }
        });
    }

    // ----------------------------------------------
    // 6. "Yukarı Çık" Butonu İşlevselliği
    // ----------------------------------------------
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // 300px aşağı kaydırıldığında göster
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            console.log('Yukarı Çık butonu tıklandı.');
        });
    }

});