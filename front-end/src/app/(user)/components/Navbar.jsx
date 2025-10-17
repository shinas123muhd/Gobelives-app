"use client";

import ShadowButton from "./ShadowButton";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "../constants";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-[#2E4346] py-4 sm:py-5 w-full border-b border-[#B3BEBA] px-4 sm:px-6 lg:px-12 flex items-center justify-between z-50 relative overflow-x-hidden">
      {/* Logo */}
      <div className="flex items-center space-x-2 h-6 w-24 sm:h-8 sm:w-36">
        <Image
          src="/svgs/LogoText.svg"
          alt="logo"
          width={100}
          height={100}
          className="h-full w-auto object-contain"
        />
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex gap-6 xl:gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className="text-white text-sm xl:text-base whitespace-nowrap hover:text-primary transition-colors"
          >
            {link.title}
          </Link>
        ))}
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-12">
        {!user ? (
          <div className="flex items-center gap-3 xl:gap-5">
            <ShadowButton
              text="Login"
              textColor="#000000"
              borderColor="#000000"
              bgColor="#FFD700"
              shadowBg="black"
              width={36}
              path="/login"
            />
            <ShadowButton
              text="Register"
              textColor="#FFD700"
              borderColor="#FFD700"
              bgColor="#0F1B17"
              shadowBg="black"
              width={40}
              path="/register"
            />
          </div>
        ) : (
          <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <div
              className="relative w-40 py-7 bg-black cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="absolute bottom-2 left-2 w-full h-full border-2 border-primary bg-[#0F1B17] flex justify-center items-center gap-2">
                <h2 className="text-primary font-bold text-medium">Profile</h2>
                <div className="w-10 h-10 bg-[#0F1B17] flex items-center justify-center p-1 overflow-hidden">
                  <Image
                    src="/images/Profile.jpg"
                    alt="profile"
                    width={20}
                    height={20}
                    className="rounded-full h-full w-full object-cover"
                  />
                </div>
                <div>
                  <Image src="/svgs/ArrowDown.svg" alt="arrow" width={20} height={20} />
                </div>
              </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute top-full mt-2 w-40 bg-[#0F1B17] border-2 border-primary shadow-lg z-50 rounded overflow-hidden">
                <button
                  className="w-full px-4 py-3 text-left text-white hover:bg-primary/20"
                  onClick={() => {
                    console.log("Go to profile");
                    setIsOpen(false);
                  }}
                >
                  Profile
                </button>
                <button
                  className="w-full px-4 py-3 text-left text-white hover:bg-primary/20"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden flex flex-col gap-1.5 w-6 h-6 justify-center items-center"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden absolute top-full left-0 right-0 bg-[#2E4346] border-b border-[#B3BEBA] shadow-lg z-50"
        >
          {/* Mobile Navigation Links */}
          <div className="flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="text-white px-6 py-3 hover:bg-[#3a5356] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Section */}
          <div className="border-t border-[#B3BEBA] py-4 px-6">
            {!user ? (
              <div className="flex flex-col gap-3">
                <ShadowButton
                  text="Login"
                  textColor="#000000"
                  borderColor="#000000"
                  bgColor="#FFD700"
                  shadowBg="black"
                  width={36}
                  path="/login"
                />
                <ShadowButton
                  text="Register"
                  textColor="#FFD700"
                  borderColor="#FFD700"
                  bgColor="#0F1B17"
                  shadowBg="black"
                  width={40}
                  path="/register"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  className="w-full px-4 py-3 text-left text-white bg-[#0F1B17] border-2 border-primary rounded hover:bg-primary/20"
                  onClick={() => {
                    console.log("Go to profile");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Profile
                </button>
                <button
                  className="w-full px-4 py-3 text-left text-white bg-[#0F1B17] border-2 border-primary rounded hover:bg-primary/20"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;