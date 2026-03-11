import React from "react";
import { useState, useEffect } from "react";
import { fetchEvidence } from "../../services/EvidenceService";
import EvidenceDetailModal from "../../components/EvidenceDetailModal";
import { formatUTCDate } from "../../utils/date";
import { getOrderById } from "../../services/orderService";
import ExportPDFButton from "../../components/ExportPDFButton";
import FilterDropdown from "../../components/FilterDropdown";

function Evidences() {
  const [evidences, setEvidences] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [filtroMedio, setFiltroMedio] = useState("Todos");
  const [filtroAnomalia, setFiltroAnomalia] = useState("Todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("reciente");

  useEffect(() => {
    const loadEvidence = async () => {
      try {
        const data = await fetchEvidence();
        setEvidences(data);
      } catch (error) {
        console.error("Error cargando evidencias", error);
      } finally {
        setLoading(false);
      }
    };
    loadEvidence();
  }, []);

  useEffect(() => {
    if (isModalOpen && selectedEvidence?.order_id) {
      getOrderById(selectedEvidence.order_id)
        .then(setOrder)
        .catch(console.error);
    }
  }, [isModalOpen, selectedEvidence]);

  const openModal = (evidence) => {
    setSelectedEvidence(evidence);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedEvidence(null);
    setIsModalOpen(false);
  };

  const mediosDisponibles = [
    "Todos",
    ...new Set(evidences.map((e) => e.channel_name).filter(Boolean)),
  ];

  const anomaliaOpciones = ["Todos", "Anomalía", "Normal"];
  const ordenOpciones = ["Más reciente", "Más antiguo"];

  const filteredEvidences = evidences
    .filter((evidence) => {
      const matchSearch =
        `${evidence.nombre || ""} ${evidence.apellidos || ""} ${evidence.email || ""} ${evidence.channel_name || ""} ${evidence.user_name || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchMedio =
        filtroMedio === "Todos" || evidence.channel_name === filtroMedio;
      const matchAnomalia =
        filtroAnomalia === "Todos" ||
        (filtroAnomalia === "Anomalía" && evidence.has_anomaly) ||
        (filtroAnomalia === "Normal" && !evidence.has_anomaly);
      return matchSearch && matchMedio && matchAnomalia;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return ordenFecha === "Más reciente" ? dateB - dateA : dateA - dateB;
    });

  const hayFiltrosActivos =
    filtroMedio !== "Todos" ||
    filtroAnomalia !== "Todos" ||
    fechaDesde ||
    fechaHasta ||
    search;

  const limpiarFiltros = () => {
    setFiltroMedio("Todos");
    setFiltroAnomalia("Todos");
    setFechaDesde("");
    setFechaHasta("");
    setSearch("");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Evidencias</h1>
      <div className="flex justify-end items-center mb-4 mr-4">
        <ExportPDFButton
          title="Reporte de Evidencias"
          filename="evidencias.pdf"
          columns={[
            { label: "Orden", key: "_orden" },
            { label: "Medio", key: "channel_name" },
            { label: "Usuario", key: "user_name" },
            { label: "Fecha", key: "_fecha" },
            { label: "Observaciones", key: "_anomalia" },
          ]}
          rows={filteredEvidences.map((e) => ({
            ...e,
            _orden: `#${e.order_id}`,
            channel_name: e.channel_name || "—",
            _fecha: formatUTCDate(e.created_at),
            _anomalia: e.has_anomaly ? "Anomalía" : "Normal",
          }))}
          filters={{
            Medio: filtroMedio,
            Observaciones: filtroAnomalia,
            Desde: fechaDesde || null,
            Hasta: fechaHasta || null,
            Búsqueda: search,
          }}
        />
      </div>

      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-3 mb-4 lg:justify-between lg:items-center">
          <div className="relative w-full lg:w-1/3">
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
              placeholder="Buscar evidencias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
            <FilterDropdown
              label="Fecha"
              options={ordenOpciones}
              value={ordenFecha}
              onChange={setOrdenFecha}
            />

            <FilterDropdown
              label="Medio"
              options={mediosDisponibles}
              value={filtroMedio}
              onChange={setFiltroMedio}
            />
            <FilterDropdown
              label="Observaciones"
              options={anomaliaOpciones}
              value={filtroAnomalia}
              onChange={setFiltroAnomalia}
            />

            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="py-2 px-4">Orden</th>
                <th className="py-2 px-4">Medio</th>
                <th className="py-2 px-4">Usuario</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Observaciones</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvidences.map((evidence) => (
                <tr
                  key={evidence.id}
                  className="border-t border-gray-300 text-sm"
                >
                  <td className="py-2 px-4">#{evidence.order_id}</td>
                  <td className="py-2 px-4">{evidence.channel_name || "—"}</td>
                  <td className="py-2 px-4">{evidence.user_name}</td>
                  <td className="py-2 px-4">
                    <div className="text-gray-800 font-medium">
                      {formatUTCDate(evidence.created_at)}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {evidence.has_anomaly ? (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                          <path d="M12 8v4" />
                          <path d="M12 16h.01" />
                        </svg>
                        Anomalía
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => openModal(evidence)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      ⋯
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EvidenceDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        evidence={selectedEvidence}
        order={order}
      />
    </div>
  );
}

export default Evidences;
