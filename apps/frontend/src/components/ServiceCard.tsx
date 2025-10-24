'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  alpha,
} from '@mui/material';
import { Launch as LaunchIcon, Circle as CircleIcon } from '@mui/icons-material';

interface ServiceCardProps {
  app: {
    id: string;
    name: string;
    description: string;
    icon: string;
    url: string;
    color: string;
    status: 'online' | 'offline';
  };
}

const getLogoPath = (appId: string): string => {
  const logoMap: Record<string, string> = {
    'coremachine': '/logo-coremachine.png',
    'coredocument': '/logo-coredocument.png',
  };
  return logoMap[appId] || '/logo-coremachine.png';
};

export default function ServiceCard({ app }: ServiceCardProps) {
  const isOnline = app.status === 'online';

  const handleOpen = () => {
    if (isOnline) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        cursor: isOnline ? 'pointer' : 'default',
        opacity: isOnline ? 1 : 0.6,
        backgroundColor: '#1e1e1e',
        '&:hover': isOnline
          ? {
              transform: 'translateY(-8px)',
              boxShadow: `0 12px 40px ${alpha(app.color, 0.3)}`,
              borderColor: app.color,
            }
          : {},
        borderLeft: `4px solid ${isOnline ? app.color : 'rgba(255, 255, 255, 0.1)'}`,
      }}
      onClick={handleOpen}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Icon e Status */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              position: 'relative',
              filter: isOnline ? 'brightness(0) invert(1)' : 'grayscale(1)',
            }}
          >
            <Image
              src={getLogoPath(app.id)}
              alt={`${app.name} logo`}
              fill
              style={{ objectFit: 'contain' }}
            />
          </Box>
          <Chip
            icon={
              <CircleIcon
                sx={{
                  fontSize: '0.75rem !important',
                  color: isOnline ? '#4caf50' : '#f44336',
                }}
              />
            }
            label={isOnline ? 'Online' : 'Offline'}
            size="small"
            sx={{
              backgroundColor: isOnline
                ? alpha('#4caf50', 0.2)
                : alpha('#f44336', 0.2),
              color: isOnline ? '#4caf50' : '#f44336',
              fontWeight: 600,
              border: `1px solid ${isOnline ? alpha('#4caf50', 0.3) : alpha('#f44336', 0.3)}`,
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: isOnline ? 'white' : 'rgba(255, 255, 255, 0.5)',
          }}
        >
          {app.name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 2,
          }}
        >
          {app.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={!isOnline}
          endIcon={<LaunchIcon />}
          onClick={handleOpen}
          sx={{
            backgroundColor: app.color,
            '&:hover': {
              backgroundColor: alpha(app.color, 0.8),
            },
            '&:disabled': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            fontWeight: 600,
            textTransform: 'none',
            py: 1,
          }}
        >
          {isOnline ? 'Apri Applicazione' : 'Non Disponibile'}
        </Button>
      </CardActions>
    </Card>
  );
}
