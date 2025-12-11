interface Menu {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export interface SidebarMenuCategory {
  category: string | null;
  menus: Menu[];
}
