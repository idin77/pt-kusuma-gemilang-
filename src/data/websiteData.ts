export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  detailedDesc: string;
  benefits: string[];
  equipment: string;
  badge: string;
}

export const CONTACT_INFO = {
  name: 'PT KUSUMA GEMILANG RAYA',
  tagline: 'Jasa Sedot WC Bekasi Resmi & Profesional',
  phone: '+62 896-7506-4916',
  phoneDisplay: '+62 896-7506-4916',
  phoneRaw: '6289675064916',
  whatsappUrl: 'https://wa.me/6289675064916',
  logoUrl: '/logo.jpeg',
  heroImg: '/hero_sedot_wc_bekasi.jpg',
  teamImg: '/sedot_wc_bekasi.jpg',
  equipmentImg: '/src/assets/images/vacuum_equipment_detail_1791387814670.jpg',
  legal: {
    company: 'PT Kusuma Gemilang Raya',
    nib: 'NIB KBLI 37011',
    cert: 'Sertifikat Standar & Izin Operasional Sanitasi',
    tax: 'SPPKP (Pengusaha Kena Pajak Resmi)',
    serviceArea: 'Kota & Kabupaten Bekasi',
    operationalHours: '24 Jam Setiap Hari (Termasuk Hari Libur)'
  }
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'sedot-wc',
    title: 'Sedot WC / Septic Tank',
    desc: 'Pengurasan septic tank dan sedot WC untuk rumah, kantor, usaha, dan fasilitas umum.',
    detailedDesc: 'Layanan penyedotan tinja dan pengurasan septic tank sampai tuntas dan bersih menggunakan tangki vakum bertekanan tinggi. Mengatasi septic tank penuh, bau tidak sedap, dan genangan air kloset.',
    benefits: [
      'Penyedotan cepat bertekanan tinggi tanpa bau menyengat',
      'Selang panjang hingga 50-70 meter (bisa masuk gang sempit)',
      'Armada tangki kapasitas 3.000 s/d 5.000 liter',
      'Pengecekan dan pembersihan sirkulasi udara septic tank'
    ],
    equipment: 'Truk Tangki Vakum Modern, Selang Spiral Heavy-Duty',
    badge: 'Paling Banyak Dipesan'
  },
  {
    id: 'saluran-mampet',
    title: 'Saluran Mampet',
    desc: 'Penanganan saluran air, toilet, wastafel, dan pipa yang tersumbat dengan teknologi tepat.',
    detailedDesc: 'Pelancaran saluran air kotor, pipa pembuangan kamar mandi, bak cuci piring (kitchen sink), dan toilet yang tersumbat lemak, rambut, atau kotoran keras tanpa perlu merusak lantai atau membongkar pipa.',
    benefits: [
      'Tanpa bongkar keramik atau tembok saluran',
      'Menggunakan teknologi mesin spiral drain cleaner canggih',
      'Cepat tuntas dalam hitungan 30-60 menit',
      'Dibersihkan dari endapan lemak membandel'
    ],
    equipment: 'Mesin Rigid Spiral Pipe Cleaner & High Pressure Jetting',
    badge: 'Solusi Tanpa Bongkar'
  },
  {
    id: 'limbah-stp',
    title: 'Sedot Limbah STP',
    desc: 'Layanan penyedotan limbah STP untuk gedung, perusahaan, hotel, restoran, dan fasilitas lainnya.',
    detailedDesc: 'Pembersihan dan pengurasan lumpur aktif (biological sludge), lemak grease trap, dan limbah Sewage Treatment Plant (STP) komersial & industri sesuai regulasi lingkungan hidup.',
    benefits: [
      'Dokumen manifest & izin pembuangan limbah resmi IPLT',
      'Kontrak perawatan berkala untuk hotel, mal, & pabrik',
      'Kapasitas tangki armada industri besar',
      'Teknisi bersertifikat dan ber-K3'
    ],
    equipment: 'Truk Vakum Industri & Pompa Sludge Submersible',
    badge: 'Resmi Komersial & Industri'
  },
  {
    id: 'pembuatan-septic-tank',
    title: 'Pembuatan Septic Tank',
    desc: 'Jasa pembuatan dan perbaikan septic tank sesuai kebutuhan lokasi dan standar lingkungan.',
    detailedDesc: 'Pembuatan septic tank konvensional resapan maupun pemasangan septic tank biotech modern ramah lingkungan, renovasi rembesan septic tank yang bocor atau cepat penuh.',
    benefits: [
      'Konstruksi kokoh dengan standar resapan anti cepat penuh',
      'Opsi Septic Tank Biofilter ramah lingkungan tanpa bau',
      'Analisis tanah dan kedalaman air tanah di Bekasi',
      'Garansi pengerjaan rapi dan tahan lama'
    ],
    equipment: 'Bahan Berkualitas Standar SNI & Tenaga Ahli Konstruksi Sanitasi',
    badge: 'Konstruksi & Renovasi'
  }
];

