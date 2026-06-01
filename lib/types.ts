// ──────────────────────────────────────────────────────────────────────────────
// Serva — Core TypeScript Types
// ──────────────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "restaurant_owner" | "staff" | "client";

export type PlanTier = "starter" | "pro" | "enterprise";

// ── Restaurant ────────────────────────────────────────────────────────────────

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  address: string | null;
  city: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  currency: string;
  plan: PlanTier;
  is_active: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// ── Table ─────────────────────────────────────────────────────────────────────

export type TableStatus = "available" | "occupied" | "reserved" | "closed";

export interface Table {
  id: string;
  restaurant_id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  qr_code_url: string | null;
  position_x: number | null;
  position_y: number | null;
  created_at: string;
  updated_at: string;
}

// ── Category ──────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Menu Item ─────────────────────────────────────────────────────────────────

export interface MenuItemOption {
  id: string;
  name: string;
  price_modifier: number;
}

export interface MenuItemOptionGroup {
  id: string;
  name: string;
  required: boolean;
  max_selections: number;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  allergens: string[];
  option_groups: MenuItemOptionGroup[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ── Order ─────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type PaymentMethod = "cash" | "card" | "online";

export interface OrderItemOption {
  option_group_id: string;
  option_group_name: string;
  option_id: string;
  option_name: string;
  price_modifier: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  options: OrderItemOption[];
  notes: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  table_id: string | null;
  table_name: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  customer_name: string | null;
  customer_notes: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// ── Cart (client-side only) ───────────────────────────────────────────────────

export interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  options: OrderItemOption[];
  notes: string | null;
}

export interface Cart {
  restaurant_id: string;
  table_id: string;
  items: CartItem[];
}

// ── Supabase Database Types ───────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: Restaurant;
        Insert: Omit<Restaurant, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Restaurant, "id" | "created_at">>;
      };
      tables: {
        Row: Table;
        Insert: Omit<Table, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Table, "id" | "created_at">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Category, "id" | "created_at">>;
      };
      menu_items: {
        Row: MenuItem;
        Insert: Omit<MenuItem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MenuItem, "id" | "created_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at" | "items">;
        Update: Partial<Omit<Order, "id" | "created_at" | "items">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id" | "created_at">;
        Update: Partial<Omit<OrderItem, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      plan_tier: PlanTier;
      table_status: TableStatus;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      payment_method: PaymentMethod;
    };
  };
}
