/**
 * HardwareQuest - PDF Certificate Generator
 * Generates official A4 Landscape certificate and handles printing
 */

class CertificateManager {
  constructor() {
    this.isGenerating = false;
  }

  sanitizeFilename(str) {
    if (!str) return "Учень";
    return str.trim().replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "_");
  }

  generateCertificateId() {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    return `HQ-${year}-${randomHex}`;
  }

  getFormattedDate() {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('uk-UA', options);
  }

  renderCertificateData(studentData, gradeData) {
    const certElement = document.getElementById("certificateToExport");
    if (!certElement) return;

    // Student Full Name
    const nameEl = document.getElementById("certStudentName");
    const idEl = document.getElementById("certVerificationId");
    const dateEl = document.getElementById("certIssueDate");

    if (nameEl) nameEl.textContent = studentData.fullName || "Шевченко Дарина";
    
    // Unique ID & Date
    if (!studentData.certId) {
      studentData.certId = this.generateCertificateId();
    }
    if (idEl) idEl.textContent = studentData.certId;
    if (dateEl) dateEl.textContent = this.getFormattedDate();

    // Scores & Grades (100 pts max)
    const gradeNumEl = document.getElementById("certGradeNumber");
    const gradeLevelEl = document.getElementById("certGradeLevel");
    const pointsEl = document.getElementById("certPointsEarned");
    const percentEl = document.getElementById("certPercentValue");
    const gradeBadge = document.getElementById("certGradeBadge");

    if (gradeNumEl) gradeNumEl.textContent = gradeData.grade;
    if (gradeLevelEl) gradeLevelEl.textContent = gradeData.level;
    if (pointsEl) pointsEl.textContent = `${gradeData.pointsEarned} / 100`;
    if (percentEl) percentEl.textContent = `${gradeData.percentage}%`;

    if (gradeBadge && gradeData.color) {
      gradeBadge.style.background = `linear-gradient(135deg, ${gradeData.color}, #0f172a)`;
    }
  }

  async downloadCertificatePDF(studentData, gradeData) {
    if (this.isGenerating) return;
    this.isGenerating = true;

    const downloadBtn = document.getElementById("btnDownloadPDF");
    const originalBtnText = downloadBtn ? downloadBtn.innerHTML : "";

    if (downloadBtn) {
      downloadBtn.disabled = true;
      downloadBtn.innerHTML = `
        <svg class="animate-spin" style="width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2 A 10 10 0 0 1 22 12"/>
        </svg>
        Формування PDF...
      `;
    }

    const certElement = document.getElementById("certificateToExport");
    if (!certElement) {
      alert("Помилка: не знайдено шаблон сертифіката для експорту.");
      this.resetButton(downloadBtn, originalBtnText);
      return;
    }

    // Adapt font-size for long student names
    const nameEl = document.getElementById("certStudentName");
    if (nameEl && studentData.fullName) {
      nameEl.style.fontSize = studentData.fullName.length > 25 ? "26px" : "34px";
    }

    const fullNameParts = (studentData.fullName || "Учень").trim().split(/\s+/);
    const surname = fullNameParts[0] || "Учень";
    const firstName = fullNameParts[1] || "";
    const namePart = firstName ? `${surname}_${firstName}` : surname;
    const filename = `Сертифікат_${this.sanitizeFilename(namePart)}.pdf`;

    try {
      if (typeof window.html2canvas !== "undefined" && typeof window.jsPDF !== "undefined") {
        // Clone certificate into an isolated container positioned at (0, 0)
        // This eliminates any vertical window scroll offset or parent layout shift
        const clone = certElement.cloneNode(true);
        const holder = document.createElement("div");
        holder.style.position = "fixed";
        holder.style.top = "0px";
        holder.style.left = "0px";
        holder.style.width = "1000px";
        holder.style.height = "700px";
        holder.style.zIndex = "999999";
        holder.style.overflow = "hidden";
        holder.style.backgroundColor = "#ffffff";
        holder.appendChild(clone);
        document.body.appendChild(holder);

        let canvas;
        try {
          canvas = await window.html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: 1000,
            height: 700,
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0
          });
        } finally {
          document.body.removeChild(holder);
        }

        // Initialize standard A4 Landscape PDF (297mm x 210mm)
        const pdf = new window.jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
          compress: true
        });

        const pageWidth = 297;
        const pageHeight = 210;

        // Container aspect ratio: 1000 / 700 = 1.42857
        const canvasRatio = canvas.width / canvas.height;

        // Perfectly proportioned centered frame:
        // Width: 280 mm (leaves 8.5 mm margin left and right)
        // Height: 196 mm (leaves 7.0 mm margin top and bottom)
        const maxW = 280;
        const maxH = 196;

        let imgW = maxW;
        let imgH = imgW / canvasRatio;

        if (imgH > maxH) {
          imgH = maxH;
          imgW = imgH * canvasRatio;
        }

        // Exact horizontal and vertical centering
        const posX = (pageWidth - imgW) / 2;
        const posY = (pageHeight - imgH) / 2;

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', posX, posY, imgW, imgH, undefined, 'FAST');

        // Trigger direct browser file save
        pdf.save(filename);
      } else if (typeof html2pdf !== "undefined") {
        // Fallback with exact centered margins
        const opt = {
          margin: [7, 8.5, 7, 8.5],
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'landscape',
            compress: true
          }
        };

        await html2pdf().set(opt).from(certElement).save();
      } else {
        alert("Бібліотека генерації PDF недоступна. Будь ласка, оновіть сторінку.");
      }
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Помилка під час формування PDF-файлу. Будь ласка, спробуйте ще раз.");
    } finally {
      this.resetButton(downloadBtn, originalBtnText);
    }
  }

  resetButton(btn, text) {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = text;
    }
    this.isGenerating = false;
  }
}

window.certificateManager = new CertificateManager();
