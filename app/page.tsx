import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Profil Perusahaan Properti</title>
        <meta
          name="description"
          content="Profil perusahaan spesialis di bidang aset properti"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-slate-400 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold ">Graha Pramita Konsultan</h1>
          <div className="flex items-center">
            <a href="#home" className="mx-2  hover:text-blue-300 font-medium">
              Home
            </a>
            <a href="#about" className="mx-2  hover:text-blue-300 font-medium">
              Tentang Kami
            </a>
            <a
              href="#services"
              className="mx-2  hover:text-blue-300 font-medium"
            >
              Layanan Kami
            </a>
            <Link href="/login">
              <button className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section
          id="home"
          className="relative min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-center"
          style={{ backgroundImage: "url(/background.jpg)" }}
        >
          <h2 className="text-4xl font-bold text-white shadow-lg">
            Graha Pramita Konsultan
          </h2>
          <p className="mt-3 text-xl text-white shadow-lg">
            Konsultan Terpercaya untuk Penilaian dan Konsultasi Bisnis Anda.
          </p>
          <p className="text-white mt-2"></p>
        </section>

        <section id="about" className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold">Tentang Kami</h2>
          <p className="text-base  mt-2">
            Graha Pramita Konsultan berawal dari bentuk usaha perseorangan yang
            dikenal sebagai Kantor Jasa Penilai Publik (KJPP) Muhammad Syarif.
            Seiring dengan perubahan regulasi dan perkembangan perusahaan, kami
            menjadi bagian dari Kantor Jasa Penilai Publik Syarif, Endang &
            Rekan pada tahun 2012. Dengan pengalaman bertahun-tahun di bidang
            penilaian properti dan bisnis, kami berkomitmen untuk memberikan
            layanan profesional yang dapat diandalkan dan memenuhi kebutuhan
            para pengguna jasa.
          </p>
        </section>

        <section id="services" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-10">
              Layanan Kami
            </h2>
            <div className="flex flex-wrap justify-center">
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 ">
                <div className="bg-white rounded-lg  shadow-lg p-5  h-80 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <h3 className="text-lg font-semibold mb-2">
                    Penilaian Properti - Jasa Lainnya
                  </h3>
                  <p className="text-sm text-gray-600">
                    Penilai Publik dengan klasifikasi bidang jasa Penilaian
                    Properti dapat memberikan jasa lainnya yang berkaitan dengan
                    kegiatan penilaian, meliputi konsultasi pengembangan
                    properti, desain sistem informasi aset, manajemen properti,
                    studi kelayakan usaha, jasa agen properti, pengawasan
                    pembiayaan proyek, studi penentuan sisa umur ekonomi, studi
                    penggunaan tertinggi dan terbaik (highest and best use), dan
                    studi optimalisasi aset.
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3  lg:w-1/4 p-4">
                <div className="bg-white rounded-lg  h-80 shadow-lg p-5 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <h3 className="text-lg font-semibold mb-2">
                    Penilaian Bisnis - Jasa Lainnya
                  </h3>
                  <p className="text-sm text-gray-600">
                    Penilai Publik dengan klasifikasi bidang jasa Penilaian
                    Bisnis dapat memberikan jasa lainnya yang berkaitan dengan
                    kegiatan penilaian, meliputi studi kelayakan usaha,
                    penasihat keuangan korporasi, dan pengawasan pembiayaan
                    proyek.
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                <div className="bg-white rounded-lg  h-80 shadow-lg p-5 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <h3 className="text-lg font-semibold mb-2">
                    Penilaian Properti Sederhana - Jasa Lainnya
                  </h3>
                  <p className="text-sm text-gray-600">
                    Penilai Publik dengan klasifikasi bidang jasa Penilaian
                    Properti Sederhana dapat memberikan jasa lainnya yang
                    berkaitan dengan kegiatan penilaian, yaitu jasa agen
                    properti.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full h-12 flex justify-center items-center border-t ">
        <div className="flex flex-col items-center">
          <p>© 2024 Graha Pramita Consultan. All rights reserved.</p>
          <Link href="https://www.consultnta.com/">
            <p>Powered by consultnta</p>
          </Link>
        </div>
      </footer>
    </div>
  );
}
