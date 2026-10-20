import {
  Droplets,
  Zap,
  Snowflake,
  BatteryCharging,
  Hammer,
  PaintRoller,
  Cctv,
  Sun,
  WashingMachine,
  Smartphone,
  Sparkles,
  Car,
  LayoutGrid,
  BriefcaseBusiness,
  ShieldCheck,
  Users,
  Wallet,
  TriangleAlert,
  Tags,
  ChartNoAxesCombined,
  Settings,
} from "lucide-react";
export const services = [
  {
    name: "Plumbing",
    icon: Droplets,
    tone: "blue",
    description: "Leaks, pipes & everything in between",
    price: 5000,
  },
  {
    name: "Electrical",
    icon: Zap,
    tone: "yellow",
    description: "Keep your home safely connected",
    price: 6000,
  },
  {
    name: "AC & HVAC",
    icon: Snowflake,
    tone: "mint",
    description: "A little care. A lot more cool.",
    price: 8000,
  },
  {
    name: "Generator",
    icon: BatteryCharging,
    tone: "lilac",
    description: "Power that keeps up with you",
    price: 7000,
  },
  {
    name: "Carpentry",
    icon: Hammer,
    tone: "peach",
    description: "Built, fitted & fixed with care",
    price: 6000,
  },
  {
    name: "Painting",
    icon: PaintRoller,
    tone: "pink",
    description: "Give your space a fresh start",
    price: 5000,
  },
  {
    name: "CCTV & security",
    icon: Cctv,
    tone: "mint",
    description: "A little more peace of mind",
    price: 8000,
  },
  {
    name: "Solar",
    icon: Sun,
    tone: "yellow",
    description: "Brighter days, smarter energy",
    price: 10000,
  },
  {
    name: "Appliances",
    icon: WashingMachine,
    tone: "blue",
    description: "Get your everyday essentials going",
    price: 6000,
  },
  {
    name: "Phones & gadgets",
    icon: Smartphone,
    tone: "lilac",
    description: "Back to doing what you love",
    price: 4000,
  },
  {
    name: "Cleaning",
    icon: Sparkles,
    tone: "pink",
    description: "A clean space. A clear head.",
    price: 5000,
  },
  {
    name: "Mechanic",
    icon: Car,
    tone: "peach",
    description: "Get back on the road",
    price: 8000,
  },
];
export const tabs = [
  { key: "overview", name: "Overview", icon: LayoutGrid },
  { key: "jobs", name: "Jobs & dispatch", icon: BriefcaseBusiness },
  { key: "artisans", name: "Artisans", icon: ShieldCheck },
  { key: "customers", name: "Customers", icon: Users },
  { key: "payments", name: "Payments & payouts", icon: Wallet },
  { key: "disputes", name: "Disputes", icon: TriangleAlert },
  { key: "services", name: "Services & pricing", icon: Tags },
  { key: "reports", name: "Reports", icon: ChartNoAxesCombined },
  { key: "settings", name: "Settings", icon: Settings },
];
export type Job = {
  id: string;
  service: string;
  customer: string;
  area: string;
  artisan: string;
  status: string;
  value: number;
  date: string;
};
export const initialJobs: Job[] = [
  {
    id: "FX-20519",
    service: "AC not cooling",
    customer: "Alex Okon",
    area: "Ajah",
    artisan: "Unassigned",
    status: "Unassigned",
    value: 18000,
    date: "2026-10-19",
  },
  {
    id: "FX-20518",
    service: "Kitchen sink leak",
    customer: "Chika Nwosu",
    area: "Lekki",
    artisan: "Ibrahim Okon",
    status: "On the way",
    value: 14500,
    date: "2026-10-19",
  },
  {
    id: "FX-20517",
    service: "Generator servicing",
    customer: "Funmi Ade",
    area: "Ikeja",
    artisan: "Chinedu Okafor",
    status: "In progress",
    value: 27000,
    date: "2026-10-19",
  },
  {
    id: "FX-20516",
    service: "Door lock replacement",
    customer: "Tolu Balogun",
    area: "Yaba",
    artisan: "Unassigned",
    status: "Unassigned",
    value: 12000,
    date: "2026-10-19",
  },
  {
    id: "FX-20515",
    service: "Electrical fault finding",
    customer: "Amaka Eze",
    area: "Ikoyi",
    artisan: "Babatunde Ade",
    status: "Completed",
    value: 22000,
    date: "2026-10-18",
  },
  {
    id: "FX-20514",
    service: "Living room painting",
    customer: "Daniel Udo",
    area: "Victoria Island",
    artisan: "Musa Bello",
    status: "Scheduled",
    value: 48000,
    date: "2026-10-20",
  },
  {
    id: "FX-20513",
    service: "Washing machine repair",
    customer: "Grace John",
    area: "Surulere",
    artisan: "Ibrahim Okon",
    status: "Completed",
    value: 24000,
    date: "2026-10-17",
  },
];
export type Artisan = {
  id: string;
  name: string;
  trade: string;
  area: string;
  rating: string;
  status: string;
  initials: string;
};
export const initialArtisans: Artisan[] = [
  {
    id: "AR-101",
    name: "Emeka Nwosu",
    trade: "Electrical",
    area: "Ikeja",
    rating: "New",
    status: "Pending",
    initials: "EN",
  },
  {
    id: "AR-102",
    name: "Aisha Yusuf",
    trade: "Cleaning",
    area: "Yaba",
    rating: "4.9",
    status: "Pending",
    initials: "AY",
  },
  {
    id: "AR-103",
    name: "Chinedu Okafor",
    trade: "Generator",
    area: "Lekki",
    rating: "4.9",
    status: "Approved",
    initials: "CO",
  },
  {
    id: "AR-104",
    name: "Ibrahim Okon",
    trade: "Plumbing",
    area: "Ajah",
    rating: "4.8",
    status: "Approved",
    initials: "IO",
  },
  {
    id: "AR-105",
    name: "Babatunde Ade",
    trade: "AC & HVAC",
    area: "Ikoyi",
    rating: "4.8",
    status: "Approved",
    initials: "BA",
  },
  {
    id: "AR-106",
    name: "Musa Bello",
    trade: "Painting",
    area: "Ikeja",
    rating: "4.7",
    status: "Approved",
    initials: "MB",
  },
];
export const money = (v: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(v);
