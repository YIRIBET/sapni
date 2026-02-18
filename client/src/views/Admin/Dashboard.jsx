import React from "react";
import Sidebar from "../../components/Sidebar";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const data = {
    labels: ["Neutral", "Reporte", "Negativa", "Positiva"],
    datasets: [
      {
        data: [150, 75, 20, 20],
        backgroundColor: [
          "#3b82f6", // blue
          "#f97316", // orange
          "#ea0808", // yellow
          "#22c55e", // green
        ],
        borderWidth: 0,
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

  return (
    <div className="flex h-screen bg-[#E6EAF3] w-full overflow-scroll">
      Admin Dashboard
      <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white">
        <Sidebar />
      </div>
      <div className="flex-1 p-10 ml-26">
        <h1 className="text-3xl font-bold mb-6">Bienvenido al Dashboard</h1>

        <div className="grid col-grid grid-cols-3 md:grid-cols-4 gap-4 ">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-start items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-monitor-smartphone-icon lucide-monitor-smartphone"
              >
                <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" />
                <path d="M10 19v-3.96 3.15" />
                <path d="M7 19h5" />
                <rect width="6" height="10" x="16" y="12" rx="2" />
              </svg>
              <h2 className="text-xl font-bold ml-2">Digital</h2>
            </div>

            <p className="text-3xl font-bold text-green-600">150</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-start items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-radio-icon lucide-radio"
              >
                <path d="M16.247 7.761a6 6 0 0 1 0 8.478" />
                <path d="M19.075 4.933a10 10 0 0 1 0 14.134" />
                <path d="M4.925 19.067a10 10 0 0 1 0-14.134" />
                <path d="M7.753 16.239a6 6 0 0 1 0-8.478" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              <h2 className="text-xl font-bold ml-2">Radio</h2>
            </div>
            <p className="text-3xl font-bold text-orange-600">75</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-start items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-clapperboard-icon lucide-clapperboard"
              >
                <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />
                <path d="m6.2 5.3 3.1 3.9" />
                <path d="m12.4 3.4 3.1 4" />
                <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
              </svg>
              <h2 className="text-xl font-bold ml-2">TV</h2>
            </div>
            <p className="text-3xl font-bold text-yellow-600">20</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-start items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-scroll-text-icon lucide-scroll-text"
              >
                <path d="M15 12h-5" />
                <path d="M15 8h-5" />
                <path d="M19 17V5a2 2 0 0 0-2-2H4" />
                <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
              </svg>

              <p className="text-m text-gray-500 font-bold ml-2">Periodico</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600 text-center">20</p>
          </div>
        </div>

        <div className="bg-white rounded-lg mt-4 p-4">
          <div className="mt-4 flex justify-between items-center mb-1">
            <p className="text-xl font-bold">Progreso diario</p>
            <button className="text-sm text-blue-500 hover:text-blue-700 hover:bg-blue-100 hover:rounded-md px-2 py-1">
              Ver todos
            </button>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium">Factor 4</p>
              <p className="text-sm text-gray-500 mt-1 ml-2 ">70% completado</p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium">Factor 4</p>
              <p className="text-sm text-gray-500 mt-1 ml-2 ">70% completado</p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid col-grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center mt-4 ">
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-sm font-medium text-gray-600 mb-5">
              Notas por estado
            </h2>

            <Pie data={data} options={options} />
          </div>
          <div className="bg-white rounded-lg shadow p-4 justify-center items-center h-full">
            <h2 className="text-sm font-medium text-gray-600 mb-5">
              lista de medios
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-500">
              <li>Medio 1</li>
              <li>Medio 2</li>
              <li>Medio 3</li>
            </ul>
          </div>
          <div>hola 3</div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
