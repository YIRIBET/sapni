import { useEffect, useState } from "react";
import React from "react";
import { formatDate, formatUTCDate } from "../utils/date";
import { getOrderById } from "../services/orderService";

const EvidenceDetailModal = ({ isOpen, onClose, evidence }) => {
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    if (isOpen && evidence?.order_id) {
      setLoadingOrder(true);
      getOrderById(evidence.order_id)
        .then((res) => setOrder(res.data))
        .catch(console.error)
        .finally(() => setLoadingOrder(false));
    }
  }, [isOpen, evidence]);

  if (!isOpen || !evidence) return null;

  const Item = ({ label, value }) => (
    <div className="space-y-0.5">
      <p className="text-[11px] text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
    </div>
  );

  const isRadioOrTv = ["Radio", "Televisión"].includes(evidence.type_name);

  const isDigitalOrWebsite = [
    "Digital",
    "Website",
    "Redes Sociales",
    "Periódico",
  ].includes(evidence.type_name);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
     <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">
              Evidencia #{evidence.id}
            </h2>

            {evidence.has_anomaly === 1 && (
              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                Anomalía
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <Item label="Orden" value={`#${evidence.order_id}`} />
        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          {loadingOrder ? (
            <p className="text-xs text-gray-400">Cargando orden…</p>
          ) : order ? (
            <div className="grid grid-cols-2 gap-4">
              <Item label="Spots ordenados" value={order.total_spots_ordered} />
              <Item label="Campaña" value={order.campaign_name} />
              <Item label="Contrato" value={order.contract_amount} />
              <Item label="Medio contratado" value={order.channel_name} />
            </div>
          ) : (
            <p className="text-xs text-gray-400">Orden no disponible</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <Item label="Usuario" value={evidence.user_name} />
          <Item label="Medio" value={evidence.channel_name} />
          <Item label="Tipo de medio" value={evidence.type_name} />
          <Item label="Formato" value={evidence.format_name} />
          <Item label="Estatus" value={evidence.status_name} />

          {isDigitalOrWebsite && (
            <>
              <Item
                label="Título de la publicación"
                value={evidence.publication_title}
              />
              <Item
                label="Link"
                value={
                  evidence.link ? (
                    <a
                      href={evidence.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver publicación
                    </a>
                  ) : null
                }
              />
            </>
          )}

          {isRadioOrTv && (
            <Item label="Nombre del programa" value={evidence.program_name} />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Item
            label="Fecha registrada"
            value={formatDate(evidence.evidence_date)}
          />
          <Item label="Hora registrada" value={evidence.evidence_time} />
          <Item
            label="Registro del sistema"
            value={formatUTCDate(evidence.created_at)}
          />
        </div>

        {evidence.has_anomaly === 1 && evidence.anomalies?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">
              Anomalías detectadas
            </p>

            <div className="space-y-2">
              {evidence.anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="bg-red-50 border border-red-100 rounded-md p-2 text-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-red-700">
                      {anomaly.description}
                    </span>
                  </div>

                  <p className="text-gray-600 text-xs mt-1">
                    {anomaly.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-400 mb-1">Notas internas</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-2">
            {evidence.internal_notes || "Sin notas"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EvidenceDetailModal;