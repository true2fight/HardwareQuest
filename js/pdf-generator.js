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

    const fullNameParts = (studentData.fullName || "Учень").trim().split(/\s+/);
    const surname = fullNameParts[0] || "Учень";
    const firstName = fullNameParts[1] || "";
    const namePart = firstName ? `${surname}_${firstName}` : surname;
    const filename = `Сертифікат_${this.sanitizeFilename(namePart)}.pdf`;

    if (typeof html2pdf !== "undefined") {
      const opt = {
        margin: [0, 0, 0, 0],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'landscape',
          compress: true
        }
      };

      try {
        await html2pdf().set(opt).from(certElement).save();
      } catch (err) {
        console.error("html2pdf generation error:", err);
        this.fallbackPrintOption(filename);
      } finally {
        this.resetButton(downloadBtn, originalBtnText);
      }
    } else {
      this.fallbackPrintOption(filename);
      this.resetButton(downloadBtn, originalBtnText);
    }
  }

  fallbackPrintOption(suggestedFilename) {
    const userChoice = confirm(
      `Бажаєте зберегти сертифікат через вікно друку?\n(Оберіть «Зберегти як PDF» у списку принтерів).`
    );
    if (userChoice) {
      window.print();
    }
  }

  resetButton(btn, text) {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = text;
    }
    this.isGenerating = false;
  }

  printCertificate() {
    window.print();
  }
}

window.certificateManager = new CertificateManager();
