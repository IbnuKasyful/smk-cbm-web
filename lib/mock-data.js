// Local fallback content used until the WordPress CMS is connected.
// Everything here is based on VERIFIED public facts about SMK Citra Bangsa
// Mandiri Purwokerto (name, address, phone, accreditation, majors, socials).
// No student/teacher counts are invented. Placeholder imagery lives in
// /public/images and can be swapped for real school photos.

export const SCHOOL = {
  name: 'SMK Citra Bangsa Mandiri',
  shortName: 'SMK CBM',
  city: 'Purwokerto',
  tagline:
    'Mewujudkan Generasi Tenaga Kerja yang Profesional, Unggul & Berkarakter',
  accreditation: 'A',
  address:
    'Kampung Pendidikan CBM, Jl. Gerilya Barat Tj., Cileleng, Tanjung, Kec. Purwokerto Selatan, Kabupaten Banyumas, Jawa Tengah 53144',
  phone: '(0281) 7771967',
  email: 'info@smkcbm.sch.id',
  socials: {
    facebook: 'https://facebook.com/smkcbmpwt',
    instagram: 'https://instagram.com/smkcbmofficial',
    youtube: 'https://youtube.com/@smkcbmofficial765',
  },
};

// "SMK CBM at a Glance" — only figures we can stand behind.
export const STATS = [
  {
    key: 'akreditasi',
    label: 'Akreditasi',
    value: 'A',
    caption: 'Peringkat Unggul dari BAN-S/M',
  },
  {
    key: 'program',
    label: 'Program Keahlian',
    value: '6',
    caption: 'Bidang kesehatan, bisnis, dan pariwisata',
  },
  {
    key: 'boarding',
    label: 'Sistem',
    value: 'Boarding',
    caption: 'Asrama berkarakter Islami',
  },
];

// Hero highlight cards shown under the "Pendaftaran Dibuka" announcement.
export const HERO_STATS = [
  { key: 'alumni', value: '1.500+', caption: 'Alumni terserap dunia kerja' },
  { key: 'mitra', value: '120+', caption: 'Mitra industri, RS & apotek' },
  { key: 'guru', value: '60', caption: 'Guru & instruktur (rasio 9:1)' },
  { key: 'akreditasi', value: 'A', caption: 'Akreditasi unggul (BAN-S/M)' },
];

// Tenaga pendidik ditampilkan pada halaman "Tentang" (carousel horizontal).
// Nama di bawah ini adalah PLACEHOLDER — ganti dengan data guru asli dan
// tambahkan foto (letakkan di /public/images lalu isi field `photo`).
export const TEACHERS = [
  { key: 't1', name: 'Nama Guru', role: 'Kepala Sekolah', photo: '' },
  { key: 't2', name: 'Nama Guru', role: 'Wakil Kepala Sekolah', photo: '' },
  { key: 't3', name: 'Nama Guru', role: 'Guru Keperawatan', photo: '' },
  { key: 't4', name: 'Nama Guru', role: 'Guru Farmasi', photo: '' },
  { key: 't5', name: 'Nama Guru', role: 'Guru Perhotelan', photo: '' },
  { key: 't6', name: 'Nama Guru', role: 'Guru Akuntansi', photo: '' },
  { key: 't7', name: 'Nama Guru', role: 'Guru TKJ', photo: '' },
  { key: 't8', name: 'Nama Guru', role: 'Guru Kuliner', photo: '' },
  { key: 't9', name: 'Nama Guru', role: 'Instruktur Asrama', photo: '' },
  { key: 't10', name: 'Nama Guru', role: 'Guru BK', photo: '' },
];

