import Image from "next/image";

interface SectionBannerProps {
  banner?: string;
}

export default function SectionBanner({ banner }: SectionBannerProps) {
  return (
    <div className="w-full h-[20rem] overflow-hidden">
      {banner ? (
        <Image
          src={banner}
          alt="Banner"
          className="aspect-video w-full object-cover scale-105"
        />
      ) : (
        <div className="aspect-video w-full object-cover scale-105 bg-linear-to-br from-(--gray-3) to-(--gray-4)" />
      )}
    </div>
  );
}
