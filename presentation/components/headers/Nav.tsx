"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavMenuItem from "./NavMenuItem";
import WishlistDropdown from "./WishlistDropdown";

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
              width={300}
              height={100}
            />
          </Link>
        </div>
      </div>
      <NavMenuItem
        label="Wishlist"
        icon={
          <i className="icon-hearth" style={{ fontSize: '18px' }} />
        }
        isActive={pathname === "/wishlist"}
      >
        <WishlistDropdown />
      </NavMenuItem>
    </>
  );
}