export const WHY_US = [
  {
    title: 'Perusahaan Profesional',
    desc: 'Legalitas resmi dan terdaftar sebagai perusahaan jasa sanitasi berbadan hukum PT.'
  },
  {
    title: 'Teknisi Berpengalaman',
    desc: 'Tim ahli yang terlatih menangani berbagai masalah saluran dan septic tank rumit.'
  },
  {
    title: 'Armada Siap Operasional',
    desc: 'Truk sedot lengkap dengan peralatan modern siap berangkat ke lokasi Anda seketika.'
  },
  {
    title: 'Respon Cepat',
    desc: 'Penanganan sigap, langsung datang ke lokasi tanpa proses berbelit dan tepat waktu.'
  },
  {
    title: 'Harga Transparan',
    desc: 'Estimasi biaya jelas di awal, tanpa biaya tersembunyi atau biaya tak terduga.'
  },
  {
    title: 'Rumah Hingga Perusahaan',
    desc: 'Melayani skala kecil rumahan, kost, ruko hingga kebutuhan pabrik dan industri besar.'
  }
];

export const SOLUTIONS = [
  {
    category: 'Rumah Tinggal',
    icon: 'home',
    items: ['Sedot WC', 'Sedot Septic Tank', 'WC Mampet', 'Saluran Mampet']
  },
  {
    category: 'Perkantoran',
    icon: 'building',
    items: ['Sedot Septic Tank', 'Sedot Limbah', 'Perawatan Saluran', 'Toilet Gedung Mampet']
  },
  {
    category: 'Perusahaan & Industri',
    icon: 'factory',
    items: ['Sedot Limbah STP', 'Penyedotan Septic Tank', 'Layanan Sanitasi Berkala', 'Manifest Pembuangan']
  },
  {
    category: 'Usaha & Komersial',
    icon: 'store',
    items: ['Restoran & Hotel', 'Ruko & Gudang', 'Grease Trap Lemak', 'Fasilitas Umum']
  }
];

export const KOTA_BEKASI = [
  'Bekasi Barat',
  'Bekasi Timur',
  'Bekasi Utara',
  'Bekasi Selatan',
  'Medan Satria',
  'Rawalumbu',
  'Jatiasih',
  'Jatisampurna',
  'Pondok Gede',
  'Pondok Melati',
  'Mustika Jaya',
  'Bantar Gebang'
];

export const KAB_BEKASI = [
  'Cikarang Barat',
  'Cikarang Timur',
  'Cikarang Utara',
  'Cikarang Selatan',
  'Cikarang Pusat',
  'Cibitung',
  'Tambun Selatan',
  'Tambun Utara',
  'Babelan',
  'Tarumajaya',
  'Setu',
  'Serang Baru',
  'Cibarusah',
  'Bojongmangu',
  'Kedungwaringin',
  'Sukatani',
  'Sukakarya',
  'Pebayuran',
  'Cabangbungin',
  'Muaragembong',
  'Karangbahagia',
  'Tambelang',
  'Sukawangi'
];

export const PROCESS_STEPS = [
  {
    num: 1,
    title: 'Hubungi Kami',
    desc: 'Konsultasi awal via WhatsApp atau telepon untuk jelaskan masalah Anda.'
  },
  {
    num: 2,
    title: 'Konsultasi & Jadwal',
    desc: 'Estimasi harga transparan dan penjadwalan kedatangan armada ke lokasi.'
  },
  {
    num: 3,
    title: 'Teknisi Datang',
    desc: 'Tim ahli tiba di lokasi tepat waktu dengan peralatan lengkap & modern.'
  },
  {
    num: 4,
    title: 'Pekerjaan Selesai',
    desc: 'Masalah sanitasi teratasi, lokasi dibersihkan, bergaransi, dan pembayaran selesai.'
  }
];

export interface FaqItem {
  q: string;
  a: string;
  iconName?: string;
  category?: string;
  badge?: 'Verified' | 'Official';
  highlightType?: 'pricing' | 'guarantee' | 'safety' | 'location' | 'service';
}

