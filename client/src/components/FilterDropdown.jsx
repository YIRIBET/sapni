import React from "react";
import { useRef, useEffect, useState } from "react";

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors ${
          value !== "Todos"
            ? "bg-gray-200 border-gray-400"
            : "bg-white text-gray-600 border-gray-300 hover:border-[#1A6795] hover:text-[#1A6795]"
        }`}
      >
        {label}: <span className="font-medium">{value}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1">
          {options.map((option) => (
            <li key={option}>
              <button
                onClick={() => { onChange(option); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-[#1A6795] transition-colors flex items-center justify-between ${
                  value === option ? "text-[#1A6795] font-medium bg-blue-50" : "text-gray-700"
                }`}
              >
                {option}
                {value === option && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default FilterDropdown;