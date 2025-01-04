"use client"

import LoginClient from "@/modules/login";
import { Suspense } from 'react';

export default function Login() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Suspense fallback={<div></div>}>
        <LoginClient />
      </Suspense>
    </div>
  );
}

