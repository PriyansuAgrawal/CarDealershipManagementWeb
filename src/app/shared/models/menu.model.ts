export interface MenuItem {
  menuId: number;
  name: string;
  path: string;
  icon: string;
  parentId?: number;
  sortOrder: number;
  children: MenuItem[];
}
