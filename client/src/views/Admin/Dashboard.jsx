import React from "react";
import { useState, useEffect } from "react";
import {
  fetchCountUserEvidence,
  fetchCountByMediaChannel,
  fetchCountsByMediaType,
  fetchCountsByStatus,
  fetchProgressByOrder,
  fetchEvidence,
} from "../../services/EvidenceService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countUserEvidence, setCountUserEvidence] = useState([]);
  const [mediaChannelCounts, setMediaChannelCounts] = useState([]);
  const [mediaTypeCounts, setMediaTypeCounts] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [orderProgress, setOrderProgress] = useState([]);

  useEffect(() => {
    const loadEvidence = async () => {
      try {
        const data = await fetchEvidence();
        setEvidence(data);
      } catch (error) {
        console.error("Error cargando evidencias", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvidence();
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          countUserEvidence,
          mediaChannelCounts,
          mediaTypeCounts,
          statusCounts,
          orderProgress,
        ] = await Promise.all([
          fetchCountUserEvidence(),
          fetchCountByMediaChannel(),
          fetchCountsByMediaType(),
          fetchCountsByStatus(),
          fetchProgressByOrder(),
        ]);

        setCountUserEvidence(countUserEvidence);
        setMediaChannelCounts(mediaChannelCounts);
        setMediaTypeCounts(mediaTypeCounts);
        setStatusCounts(statusCounts);
        setOrderProgress(orderProgress);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      }
    };

    loadDashboardData();
  }, []);

  const statusChartData = {
    labels: statusCounts.map((s) => s.status_name),
    datasets: [
      {
        data: statusCounts.map((s) => s.total),
        backgroundColor: ["#22c55e", "#f91616", "#3b82f6", "#eab308"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
        },
      },
    },
  };
  const getProgressColor = (percentage) => {
    if (percentage < 25) return "bg-red-500";
    if (percentage < 70) return "bg-yellow-400";
    if (percentage < 90) return "bg-green-400";
    return "bg-green-600";
  };

  return (
    <div>
      <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
        {mediaTypeCounts.map((item) => (
          <div
            key={item.media_type_id}
            className="bg-white rounded-lg shadow p-6 text-center"
          >
            <p className="text-sm text-gray-500">{item.type_name}</p>
            <p className="text-3xl font-bold text-blue-600">
              {item.total_evidences}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg mt-4 p-4">
        <div className="mt-4 flex justify-between items-center mb-1">
          <p className="text-xl font-bold">Progreso diario</p>
          <button className="text-sm text-blue-500 hover:text-blue-700 hover:bg-blue-100 hover:rounded-md px-2 py-1">
            Ver todos
          </button>
        </div>
        {orderProgress.map((order) => {
          const progress = Number(order.progress_percentage) || 0;
          const colorClass = getProgressColor(progress);

          return (
            <div key={order.order_id} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Orden #{order.order_id}</span>
                <span className="font-medium">{progress}%</span>
              </div>

              <div className="w-full bg-gray-200 h-3 rounded">
                <div
                  className={`${colorClass} h-3 rounded transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid col-grid grid-cols-2 md:grid-cols-3 gap-4 justify-center items-center mt-4 ">
        <div className="bg-white rounded-lg shadow p-4 min-h-full">
        <h2 className="text-sm font-medium text-gray-600 mb-5">
          Notas por estado
        </h2>
        <Pie data={statusChartData} options={options} />
      </div>
        <div className="bg-white rounded-lg shadow p-4 h-full">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Medios con más evidencias
          </h2>
          <ul className="space-y-3">
            {mediaChannelCounts.map((item) => (
              <li
                key={item.media_channel_id}
                className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2"
              >
                <span className="text-sm text-gray-700 font-medium">
                  {item.channel_name}
                </span>

                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {item.total_evidences}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-4 h-full">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Usuarios más activos
          </h2>

          <ul className="space-y-3">
            {countUserEvidence.map((item) => (
              <li
                key={item.user_id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {item.user_name.charAt(0).toUpperCase()}
                  </div>

                  <span className="text-sm text-gray-700">
                    {item.user_name}
                  </span>
                </div>

                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {item.total_evidences}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
