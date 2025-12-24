"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavMenuItem from "./NavMenuItem";
import WishlistDropdown from "./WishlistDropdown";
import { Heart } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();

  return (
    <>
      <div className="col-xl-2 col-md-3 col-7 d-flex align-items-center">
        <div className="logo-site">
          <Link href={`/`}>
            <Image
              alt="Logo"
              src="/images/logo/horizontal-shipazo.webp"
              style={{
                aspectRatio: "185 / 41"
              }}
              width={145}
              height={41}
            />
          </Link>
        </div>
      </div>
      <NavMenuItem
        label="Wishlist"
        icon={
          <Heart width={20} height={20} />
        }
        isActive={pathname === "/wishlist"}
      >
        <WishlistDropdown />
      </NavMenuItem>
    </>
  );
}

