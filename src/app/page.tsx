"use client"

import HomeClient from "@/modules/home";
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Suspense fallback={<div></div>}>
        <HomeClient />
      </Suspense>
    </div>
  );
}
