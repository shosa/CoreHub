"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
      console.error("Errore nel caricamento dello stato delle app:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = apps.filter((app) => app.status === "online").length;
  const offlineCount = apps.length - onlineCount;

  const getServiceUrl = (service: ServiceStatus): string | null => {
    if (service.status !== "online") return null;
    const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
    if (service.containerName === "core-mysql") return `http://${hostname}:8080`;
    if (service.containerName === "core-minio") return `http://${hostname}:9001`;
    return null;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Main Content */}
      <main style={{ flex: 1, padding: "48px 24px 120px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <Image
            src="/logo.png"
            alt="CoreSuite Logo"
            width={400}
            height={100}
            style={{ objectFit: "contain" }}
            priority
          />

          {!loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24, flexWrap: "wrap" }}
            >
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 50,
                backgroundColor: "rgba(76, 175, 80, 0.15)",
                color: "#4caf50",
                fontSize: 14,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)"
              }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                  animation: "pulse-dot 2s ease-in-out infinite"
                }}></span>
                {onlineCount} Servizi Online
              </span>

              {offlineCount > 0 && (
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 50,
                  backgroundColor: "rgba(244, 67, 54, 0.15)",
                  color: "#f44336",
                  fontSize: 14,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)"
                }}>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#f44336",
                    animation: "pulse-dot 2s ease-in-out infinite"
                  }}></span>
                  {offlineCount} Offline
                </span>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                border: "4px solid #e0e0e0",
                borderTopColor: "#1976d2"
              }}
            />
          </div>
        )}

        {/* Apps Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 24
            }}>
              <AnimatePresence>
                {apps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ServiceCard app={app} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      {!loading && services.length > 0 && (
        <footer style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.05)",
          padding: "16px 24px",
          zIndex: 100
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            maxWidth: 1400,
            margin: "0 auto"
          }}>
            {/* Services Status */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ color: "#666", fontWeight: 600, fontSize: 14 }}>
                CoreServices:
              </span>
              {services.map((service) => {
                const serviceUrl = getServiceUrl(service);
                const isClickable = !!serviceUrl;
                const isOnline = service.status === "online";

                return (
                  <button
                    key={service.containerName}
                    onClick={() => isClickable && window.open(serviceUrl!, "_blank", "noopener,noreferrer")}
                    disabled={!isClickable}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: `1px solid ${isOnline ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)"}`,
                      backgroundColor: isOnline ? "rgba(76, 175, 80, 0.15)" : "rgba(244, 67, 54, 0.15)",
                      color: isOnline ? "#4caf50" : "#f44336",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: isClickable ? "pointer" : "default",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: isOnline ? "#4caf50" : "#f44336"
                    }}></span>
                    {service.name}
                  </button>
                );
              })}
            </div>

            {/* Copyright */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Image
                src="/logo-footer.png"
                alt="CoreSuite"
                width={200}
                height={50}
                style={{ objectFit: "contain" }}
              />
              <span style={{ color: "#999" }}>-</span>
              <a
                href="mailto:kishosa@me.com"
                style={{
                  color: "#666",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: 14
                }}
              >
                @StefanoSolidoro
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
