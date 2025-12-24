"use client";
import React from "react";

export default function Footer1({ fullWidth = false }) {

  return (
    <footer className="tf-footer">
      <div className={`container${fullWidth ? "-full" : ""}`}>
        <div className="ft-body-inner">
          <p className="nocopy caption text-center">
            <span className="fw-medium">shipazo.</span>© 2025. All right
            reserved - Designed by ThemesFlat
          </p>
        </div>
      </div>
    </footer>
  );
}
