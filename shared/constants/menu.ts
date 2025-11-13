export const demoItems = [
  {
    id: 5,
    href: "/home-5",
    active: true,
    imageSrc: "/images/demo/home-5.jpg",
    labels: [{ text: "New", className: "demo-new" }, { text: "Trend" }],
    name: "Home 5",
  },
];
export const shopPages = [
  {
    id: 1,
    heading: "SHOP LAYOUT",
    items: [
      { id: 1, href: "/shop-default", text: "Shop Default" },
      { id: 2, href: "/shop-right-sidebar", text: "Shop Right Sidebar" },
      { id: 3, href: "/shop-fullwidth", text: "Shop Full Width" },
      { id: 4, href: "/shop-cart", text: "Shop Cart" },
    ],
  },
  {
    id: 2,
    heading: "WOO PAGE",
    items: [
      // { id: 1, href: "/compare", text: "Compare" },
      // { id: 2, href: "/wishlist", text: "Wishlist" },
      { id: 3, href: "/checkout", text: "Check Out" },
      { id: 4, href: "/order-details", text: "Order Detail" },
      { id: 5, href: "/track-your-order", text: "Track Your Order" },
      { id: 6, href: "/my-account", text: "My Account" },
      { id: 7, href: "/analytics", text: "Analytics" },
    ],
  },
];

export const shopDetailsPages = [
  {
    id: 1,
    heading: "PRODUCT LAYOUTS",
    items: [
      { id: 1, href: "/product-detail/1", text: "Product Detail" },
    ],
  },
  // Se removieron otras variantes de detalle
];

export const blogMenuItems: Array<{ id: number; href: string; text: string }> = [];

export const othersPages: Array<{ id: number; href: string; text: string }> = [];
