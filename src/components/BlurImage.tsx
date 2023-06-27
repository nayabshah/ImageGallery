"use client";
import Image from "next/legacy/image";
import { useState } from "react";

const BlurImage = ({ image, alt }) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <div
      className={`aspect-w-1   ${
        isLoading ? "animate-pulse" : ""
      } overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 `}
    >
      <Image
        className={`
        h-auto max-w-full rounded-lg duration-700 ease-in-out group-hover:opacity-75
       ${
         isLoading
           ? "scale-110 blur-2xl grayscale"
           : "scale-100 blur-0 grayscale-0"
       })`}
        onLoadingComplete={() => setLoading(false)}
        src={image}
        alt={alt}
        width={600}
        height={450}
        layout="responsive"
      />
    </div>
  );
};

export default BlurImage;