// Sambutan Kepala Sekolah ("A Word from the Founder" block on the About page).
// Nama & foto adalah PLACEHOLDER — ganti dengan data kepala sekolah sebenarnya.
export const SAMBUTAN = {
  name: 'Nama Kepala Sekolah',
  role: 'Kepala Sekolah SMK CBM',
  photo: '',
  paragraphs: [
    'Assalamualaikum warahmatullahi wabarakatuh. Selamat datang di SMK Citra Bangsa Mandiri. Kami percaya bahwa setiap peserta didik memiliki potensi luar biasa yang dapat berkembang melalui pendidikan vokasi yang berkualitas, berkarakter, dan berlandaskan nilai-nilai Islami.',
    'Melalui sistem boarding school, laboratorium berstandar industri, serta kemitraan luas dengan dunia usaha dan dunia industri, kami berkomitmen membentuk lulusan yang profesional, unggul, dan siap menghadapi tantangan global — baik untuk bekerja, berwirausaha, maupun melanjutkan pendidikan.',
    'Terima kasih atas kepercayaan Anda. Mari bersama-sama menumbuhkan generasi yang beriman, kompeten, dan berbudaya lingkungan di SMK CBM.',
  ],
};

// "Sekilas SMK CBM" highlight cards (2×2 grid in AboutStats).
export const HIGHLIGHTS = [
  {
    key: 'akreditasi',
    icon: 'medal',
    title: 'Akreditasi A (Unggul)',
    description:
      'Kualitas pendidikan terjamin dengan standar nasional tertinggi untuk jurusan Farmasi.',
  },
  {
    key: 'karir',
    icon: 'briefcase',
    title: 'Siap Kerja & Kuliah',
    description:
      'Kerjasama luas dengan RS, Apotek, Industri Perhotelan, Rumah Makan, UMKM dan Perusahaan Digital Marketing untuk penempatan kerja lulusan.',
  },
  {
    key: 'lab',
    icon: 'microscope',
    title: 'Lab Farmasi Standar Industri',
    description:
      'Ruang praktik modern dengan peralatan lengkap sesuai standar dunia kerja dan industri.',
  },
  {
    key: 'boarding',
    icon: 'mosque',
    title: 'Boarding School & Religius',
    description:
      'Pembentukan karakter Islami dan disiplin melalui fasilitas asrama yang nyaman dan aman.',
  },
];

// "Tentang Kami" page content — profile, vision/mission, and video profile.
export const ABOUT = {
  videoId: 'E-OHl_M3JC8',
  intro: [
    'SMK Citra Bangsa Mandiri (SMK CBM) adalah sekolah menengah kejuruan berbasis boarding school di Purwokerto, Kabupaten Banyumas, Jawa Tengah. Memadukan kurikulum modern, fasilitas berstandar industri, dan pembinaan karakter Islami, SMK CBM berkomitmen mencetak lulusan yang profesional, unggul, dan berkarakter.',
    'Dengan program keahlian di bidang kesehatan, bisnis digital, dan pariwisata — didukung laboratorium praktik serta kemitraan dengan rumah sakit, apotek, perhotelan, dan dunia usaha — SMK CBM menyiapkan peserta didik agar siap bekerja, berwirausaha, maupun melanjutkan pendidikan.',
  ],
  visi:
    'Menjadikan murid beriman, sehat, unggul, kompeten, kreatif, serta berbudaya lingkungan untuk menghadapi tantangan global.',
  misi: [
    'Menyelenggarakan pendidikan vokasi berkarakter Islami yang menumbuhkan keimanan, kedisiplinan, dan akhlak mulia.',
    'Membekali peserta didik dengan kompetensi keahlian sesuai standar dunia usaha dan dunia industri.',
    'Menyediakan fasilitas dan laboratorium praktik berstandar industri untuk mendukung pembelajaran.',
    'Menjalin kemitraan luas dengan rumah sakit, apotek, perhotelan, dan dunia usaha untuk PKL serta penyaluran kerja.',
    'Membentuk lingkungan boarding school yang menumbuhkan kemandirian, kepemimpinan, dan kepedulian lingkungan.',
  ],
};

