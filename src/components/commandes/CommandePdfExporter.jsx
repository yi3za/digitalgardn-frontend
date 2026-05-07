import React from "react";
import { jsPDF } from "jspdf";
import { Printer } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { APP_NAME } from "@/lib/config";
import { Button } from "../ui";

/**
 * Composant pour exporter une commande au format PDF
 */
export function CommandePdfExporter({ t, commande }) {
  // Fonction pour generer et telecharger le PDF de la commande
  const handlePrint = (e) => {
    e.stopPropagation();
    const doc = new jsPDF();
    const forestGreen = [6, 78, 59];
    doc.setTextColor(...forestGreen);
    doc.setFontSize(22);
    doc.text(`${t("commandes:invoice.title_pdf")} - ${APP_NAME}`, 20, 20);
    doc.setDrawColor(...forestGreen);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`${t("commandes:invoice.order_id")}: #${commande.id}`, 20, 40);
    doc.text(
      `${t("commandes:invoice.service_name")}: ${commande.service.titre}`,
      20,
      50,
    );
    doc.text(
      `${t("commandes:invoice.client_name")}: ${commande.client.name}`,
      20,
      60,
    );
    doc.text(`${t("commandes:invoice.amount")}: ${commande.montant} $`, 20, 70);
    doc.text(
      `${t("commandes:invoice.status")}: ${t(`commandes:status.${commande.statut}`)}`,
      20,
      80,
    );
    doc.text(
      `${t("commandes:invoice.date")}: ${formatDateTime(commande.updated_at)}`,
      20,
      90,
    );
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(t("commandes:invoice.footer"), 20, 120);
    doc.save(`${t("commandes:invoice.title_pdf")}_${commande.id}`);
  };

  return (
    <Button onClick={handlePrint} size="sm">
      <Printer />
      {t("commandes:invoice.btn_print")}
    </Button>
  );
}
