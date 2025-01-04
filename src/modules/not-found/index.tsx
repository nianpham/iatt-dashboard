"use client"

import { IMAGES } from "@/utils/image"
import Image from "next/image"

export default function NotFoundPage() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[rgb(249,252,255)]">
      <Image
        src={IMAGES.NOT_FOUND}
        alt="404"
        width={440}
        height={440}
      />
    </div>
  )
}
