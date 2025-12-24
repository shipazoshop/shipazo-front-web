"use client";

import { create } from "zustand";
import type { OrderDetail } from "@/domain/entities/order.entity";

interface NewOrderState {
  order: OrderDetail | null;
  setOrder: (order: OrderDetail | null) => void;
  clearOrder: () => void;
}

export const useNewOrderStore = create<NewOrderState>((set) => ({
  order: null,
  setOrder: (order) => set({ order }),
  clearOrder: () => set({ order: null }),
}));
