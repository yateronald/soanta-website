import { Inbox, Users, Trash2 } from 'lucide-react';

export const menuItems = [
  { path: '/admin', icon: Inbox, label: 'Demandes', end: true },
  { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
  { path: '/admin/deleted', icon: Trash2, label: 'Corbeille' },
];