// Perjalanan / tonggak sejarah SMK CBM (timeline "Journey" di halaman Tentang).
// Disusun per fase agar tetap faktual; tambahkan tahun sebenarnya bila tersedia.
export const JOURNEY = [
  {
    key: 'j1',
    step: 'Awal',
    title: 'Berdirinya SMK Citra Bangsa Mandiri',
    description:
      'Bermula dari komitmen menghadirkan pendidikan vokasi berkarakter Islami di Purwokerto, SMK CBM didirikan sebagai boarding school yang memadukan ilmu, keterampilan, dan akhlak.',
  },
  {
    key: 'j2',
    step: 'Pengembangan',
    title: 'Pembukaan Program Keahlian Unggulan',
    description:
      'Sekolah mengembangkan enam program keahlian di bidang kesehatan, bisnis digital, dan pariwisata, lengkap dengan laboratorium praktik berstandar industri.',
  },
  {
    key: 'j3',
    step: 'Kemitraan',
    title: 'Jejaring Dunia Usaha & Dunia Industri',
    description:
      'Kemitraan luas dengan rumah sakit, apotek, perhotelan, dan perusahaan digital dibangun untuk mendukung PKL serta penyaluran kerja lulusan.',
  },
  {
    key: 'j4',
    step: 'Pengakuan',
    title: 'Terakreditasi A (Unggul)',
    description:
      'Mutu penyelenggaraan pendidikan diakui melalui akreditasi A dari BAN-S/M, menegaskan standar kualitas tertinggi bagi peserta didik.',
  },
  {
    key: 'j5',
    step: 'Kini',
    title: 'Mencetak Generasi Profesional & Berkarakter',
    description:
      'Hingga kini SMK CBM terus menumbuhkan lulusan yang beriman, kompeten, dan siap bekerja, berwirausaha, maupun melanjutkan pendidikan.',
  },
];

// Penerimaan Siswa Baru (PSB) info — mirrors the "Informasi PSB" section on
// smkcbm.sch.id for the 2026/2027 intake.
export const ADMISSION = {
  year: '2026/2027',
  registrationFee: 'Rp 500.000',
  feeNote: 'Sisa biaya pendidikan dapat diangsur.',
  schedule: '08 – 10 Juli 2026',
  scheduleNote: 'Periode pengumpulan berkas pendaftaran.',
  registerUrl: 'https://bit.ly/spmbsmkcbm2026',
  requirements: [
    'Lulusan SMP / sederajat',
    'Sehat jasmani dan rohani (bebas narkoba dan tidak merokok)',
    'Berkelakuan baik',
    'Bersedia mengikuti peraturan sekolah',
  ],
  documents: [
    'Fotokopi Surat Keterangan Lulus (SKL) — 3 lembar',
    'Fotokopi Akta Kelahiran — 3 lembar',
    'Fotokopi Kartu Keluarga — 3 lembar',
    'Fotokopi Ijazah — 3 lembar (dapat menyusul)',
    'Fotokopi kartu program bantuan, jika ada — 3 lembar',
    'Pas foto berwarna 3×4 — 4 lembar',
  ],
};

