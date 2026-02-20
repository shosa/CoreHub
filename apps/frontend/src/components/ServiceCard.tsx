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

export default function ServiceCard({ app }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isOnline = app.status === "online";

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

  // Colori border basati sul colore dell'app
  const getBorderColor = () => {
    if (!isOnline) return "#e5e7eb";
    return app.color || "#1976d2";
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 16,
        border: `2px solid ${getBorderColor()}`,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: isHovered && isOnline
          ? `0 20px 40px ${app.color}30, 0 8px 16px rgba(0,0,0,0.1)`
          : "0 4px 20px rgba(0, 0, 0, 0.08)",
        transform: isHovered && isOnline ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.3s ease",
        opacity: isOnline ? 1 : 0.6,
        overflow: "hidden"
      }}
    >
      {/* Colored top accent bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: isOnline ? app.color : "#9ca3af"
      }} />

      {/* Card Content */}
      <div style={{ flex: 1, padding: 20, paddingTop: 24 }}>
        {/* Header: Logo + Status Badge */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 16
        }}>
          {/* Logo */}
          <div style={{
            position: "relative",
            width: 64,
            height: 64,
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "#f8fafc",
            padding: 8,
            filter: isOnline ? "none" : "grayscale(100%)",
            opacity: isOnline ? 1 : 0.5
          }}>
            <Image
              src={getLogoPath(app.id)}
              alt={`${app.name} logo`}
              fill
              style={{ objectFit: "contain", padding: 4 }}
            />
          </div>

          {/* Status Badge */}
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 50,
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: isOnline ? "rgba(76, 175, 80, 0.15)" : "rgba(244, 67, 54, 0.15)",
            color: isOnline ? "#4caf50" : "#f44336",
            border: `1px solid ${isOnline ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)"}`
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: isOnline ? "#4caf50" : "#f44336",
              animation: "pulse-dot 2s ease-in-out infinite"
            }} />
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 8,
          color: isOnline ? "#1a1a1a" : "#9ca3af"
        }}>
          {app.name}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: isOnline ? "#666" : "#9ca3af"
        }}>
          {app.description}
        </p>
      </div>

      {/* Action Button */}
      <div style={{ padding: "0 20px 20px" }}>
        <button
          onClick={handleOpen}
          disabled={!isOnline}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 16px",
            borderRadius: 12,
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: isOnline ? "pointer" : "not-allowed",
            background: isOnline
              ? `linear-gradient(135deg, ${app.color} 0%, ${app.color}dd 100%)`
              : "#f1f5f9",
            color: isOnline ? "#fff" : "#9ca3af",
            boxShadow: isOnline ? `0 4px 12px ${app.color}40` : "none",
            transition: "all 0.2s ease",
            transform: isHovered && isOnline ? "scale(1.02)" : "scale(1)"
          }}
        >
          {isOnline ? (
            <>
              Apri Applicazione
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </>
          ) : (
            "Non Disponibile"
          )}
        </button>
      </div>
    </div>
  );
}
