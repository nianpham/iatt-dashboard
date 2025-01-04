"use client"

import LoginClient from "@/modules/login";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <LoginClient />
    </div>
  );
}