// The six real program keahlian offered by the school.
export const PROGRAMS = [
  {
    id: 1,
    slug: 'keperawatan-caregiving',
    name: 'Layanan Penunjang Keperawatan & Caregiving',
    short: 'Keperawatan & Caregiving',
    field: 'Kesehatan',
    description:
      'Membentuk tenaga penunjang keperawatan dan caregiver yang terampil, empatik, dan siap bekerja di fasilitas kesehatan maupun perawatan lansia.',
    overview:
      'Program ini membentuk tenaga penunjang keperawatan dan caregiver yang terampil, empatik, dan siap bekerja di fasilitas kesehatan maupun perawatan lansia. Siswa dibekali kompetensi dasar keperawatan, komunikasi terapeutik, serta praktik langsung di laboratorium dan mitra fasilitas kesehatan.',
    competencies: [
      'Dasar anatomi, fisiologi, dan ilmu keperawatan',
      'Prosedur perawatan pasien dan lansia (caregiving)',
      'Pertolongan pertama dan penanganan kegawatdaruratan',
      'Komunikasi terapeutik dan etika pelayanan kesehatan',
      'Pengelolaan kebersihan, nutrisi, dan kenyamanan pasien',
    ],
    careers: [
      'Asisten perawat di rumah sakit dan klinik',
      'Caregiver lansia (homecare & panti wreda)',
      'Tenaga penunjang di puskesmas dan fasilitas kesehatan',
      'Melanjutkan ke D3/S1 Keperawatan',
    ],
  },
  {
    id: 2,
    slug: 'laboratorium-medik',
    name: 'Layanan Penunjang Laboratorium Medik',
    short: 'Laboratorium Medik',
    field: 'Kesehatan',
    description:
      'Menyiapkan analis penunjang laboratorium medik yang cermat dalam pengambilan dan pengolahan sampel sesuai standar layanan kesehatan.',
    overview:
      'Program ini menyiapkan analis penunjang laboratorium medik yang cermat dalam pengambilan, pengolahan, dan pemeriksaan sampel sesuai standar layanan kesehatan. Siswa berlatih menggunakan peralatan laboratorium serta menerapkan keselamatan kerja dan pengendalian mutu.',
    competencies: [
      'Teknik pengambilan sampel darah (flebotomi)',
      'Pemeriksaan hematologi dan kimia klinik dasar',
      'Mikrobiologi dan parasitologi dasar',
      'Pengelolaan spesimen serta K3 laboratorium',
      'Pengoperasian alat laboratorium dan pencatatan hasil',
    ],
    careers: [
      'Asisten analis di laboratorium RS, klinik, dan lab mandiri',
      'Tenaga penunjang laboratorium puskesmas',
      'Quality control di industri makanan dan farmasi',
      'Melanjutkan ke D3/S1 Teknologi Laboratorium Medik',
    ],
  },
  {
    id: 3,
    slug: 'kefarmasian',
    name: 'Layanan Penunjang Kefarmasian Klinis & Komunitas',
    short: 'Kefarmasian Klinis & Komunitas',
    field: 'Kesehatan',
    description:
      'Membekali siswa dengan kompetensi kefarmasian di apotek, klinik, dan komunitas, didukung laboratorium farmasi berstandar industri.',
    overview:
      'Program ini membekali siswa dengan kompetensi kefarmasian di apotek, klinik, dan komunitas, didukung laboratorium farmasi berstandar industri. Siswa mempelajari pelayanan resep, peracikan sediaan obat, hingga manajemen perbekalan farmasi.',
    competencies: [
      'Pelayanan resep dan swamedikasi',
      'Peracikan dan pembuatan sediaan obat',
      'Farmakologi dan penggolongan obat dasar',
      'Manajemen perbekalan dan administrasi apotek',
      'Komunikasi informasi obat kepada pasien',
    ],
    careers: [
      'Asisten tenaga kefarmasian di apotek dan klinik',
      'Tenaga farmasi di rumah sakit dan puskesmas',
      'Staf di industri farmasi dan distributor obat',
      'Melanjutkan ke D3/S1 Farmasi',
    ],
  },
  {
    id: 4,
    slug: 'bisnis-digital',
    name: 'Bisnis Digital',
    short: 'Bisnis Digital',
    field: 'Bisnis & Teknologi',
    description:
      'Mengembangkan wirausahawan dan tenaga pemasaran digital yang menguasai e-commerce, media sosial, dan strategi bisnis modern.',
    overview:
      'Program ini mengembangkan wirausahawan dan tenaga pemasaran digital yang menguasai e-commerce, media sosial, dan strategi bisnis modern. Siswa belajar mengelola toko online, membuat konten, hingga menganalisis data penjualan.',
    competencies: [
      'Pengelolaan e-commerce dan marketplace',
      'Digital marketing dan pemasaran media sosial',
      'Desain konten dan copywriting',
      'Administrasi bisnis dan keuangan dasar',
      'Analisis data penjualan dan perilaku konsumen',
    ],
    careers: [
      'Admin marketplace dan e-commerce',
      'Content creator dan social media specialist',
      'Digital marketer di UMKM dan perusahaan',
      'Wirausaha digital mandiri',
    ],
  },
  {
    id: 5,
    slug: 'perhotelan',
    name: 'Perhotelan',
    short: 'Perhotelan',
    field: 'Pariwisata',
    description:
      'Melatih tenaga perhotelan profesional dalam layanan front office, tata graha, dan hospitality berstandar industri.',
    overview:
      'Program ini melatih tenaga perhotelan profesional dalam layanan front office, tata graha, dan food & beverage berstandar industri. Siswa mengasah keterampilan hospitality dan komunikasi dengan tamu, termasuk bahasa asing dasar pariwisata.',
    competencies: [
      'Front office dan pengelolaan reservasi',
      'Tata graha (housekeeping) sesuai standar hotel',
      'Layanan food & beverage (restoran & banquet)',
      'Hospitality dan komunikasi dengan tamu',
      'Bahasa asing dasar untuk pariwisata',
    ],
    careers: [
      'Front office / receptionist hotel',
      'Housekeeping dan room attendant',
      'Waiter dan staf food & beverage',
      'Staf event, MICE, dan wirausaha akomodasi',
    ],
  },
  {
    id: 6,
    slug: 'kuliner',
    name: 'Kuliner',
    short: 'Kuliner',
    field: 'Pariwisata',
    description:
      'Mencetak juru masak dan pengelola usaha kuliner yang kreatif, higienis, dan siap bersaing di industri makanan dan minuman.',
    overview:
      'Program ini mencetak juru masak dan pengelola usaha kuliner yang kreatif, higienis, dan siap bersaing di industri makanan dan minuman. Siswa berlatih teknik memasak, sanitasi, penyajian, hingga manajemen produksi di dapur praktik sekolah.',
    competencies: [
      'Teknik dasar memasak, pastry, dan bakery',
      'Sanitasi, higiene, dan keamanan pangan',
      'Plating dan penyajian makanan (food presentation)',
      'Manajemen dapur dan penghitungan biaya produksi',
      'Kewirausahaan dan pengelolaan usaha kuliner',
    ],
    careers: [
      'Juru masak (cook) di hotel dan restoran',
      'Staf pastry, bakery, dan katering',
      'Wirausaha kuliner dan food entrepreneur',
      'Melanjutkan ke pendidikan tata boga',
    ],
  },
];

