import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { FiMap } from "react-icons/fi";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Profil Perusahaan Properti</title>
        <meta
          name="description"
          content="Profil perusahaan spesialis di bidang aset properti"
        />

        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>

      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url(/background-building.jpg)" }}
      >
        <nav className="bg-transparent py-4 ">
          <div className="container mx-auto px-1 flex justify-between items-center">
            <div className="flex justify-start items-center">
              <Image
                alt=""
                src="/logo-large.png"
                width={100}
                height={20}
                className={``}
              />
              <h1 className="text-xl font-bold text-white">
                PT. Graha Paramita Konsultan
              </h1>
            </div>
            <div className="flex items-center">
              <a
                href="#home"
                className="mx-4 text-lg hover:text-blue-300 font-medium text-white"
              >
                Home
              </a>
              <a
                href="#about"
                className="mx-4 text-lg hover:text-blue-300 font-medium text-white"
              >
                About Us
              </a>
              <a
                href="#services"
                className="mx-4 text-lg hover:text-blue-300 font-medium text-white"
              >
                Our Services
              </a>
            </div>
          </div>
        </nav>

        <section
          id="home"
          className="flex flex-col justify-center items-center text-center min-h-screen"
        >
          <h2 className="text-5xl font-bold text-white  mb-4">
            PT. Graha Paramita Konsultan
          </h2>
          <div className="bg-black rounded-xl bg-opacity-10 px-10 py-4">
            <p className="mt-3 text-xl text-white ">
              Leading the way in business excellence through reliable opinions,
              trustworthy relationships, and sustainable strategies for a
              successful future
            </p>
          </div>
        </section>
      </div>

      <main>
        <section id="about" className=" py-16 bg-gray-100">
          <div className="flex flex-row justify-between container px-4 mx-auto gap-10 ">
            <div className="flex-1">
              <h2 className="text-[38px] font-semibold mb-7">About Us</h2>
              <p className="text-lg leading-relaxed mt-2">
                PT. Graha Paramita Konsultan is a trusted provider of business
                feasibility studies, project supervision, business model design,
                and property valuation services. Committed to reliability,
                trustworthiness, and sustainability, we offer precise analyses
                and strategic recommendations to help businesses make informed
                decisions and achieve long-term success.
              </p>
            </div>
            <div
              className="flex-1  h-[440px]"
              style={{
                backgroundImage: "url(/building.png)",
                backgroundSize: "100% auto",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
        </section>

        <section id="services" className="py-16 bg-c-light-blue">
          <div className="container mx-auto px-4">
            <h2 className="text-[38px] font-semibold text-center mb-10 ">
              Our Services
            </h2>
            <div className="flex flex-wrap justify-center group text-center">
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4 ">
                <div className="bg-white rounded-lg ring-2 ring-c-blue shadow-lg p-7  h-[300px] flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <h3 className="text-2xl font-semibold mb-2 text-center">
                    Business Feasibility Study
                  </h3>
                  <p className="text-base text-gray-600 leading-6 ">
                    Our company provides comprehensive and reliable Business
                    Feasibility Study services. Through meticulous approaches
                    and in-depth analyses, we assist you in assessing the
                    potential success of your projects, identifying risks, and
                    offering strategic recommendations that ensure informed and
                    sustainable investment decisions. Trust us to guide you
                    towards sustainable business success.
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4 ">
                <div className="bg-white rounded-lg  ring-2 ring-c-blue shadow-lg p-7  h-[300px] flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <h3 className="ml-4 text-2xl font-semibold mb-2 text-center leading">
                    Business Plan Designs
                  </h3>
                  <p className="text-base text-gray-600 leading-6">
                    Our company specializes in creating comprehensive Business
                    Plan Designs tailored to your needs. With our expertise and
                    strategic approach, we help you develop clear, actionable,
                    and sustainable business plans that drive growth and
                    success. Rely on us to turn your vision into a
                    well-structured and achievable roadmap for the future.
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4 ">
                <div className="bg-white rounded-lg ring-2 ring-c-blue shadow-lg p-7  h-[300px] flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <h3 className="text-2xl font-semibold mb-2 text-center">
                    Valuations
                  </h3>
                  <p className="text-base text-gray-600  leading-6">
                    Our company offers expert Property Valuation services and
                    access to an extensive property database. With precise
                    valuations and comprehensive data, we provide accurate
                    insights to make informed decisions. Trust us to deliver
                    reliable assessments and valuable information, ensuring the
                    best outcomes for your property investments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full h-12 flex justify-center items-center border-t py-14">
        <div className="flex flex-col items-center">
          <p>© 2024 PT. Graha Paramita Konsultan. All rights reserved.</p>
          <Link href="https://www.consultnta.com/">
            <div className="flex flex-row mt-1">
              <p>Powered by </p>
              <p className="underline text-blue-500 font-semibold ml-1">
                consultnta.
              </p>
            </div>
          </Link>
        </div>
      </footer>
    </div>
  );
}
