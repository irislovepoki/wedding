const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function imageLoader({ src }: { src: string }) {
  if (src.startsWith("/") && !src.startsWith(basePath + "/")) {
    return `${basePath}${src}`;
  }
  return src;
}
