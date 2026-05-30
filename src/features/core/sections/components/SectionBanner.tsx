import Image from "next/image";

interface SectionBannerProps {
  banner?: string;
}

export default function SectionBanner({ banner }: SectionBannerProps) {
  return (
    <div className="p-4">
      <div className="w-full h-[18rem] relative overflow-hidden rounded-xl">
        {banner ? (
          <Image
            fill
            src={banner}
            alt="Banner"
            className="w-full object-cover scale-105"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-(--gray-3) to-(--gray-4)" />
        )}
        <div className="absolute inset-0 bg-black/50 rounded-xl" />
      </div>
    </div>
  );
}
