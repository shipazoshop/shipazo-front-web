"use client";

import React, { ReactNode } from "react";

export interface NavMenuItemProps {
  /**
   * Texto del item de navegación
   */
  label: string;

  /**
   * Icono opcional (componente React o elemento SVG)
   */
  icon?: ReactNode;

  /**
   * Clase CSS adicional para el contenedor del item
   */
  className?: string;

  /**
   * Si está activo o no
   */
  isActive?: boolean;

  /**
   * Contenido del dropdown/submenu
   */
  children?: ReactNode;
}

export default function NavMenuItem({
  label,
  icon,
  className = "",
  isActive = false,
  children,
}: NavMenuItemProps) {
  return (
    <li
      className={`nav-item ${isActive ? "active" : ""} ${className} pst-unset`}
    >
      <a href="#" className="item-link link body-md-2 fw-semibold d-flex align-items-center">
        {icon && <span className="nav-item-icon d-flex align-items-center" style={{ marginRight: '0.35rem' }}>{icon}</span>}
        <span>{label}</span>
        {children && <i className="icon icon-arrow-down" style={{ marginLeft: '0.25rem' }} />}
      </a>
      {children && children}
    </li>
  );
}
