import {
  Wifi,
  ChefHat,
  Snowflake,
  WashingMachine,
  PawPrint,
  Baby,
  Router,
  ParkingCircle,
  Home,
  type LucideIcon,
} from "lucide-react";

export const amenityIcons: Record<string, LucideIcon> = {
  "Free WiFi": Wifi,
  Internet: Router,
  Wireless: Wifi,
  Kitchen: ChefHat,
  "Air conditioning": Snowflake,
  "Washing Machine": WashingMachine,
  "Pets allowed": PawPrint,
  "Suitable for children": Baby,
  "Street parking": ParkingCircle,
};

export function amenityIcon(label: string): LucideIcon {
  return amenityIcons[label] ?? Home;
}
