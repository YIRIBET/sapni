import React from "react";
import { useEffect, useState } from "react";
import { fetchProgressByOrder } from "../services/EvidenceService";
import { getOrdersByMediaType } from "../services/orderService";
import { useNavigate } from "react-router-dom";

const getProgressColor = (percentage) => {
  if (percentage < 25) return "bg-red-500";
  if (percentage < 70) return "bg-yellow-400";
  if (percentage < 90) return "bg-green-400";
  return "bg-green-600";
};

function OrderProgress() {
  const [orderProgress, setOrderProgress] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProgressByOrder();
        setOrderProgress(data);
      } catch (error) {
        console.error("Error cargando progreso", error);
      }
    };
    load();
  }, []);

  const filtered = orderProgress.filter((o) =>
    (o.campaign_name || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded hover:bg-gray-100 text-gray-500"
        >
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
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold">Progreso de órdenes</h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por orden..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-100 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-5">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            Sin órdenes disponibles
          </p>
        )}
        {filtered.map((order) => {
          const realProgress = Number(order.progress_percentage) || 0;
          const progress = Math.min(realProgress, 100);
          const colorClass = getProgressColor(progress);

          return (
            <div key={order.order_id}>
              <div className="flex justify-between text-sm mb-1 items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {order.campaign_name} - {order.channel_name}
                  </span>
                </div>
                <span className="font-medium">
                  {realProgress > 100
                    ? `100% (+${Math.round(realProgress - 100)}%)`
                    : `${realProgress}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded">
                <div
                  className={`${colorClass} h-3 rounded transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              {realProgress > 100 && (
                <p className="text-xs text-red-500 mt-1">
                  Evidencias adicionales detectadas
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderProgress;
