"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Chip,
  CircularProgress,
} from "@mui/material";
import ServiceCard from "@/components/ServiceCard";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a1a1a",
    },
    secondary: {
      main: "#666666",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

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

    // Polling ogni 30 secondi per aggiornare gli stati
    const interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const onlineCount = apps.filter((app) => app.status === "online").length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          pt: 6,
          pb: 12,
          px: { xs: 2, sm: 4, md: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
          {/* Header - Logo e Status */}
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
            }}
          >
            <Image
              src="/logo.png"
              alt="CoreSuite Logo"
              width={400}
              height={100}
              style={{ objectFit: "contain" }}
            />

            {!loading && (
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  mt: 4,
                }}
              >
                <Chip
                  label={`${onlineCount} Servizi Online`}
                  color="success"
                  sx={{
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                  }}
                />
                {onlineCount < apps.length && (
                  <Chip
                    label={`${apps.length - onlineCount} Offline`}
                    color="error"
                    sx={{
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
                    }}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          )}

          {/* Apps Grid */}
          {!loading && (
            <Box sx={{ maxWidth: "1400px", mx: "auto", width: "100%" }}>
              <Grid container spacing={4}>
                {apps.map((app) => (
                  <Grid item xs={12} sm={6} md={4} key={app.id}>
                    <ServiceCard app={app} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

      </Box>

      {/* Footer - CoreServices Status (absolute bottom) */}
      {!loading && services.length > 0 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.05)",
            py: 2,
            px: { xs: 2, sm: 4, md: 6 },
            zIndex: 100,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              maxWidth: "1400px",
              mx: "auto",
            }}
          >
            {/* CoreServices label e chips */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography
                variant="body2"
                sx={{ color: "#666", fontWeight: 600 }}
              >
                CoreServices:
              </Typography>
              {services.map((service) => {
                // Determina URL e se è clickable
                let serviceUrl = '';
                let isClickable = false;
                const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

                if (service.containerName === 'core-mysql' && service.status === 'online') {
                  serviceUrl = `http://${hostname}:8080`;
                  isClickable = true;
                } else if (service.containerName === 'core-minio' && service.status === 'online') {
                  serviceUrl = `http://${hostname}:9001`;
                  isClickable = true;
                }

                return (
                  <Chip
                    key={service.containerName}
                    label={service.name}
                    size="small"
                    onClick={isClickable ? () => window.open(serviceUrl, '_blank', 'noopener,noreferrer') : undefined}
                    sx={{
                      backgroundColor:
                        service.status === "online"
                          ? "rgba(76, 175, 80, 0.15)"
                          : "rgba(244, 67, 54, 0.15)",
                      color:
                        service.status === "online" ? "#4caf50" : "#f44336",
                      border: `1px solid ${
                        service.status === "online"
                          ? "rgba(76, 175, 80, 0.3)"
                          : "rgba(244, 67, 54, 0.3)"
                      }`,
                      fontWeight: 500,
                      cursor: isClickable ? 'pointer' : 'default',
                      '&:hover': isClickable ? {
                        backgroundColor: service.status === "online"
                          ? "rgba(76, 175, 80, 0.25)"
                          : "rgba(244, 67, 54, 0.25)",
                        transform: 'scale(1.05)',
                      } : {},
                      transition: 'all 0.2s ease',
                    }}
                  />
                );
              })}
            </Box>

            {/* Copyright */}
            <Typography variant="body2" sx={{ color: "#999" }}>
              CoreSuite - Stefano Solidoro
            </Typography>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}
