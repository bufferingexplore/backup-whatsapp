"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function HomeContent() {
  const [opacity, setOpacity] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(100);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsAnimating(true);
    setOpacity(0);
    setTimeout(() => {
      router.push(isLoggedIn ? "/dashboard" : "/login");
    }, 500);
  };

  return (
    <div
      className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] transition-opacity duration-500 ${
        isAnimating ? "opacity-0" : ""
      }`}
      style={{
        background:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/img/header.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: `${opacity}%`,
      }}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          src="/svg/whatsapp.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="mb-2 text-2xl font-bold">Welcome to WhatsApp Tools</h1>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href={isLoggedIn ? "/dashboard" : "/login"}
            onClick={handleLogin}
            style={{ transition: "transform 0.5s ease-in-out" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            {isLoggedIn ? "Dashboard" : "Login"}
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}
