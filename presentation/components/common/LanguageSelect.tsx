"use client";

import { useEffect, useRef, useState } from "react";

type LanguageOption = {
  id: string;
  label: string;
};

type LanguageSelectProps = {
  parentClassName?: string;
  topStart?: boolean;
  light?: boolean;
};

const languageOptions: LanguageOption[] = [
  { id: "en", label: "English" },
  { id: "vi", label: "Vietnam" },
];

export default function LanguageSelect({
  parentClassName = "image-select center style-default type-languages",
  topStart = false,
  light = false,
}: LanguageSelectProps) {
  const [selected, setSelected] = useState<LanguageOption>(languageOptions[0]);
  const [isDDOpen, setIsDDOpen] = useState(false);
  const languageSelect = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageSelect.current &&
        !languageSelect.current.contains(event.target as Node)
      ) {
        setIsDDOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`dropdown bootstrap-select ${parentClassName}  dropup `}
      onClick={() => setIsDDOpen((previous) => !previous)}
      ref={languageSelect}
    >
      <select
        className="image-select center style-default type-languages"
        tabIndex={-1}
        value={selected.id}
        onChange={() => {}}
      >
        {languageOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        tabIndex={-1}
        className={`btn dropdown-toggle btn-light  ${
          isDDOpen ? "show" : ""
        }  ${light ? "text-white" : ""} `}
      >
        <div className="filter-option">
          <div className="filter-option-inner">
            <div className="filter-option-inner-inner">{selected.label}</div>
          </div>
        </div>
      </button>
      <div
        className={`dropdown-menu ${isDDOpen ? "show" : ""} `}
        style={{
          maxHeight: "899.688px",
          overflow: "hidden",
          minHeight: 0,
          position: "absolute",
          inset: topStart ? "" : "auto auto 12px 12px",
          margin: 0,
          top: topStart ? "12px" : "",
          transform: `translate(0px, ${topStart ? 22 : -20}px)`,
        }}
        data-popper-placement={`${!topStart ? "top" : "bottom"}-start`}
      >
        <div
          className="inner show"
          style={{ maxHeight: "869.688px", overflowY: "auto", minHeight: 0 }}
        >
          <ul
            className="dropdown-menu inner show"
            role="presentation"
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            {languageOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => setSelected(option)}
                className={`selected ${selected.id === option.id ? "active" : ""}`}
              >
                <a
                  className={`dropdown-item ${
                    selected.id === option.id ? "active selected" : ""
                  }`}
                >
                  <span className="text">{option.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