export const FAQS: FaqItem[] = [
  {
    q: 'Berapa harga sedot WC & limbah di Bekasi?',
    a: 'Harga layanan kami sangat transparan dihitung per kubik (m³): Limbah Black Water (Tinja / Septic Tank) Rp 500.000/kubik (non manifest), Limbah Grey Water (Lumpur & Lemak) Rp 900.000/kubik (non manifest), dan opsi penambahan Dokumen Manifest Resmi IPLT sebesar Rp 400.000/kubik. Anda dapat langsung menggunakan Kalkulator Estimasi Biaya di atas untuk menghitung total biaya secara instan.',
    iconName: 'BadgeDollarSign',
    category: 'Harga & Biaya',
    badge: 'Official',
    highlightType: 'pricing'
  },
  {
    q: 'Apakah pengerjaan sedot WC dan pelancaran saluran disertai Garansi Resmi?',
    a: 'Ya, seluruh pekerjaan oleh teknisi PT Kusuma Gemilang Raya bergaransi resmi. Kami memberikan jaminan kepuasan pengerjaan tuntas dan rapi. Apabila dalam masa garansi saluran mengalami kendala yang bersumber dari pengerjaan sebelumnya, tim kami siap datang kembali untuk melakukan penanganan ulang tanpa biaya tambahan.',
    iconName: 'Award',
    category: 'Jaminan Garansi',
    badge: 'Official',
    highlightType: 'guarantee'
  },
  {
    q: 'Apakah melayani Kota Bekasi dan Kabupaten Bekasi?',
    a: 'Ya, kami melayani seluruh wilayah Kota Bekasi dan Kabupaten Bekasi dengan armada yang siap standby setiap saat.',
    iconName: 'MapPin',
    category: 'Cakupan Wilayah',
    highlightType: 'location'
  },
  {
    q: 'Apakah melayani Cikarang?',
    a: 'Sangat bisa. Cikarang (Cikarang Pusat, Utara, Selatan, Barat, Timur) dan seluruh kecamatan di Kabupaten Bekasi merupakan area layanan utama kami.',
    iconName: 'Truck',
    category: 'Area Khusus Cikarang',
    highlightType: 'location'
  },
  {
    q: 'Apakah bisa sedot septic tank?',
    a: 'Bisa, pengurasan septic tank untuk rumah tinggal, perkantoran, ruko, restoran, dan fasilitas umum adalah spesialisasi layanan kami.',
    iconName: 'Droplet',
    category: 'Layanan Tangki',
    highlightType: 'service'
  },
  {
    q: 'Apakah melayani saluran mampet?',
    a: 'Ya, kami memiliki teknisi ahli khusus untuk menangani saluran air, toilet, wastafel, pipa got, dan floor drain yang tersumbat tanpa perlu bongkar keramik.',
    iconName: 'Wrench',
    category: 'Saluran & Pipa',
    highlightType: 'service'
  },
  {
    q: 'Apakah layanan tersedia 24 jam?',
    a: 'Layanan kami tersedia 24 jam setiap hari, termasuk hari libur dan akhir pekan. Untuk kunjungan malam/dini hari darurat, tim kami selalu siap siaga.',
    iconName: 'Clock',
    category: 'Operasional 24 Jam',
    highlightType: 'service'
  },
  {
    q: 'Apakah melayani rumah, kantor, dan perusahaan?',
    a: 'Tentu, kami melayani mulai dari skala rumah tangga kecil, perkantoran swasta/pemerintah, ruko, hingga kebutuhan pabrik dan industri besar di kawasan Bekasi.',
    iconName: 'Building2',
    category: 'Sektor Klien',
    highlightType: 'service'
  },
  {
    q: 'Bagaimana prosedur teknis kerja di lapangan, standar APD teknisi, dan protokol kebersihannya?',
    a: 'Setiap teknisi PT Kusuma Gemilang Raya menerapkan SOP keselamatan dan higienitas ketat: (1) Standar APD Lengkap: Teknisi wajib mengenakan sepatu boots safety anti-slip, sarung tangan karet industri tebal, masker respirator/penyaring gas metana, dan seragam kerja resmi. (2) Prosedur Teknis Lapangan Aman: Pengerjaan menggunakan selang vakum spiral kedap udara dan pompa vakum bertenaga tinggi tanpa merusak instalasi pipa atau merusak lantai keramik. (3) Protokol Kebersihan Purna-Kerja: Selesai pengerjaan, tim kami membilas dan membersihkan seluruh area sekitar saluran, melakukan penyemprotan desinfektan antibakteri penghilang bau, dan merapatkan kembali penutup septic tank dengan rapi sehingga hunian atau lokasi usaha Anda tetap steril dan bersih maksimal.',
    iconName: 'ShieldCheck',
    category: 'SOP Keamanan & Garansi',
    badge: 'Verified',
    highlightType: 'safety'
  }
];

