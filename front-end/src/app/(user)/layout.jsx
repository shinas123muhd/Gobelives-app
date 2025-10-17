
import { Source_Sans_3, Mulish } from "next/font/google";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const sourceSansPro = Source_Sans_3({
  variable: "--font-source-sans-pro",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  weight: ["300", "400", "500", "600", "700"],
});

export default function UserLayout({ children }) {
  return (
    <div className={`${sourceSansPro.variable} ${mulish.variable} font-sans`}>
      <Navbar />
      <div
        className="bg-[url('/images/BgPattern.png')] bg-repeat bg-center min-h-screen"
        style={{ backgroundSize: "auto" }}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
}
