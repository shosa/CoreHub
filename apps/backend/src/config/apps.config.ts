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
    id: 'coremachine',
    name: 'CoreMachine',
    description: 'Gestione Macchine e Produzione',
    icon: '🏭',
    url: 'http://localhost:81',
    containerName: 'coremachine-frontend',
    color: '#1976d2', // Blue
  },
  {
    id: 'coredocument',
    name: 'CoreDocument',
    description: 'Gestione Documentale',
    icon: '📄',
    url: 'http://localhost:82',
    containerName: 'coredocument-frontend',
    color: '#2e7d32', // Green
  },
  // Facile aggiungere nuove app in futuro:
  // {
  //   id: 'coreinventory',
  //   name: 'CoreInventory',
  //   description: 'Gestione Magazzino',
  //   icon: '📦',
  //   url: 'http://localhost:83',
  //   containerName: 'coreinventory-frontend',
  //   color: '#ed6c02', // Orange
  // },
];