export interface SanitationPartner {
  id: string;
  name: string;
  shortName: string;
  category: 'Asosiasi Sanitasi' | 'Instansi Pemda' | 'Regulasi & Legalitas' | 'Sertifikasi K3' | 'Kawasan Rekanan';
  description: string;
  badgeText: string;
  credentialNumber: string;
  iconType: 'association' | 'dlh' | 'oss' | 'safety' | 'standard' | 'industry';
  highlight: string;
}

export const SANITATION_PARTNERS: SanitationPartner[] = [
  {
    id: 'apsi',
    name: 'Asosiasi Pengusaha Sanitasi Indonesia',
    shortName: 'APSI',
    category: 'Asosiasi Sanitasi',
    description: 'Organisasi profesi nasional yang menaungi penyedia jasa pengurasan tinja, pembersihan tangki, dan sanitasi lingkungan higienis.',
    badgeText: 'Anggota Resmi Terdaftar',
    credentialNumber: 'No. Anggota: APSI-REG/JB-0824',
    iconType: 'association',
    highlight: 'Kepatuhan Kode Etik Sanitasi Nasional'
  },
  {
    id: 'iplt-sumurbatu',
    name: 'IPLT Sumur Batu - DLH Kota & Kab. Bekasi',
    shortName: 'DLH / IPLT Bekasi',
    category: 'Instansi Pemda',
    description: 'Instalasi Pengolahan Lumpur Tinja Resmi Dinas Lingkungan Hidup Bekasi. Jaminan limbah dibuang ke instalasi pemrosesan resmi, bukan dibuang liar.',
    badgeText: 'Mitra Pembuangan Resmi Berizin',
    credentialNumber: 'Rekomendasi Pembuangan Resmi DLH',
    iconType: 'dlh',
    highlight: 'Jaminan Bebas Buang Liar / Ramah Lingkungan'
  },
  {
    id: 'oss-kbli',
    name: 'OSS RBA - KBLI 37011 Pengelolaan Air Limbah',
    shortName: 'OSS KBLI 37011',
    category: 'Regulasi & Legalitas',
    description: 'Perizinan Berusaha Berbasis Risiko resmi dari Kementerian Investasi / BKPM RI untuk aktivitas pengumpulan dan pengangkutan air limbah.',
    badgeText: 'Legalitas Badan Hukum PT',
    credentialNumber: 'NIB: KBLI 37011 Berizin Operasional',
    iconType: 'oss',
    highlight: 'Badan Usaha Resmi PT Kusuma Gemilang Raya'
  },
  {
    id: 'k3-hse',
    name: 'Standar K3 Lingkungan & Keselamatan Kerja',
    shortName: 'K3 Safety & APD',
    category: 'Sertifikasi K3',
    description: 'Penerapan protokol Keselamatan & Kesehatan Kerja (HSE) dengan seragam APD lengkap, masker filter gas metana, dan sepatu safety boots.',
    badgeText: 'Standar APD & Keselamatan',
    credentialNumber: 'SOP Higienitas & APD Steril',
    iconType: 'safety',
    highlight: 'Perlindungan Klien & Teknisi di Lapangan'
  },
  {
    id: 'aspep-sanitasi',
    name: 'Asosiasi Perusahaan Pengolahan Air Limbah',
    shortName: 'ASPEP Sanitasi',
    category: 'Asosiasi Sanitasi',
    description: 'Jaringan profesional pengolahan lumpur aktif, grease trap komersial, dan air limbah domestik sesuai baku mutu Permen LHK No. P.68/2016.',
    badgeText: 'Baku Mutu Permen LHK',
    credentialNumber: 'Standar Mutu Limbah Domestik',
    iconType: 'standard',
    highlight: 'Manifest Limbah Grey & Black Water'
  },
  {
    id: 'kawasan-bekasi',
    name: 'Rekanan Kawasan Industri & Residensial Bekasi',
    shortName: 'Estate Bekasi',
    category: 'Kawasan Rekanan',
    description: 'Vendor sanitasi terpercaya untuk kawasan industri (MM2100, Jababeka, EJIP, Deltamas) serta puluhan cluster perumahan elit di Bekasi.',
    badgeText: 'Vendor Terverifikasi Industri',
    credentialNumber: 'Mitra Kawasan Industri & Residensial',
    iconType: 'industry',
    highlight: 'Kontrak Rutin & Panggilan Darurat 24 Jam'
  }
];