// Featured facilities carousel (the "Library" block in the reference).
export const FACILITIES = [
  {
    id: 1,
    word: 'Farmasi',
    title: 'Laboratorium Farmasi Berstandar Industri',
    description:
      'Praktik langsung meracik dan mengelola sediaan obat di laboratorium yang dirancang menyerupai lingkungan kerja apotek dan industri farmasi.',
    tag: 'Fasilitas Unggulan',
  },
  {
    id: 2,
    word: 'Asrama',
    title: 'Lingkungan Boarding School yang Berkarakter',
    description:
      'Pembinaan karakter Islami 24 jam melalui asrama yang menumbuhkan kedisiplinan, kemandirian, dan kepemimpinan.',
    tag: 'Fasilitas Unggulan',
  },
  {
    id: 3,
    word: 'Dapur',
    title: 'Dapur Produksi & Ruang Praktik Kuliner',
    description:
      'Dapur praktik dengan peralatan memadai untuk mengasah keterampilan memasak dan manajemen produksi makanan.',
    tag: 'Fasilitas Unggulan',
  },
];

// Full facilities grid for the dedicated /fasilitas page. Grouped by category.
// Deskripsi bersifat umum; sesuaikan dengan kondisi nyata sekolah bila perlu.
export const FACILITY_LIST = [
  {
    key: 'lab-farmasi',
    icon: 'flask',
    category: 'Laboratorium Kesehatan',
    title: 'Laboratorium Farmasi',
    description:
      'Ruang praktik meracik dan mengelola sediaan obat yang dirancang menyerupai lingkungan kerja apotek dan industri farmasi.',
  },
  {
    key: 'lab-keperawatan',
    icon: 'heart',
    category: 'Laboratorium Kesehatan',
    title: 'Laboratorium Keperawatan & Caregiving',
    description:
      'Ruang simulasi perawatan pasien dan lansia lengkap dengan peralatan dasar keperawatan untuk melatih keterampilan dan empati.',
  },
  {
    key: 'lab-medik',
    icon: 'microscope',
    category: 'Laboratorium Kesehatan',
    title: 'Laboratorium Medik',
    description:
      'Fasilitas praktik pengambilan dan pemeriksaan sampel (flebotomi, hematologi, kimia klinik) sesuai standar keselamatan kerja.',
  },
  {
    key: 'lab-komputer',
    icon: 'monitor',
    category: 'Bisnis & Teknologi',
    title: 'Lab Komputer & Bisnis Digital',
    description:
      'Ruang komputer untuk praktik desain, pemasaran digital, dan pengelolaan konten sesuai kebutuhan dunia usaha digital.',
  },
  {
    key: 'dapur',
    icon: 'utensils',
    category: 'Pariwisata',
    title: 'Dapur Produksi & Ruang Praktik Kuliner',
    description:
      'Dapur praktik dengan peralatan memadai untuk mengasah keterampilan memasak, pastry, dan manajemen produksi makanan.',
  },
  {
    key: 'perhotelan',
    icon: 'bed',
    category: 'Pariwisata',
    title: 'Ruang Praktik Perhotelan',
    description:
      'Simulasi layanan front office dan tata graha (housekeeping) untuk melatih hospitality berstandar industri perhotelan.',
  },
  {
    key: 'asrama',
    icon: 'home',
    category: 'Kehidupan Asrama',
    title: 'Asrama Putra & Putri',
    description:
      'Lingkungan boarding school yang nyaman dan aman, membina kedisiplinan, kemandirian, dan kepemimpinan selama 24 jam.',
  },
  {
    key: 'masjid',
    icon: 'mosque',
    category: 'Kehidupan Asrama',
    title: 'Masjid / Musholla',
    description:
      'Pusat kegiatan ibadah dan pembinaan karakter Islami yang menumbuhkan keimanan dan akhlak mulia peserta didik.',
  },
  {
    key: 'perpustakaan',
    icon: 'book',
    category: 'Fasilitas Umum',
    title: 'Perpustakaan',
    description:
      'Koleksi buku dan sumber belajar yang mendukung literasi serta pengembangan wawasan akademik dan kejuruan.',
  },
  {
    key: 'kelas',
    icon: 'board',
    category: 'Fasilitas Umum',
    title: 'Ruang Kelas Modern',
    description:
      'Ruang belajar yang nyaman dan mendukung pembelajaran interaktif untuk teori maupun diskusi.',
  },
  {
    key: 'lapangan',
    icon: 'ball',
    category: 'Fasilitas Umum',
    title: 'Lapangan Olahraga',
    description:
      'Area olahraga dan kegiatan luar ruang untuk menjaga kebugaran serta menumbuhkan sportivitas dan kerja sama.',
  },
  {
    key: 'kantin',
    icon: 'cup',
    category: 'Fasilitas Umum',
    title: 'Kantin & Ruang Makan',
    description:
      'Ruang makan bersih dan sehat yang melayani kebutuhan konsumsi harian peserta didik selama di lingkungan sekolah.',
  },
  {
    key: 'uks',
    icon: 'cross',
    category: 'Fasilitas Umum',
    title: 'Ruang UKS & Klinik',
    description:
      'Layanan kesehatan dasar dan pertolongan pertama untuk menjaga kondisi peserta didik selama kegiatan sekolah dan asrama.',
  },
  {
    key: 'aula',
    icon: 'users',
    category: 'Fasilitas Umum',
    title: 'Aula Serbaguna',
    description:
      'Ruang serbaguna untuk kegiatan akademik, seminar, pentas seni, dan acara kebersamaan seluruh warga sekolah.',
  },
  {
    key: 'koperasi',
    icon: 'store',
    category: 'Bisnis & Teknologi',
    title: 'Koperasi & Business Center',
    description:
      'Sarana praktik kewirausahaan siswa sekaligus memenuhi kebutuhan sehari-hari warga sekolah.',
  },
  {
    key: 'taman',
    icon: 'leaf',
    category: 'Kehidupan Asrama',
    title: 'Taman & Ruang Hijau',
    description:
      'Lingkungan hijau yang asri mendukung program berbudaya lingkungan serta kenyamanan belajar dan beristirahat.',
  },
];

