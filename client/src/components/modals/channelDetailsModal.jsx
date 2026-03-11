import React from "react";

function ChannelDetailModal({ channel, onClose }) {
  if (!channel) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {channel.channel_name}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1">
              Tipo
            </p>
            <p className="text-sm text-gray-700">{channel.type_name || "—"}</p>
          </div>

          <div className=" rounded-lg p-3">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1">
              Razón Social
            </p>
            <p className="text-sm text-gray-700">
              {channel.razon_social || "—"}
            </p>
          </div>

          {channel.type_name === "Radio" && (
            <div className=" rounded-lg p-3">
              <p className="text-xs font-semibold  uppercase tracking-wide mb-1">
                Frecuencia
              </p>
              <p className="text-sm text-gray-700">
                {channel.frequency || "—"}
              </p>
            </div>
          )}

          {channel.type_name === "Redes Sociales" && (
            <div className=" rounded-lg p-3">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1">
                Red Social
              </p>
              {channel.social_network ? (
                <a
                  href={channel.social_network}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#1A6795] hover:underline break-all"
                >
                  {channel.social_network}
                </a>
              ) : (
                <p className="text-sm text-gray-700">—</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ChannelDetailModal;