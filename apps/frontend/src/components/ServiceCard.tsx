"use client";

import { useState } from "react";
import Image from "next/image";

interface ServiceCardProps {
  app: {
    id: string;
    name: string;
    description: string;
    icon: string;
    url: string;
    color: string;
    status: "online" | "offline";
  };
}

const getLogoPath = (appId: string): string => {
  const logoMap: Record<string, string> = {
    coremachine: "/logo-coremachine.png",
    coredocument: "/logo-coredocument.png",
    corevisitor: "/logo-corevisitor.png",
    coregre: "/logo-coregre.png",
    coregrejs: "/logo-coregre.png",
    corecanvas: "/logo-corecanvas.png",
  };
  return logoMap[appId] || "/logo.png";
};

const LOGO_NO_INVERT = new Set(["coregrejs", "coregre"]);

export default function ServiceCard({ app }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isOnline = app.status === "online";
  const noInvert = LOGO_NO_INVERT.has(app.id);

  const getDynamicUrl = (): string => {
    try {
      const parsed = new URL(app.url);
      parsed.hostname = window.location.hostname;
      return parsed.toString();
    } catch {
      return app.url;
    }
  };

  const handleOpen = () => {
    if (isOnline) {
      window.open(getDynamicUrl(), "_blank", "noopener,noreferrer");
    }
  };

  return (
    /* Wrapper esterno: gestisce scale senza clip */
    <div
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        transform: isHovered && isOnline ? "scale(1.06)" : "scale(1)",
        boxShadow: isHovered && isOnline ? "0 8px 28px rgba(0,0,0,0.20)" : "none",
        zIndex: isHovered ? 10 : 1,
        cursor: isOnline ? "pointer" : "default",
      }}
      onClick={handleOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Inner: colore + clip */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: isOnline ? app.color : "#d0d0d0",
        overflow: "hidden",
        filter: isOnline ? "none" : "grayscale(80%) brightness(0.85)",
        animation: "tile-in 0.3s ease forwards",
      }}>
        {/* Logo centrato */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: noInvert ? 16 : 28,
        }}>
          <div style={{
            position: "relative",
            width: noInvert ? "70%" : "60%",
            height: noInvert ? "70%" : "60%",
            opacity: isOnline ? 1 : 0.4,
            filter: noInvert ? "none" : "brightness(0) invert(1)",
          }}>
            <Image
              src={getLogoPath(app.id)}
              alt={app.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Nome app in basso a sinistra */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "6px 10px",
          background: "rgba(0,0,0,0.2)",
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            {app.name}
          </span>
        </div>

        {/* Dot status in alto a destra */}
        <div style={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: isOnline ? "#fff" : "#888",
          animation: isOnline ? "pulse-dot 2s ease-in-out infinite" : "none",
          opacity: isOnline ? 0.85 : 0.5,
        }} />
      </div>
    </div>
  );
}
