import Image from "next/image";

import bg from "@/public/nysc-bg.jpeg";
import logo from "@/public/nysc-logo.png";
import LoginForm from "@/components/loginForm";

export default function Home() {
  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 relative"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full h-full bg-overlay z-0 absolute opacity-80" />

      {/* Content */}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen z-20 relative">
        <a
          href="#"
          className="flex flex-col gap-3 items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            src={logo}
            alt="nysc logo"
            width={70}
            height={70}
            className="mr-2"
          />
          NYSC Bolari Secretariat
        </a>
        <div className="w-full bg-gray-800 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl w-full text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in
            </h1>
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
