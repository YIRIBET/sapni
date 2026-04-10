import React, { useState, useEffect } from "react";
import {
  fetchCountUserEvidence,
  fetchCountByMediaChannel,
  fetchCountsByMediaType,
  fetchCountsByStatus,
  fetchProgressByOrder,
  fetchEvidence,
  fetchCountsByMonth,
  fetchCountsByMediaTypePerMonth,
  fetchProgressByMonth,
} from "../../services/EvidenceService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import OrderProgressModal from "../../components/progressOrder";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const COLORS = [
  "#3b82f6", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
];

const getProgressColor = (percentage) => {
  if (percentage < 25) return "bg-red-500";
  if (percentage < 70) return "bg-yellow-400";
  if (percentage < 90) return "bg-green-400";
  return "bg-green-600";
};

const getHighlightedOrders = (orders) => {
  const highlighted = [];
  const used = new Set();

  const anomaly = orders.find((o) => Number(o.progress_percentage) > 100);
  if (anomaly) { highlighted.push({ ...anomaly, _tag: "anomalia" }); used.add(anomaly.order_id); }

  const low = orders.find((o) => !used.has(o.order_id) && Number(o.progress_percentage) < 25);
  if (low) { highlighted.push({ ...low, _tag: "bajo" }); used.add(low.order_id); }

  const mid = orders.find((o) => !used.has(o.order_id) && Number(o.progress_percentage) >= 25 && Number(o.progress_percentage) <= 75);
  if (mid) { highlighted.push({ ...mid, _tag: "medio" }); used.add(mid.order_id); }

  const high = orders.find((o) => !used.has(o.order_id) && Number(o.progress_percentage) > 75 && Number(o.progress_percentage) <= 100);
  if (high) { highlighted.push({ ...high, _tag: "alto" }); used.add(high.order_id); }

  return highlighted;
};
const formatMonth = (ym) => {
  const [year, month] = ym.split("-");
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString("es-MX", { month: "short", year: "numeric" });
};

