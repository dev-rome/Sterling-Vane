import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Sterling & Vane, gentlemen’s barbers in Chicago’s West Loop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const tagline = "Gentlemen’s barbers · West Loop, Chicago";

// Loads only the letters we use from Google Fonts, so the image matches the site.
async function loadGoogleFont(family: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const font = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!font) throw new Error(`Could not load font: ${family}`);
  return (await fetch(font[1])).arrayBuffer();
}

export default async function Image() {
  const [hero, cormorant] = await Promise.all([
    readFile(join(process.cwd(), "public/images/hero.jpg")),
    loadGoogleFont(
      "Cormorant+Garamond:wght@500",
      `EST. 2014Sterling&Vane${tagline}`,
    ),
  ]);
  const heroSrc = `data:image/jpeg;base64,${hero.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#0b0907",
      }}
    >
      <img
        src={heroSrc}
        alt=""
        width={1200}
        height={630}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(90deg, rgba(11,9,7,0.96) 0%, rgba(11,9,7,0.8) 55%, rgba(11,9,7,0.25) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
          gap: 20,
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 8, color: "#d19a55" }}>
          EST. 2014
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 112,
            lineHeight: 1,
            color: "#f2ebe1",
          }}
        >
          <span>Sterling</span>
          <span style={{ color: "#d19a55" }}>&amp;</span>
          <span>Vane</span>
        </div>
        <div style={{ fontSize: 38, color: "#ada59c" }}>{tagline}</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: cormorant, style: "normal", weight: 500 },
      ],
    },
  );
}
