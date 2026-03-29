import Image from "next/image";
import { siteConfig } from "@/content/site";
import { BackgroundMusic } from "./components/background-music";
import { RSVPSection } from "./components/rsvp-section";

type AlbumPhoto = {
  src: string;
  alt: string;
  objectPosition: string;
  fit: "contain" | "cover";
};

function createAlbumPhotos(
  folder: string,
  count: number,
  portraitPhotos: Set<number>,
): AlbumPhoto[] {
  return Array.from({ length: count }, (_, index) => ({
    src: `/${folder}/${String(index + 1).padStart(2, "0")}.jpg`,
    alt: `${folder} 第 ${index + 1} 张`,
    objectPosition: "50% 52%",
    fit: portraitPhotos.has(index + 1) ? "contain" : "cover",
  }));
}

const album2017Photos = createAlbumPhotos("2017", 22, new Set([14, 18]));
const album2020Photos = createAlbumPhotos(
  "2020",
  23,
  new Set([4, 6, 11, 12, 13, 22]),
);

function FrameAlbum({
  photos,
  className,
  bleedClassName = "-inset-[1.8%]",
}: {
  photos: AlbumPhoto[];
  className: string;
  bleedClassName?: string;
}) {
  return (
    <div className={`absolute z-0 overflow-hidden ${className}`}>
      <div className={`absolute ${bleedClassName}`}>
        <div className="album-scroll flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth">
          {photos.map((photo) => (
            <div
              key={photo.src}
              className="relative h-full min-w-full shrink-0 snap-center overflow-hidden"
            >
              <Image
                src="/polaroid-paper.png"
                alt=""
                fill
                unoptimized
                sizes="84vw"
                className="object-cover"
              />
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                unoptimized
                sizes="84vw"
                className={photo.fit === "contain" ? "object-contain" : "object-cover"}
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
      <BackgroundMusic />

      <section className="w-full">
        <Image
          src="/page-1.jpg"
          alt="婚礼邀请函第一页"
          width={1080}
          height={3010}
          priority
          unoptimized
          sizes="100vw"
          className="block h-auto w-full"
        />
      </section>

      <section className="relative w-full">
        <FrameAlbum
          photos={album2017Photos}
          className="left-[7.35%] top-[4.05%] h-[33.4%] w-[85.2%]"
        />
        <FrameAlbum
          photos={album2020Photos}
          className="left-[7.05%] top-[54.55%] h-[33.4%] w-[86.45%]"
          bleedClassName="-inset-y-[1.1%] -inset-x-[0.8%]"
        />

        <Image
          src="/page-2-frame.png"
          alt="婚礼邀请函第二页"
          width={1080}
          height={1981}
          priority
          unoptimized
          sizes="100vw"
          className="pointer-events-none relative z-10 block h-auto w-full"
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

      <section className="w-full">
        <Image
          src="/page-3.jpg"
          alt="婚礼邀请函第三页"
          width={1080}
          height={4179}
          unoptimized
          sizes="100vw"
          className="block h-auto w-full"
        />
      </section>

      <section className="w-full">
        <Image
          src="/page-4.jpg"
          alt="婚礼邀请函第四页"
          width={1080}
          height={2151}
          unoptimized
          sizes="100vw"
          className="block h-auto w-full"
        />
      </section>

      <RSVPSection />

      <section className="w-full">
        <Image
          src="/page-6.jpg"
          alt="婚礼邀请函第六页"
          width={1080}
          height={828}
          unoptimized
          sizes="100vw"
          className="block h-auto w-full"
        />
      </section>
    </main>
  );
}
