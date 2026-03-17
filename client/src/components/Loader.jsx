import React from "react";

function Loader({ size = 28, color = "#1A6795" }) {
  return (
    <div className="flex justify-center py-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-spin"
      >
        <path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/>
        <path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/>
        <path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/>
        <path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>
      </svg>
    </div>
  );
}

export default Loader;