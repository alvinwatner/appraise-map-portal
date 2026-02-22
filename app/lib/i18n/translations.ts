export type Locale = "id" | "en";

const translations = {
  navbar: {
    en: {
      services: "Services",
      about: "About",
      contact: "Contact",
      navigationMenu: "Navigation Menu",
    },
    id: {
      services: "Layanan",
      about: "Tentang",
      contact: "Kontak",
      navigationMenu: "Menu Navigasi",
    },
  },
  hero: {
    en: {
      heading: "Leading the Way in Business Excellence",
      subheading:
        "Through reliable opinions, trustworthy relationships, and sustainable strategies for a successful future.",
      ourServices: "Our Services",
      contactUs: "Contact Us",
    },
    id: {
      heading: "Memimpin Jalan Menuju Keunggulan Bisnis",
      subheading:
        "Melalui opini yang terpercaya, hubungan yang amanah, dan strategi berkelanjutan untuk masa depan yang sukses.",
      ourServices: "Layanan Kami",
      contactUs: "Hubungi Kami",
    },
  },
  trust: {
    en: {
      yearsExperience: "Years Experience",
      projectsCompleted: "Projects Completed",
      govPrivateSectors: "Gov & Private Sectors",
      certifiedAppraisers: "Certified Appraisers",
    },
    id: {
      yearsExperience: "Tahun Pengalaman",
      projectsCompleted: "Proyek Selesai",
      govPrivateSectors: "Sektor Pemerintah & Swasta",
      certifiedAppraisers: "Penilai Bersertifikat",
    },
  },
  about: {
    en: {
      heading: "About Our Company",
      paragraph1:
        "Our team of certified professionals brings years of experience and a commitment to precision in property appraisals, ensuring accurate and reliable valuations. We adhere to industry standards and provide insights that empower informed decision-making for our clients.",
      paragraph2:
        "PT. Graha Paramita Konsultan, in partnership with Kantor Jasa Penilai Publik Kevin Lie, Hartono dan Rekan, delivers trusted business feasibility studies, project supervision, and property valuation services across Indonesia.",
      learnMore: "Learn More",
    },
    id: {
      heading: "Tentang Perusahaan Kami",
      paragraph1:
        "Tim profesional bersertifikat kami membawa pengalaman bertahun-tahun dan komitmen terhadap ketepatan dalam penilaian properti, memastikan valuasi yang akurat dan terpercaya. Kami mematuhi standar industri dan memberikan wawasan yang memberdayakan pengambilan keputusan bagi klien kami.",
      paragraph2:
        "PT. Graha Paramita Konsultan, bermitra dengan Kantor Jasa Penilai Publik Kevin Lie, Hartono dan Rekan, menyediakan studi kelayakan bisnis, pengawasan proyek, dan jasa penilaian properti yang terpercaya di seluruh Indonesia.",
      learnMore: "Selengkapnya",
    },
  },
  services: {
    en: {
      heading: "Our Services",
      subheading: "Professional property valuation and consulting services",
      appraisalTitle: "Appraisal",
      appraisalDesc:
        "Independent and professional property valuation services covering residential properties (houses, apartments, condominiums), commercial properties (shophouses, offices, malls), industrial & warehouse properties, vacant land & development sites, and special assets as required.",
      purposeTitle: "Purpose of Appraisal",
      purposeDesc:
        "Our appraisal services serve diverse needs including banking & financing requirements, government and state-owned enterprise (BUMN) interests, and private corporate purposes across various sectors.",
      otherTitle: "Other Services",
      otherDesc:
        "Beyond property valuation, we offer comprehensive business feasibility studies (studi kelayakan bisnis) and construction physical development supervision (pengawasan pembangunan fisik proyek).",
      learnMore: "Learn more",
    },
    id: {
      heading: "Layanan Kami",
      subheading: "Jasa penilaian properti dan konsultasi profesional",
      appraisalTitle: "Penilaian Properti",
      appraisalDesc:
        "Jasa penilaian properti independen dan profesional mencakup properti residensial (rumah, apartemen, kondominium), properti komersial (ruko, kantor, mal), properti industri & gudang, tanah kosong & lokasi pengembangan, serta aset khusus sesuai kebutuhan.",
      purposeTitle: "Tujuan Penilaian",
      purposeDesc:
        "Layanan penilaian kami melayani berbagai kebutuhan termasuk persyaratan perbankan & pembiayaan, kepentingan pemerintah dan BUMN, serta tujuan korporasi swasta di berbagai sektor.",
      otherTitle: "Layanan Lainnya",
      otherDesc:
        "Selain penilaian properti, kami menawarkan studi kelayakan bisnis yang komprehensif dan pengawasan pembangunan fisik proyek.",
      learnMore: "Selengkapnya",
    },
  },
  contact: {
    en: {
      heading: "Contact Us",
      subheading:
        "Interested in working together? Fill out some info and we will be in touch shortly. We can\u2019t wait to hear from you!",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      message: "Message",
      required: "(required)",
      firstNamePlaceholder: "John",
      lastNamePlaceholder: "Doe",
      emailPlaceholder: "john@example.com",
      messagePlaceholder: "Tell us about your project...",
      send: "Send",
    },
    id: {
      heading: "Hubungi Kami",
      subheading:
        "Tertarik untuk bekerja sama? Isi informasi di bawah ini dan kami akan segera menghubungi Anda. Kami menantikan kabar dari Anda!",
      firstName: "Nama Depan",
      lastName: "Nama Belakang",
      email: "Email",
      message: "Pesan",
      required: "(wajib)",
      firstNamePlaceholder: "Budi",
      lastNamePlaceholder: "Santoso",
      emailPlaceholder: "budi@contoh.com",
      messagePlaceholder: "Ceritakan tentang proyek Anda...",
      send: "Kirim",
    },
  },
  footer: {
    en: {
      tagline: "\u201CDriven by accuracy, Guided by integrity\u201D",
      location: "Location",
      contact: "Contact",
      copyright:
        "\u00A9 2025 PT. Graha Paramita Konsultan. All rights reserved.",
    },
    id: {
      tagline: "\u201CDidorong oleh akurasi, Dipandu oleh integritas\u201D",
      location: "Lokasi",
      contact: "Kontak",
      copyright:
        "\u00A9 2025 PT. Graha Paramita Konsultan. Hak cipta dilindungi.",
    },
  },
} as const;

export default translations;
