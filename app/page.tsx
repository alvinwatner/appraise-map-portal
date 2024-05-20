import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Profil Perusahaan Properti</title>
        <meta name="description" content="Profil perusahaan spesialis di bidang aset properti" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-slate-400 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold ">Properti XYZ</h1>
          <div className="flex items-center">
            <a href="#home" className="mx-2  hover:text-blue-300 font-medium">Home</a>
            <a href="#about" className="mx-2  hover:text-blue-300 font-medium">Tentang Kami</a>
            <a href="#services" className="mx-2  hover:text-blue-300 font-medium">Layanan Kami</a>
            <Link href="/login">
              <button className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section id="home" className="relative min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-center" style={{ backgroundImage: 'url(/background.jpg)' }}>
          <h2 className="text-4xl font-bold text-white shadow-lg">
            Selamat Datang di Properti XYZ
          </h2>
          <p className="mt-3 text-xl text-white shadow-lg">
            Kami adalah perusahaan yang bergerak di bidang aset properti dengan pengalaman lebih dari 20 tahun.
          </p>
          <p className="text-white mt-2">
            Menyediakan solusi properti terbaik, mengelola lebih dari 300 unit properti di seluruh negeri, dan berkomitmen pada kepuasan pelanggan.
          </p>
        </section>

        <section id="about" className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold">Tentang Kami</h2>
          <p className="text-md mt-2">
            Properti XYZ berkomitmen untuk mengembangkan aset properti yang menguntungkan dan berkelanjutan.
          </p>
        </section>

        <section id="services" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-10">Layanan Kami</h2>
            <div className="flex flex-wrap justify-center">
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <h3 className="text-lg font-semibold mb-2">Manajemen Properti</h3>
                  <p className="text-sm text-gray-600">Mengelola aset properti dengan efisien dan profesional.</p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <h3 className="text-lg font-semibold mb-2">Penjualan dan Sewa Properti</h3>
                  <p className="text-sm text-gray-600">Menawarkan berbagai pilihan properti untuk dijual atau disewa.</p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <h3 className="text-lg font-semibold mb-2">Konsultasi Investasi Properti</h3>
                  <p className="text-sm text-gray-600">Memberikan nasihat terbaik untuk investasi properti Anda.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full h-12 flex justify-center items-center border-t">
        <p>© 2024 Properti XYZ. All rights reserved.</p>
      </footer>
    </div>
  )
}
