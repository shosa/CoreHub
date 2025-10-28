import * as dotenv from "dotenv";

// Carica le variabili d'ambiente
dotenv.config();

const BASE_URL = process.env.BASE_URL || "http://localhost";

export interface CoreApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  containerName: string;
  color: string; // Colore principale per la card
}

export const CORE_APPS: CoreApp[] = [
  {
    id: "coremachine",
    name: "CoreMachine",
    description: "Registro Macchine e Manutenzioni",
    icon: "🏭",
    url: `${BASE_URL}:81`,
    containerName: "coremachine-frontend",
    color: "#1976d2", // Blue
  },
  {
    id: "coredocument",
    name: "CoreDocument",
    description: "Gestione Documentale",
    icon: "📄",
    url: `${BASE_URL}:82`,
    containerName: "coredocument-frontend",
    color: "#2e7d32", // Green
  },
  {
    id: "corevisitor",
    name: "CoreVisitor",
    description: "Gestione Visitatori",
    icon: "📄",
    url: `${BASE_URL}:83`,
    containerName: "corevisitor-frontend",
    color: "#9c27b0", // Purple
  },
  {
    id: "coregre",
    name: "CoreGre",
    description: "ERP Gestione Aziendale",
    icon: "/coregre-logo.png",
    url: `${BASE_URL}:84`,
    containerName: "coregre-app",
    color: "#e27329", // Orange
  },
  // Facile aggiungere nuove app in futuro:
  // {
  //   id: 'coreinventory',
  //   name: 'CoreInventory',
  //   description: 'Gestione Magazzino',
  //   icon: '📦',
  //   url: `${BASE_URL}:83`,
  //   containerName: 'coreinventory-frontend',
  //   color: '#ed6c02', // Orange
  // },
];
