/**
 * generateCertificate.js — Professional Certificate PDF Generator
 * ─────────────────────────────────────────────
 * Generates a beautiful, professional PDF certificate
 * using Canvas API + jsPDF. No hidden DOM elements needed.
 */
import { jsPDF } from "jspdf";

/**
 * Internal: builds the PDF and returns the jsPDF instance
 */
function _buildPdf({
  studentName = "Student",
  quizTitle = "Quiz",
  score = "80%",
  grade = "A",
  date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
  certificateId = "",
}) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297;
  const H = 210;

  // ─── Background ───
  pdf.setFillColor(252, 250, 245);
  pdf.rect(0, 0, W, H, "F");

  // Decorative border — outer
  pdf.setDrawColor(75, 65, 150);
  pdf.setLineWidth(2.5);
  pdf.rect(8, 8, W - 16, H - 16);

  // Decorative border — inner
  pdf.setDrawColor(140, 120, 200);
  pdf.setLineWidth(0.7);
  pdf.rect(12, 12, W - 24, H - 24);

  // ─── Corner ornaments ───
  const cornerSize = 18;
  const inset = 12;
  pdf.setDrawColor(75, 65, 150);
  pdf.setLineWidth(1.2);
  pdf.line(inset, inset + cornerSize, inset, inset);
  pdf.line(inset, inset, inset + cornerSize, inset);
  pdf.line(W - inset - cornerSize, inset, W - inset, inset);
  pdf.line(W - inset, inset, W - inset, inset + cornerSize);
  pdf.line(inset, H - inset - cornerSize, inset, H - inset);
  pdf.line(inset, H - inset, inset + cornerSize, H - inset);
  pdf.line(W - inset - cornerSize, H - inset, W - inset, H - inset);
  pdf.line(W - inset, H - inset - cornerSize, W - inset, H - inset);

  // ─── Top decorative band ───
  pdf.setFillColor(75, 65, 150);
  pdf.rect(30, 18, W - 60, 3, "F");
  pdf.setFillColor(218, 165, 32);
  pdf.rect(W / 2 - 25, 22, 50, 1.2, "F");

  // ─── Medal ───
  const medalX = W / 2;
  const medalY = 38;
  pdf.setFillColor(218, 165, 32);
  pdf.circle(medalX, medalY, 10, "F");
  pdf.setFillColor(252, 250, 245);
  pdf.circle(medalX, medalY, 7.5, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(218, 165, 32);
  pdf.text("\u2605", medalX, medalY + 1.5, { align: "center" });

  // ─── Headings ───
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(36);
  pdf.setTextColor(75, 65, 150);
  pdf.text("CERTIFICATE", W / 2, 62, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(140, 120, 200);
  pdf.text("O F   A C H I E V E M E N T", W / 2, 71, { align: "center" });

  pdf.setDrawColor(218, 165, 32);
  pdf.setLineWidth(0.5);
  pdf.line(W / 2 - 50, 75, W / 2 + 50, 75);

  // ─── Presented to ───
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(11);
  pdf.setTextColor(120, 120, 120);
  pdf.text("This certificate is proudly presented to", W / 2, 85, { align: "center" });

  // ─── Student Name ───
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(40, 40, 60);
  pdf.text(studentName, W / 2, 100, { align: "center" });

  const nameWidth = pdf.getTextWidth(studentName);
  pdf.setDrawColor(218, 165, 32);
  pdf.setLineWidth(0.8);
  pdf.line(W / 2 - nameWidth / 2 - 5, 103, W / 2 + nameWidth / 2 + 5, 103);

  // ─── Achievement text ───
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(100, 100, 110);
  pdf.text("for successfully completing the quiz", W / 2, 113, { align: "center" });

  // ─── Quiz Title ───
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(75, 65, 150);
  pdf.text(`"${quizTitle}"`, W / 2, 124, { align: "center" });

  // ─── Score & Grade ───
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 110);
  pdf.text("with a score of  ", W / 2 - 15, 135, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(218, 165, 32);
  pdf.text(`${score}  (Grade: ${grade})`, W / 2 + 22, 135, { align: "center" });

  // ─── Bottom band ───
  pdf.setFillColor(75, 65, 150);
  pdf.rect(30, H - 21, W - 60, 3, "F");
  pdf.setFillColor(218, 165, 32);
  pdf.rect(W / 2 - 25, H - 22.5, 50, 1.2, "F");

  // ─── Signatures ───
  const sigY = 160;

  pdf.setDrawColor(100, 100, 110);
  pdf.setLineWidth(0.3);
  pdf.line(45, sigY, 105, sigY);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 110);
  pdf.text("Date of Completion", 75, sigY + 6, { align: "center" });
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(40, 40, 60);
  pdf.text(date, 75, sigY - 3, { align: "center" });

  // Center seal
  pdf.setFillColor(75, 65, 150);
  pdf.circle(W / 2, sigY - 5, 12, "F");
  pdf.setFillColor(252, 250, 245);
  pdf.circle(W / 2, sigY - 5, 9.5, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(75, 65, 150);
  pdf.text("QUIZ", W / 2, sigY - 7, { align: "center" });
  pdf.text("MASTER", W / 2, sigY - 2.5, { align: "center" });

  // Right signature
  pdf.setDrawColor(100, 100, 110);
  pdf.setLineWidth(0.3);
  pdf.line(W - 105, sigY, W - 45, sigY);
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(12);
  pdf.setTextColor(40, 40, 60);
  pdf.text("QuizMaster", W - 75, sigY - 3, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 110);
  pdf.text("Authorized Signature", W - 75, sigY + 6, { align: "center" });

  // ─── Certificate ID ───
  if (certificateId) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(170, 170, 180);
    pdf.text(`Certificate ID: ${certificateId}`, W / 2, H - 12, { align: "center" });
  }

  // ─── Platform credit ───
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(170, 170, 180);
  pdf.text("Issued by QuizMaster \u2014 Online Quiz Platform", W / 2, H - 8, { align: "center" });

  return pdf;
}

/**
 * Generate & download a professional certificate PDF
 */
export async function generateCertificate(opts) {
  const pdf = _buildPdf(opts);
  const fileName = `Certificate_${(opts.quizTitle || "Quiz").replace(/\s+/g, "_")}_${(opts.studentName || "Student").replace(/\s+/g, "_")}.pdf`;
  pdf.save(fileName);
}

/**
 * Get certificate blob URL for inline preview (no download, no new tab)
 */
export function getCertificateBlobUrl(opts) {
  const pdf = _buildPdf(opts);
  return pdf.output("bloburl");
}
