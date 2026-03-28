import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  const coupleNames = `${siteConfig.couple.primaryName} & ${siteConfig.couple.secondaryName}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "54px",
          color: "#4b3127",
          background:
            "linear-gradient(135deg, #f8efe5 0%, #f1dfcb 58%, #ead2ba 100%)",
          fontFamily: '"PingFang SC", "Hiragino Sans GB", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            borderRadius: "36px",
            padding: "48px",
            border: "2px solid rgba(139, 75, 51, 0.14)",
            background: "rgba(255, 252, 247, 0.74)",
            boxShadow: "0 24px 80px rgba(111, 67, 48, 0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "26px",
                letterSpacing: "2px",
                color: "#9b5d45",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "1px",
                  background: "#9b5d45",
                }}
              />
              WEDDING INVITATION
            </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <div style={{ fontSize: "72px", fontWeight: 700, lineHeight: 1.1 }}>{coupleNames}</div>
              <div
                style={{
                  fontSize: "32px",
                  lineHeight: 1.5,
                  maxWidth: "640px",
                  color: "#6f4c40",
                }}
              >
                {siteConfig.share.description}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "18px",
                alignItems: "center",
                fontSize: "28px",
                color: "#8a5a47",
              }}
            >
              <div>{siteConfig.event.dateLabel}</div>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: "#b56e53",
                }}
              />
              <div>{siteConfig.event.venue}</div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "240px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "190px",
                height: "190px",
                borderRadius: "36px",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(180deg, #b86a4e 0%, #8e4e39 100%)",
                color: "#fff8f0",
                fontSize: "104px",
                fontWeight: 700,
                boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.18)",
              }}
            >
              囍
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
