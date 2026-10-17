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
    <div className={cn("relative mx-auto w-full max-w-xl pr-[16%] pb-10", className)}>
      <div>
        <div className="rounded-t-[1.2rem] rounded-b-md border border-line bg-[#ece8e1] px-2 pt-3 pb-4 shadow-[0_24px_60px_rgb(0_0_0/10%)]">
          <div className="mx-auto mb-2 h-1.5 w-1.5 rounded-full bg-[#c9c3ba]" />
          <div className="aspect-[16/10] overflow-hidden rounded-[0.7rem] bg-elevated">
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
        <div className="relative -mx-4 h-3.5 rounded-b-[1rem] bg-[#ddd6cc] shadow-[0_12px_28px_rgb(0_0_0/10%)]">
          <div className="absolute top-0 left-1/2 h-1.5 w-16 -translate-x-1/2 rounded-b-md bg-[#cfc7bc]" />
        </div>
      </div>

      {phoneSrc ? (
        <div className="absolute right-0 -bottom-1 z-10 w-[30%] sm:w-[28%]">
          <div className="rounded-[1.65rem] bg-[#111] p-[5px] shadow-[0_18px_40px_rgb(0_0_0/28%)] sm:rounded-[1.85rem] sm:p-[6px]">
            <div className="relative aspect-[1170/1992] overflow-hidden rounded-[1.35rem] bg-white sm:rounded-[1.5rem]">
              <span className="absolute top-[5px] left-1/2 z-10 h-[5px] w-[28%] -translate-x-1/2 rounded-full bg-black sm:top-1.5 sm:h-1.5 sm:w-[26%]" />
              <Image
                src={phoneSrc}
                alt=""
                width={1170}
                height={1992}
                unoptimized
                className="h-full w-full object-contain object-top"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
