import { redirect } from "next/navigation";

export const metadata = {
  title: "Home || SHIPAZO - Multipurpose React Nextjs eCommerce",
  description: "SHIPAZO - Multipurpose React Nextjs eCommerce",
};
export default function Home() {
  // Redirigir al único home soportado (home-5)
  redirect("/home-5");
}

