"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  alpha,
} from "@mui/material";
import {
  Launch as LaunchIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";

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
  };
  return logoMap[appId] || "/logo.png";
};

export default function ServiceCard({ app }: ServiceCardProps) {
  const isOnline = app.status === "online";

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOnline) {
      window.open(app.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease-in-out",
        cursor: "default",
        opacity: isOnline ? 1 : 0.7,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        border: `2px solid ${isOnline ? app.color : "rgba(0, 0, 0, 0.1)"}`,
        borderRadius: 3,
        boxShadow: isOnline
          ? `0 8px 32px ${alpha(app.color, 0.15)}`
          : "0 8px 32px rgba(0, 0, 0, 0.05)",
        "&:hover": isOnline
          ? {
              transform: "translateY(-8px) scale(1.01)",
              boxShadow: `0 16px 48px ${alpha(app.color, 0.3)}`,
              border: `2px solid ${app.color}`,
            }
          : {},
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Icon e Status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              position: "relative",
              filter: isOnline ? "none" : "grayscale(1) opacity(0.5)",
            }}
          >
            <Image
              src={getLogoPath(app.id)}
              alt={`${app.name} logo`}
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Chip
            icon={
              <CircleIcon
                sx={{
                  fontSize: "0.75rem !important",
                  color: isOnline ? "#4caf50 !important" : "#f44336 !important",
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      opacity: 1,
                    },
                    "50%": {
                      opacity: 0.5,
                    },
                  },
                }}
              />
            }
            label={isOnline ? "Online" : "Offline"}
            size="small"
            sx={{
              backgroundColor: isOnline
                ? alpha("#4caf50", 0.15)
                : alpha("#f44336", 0.15),
              color: isOnline ? "#4caf50" : "#f44336",
              fontWeight: 600,
              border: `1px solid ${
                isOnline ? alpha("#4caf50", 0.3) : alpha("#f44336", 0.3)
              }`,
              boxShadow: isOnline
                ? "0 0 10px rgba(76, 175, 80, 0.4)"
                : "0 0 10px rgba(244, 67, 54, 0.4)",
              "& .MuiChip-icon": {
                color: isOnline ? "#4caf50 !important" : "#f44336 !important",
              },
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
            color: isOnline ? "#1a1a1a" : "rgba(0, 0, 0, 0.4)",
          }}
        >
          {app.name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: isOnline ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.4)",
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
            backgroundColor: "#1a1a1a",
            color: "white",
            "&:hover": {
              backgroundColor: "#000",
              transform: "scale(1.02)",
            },
            "&:disabled": {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              color: "rgba(0, 0, 0, 0.3)",
            },
            fontWeight: 600,
            textTransform: "none",
            py: 1.5,
            transition: "all 0.2s ease",
            boxShadow: isOnline ? "0 4px 12px rgba(0, 0, 0, 0.2)" : "none",
          }}
        >
          {isOnline ? "Apri Applicazione" : "Non Disponibile"}
        </Button>
      </CardActions>
    </Card>
  );
}
