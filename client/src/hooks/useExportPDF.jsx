import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logoIncognita.png";

export function useExportPDF() {
  const exportToPDF = ({ title, columns, rows, filename = "reporte.pdf", filters = {} }) => {
    const doc = new jsPDF();

    doc.setFillColor(210, 228, 240);
    doc.rect(0, 0, 210, 28, "F");
    doc.addImage(logo, "PNG", 8, 6, 35, 16);
    doc.setTextColor(26, 103, 149);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, 70, 17);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generado: ${new Date().toLocaleDateString("es-MX", { dateStyle: "long" })}`,
      140,
      14
    );

    const activeFilters = Object.entries(filters)
      .filter(([_, v]) => v && v !== "Todos")
      .map(([k, v]) => `${k}: ${v}`)
      .join("  |  ");

    doc.setTextColor(100);
    doc.setFontSize(9);
    const filterText = `Total: ${rows.length} registro(s)${activeFilters ? "  |  " + activeFilters : ""}`;
    doc.text(filterText, 14, 36);

    autoTable(doc, {
      startY: 41,
      head: [columns.map((c) => c.label)],
      body: rows.map((row) => columns.map((c) => row[c.key] ?? "—")),
      headStyles: {
        fillColor: [26, 103, 149],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
      },
      alternateRowStyles: { fillColor: [240, 247, 252] },
      styles: { fontSize: 9, cellPadding: 4 },
    });

    doc.save(filename);
  };

  return { exportToPDF };
}