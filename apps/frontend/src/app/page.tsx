"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ServiceCard from "@/components/ServiceCard";

export interface AppStatus {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  containerName: string;
  color: string;
  status: "online" | "offline";
}

export interface ServiceStatus {
  name: string;
  containerName: string;
  status: "online" | "offline";
}

export default function Home() {
  const [apps, setApps] = useState<AppStatus[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/status");
      const data = await response.json();
      setApps(data.apps || []);
      setServices(data.services || []);
    } catch (error) {
      console.error("Errore nel caricamento dello stato:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getServiceUrl = (service: ServiceStatus): string | null => {
    if (service.status !== "online") return null;
    const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
    if (service.containerName === "core-mysql") return `http://${hostname}:8080`;
    if (service.containerName === "core-minio") return `http://${hostname}:9001`;
    return null;
  };

  const onlineCount = apps.filter((a) => a.status === "online").length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "transparent",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <header style={{
        padding: "32px 40px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Image
          src="/logo.png"
          alt="CoreSuite"
          width={200}
          height={50}
          style={{ objectFit: "contain" }}
          priority
        />

        {!loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#4caf50",
              animation: "pulse-dot 2s ease-in-out infinite",
              display: "inline-block",
            }} />
            <span style={{ fontSize: 13, color: "#666", fontWeight: 500 }}>
              {onlineCount}/{apps.length} online
            </span>
          </div>
        )}
      </header>

      {/* Grid centrata */}
      <main style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 40px 80px",
      }}>
        {loading ? (
          <div style={{
            width: 3,
            height: 36,
            backgroundColor: "#bbb",
            animation: "pulse-dot 1s ease-in-out infinite",
          }} />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 200px)",
            gap: 4,
            justifyContent: "center",
          }}>
            {apps.map((app) => (
              <ServiceCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </main>

      {/* Footer strip */}
      {!loading && services.length > 0 && (
        <footer style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
          padding: "10px 40px",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}>
          <span style={{ fontSize: 11, color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Services
          </span>
          <div style={{ display: "flex", gap: 20, flex: 1 }}>
            {services.map((service) => {
              const serviceUrl = getServiceUrl(service);
              const isOnline = service.status === "online";
              return (
                <button
                  key={service.containerName}
                  onClick={() => serviceUrl && window.open(serviceUrl, "_blank", "noopener,noreferrer")}
                  disabled={!serviceUrl}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "none",
                    cursor: serviceUrl ? "pointer" : "default",
                    padding: 0,
                  }}
                >
                  <span style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    backgroundColor: isOnline ? "#4caf50" : "#bbb",
                    display: "inline-block",
                    animation: isOnline ? "pulse-dot 2s ease-in-out infinite" : "none",
                  }} />
                  <span style={{ fontSize: 12, color: isOnline ? "#555" : "#bbb", fontWeight: 500 }}>
                    {service.name}
                  </span>
                </button>
              );
            })}
          </div>
          <a
            href="mailto:kishosa@me.com"
            style={{
              fontSize: 12,
              color: "#999",
              textDecoration: "none",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            @Stefano Solidoro
          </a>
        </footer>
      )}
    </div>
  );
}