// Reasons to choose SMK CBM (the dark "Legacy of Excellence" section).
export const REASONS = [
  {
    icon: 'award',
    title: 'Terakreditasi A',
    description:
      'Peringkat Unggul yang menjadi bukti mutu penyelenggaraan pendidikan di SMK CBM.',
  },
  {
    icon: 'users',
    title: 'Guru & Praktisi Industri',
    description:
      'Diampu tenaga pendidik berpengalaman yang didukung praktisi dari dunia kerja nyata.',
  },
  {
    icon: 'handshake',
    title: 'Kemitraan Dunia Industri',
    description:
      'Kerja sama dengan rumah sakit, apotek, perhotelan, dan perusahaan digital untuk PKL dan penyaluran kerja.',
  },
];

// Events / activities bento grid — each card previews a YouTube video.
export const EVENTS = [
  {
    id: 1,
    title: 'Aksi Peduli Lingkungan Pramuka CBM',
    place: 'Kampung Pendidikan CBM',
    year: '2026',
    youtubeId: 'RNf66KtmCnk',
  },
  {
    id: 2,
    title: 'Praktik Kefarmasian di Laboratorium Farmasi',
    place: 'Lab Farmasi',
    year: '2026',
    youtubeId: 'rs7laU2hgBA',
  },
  {
    id: 3,
    title: 'Program Penanaman Cabai & Ketahanan Pangan',
    place: 'Kebun Sekolah',
    year: '2026',
    youtubeId: 'T89RAE0u8W0',
  },
  {
    id: 4,
    title: 'Gelar Karya Kuliner Nusantara',
    place: 'Dapur Praktik',
    year: '2026',
    youtubeId: '412MB9RFskA',
  },
  {
    id: 5,
    title: 'Pengelolaan Sampah & Bank Sampah Sekolah',
    place: 'Kampung Pendidikan CBM',
    year: '2026',
    youtubeId: 'XoDlVsacG0I',
  },
  {
    id: 6,
    title: 'Pembinaan Karakter & Kegiatan Keagamaan Asrama',
    place: 'Asrama CBM',
    year: '2026',
    youtubeId: 'gQNNCHSsvBs',
  },
];

