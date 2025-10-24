'use client';

import { useEffect, useState } from 'react';
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
} from '@mui/material';
import ServiceCard from '@/components/ServiceCard';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
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
  status: 'online' | 'offline';
}

export interface ServiceStatus {
  name: string;
  containerName: string;
  status: 'online' | 'offline';
}

export default function Home() {
  const [apps, setApps] = useState<AppStatus[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setApps(data.apps || []);
      setServices(data.services || []);
    } catch (error) {
      console.error('Errore nel caricamento dello stato delle app:', error);
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

  const onlineCount = apps.filter((app) => app.status === 'online').length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 8,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 2,
              }}
            >
              Core Suite
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#666',
                mb: 3,
              }}
            >
              Dashboard Gestionale Unificata
            </Typography>

            {!loading && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Chip
                  label={`${onlineCount} Servizi Online`}
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
                {onlineCount < apps.length && (
                  <Chip
                    label={`${apps.length - onlineCount} Offline`}
                    color="error"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          )}

          {/* Apps Grid */}
          {!loading && (
            <Grid container spacing={4}>
              {apps.map((app) => (
                <Grid item xs={12} sm={6} md={4} key={app.id}>
                  <ServiceCard app={app} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            {/* CoreServices Status */}
            {!loading && services.length > 0 && (
              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#666', mb: 2, fontWeight: 600 }}
                >
                  CoreServices
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  {services.map((service) => (
                    <Chip
                      key={service.containerName}
                      label={service.name}
                      size="small"
                      sx={{
                        backgroundColor:
                          service.status === 'online'
                            ? 'rgba(76, 175, 80, 0.2)'
                            : 'rgba(244, 67, 54, 0.2)',
                        color:
                          service.status === 'online' ? '#4caf50' : '#f44336',
                        border: `1px solid ${
                          service.status === 'online'
                            ? 'rgba(76, 175, 80, 0.3)'
                            : 'rgba(244, 67, 54, 0.3)'
                        }`,
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Typography
              variant="body2"
              sx={{ color: '#999' }}
            >
              © 2025 CoreSuite - Sistema Gestionale Integrato
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
