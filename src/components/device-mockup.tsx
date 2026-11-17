import Image from "next/image";
import { cn } from "@/lib/cn";

export function DeviceMockup({
  desktopSrc,
  mobileSrc,
  alt,
  className,
}: {
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
  className?: string;
}) {
  const phoneSrc = mobileSrc;

  return (
    <div className={cn("relative mx-auto w-full max-w-xl pb-5", className)}>
      <div className="w-[82%]">
        <div className="rounded-t-[0.9rem] rounded-b-[0.3rem] bg-[#1c1c1e] px-[0.4rem] pt-2 pb-[0.4rem] shadow-[0_22px_50px_rgb(0_0_0/14%)]">
          <div className="mx-auto mb-1.5 size-1.5 rounded-full bg-[#3a3a3c]" />
          <div className="aspect-[16/10] overflow-hidden rounded-[0.3rem] bg-black">
            {desktopSrc ? (
              <Image
                src={desktopSrc}
                alt={alt}
                width={1200}
                height={750}
                unoptimized
                className="h-full w-full object-cover object-top"
              />
            ) : null}
          </div>
        </div>
        <div className="relative -mx-6 h-2.5 rounded-b-xl bg-gradient-to-b from-[#b4b8be] via-[#8d939b] to-[#6a7078] shadow-[0_12px_24px_rgb(0_0_0/18%)]">
          <div className="absolute inset-x-0 top-0 h-px bg-white/35" />
          <div className="absolute top-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-b-md bg-[#555b63]" />
        </div>
      </div>

      {phoneSrc ? (
        <div className="absolute bottom-0 left-[78%] z-10 w-[23%]">
          <div className="rounded-[1.3rem] bg-[#0c0c0e] p-[3px] shadow-[0_16px_36px_rgb(0_0_0/24%)]">
            <div className="relative aspect-[390/844] overflow-hidden rounded-[1.12rem] bg-black">
              <span className="absolute top-1.5 left-1/2 z-10 h-[10px] w-[22%] -translate-x-1/2 rounded-full bg-black" />
              <Image
                src={phoneSrc}
                alt=""
                width={390}
                height={844}
                unoptimized
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