// News posts (the "Discover the Latest News" cards). Structure mirrors the
// shape returned by lib/wordpress.js so components render either source.
export const POSTS = [
  {
    id: 101,
    slug: 'aksi-peduli-lingkungan-pramuka',
    title: 'Pramuka CBM Gelar Aksi Peduli Lingkungan di Kampung Pendidikan',
    excerpt:
      'Anggota Pramuka SMK CBM bergerak bersama membersihkan lingkungan dan menanam pohon sebagai wujud kepedulian terhadap bumi.',
    date: '2026-05-12',
    category: 'Kesiswaan',
    author: 'Humas SMK CBM',
    content:
      'Anggota Pramuka SMK Citra Bangsa Mandiri menggelar aksi peduli lingkungan di sekitar Kampung Pendidikan CBM. Kegiatan ini menumbuhkan rasa tanggung jawab siswa terhadap kelestarian alam sekaligus mempererat kebersamaan.',
  },
  {
    id: 102,
    slug: 'penanaman-cabai-ketahanan-pangan',
    title: 'Siswa CBM Dukung Ketahanan Pangan Lewat Penanaman Cabai',
    excerpt:
      'Melalui program penanaman cabai, siswa belajar bercocok tanam sekaligus mendukung gerakan ketahanan pangan mandiri.',
    date: '2026-04-28',
    category: 'Program Sekolah',
    author: 'Humas SMK CBM',
    content:
      'Program penanaman cabai di lingkungan SMK CBM mengajarkan siswa keterampilan bercocok tanam dan pentingnya ketahanan pangan. Hasil panen dimanfaatkan untuk kebutuhan praktik kuliner sekolah.',
  },
  {
    id: 103,
    slug: 'pengelolaan-sampah-bank-sampah',
    title: 'Gerakan Pengelolaan Sampah dan Bank Sampah Sekolah Diluncurkan',
    excerpt:
      'SMK CBM meluncurkan program pengelolaan sampah terpadu untuk membiasakan siswa hidup bersih dan berkelanjutan.',
    date: '2026-04-10',
    category: 'Program Sekolah',
    author: 'Humas SMK CBM',
    content:
      'SMK CBM memperkuat budaya peduli lingkungan melalui program bank sampah. Siswa dilatih memilah dan mengelola sampah agar bernilai guna, menumbuhkan kebiasaan hidup berkelanjutan.',
  },
];
