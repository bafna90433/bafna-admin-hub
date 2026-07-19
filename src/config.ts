export interface ProjectConfig {
  id: string;
  name: string;
  description: string;
  localUrl: string;
  prodUrl: string;
  imgUrl: string;
  themeColor: string;
  accentGlow: string;
  sso?: boolean;
  quickLinks: Array<{ label: string; localPath: string; prodPath: string; sso?: boolean }>;
}

export const MASTER_CREDENTIALS = {
  username: 'admin',
  password: '123' // Aap is password ko badal sakte hain
};

export const projects: ProjectConfig[] = [
  {
    id: 'labour-management',
    name: 'Labour Management',
    description: 'Workforce tracking, biometric attendance, salary advances, and cashbook logs.',
    localUrl: 'http://localhost:5174', // Owner dashboard
    prodUrl: 'https://www.ladmin.bafnadaily.com', 
    imgUrl: 'https://ik.imagekit.io/rishii/labour_management_3d.png',
    themeColor: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.4)',
    quickLinks: [
      { label: 'Owner Panel 👑', localPath: 'http://localhost:5174', prodPath: 'https://www.ladmin.bafnadaily.com' },
      { label: 'Staff Desk 💼', localPath: 'http://localhost:5173', prodPath: 'https://www.ladmin.bafnadaily.com/staff' }
    ]
  },
  {
    id: 'stock-management',
    name: 'Stock Management',
    description: 'Smart warehouse stock levels, box dimensions, dispatch, and barcode scanning.',
    localUrl: 'http://localhost:5175',
    prodUrl: 'https://stockadmin.bafnadaily.com',
    imgUrl: 'https://ik.imagekit.io/rishii/stock_management_3d.png',
    themeColor: '#3b82f6',
    accentGlow: 'rgba(59, 130, 246, 0.4)',
    quickLinks: [
      { label: 'Admin Portal 📦', localPath: 'http://localhost:5175', prodPath: 'https://stockadmin.bafnadaily.com' },
      { label: 'Staff Portal 🛒', localPath: 'http://localhost:5185', prodPath: 'https://stockadmin.bafnadaily.com/staff' }
    ]
  },
  {
    id: 'md-panel',
    name: 'MD Panel',
    description: 'Executive overview for approvals, dispatch, billing, payments, and business performance.',
    localUrl: 'http://localhost:5179',
    prodUrl: 'https://www.stockmd.bafnadaily.com/',
    imgUrl: 'https://ik.imagekit.io/rishii/stock_management_3d.png',
    themeColor: '#F59E0B',
    accentGlow: 'rgba(245, 158, 11, 0.4)',
    sso: false,
    quickLinks: [
      { label: 'MD Login', localPath: 'http://localhost:5179', prodPath: 'https://www.stockmd.bafnadaily.com/', sso: false }
    ]
  },
  {
    id: 'rattles-stock',
    name: 'Rattles Stock',
    description: 'Baby rattles inventory tracking, employee performance logs, and retail stock metrics.',
    localUrl: 'http://localhost:5176',
    prodUrl: 'https://rattlesadmin.bafnadaily.com',
    imgUrl: 'https://ik.imagekit.io/rishii/rattles_stock_3d.png',
    themeColor: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    quickLinks: [
      { label: 'Owner Panel 📈', localPath: 'http://localhost:5176', prodPath: 'https://rattlesadmin.bafnadaily.com' },
      { label: 'Employee Portal 👷', localPath: 'http://localhost:5186', prodPath: 'https://rattlesadmin.bafnadaily.com/employee' }
    ]
  },
  {
    id: 'bafna-toys',
    name: 'Bafna Toys',
    description: 'Toy catalogue records, customer applications, wholesale pricing models, and product catalogs.',
    localUrl: 'http://localhost:5177',
    prodUrl: 'https://admin.bafnatoys.com',
    imgUrl: 'https://ik.imagekit.io/rishii/bafna_toys_3d.png',
    themeColor: '#22c55e',
    accentGlow: 'rgba(34, 197, 94, 0.4)',
    quickLinks: [
      { label: 'Admin Panel 🧸', localPath: 'http://localhost:5177', prodPath: 'https://admin.bafnatoys.com' },
      { label: 'Customer Portal 🛍️', localPath: 'http://localhost:5187', prodPath: 'https://bafnatoys.com' }
    ]
  },
  {
    id: 'bafna-daily',
    name: 'Bafna Daily',
    description: 'Daily operational checklist trackers, automated barcodes, and shift scheduling desk.',
    localUrl: 'http://localhost:5178',
    prodUrl: 'https://admin.bafnadaily.com',
    imgUrl: 'https://ik.imagekit.io/rishii/bafna_daily_3d.png',
    themeColor: '#ef5350',
    accentGlow: 'rgba(239, 83, 80, 0.4)',
    quickLinks: [
      { label: 'Admin Panel 🗓️', localPath: 'http://localhost:5178', prodPath: 'https://admin.bafnadaily.com' },
      { label: 'Daily Tracker ⏱️', localPath: 'http://localhost:5188', prodPath: 'https://bafnadaily.com' }
    ]
  }
];
