import Image from "next/image";
import { siteConfig } from "@/content/site";

const albumPhotos = [
  {
    src: "/our-2017-1.jpg",
    alt: "2017年的我们，湖边婚纱照",
    objectPosition: "50% 52%",
  },
  {
    src: "/our-2017-2.jpg",
    alt: "2017年的我们，牵手散步的照片",
    objectPosition: "50% 52%",
  },
];

function FrameAlbum({
  photos,
  className,
}: {
  photos: { src: string; alt: string; objectPosition: string }[];
  className: string;
}) {
  return (
    <div className={`absolute z-0 overflow-hidden ${className}`}>
      <div className="absolute -inset-[1.8%]">
        <div className="album-scroll flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth">
          {photos.map((photo) => (
            <div
              key={photo.src}
              className="relative h-full min-w-full shrink-0 snap-center overflow-hidden"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                unoptimized
                sizes="84vw"
                className="object-cover"
                style={{
                  objectPosition: photo.objectPosition,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="w-full bg-[#4d1c20]">
      <h1 className="sr-only">{siteConfig.share.title}</h1>

      <section className="w-full">
        <Image
          src="/page-1.jpg"
          alt="婚礼邀请函第一页"
          width={1080}
          height={2977}
          priority
          unoptimized
          sizes="100vw"
          className="block h-auto w-full"
        />
      </section>

      <section className="relative w-full">
        <FrameAlbum photos={albumPhotos} className="left-[7.35%] top-[4.05%] h-[33.4%] w-[85.2%]" />

        <Image
          src="/page-2-frame.png"
          alt="婚礼邀请函第二页"
          width={1080}
          height={1981}
          priority
          unoptimized
          sizes="100vw"
          className="relative z-10 block h-auto w-full"
        />

        <div className="pointer-events-none absolute left-[0.8%] top-[5.6%] z-20 h-[30%] w-[82%]">
          <Image
            src="/回形针1.png"
            alt=""
            fill
            unoptimized
            sizes="82vw"
            className="object-contain object-left-top"
          />
        </div>

        <div className="pointer-events-none absolute right-[1.4%] top-[60.2%] z-20 h-[23%] w-[62%]">
          <Image
            src="/回形针2.png"
            alt=""
            fill
            unoptimized
            sizes="62vw"
            className="object-contain object-right-top"
          />
        </div>
      </section>
    </main>
  );
}