function Dashboard() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countUserEvidence, setCountUserEvidence] = useState([]);
  const [mediaChannelCounts, setMediaChannelCounts] = useState([]);
  const [mediaTypeCounts, setMediaTypeCounts] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [orderProgress, setOrderProgress] = useState([]);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [monthlyEvidences, setMonthlyEvidences] = useState([]);
  const [monthlyMediaType, setMonthlyMediaType] = useState([]);
  const [monthlyProgress, setMonthlyProgress] = useState([]);

  const navigate = useNavigate();

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
          countUserEvidenceData,
          mediaChannelCountsData,
          mediaTypeCountsData,
          statusCountsData,
          orderProgressData,
          monthlyEvidencesData,
          monthlyMediaTypeData,
          monthlyProgressData,
        ] = await Promise.all([
          fetchCountUserEvidence(),
          fetchCountByMediaChannel(),
          fetchCountsByMediaType(),
          fetchCountsByStatus(),
          fetchProgressByOrder(),
          fetchCountsByMonth(),
          fetchCountsByMediaTypePerMonth(),
          fetchProgressByMonth(),
        ]);
        setCountUserEvidence(countUserEvidenceData);
        setMediaChannelCounts(mediaChannelCountsData);
        setMediaTypeCounts(mediaTypeCountsData);
        setStatusCounts(statusCountsData);
        setOrderProgress(orderProgressData);
        setMonthlyEvidences(monthlyEvidencesData);
        setMonthlyMediaType(monthlyMediaTypeData);
        setMonthlyProgress(monthlyProgressData);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      }
    };
    loadDashboardData();
  }, []);

  const highlightedOrders = getHighlightedOrders(orderProgress);

  const monthlyLabels = [...new Set(monthlyEvidences.map((d) => d.month))].sort();
  const monthlyEvidencesChartData = {
    labels: monthlyLabels.map(formatMonth),
    datasets: [
      {
        label: "Evidencias",
        data: monthlyLabels.map((m) => {
          const found = monthlyEvidences.find((d) => d.month === m);
          return found ? Number(found.total_evidences) : 0;
        }),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };
  const mediaTypeMonthLabels = [...new Set(monthlyMediaType.map((d) => d.month))].sort();
  const mediaTypeNames = [...new Set(monthlyMediaType.map((d) => d.type_name))];
  const mediaTypeMonthChartData = {
    labels: mediaTypeMonthLabels.map(formatMonth),
    datasets: mediaTypeNames.map((type, i) => ({
      label: type,
      data: mediaTypeMonthLabels.map((m) => {
        const found = monthlyMediaType.find((d) => d.month === m && d.type_name === type);
        return found ? Number(found.total_evidences) : 0;
      }),
      backgroundColor: COLORS[i % COLORS.length],
      borderRadius: 6,
    })),
  };
  const progressMonthLabels = [...new Set(monthlyProgress.map((d) => d.month))].sort();
  const progressMonthChartData = {
    labels: progressMonthLabels.map(formatMonth),
    datasets: [
      {
        label: "Progreso promedio (%)",
        data: progressMonthLabels.map((m) => {
          const items = monthlyProgress.filter((d) => d.month === m);
          if (!items.length) return 0;
          const avg = items.reduce((sum, d) => sum + Number(d.progress_percentage), 0) / items.length;
          return Math.round(avg);
        }),
        backgroundColor: "#22c55e",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = (titleText) => ({
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12 } },
      title: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
      x: { grid: { display: false } },
    },
  });

  const statusChartData = {
    labels: statusCounts.map((s) => s.status_name),
    datasets: [
      {
        data: statusCounts.map((s) => s.total),
        backgroundColor: ["#22c55e", "#f91616", "#3b82f6", "#eab308"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12 } },
    },
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {mediaTypeCounts.map((item) => (
          <div key={item.media_type_id} className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-sm text-gray-500">{item.type_name}</p>
            <p className="text-3xl font-bold text-blue-600">{item.total_evidences}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg mt-4 p-4">
        <div className="mt-4 flex justify-between items-center mb-3">
          <p className="text-xl font-bold">Progreso diario</p>
          <button
            onClick={() => navigate("/order-progress")}
            className="text-sm text-blue-500 hover:text-blue-700 hover:bg-blue-100 hover:rounded-md px-2 py-1"
          >
            Ver todos 
          </button>
        </div>

        {highlightedOrders.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Sin órdenes disponibles</p>
        )}

        {highlightedOrders.map((order) => {
          const realProgress = Number(order.progress_percentage) || 0;
          const progress = Math.min(realProgress, 100);
          const colorClass = getProgressColor(progress);
          return (
            <div key={order.order_id} className="mb-4">
              <div className="flex justify-between text-sm mb-1 items-center">
                <span className="font-medium">{order.campaign_name} - {order.channel_name}</span>
                <span className="font-medium">
                  {realProgress > 100 ? `100% (+${Math.round(realProgress - 100)}%)` : `${realProgress}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded">
                <div className={`${colorClass} h-3 rounded transition-all duration-500`} style={{ width: `${progress}%` }} />
              </div>
              {realProgress > 100 && (
                <p className="text-xs text-red-500 mt-1">Evidencias adicionales detectadas</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Evidencias registradas por mes</h2>
          {monthlyEvidences.length > 0
            ? <Bar data={monthlyEvidencesChartData} options={barOptions()} />
            : <p className="text-sm text-gray-400 text-center py-8">Sin datos disponibles</p>
          }
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Evidencias por tipo de medio por mes</h2>
          {monthlyMediaType.length > 0
            ? <Bar data={mediaTypeMonthChartData} options={{ ...barOptions(), plugins: { ...barOptions().plugins, legend: { position: "bottom", labels: { boxWidth: 12 } } } }} />
            : <p className="text-sm text-gray-400 text-center py-8">Sin datos disponibles</p>
          }
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Progreso promedio de órdenes por mes (%)</h2>
          {monthlyProgress.length > 0
            ? <Bar data={progressMonthChartData} options={barOptions()} />
            : <p className="text-sm text-gray-400 text-center py-8">Sin datos disponibles</p>
          }
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        <div className="bg-white rounded-lg shadow p-4 min-h-full">
          <h2 className="text-sm font-medium text-gray-600 mb-5">Notas por estado</h2>
          <Pie data={statusChartData} options={pieOptions} />
        </div>
        <div className="bg-white rounded-lg shadow p-4 h-full">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Medios con más evidencias</h2>
          <ul className="space-y-3">
            {mediaChannelCounts.map((item) => (
              <li key={item.media_channel_id} className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                <span className="text-sm text-gray-700 font-medium">{item.channel_name}</span>
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{item.total_evidences}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-4 h-full">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Usuarios más activos</h2>
          <ul className="space-y-3">
            {countUserEvidence.map((item) => (
              <li key={item.user_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {item.user_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{item.user_name}</span>
                </div>
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">{item.total_evidences}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showAllOrders && (
        <OrderProgressModal orders={orderProgress} onClose={() => setShowAllOrders(false)} />
      )}
    </div>
  );
}

export default Dashboard;