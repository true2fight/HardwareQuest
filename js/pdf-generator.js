/**
 * HardwareQuest - PDF Certificate Generator & Sharing Logic
 * Generates official A4 Landscape certificate and handles printing and copying results
 */

class CertificateManager {
  constructor() {
    this.isGenerating = false;
  }

  /**
   * Sanitizes string for safe filename across all operating systems
   */
  sanitizeFilename(str) {
    if (!str) return "Учень";
    return str.trim().replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "_");
  }

  /**
   * Generates unique certificate verification ID
   */
  generateCertificateId(studentClass) {
    const year = new Date().getFullYear();
    const cleanClass = (studentClass || "8A").replace(/[^a-zA-Z0-9А-Яа-я]/g, "").toUpperCase();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    return `HQ-${year}-${cleanClass}-${randomHex}`;
  }

  /**
   * Formats current date in Ukrainian locale
   */
  getFormattedDate() {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('uk-UA', options);
  }

  /**
   * Fills the certificate template with student data and scores
   */
  renderCertificateData(studentData, gradeData) {
    const certElement = document.getElementById("certificateToExport");
    if (!certElement) return;

    // Student Info
    const nameEl = document.getElementById("certStudentName");
    const classEl = document.getElementById("certStudentClass");
    const idEl = document.getElementById("certVerificationId");
    const dateEl = document.getElementById("certIssueDate");

    if (nameEl) nameEl.textContent = studentData.fullName || "Шевченко Дарина";
    if (classEl) classEl.textContent = `Учень / Учениця ${studentData.studentClass || "8-А"} класу`;
    
    // Unique ID
    if (!studentData.certId) {
      studentData.certId = this.generateCertificateId(studentData.studentClass);
    }
    if (idEl) idEl.textContent = studentData.certId;
    if (dateEl) dateEl.textContent = this.getFormattedDate();

    // Scores & Grades
    const gradeNumEl = document.getElementById("certGradeNumber");
    const gradeLevelEl = document.getElementById("certGradeLevel");
    const pointsEl = document.getElementById("certPointsEarned");
    const percentEl = document.getElementById("certPercentValue");
    const gradeBadge = document.getElementById("certGradeBadge");

    if (gradeNumEl) gradeNumEl.textContent = gradeData.grade;
    if (gradeLevelEl) gradeLevelEl.textContent = gradeData.level;
    if (pointsEl) pointsEl.textContent = `${gradeData.pointsEarned} / ${gradeData.maxPoints}`;
    if (percentEl) percentEl.textContent = `${gradeData.percentage}%`;

    if (gradeBadge && gradeData.color) {
      gradeBadge.style.background = `linear-gradient(135deg, ${gradeData.color}, #0f172a)`;
    }
  }

  /**
   * Exports the certificate as an A4 Landscape PDF using html2pdf.js
   */
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

    // Extract surname for filename according to requirement: Сертифікат_[Прізвище]_[Клас].pdf
    const fullNameParts = (studentData.fullName || "Учень").trim().split(/\s+/);
    const surname = fullNameParts[0] || "Учень";
    const studentClass = this.sanitizeFilename(studentData.studentClass || "8-А");
    const filename = `Сертифікат_${this.sanitizeFilename(surname)}_${studentClass}.pdf`;

    // Check if html2pdf library is available
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
      // Fallback: direct window.print() or canvas
      console.warn("html2pdf not found, using print dialog fallback.");
      this.fallbackPrintOption(filename);
      this.resetButton(downloadBtn, originalBtnText);
    }
  }

  fallbackPrintOption(suggestedFilename) {
    const userChoice = confirm(
      `Бібліотеку PDF завантажується. Бажаєте зберегти сертифікат через системне вікно друку?\n(Оберіть «Зберегти як PDF» у списку принтерів).`
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

  /**
   * Copies formatted text summary for pasting into teacher's messenger or Google Classroom
   */
  copyResultsText(studentData, gradeData) {
    const textToCopy = `🎓 ЗВІТ ПРО ПРОХОДЖЕННЯ ВЕБ-ТРЕНАЖЕРА «HardwareQuest: Збери свій ПК»:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Учень / Учениця: ${studentData.fullName || "Учень"}
🏫 Клас: ${studentData.studentClass || "8-А"}
📚 Тема: «Апаратне забезпечення персонального комп'ютера»
🏆 Підсумкова оцінка: ${gradeData.grade} БАЛІВ (${gradeData.level})
📊 Результат: ${gradeData.percentage}% (${gradeData.pointsEarned} з ${gradeData.maxPoints} балів)
📅 Дата проходження: ${this.getFormattedDate()}
🔑 Унікальний ID сертифіката: ${studentData.certId || "HQ-2026-ONLINE"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Сертифікат згенеровано автоматично на платформі HardwareQuest.`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("📋 Результати успішно скопійовано в буфер обміну!\nТепер ти можеш вставити їх у повідомлення для вчителя (Viber / Telegram / Google Classroom).");
    }).catch(err => {
      console.error("Clipboard copy error:", err);
      prompt("Скопіюй цей текст вручну для звіту вчителю:", textToCopy);
    });
  }

  /**
   * Triggers native print dialog
   */
  printCertificate() {
    window.print();
  }
}

// Global instance
window.certificateManager = new CertificateManager();
