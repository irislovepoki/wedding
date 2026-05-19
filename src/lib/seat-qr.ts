import { cache } from "react";
import QRCode from "qrcode";
import { siteConfig } from "@/content/site";

export const seatLookupPath = "/seat";

export function getSeatLookupUrl(): string {
  return new URL(seatLookupPath, siteConfig.siteUrl).toString();
}

export const getSeatLookupQrDataUrl = cache(async () => {
  return QRCode.toDataURL(getSeatLookupUrl(), {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: {
      dark: "#5a2326",
      light: "#0000",
    },
  });
});
