/**
 * HardwareQuest: Збери свій ПК
 * Core Game Engine, UI Controller and Sound Synthesizer
 * Total Maximum Score: exactly 100 points across 6 modules.
 */

class HardwareQuestApp {
  constructor() {
    this.storageKey = "hardware_quest_save_v2";
    this.audioEnabled = true;
    this.audioCtx = null;

    // Default State
    this.state = {
      student: {
        fullName: "",
        certId: ""
      },
      currentScreen: "start",
      currentModuleId: 1,
      moduleScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      maxModuleScores: { 1: 15, 2: 20, 3: 15, 4: 15, 5: 20, 6: 15 },
      completedModules: [],
      // Module-specific answers
      mod1Assignments: { pc_office: null, pc_gaming: null, pc_server: null },
      mod1Quiz: {},
      mod2Sorted: { volatile: [], non_volatile: [] },
      mod2Ladder: [],
      mod3Answers: {},
      mod3TableAnswers: { row_keys: null, row_mouse: null, row_scan: null, row_mic: null },
      mod4PairsMatched: [],
      mod4SelectedSource: null,
      mod4Answers: {},
      mod5Slots: { 1: null, 2: null, 3: null, 4: null, 5: null },
      mod5Answers: {},
      mod6Answers: {}
    };

    this.init();
  }

  init() {
    this.loadSavedState();
    this.setupAudio();
    this.setupEventListeners();
    this.checkResumeAvailability();
    this.updateHUD();
  }

  /* ==========================================================================
     AUDIO SYNTHESIZER (Web Audio API)
     ========================================================================== */
  setupAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.audioCtx = new AudioContextClass();
    }
  }

  ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playSound(type) {
    if (!this.audioEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "success") {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } else if (type === "error") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "fanfare") {
      const notes = [
        { f: 523.25, d: 0.15, t: 0 },
        { f: 659.25, d: 0.15, t: 0.15 },
        { f: 783.99, d: 0.15, t: 0.3 },
        { f: 1046.5, d: 0.5, t: 0.45 }
      ];
      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.2, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    }
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    const btn = document.getElementById("audioToggleBtn");
    if (btn) {
      btn.innerHTML = this.audioEnabled 
        ? `<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Звук: Увімк.`
        : `<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg> Звук: Вимк.`;
    }
  }

  /* ==========================================================================
     LOCAL STORAGE STATE
     ========================================================================== */
  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not save to LocalStorage:", e);
    }
  }

  loadSavedState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = Object.assign(this.state, parsed);
      }
    } catch (e) {
      console.warn("Could not load from LocalStorage:", e);
    }
  }

  checkResumeAvailability() {
    const resumeBtn = document.getElementById("btnResumeQuest");
    if (resumeBtn && this.state.student.fullName && this.state.currentScreen !== "start") {
      resumeBtn.style.display = "inline-flex";
      resumeBtn.textContent = `Продовжити квест (${this.state.student.fullName}, Модуль ${this.state.currentModuleId})`;
    } else if (resumeBtn) {
      resumeBtn.style.display = "none";
    }
  }

  clearSession() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {}
    location.reload();
  }

  /* ==========================================================================
     EVENT LISTENERS & NAVIGATION
     ========================================================================== */
  setupEventListeners() {
    const audioBtn = document.getElementById("audioToggleBtn");
    if (audioBtn) audioBtn.addEventListener("click", () => this.toggleAudio());

    const openRulesBtn = document.getElementById("btnOpenRules");
    const closeRulesBtn = document.getElementById("btnCloseRules");
    const modal = document.getElementById("rulesModal");
    if (openRulesBtn && modal) openRulesBtn.addEventListener("click", () => modal.classList.add("active"));
    if (closeRulesBtn && modal) closeRulesBtn.addEventListener("click", () => modal.classList.remove("active"));
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });
    }

    const startForm = document.getElementById("studentRegistrationForm");
    if (startForm) {
      startForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleStartQuest();
      });
    }

    const resumeBtn = document.getElementById("btnResumeQuest");
    if (resumeBtn) {
      resumeBtn.addEventListener("click", () => {
        this.playSound("click");
        this.navigateToScreen(`moduleView`);
        this.renderModule(this.state.currentModuleId || 1);
      });
    }

    document.querySelectorAll(".step-item").forEach(item => {
      item.addEventListener("click", () => {
        const modId = parseInt(item.getAttribute("data-module-id"));
        if (this.state.student.fullName) {
          this.navigateToModule(modId);
        }
      });
    });

    const downloadPdfBtn = document.getElementById("btnDownloadPDF");
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener("click", () => {
        this.playSound("click");
        const gradeData = this.calculateTotalGrade();
        window.certificateManager.downloadCertificatePDF(this.state.student, gradeData);
      });
    }

    const printBtn = document.getElementById("btnPrintCert");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        this.playSound("click");
        window.certificateManager.printCertificate();
      });
    }

    const restartBtn = document.getElementById("btnRestartQuest");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        if (confirm("Розпочати квест заново? Поточний прогрес буде скинуто.")) {
          this.clearSession();
        }
      });
    }
  }

  handleStartQuest() {
    const nameInput = document.getElementById("studentFullName");
    const fullName = nameInput ? nameInput.value.trim() : "";

    if (!fullName || fullName.length < 3) {
      alert("Будь ласка, введи своє справжнє Прізвище та Ім'я для формування сертифіката!");
      if (nameInput) nameInput.focus();
      return;
    }

    this.state.student.fullName = fullName;
    this.state.student.certId = window.certificateManager.generateCertificateId();

    this.playSound("success");
    this.navigateToModule(1);
    this.saveState();
  }

  navigateToScreen(screenId) {
    this.state.currentScreen = screenId;
    document.querySelectorAll(".screen-view").forEach(s => s.classList.remove("active"));

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    this.updateHUD();
    this.saveState();
  }

  navigateToModule(modId) {
    if (modId < 1 || modId > 6) return;
    this.state.currentModuleId = modId;
    this.renderModule(modId);
    this.navigateToScreen(`moduleView`);
  }

  updateHUD() {
    const studentTagEl = document.getElementById("hudStudentTag");
    if (studentTagEl) {
      if (this.state.student.fullName) {
        studentTagEl.style.display = "flex";
        studentTagEl.innerHTML = `👤 <strong>${this.state.student.fullName}</strong>`;
      } else {
        studentTagEl.style.display = "none";
      }
    }

    const hudScoreEl = document.getElementById("hudScoreValue");
    if (hudScoreEl) {
      const totalPoints = this.calculateEarnedPoints();
      hudScoreEl.textContent = `${totalPoints} / 100 б.`;
    }

    document.querySelectorAll(".step-item").forEach(item => {
      const id = parseInt(item.getAttribute("data-module-id"));
      item.classList.remove("active", "completed");
      if (id === this.state.currentModuleId && this.state.currentScreen === "moduleView") {
        item.classList.add("active");
      } else if (this.state.completedModules.includes(id)) {
        item.classList.add("completed");
      }
    });
  }

  calculateEarnedPoints() {
    return Math.round(Object.values(this.state.moduleScores).reduce((a, b) => a + b, 0));
  }

  calculateTotalGrade() {
    const earned = this.calculateEarnedPoints();
    return window.calculateUkrainianGrade(earned, 100);
  }

  /* ==========================================================================
     MODULE RENDERER ROUTER
     ========================================================================== */
  renderModule(modId) {
    const moduleData = window.MODULES_DATA.find(m => m.id === modId);
    if (!moduleData) return;

    document.getElementById("modMetaBadge").textContent = moduleData.badge;
    document.getElementById("modMainTitle").textContent = moduleData.title;
    document.getElementById("modDescText").textContent = moduleData.description;
    document.getElementById("modHeaderIcon").src = moduleData.icon;

    const theorySummaryEl = document.getElementById("theorySummaryText");
    const theoryGridEl = document.getElementById("theoryPointsGrid");
    if (theorySummaryEl) theorySummaryEl.textContent = moduleData.theory.summary;
    if (theoryGridEl) {
      theoryGridEl.innerHTML = moduleData.theory.points.map(p => `
        <div class="theory-point-item">
          <strong>${p.term}</strong>
          <p>${p.desc}</p>
        </div>
      `).join("");
    }

    const workspaceContainer = document.getElementById("moduleInteractiveArea");
    if (!workspaceContainer) return;

    switch (modId) {
      case 1:
        this.renderModule1(moduleData, workspaceContainer);
        break;
      case 2:
        this.renderModule2(moduleData, workspaceContainer);
        break;
      case 3:
        this.renderModule3(moduleData, workspaceContainer);
        break;
      case 4:
        this.renderModule4(moduleData, workspaceContainer);
        break;
      case 5:
        this.renderModule5(moduleData, workspaceContainer);
        break;
      case 6:
        this.renderModule6(moduleData, workspaceContainer);
        break;
    }

    const nextBtn = document.getElementById("btnNextModule");
    if (nextBtn) {
      if (modId === 6) {
        nextBtn.innerHTML = `Завершити квест та отримати сертифікат 🎓`;
        nextBtn.onclick = () => this.finishQuest();
      } else {
        nextBtn.innerHTML = `До модуля ${modId + 1} ➡️`;
        nextBtn.onclick = () => {
          this.playSound("click");
          this.navigateToModule(modId + 1);
        };
      }
    }
  }

  /* ==========================================================================
     MODULE 1: 6 CPU SELECTION FOR 3 COMPUTERS (15 POINTS)
     ========================================================================== */
  renderModule1(data, container) {
    const challenge = data.cpuSelectionChallenge;
    const targetComputers = challenge.targetComputers;
    const availableCpus = challenge.availableCpus;

    let html = `
      <div class="workspace-title">⚙️ Завдання 1: Вибір оптимального CPU для кожного комп'ютера (9 балів)</div>
      <p class="workspace-instruction">${challenge.instruction}</p>

      <!-- 3 Target Computers Cards -->
      <div class="target-pcs-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;margin-bottom:2rem;">
    `;

    targetComputers.forEach(pc => {
      const assignedCpuId = this.state.mod1Assignments[pc.id];
      const assignedCpu = availableCpus.find(c => c.id === assignedCpuId);
      const isCorrect = assignedCpuId === pc.correctCpuId;

      html += `
        <div class="target-pc-card" style="background:rgba(15,23,42,0.85);border:2px ${assignedCpu ? (isCorrect ? 'solid var(--green)' : 'solid var(--red)') : 'dashed rgba(255,255,255,0.2)'};border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 8px 20px rgba(0,0,0,0.3);">
          <div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:1.8rem;">${pc.icon}</span>
              <div>
                <h4 style="color:#ffffff;font-size:1rem;margin:0;">${pc.name}</h4>
                <div style="font-size:0.75rem;color:var(--cyan);font-weight:700;">Цільове призначення</div>
              </div>
            </div>
            <p style="font-size:0.8rem;color:var(--text-muted);line-height:1.4;margin-bottom:12px;">${pc.purpose}</p>
          </div>

          <div style="background:rgba(30,41,59,0.7);border-radius:8px;padding:10px;text-align:center;">
            <div style="font-size:0.75rem;color:var(--text-dim);margin-bottom:4px;font-weight:700;">Обраний процесор:</div>
            ${assignedCpu ? `
              <div style="display:flex;align-items:center;gap:8px;justify-content:center;">
                <img src="${assignedCpu.icon}" style="width:34px;height:34px;" />
                <div style="text-align:left;">
                  <strong style="font-size:0.85rem;color:#ffffff;display:block;">${assignedCpu.name}</strong>
                  <span style="font-size:0.75rem;color:${isCorrect ? 'var(--green)' : 'var(--red)'};font-weight:700;">
                    ${isCorrect ? '✅ Ідеально підходить' : '❌ Неоптимальний вибір'}
                  </span>
                </div>
              </div>
              <button onclick="app.unassignCpuFromPc('${pc.id}')" style="margin-top:8px;background:transparent;border:none;color:var(--text-muted);font-size:0.75rem;text-decoration:underline;cursor:pointer;">
                [Змінити вибір]
              </button>
            ` : `
              <div style="font-size:0.82rem;color:var(--cyan);font-weight:600;padding:6px 0;">
                ⬅️ Обери один із 6 процесорів нижче
              </div>
            `}
          </div>
        </div>
      `;
    });

    html += `</div>`;

    // 6 Available CPUs Showcase
    html += `
      <div class="workspace-title" style="font-size:1.05rem;">📦 Доступні на ринку процесори (6 варіантів):</div>
      <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem;">
        Натисни на кнопку комп'ютера під потрібним процесором, щоб встановити його:
      </p>

      <div class="cpus-catalog-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:1rem;margin-bottom:2rem;">
    `;

    availableCpus.forEach(cpu => {
      // Find which PC this CPU is assigned to (if any)
      const assignedToPcId = Object.keys(this.state.mod1Assignments).find(pcId => this.state.mod1Assignments[pcId] === cpu.id);
      const isAssigned = !!assignedToPcId;

      html += `
        <div class="cpu-showcase-card" style="background:rgba(30,41,59,0.7);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:1rem;display:flex;flex-direction:column;justify-content:space-between;transition:border-color 0.2s;">
          <div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
              <img src="${cpu.icon}" style="width:48px;height:48px;flex-shrink:0;" />
              <div>
                <h4 style="font-size:0.95rem;color:#ffffff;margin:0 0 2px 0;">${cpu.name}</h4>
                <div style="font-size:0.75rem;color:var(--blue);font-weight:700;">${cpu.categoryName}</div>
              </div>
            </div>
            <div style="background:rgba(15,23,42,0.6);border-radius:6px;padding:8px 10px;font-size:0.8rem;color:#e2e8f0;line-height:1.4;margin-bottom:12px;">
              ${cpu.specs}
            </div>
          </div>

          <div>
            <div style="font-size:0.75rem;color:var(--text-dim);margin-bottom:6px;font-weight:700;">Встановити в:</div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
              <button class="config-option-btn ${assignedToPcId === 'pc_office' ? 'selected' : ''}" 
                      style="padding:6px 4px;font-size:0.72rem;text-align:center;"
                      onclick="app.assignCpuToPc('${cpu.id}', 'pc_office')">
                💼 Офісний
              </button>
              <button class="config-option-btn ${assignedToPcId === 'pc_gaming' ? 'selected' : ''}" 
                      style="padding:6px 4px;font-size:0.72rem;text-align:center;"
                      onclick="app.assignCpuToPc('${cpu.id}', 'pc_gaming')">
                🎮 Ігровий
              </button>
              <button class="config-option-btn ${assignedToPcId === 'pc_server' ? 'selected' : ''}" 
                      style="padding:6px 4px;font-size:0.72rem;text-align:center;"
                      onclick="app.assignCpuToPc('${cpu.id}', 'pc_server')">
                🏢 Сервер
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;

    // Quiz Questions (2 * 3 = 6 points)
    html += `
      <div class="quiz-block">
        <div class="workspace-title">📝 Завдання 2: Перевірка теоретичних знань про процесор (6 балів)</div>
    `;

    data.quiz.forEach((q, qIdx) => {
      html += `
        <div class="quiz-card">
          <div class="quiz-question">${qIdx + 1}. ${q.question}</div>
          <div class="quiz-options">
      `;
      q.options.forEach((optText, oIdx) => {
        const isSelected = this.state.mod1Quiz[`quiz_${qIdx}`] === oIdx;
        const statusClass = isSelected ? (oIdx === q.correct ? "correct-choice" : "wrong-choice") : "";
        html += `
          <button class="quiz-opt-btn ${statusClass}" onclick="app.selectMod1Quiz(${qIdx}, ${oIdx}, ${q.correct}, '${q.explanation.replace(/'/g, "\\'")}')">
            ${optText}
          </button>
        `;
      });
      html += `
          </div>
          <div class="feedback-explanation" id="quizFeedback_1_${qIdx}"></div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  assignCpuToPc(cpuId, targetPcId) {
    // If another PC has this CPU, remove it
    Object.keys(this.state.mod1Assignments).forEach(pId => {
      if (this.state.mod1Assignments[pId] === cpuId) {
        this.state.mod1Assignments[pId] = null;
      }
    });

    this.state.mod1Assignments[targetPcId] = cpuId;

    const targetPc = window.MODULES_DATA[0].cpuSelectionChallenge.targetComputers.find(p => p.id === targetPcId);
    const isCorrect = targetPc && targetPc.correctCpuId === cpuId;
    this.playSound(isCorrect ? "success" : "error");

    this.recalculateMod1Score();
    this.renderModule(1);
  }

  unassignCpuFromPc(pcId) {
    this.state.mod1Assignments[pcId] = null;
    this.playSound("click");
    this.recalculateMod1Score();
    this.renderModule(1);
  }

  selectMod1Quiz(qIdx, oIdx, correctIdx, explanation) {
    this.state.mod1Quiz[`quiz_${qIdx}`] = oIdx;
    const isCorrect = oIdx === correctIdx;
    const fbEl = document.getElementById(`quizFeedback_1_${qIdx}`);
    if (fbEl) {
      fbEl.className = `feedback-explanation show ${isCorrect ? "success" : "error"}`;
      fbEl.textContent = isCorrect ? `Правильно! ${explanation}` : `Не зовсім. ${explanation}`;
    }
    this.playSound(isCorrect ? "success" : "error");
    this.recalculateMod1Score();
    this.renderModule(1);
  }

  recalculateMod1Score() {
    let score = 0;
    const targetPcs = window.MODULES_DATA[0].cpuSelectionChallenge.targetComputers;
    targetPcs.forEach(pc => {
      if (this.state.mod1Assignments[pc.id] === pc.correctCpuId) {
        score += 3; // 3 * 3 = 9 points
      }
    });

    const quiz = window.MODULES_DATA[0].quiz;
    quiz.forEach((q, idx) => {
      if (this.state.mod1Quiz[`quiz_${idx}`] === q.correct) {
        score += 3; // 2 * 3 = 6 points
      }
    });

    this.state.moduleScores[1] = Math.min(score, this.state.maxModuleScores[1]);
    if (score >= 10 && !this.state.completedModules.includes(1)) {
      this.state.completedModules.push(1);
    }
    this.updateHUD();
    this.saveState();
  }

  /* ==========================================================================
     MODULE 2: MEMORY SORTING & SPEED LADDER (20 POINTS)
     ========================================================================== */
  renderModule2(data, container) {
    const allItems = data.sortingChallenge.items;
    const volatileItems = this.state.mod2Sorted.volatile || [];
    const nonVolatileItems = this.state.mod2Sorted.non_volatile || [];
    const poolItems = allItems.filter(item => !volatileItems.includes(item.id) && !nonVolatileItems.includes(item.id));

    let html = `
      <div class="workspace-title">💾 Завдання 1: ${data.sortingChallenge.title} (14 балів)</div>
      <p class="workspace-instruction">${data.sortingChallenge.instruction}</p>
      
      <div class="items-pool-wrapper">
        <div class="pool-label">Натисни або перетягни носій у відповідний кошик:</div>
        <div class="items-pool" id="mod2Pool" ondragover="event.preventDefault()" ondrop="app.dropItemToCategory(event, 'pool')">
    `;

    poolItems.forEach(item => {
      html += `
        <div class="draggable-item" draggable="true" id="${item.id}"
             ondragstart="app.dragStart(event, '${item.id}')"
             onclick="app.promptItemCategory('${item.id}')">
          <img src="${item.icon}" alt="${item.name}" />
          <span>${item.name}</span>
        </div>
      `;
    });

    if (poolItems.length === 0) {
      html += `<div style="color:var(--green);font-size:0.9rem;padding:8px;">✅ Всі накопичувачі успішно розподілено!</div>`;
    }

    html += `
        </div>
      </div>

      <div class="sorting-container">
    `;

    data.sortingChallenge.categories.forEach(cat => {
      const itemsInCat = cat.id === "volatile" ? volatileItems : nonVolatileItems;
      html += `
        <div class="sort-bucket" id="bucket_${cat.id}" 
             ondragover="app.dragOverBucket(event)" 
             ondragleave="app.dragLeaveBucket(event)"
             ondrop="app.dropItemToCategory(event, '${cat.id}')">
          <div class="sort-bucket-header">
            <div class="sort-bucket-title" style="color:${cat.color}">${cat.title}</div>
            <div class="sort-bucket-sub">${cat.subtitle}</div>
          </div>
          <div class="sort-bucket-items">
      `;

      itemsInCat.forEach(itemId => {
        const itemObj = allItems.find(i => i.id === itemId);
        if (itemObj) {
          const isCorrect = itemObj.category === cat.id;
          html += `
            <div class="draggable-item ${isCorrect ? 'correct-item' : 'wrong-item'}" 
                 onclick="app.removeItemFromBucket('${itemId}', '${cat.id}')" title="Натисни, щоб повернути у список">
              <img src="${itemObj.icon}" alt="${itemObj.name}" />
              <span>${itemObj.name}</span>
              <span style="font-size:0.75rem;margin-left:auto;">${isCorrect ? '✅' : '❌'} (повернути)</span>
            </div>
          `;
        }
      });

      html += `</div></div>`;
    });

    html += `</div>`;

    // Speed Ladder
    html += `
      <div class="quiz-block">
        <div class="workspace-title">⚡ Завдання 2: ${data.speedLadder.title} (6 балів)</div>
        <p class="workspace-instruction">${data.speedLadder.instruction}</p>
        <div class="speed-ladder-slots">
    `;

    const ladderItems = data.speedLadder.items;
    [0, 1, 2, 3].forEach(slotIdx => {
      const assignedId = this.state.mod2Ladder[slotIdx];
      const itemObj = ladderItems.find(i => i.id === assignedId);
      html += `
        <div class="speed-slot ${itemObj ? 'filled' : ''}" onclick="app.cycleLadderItem(${slotIdx})">
          <div class="speed-slot-num">Сходинка ${slotIdx + 1} ${slotIdx === 0 ? '(Найповільніший)' : slotIdx === 3 ? '(Найшвидший)' : ''}</div>
          ${itemObj ? `
            <img src="${itemObj.icon}" style="width:36px;height:36px;margin:4px 0;" />
            <div style="font-size:0.8rem;font-weight:700;">${itemObj.name}</div>
            <span style="font-size:0.7rem;color:var(--cyan);">(Натисни для зміни)</span>
          ` : `
            <div style="font-size:0.8rem;color:var(--text-dim);cursor:pointer;">[Натисни, щоб обрати]</div>
          `}
        </div>
      `;
    });

    html += `
        </div>
        <div style="margin-top:1rem;text-align:center;">
          <button class="btn-quest btn-quest-secondary" style="padding:8px 16px;font-size:0.85rem;" onclick="app.checkSpeedLadder()">
            Перевірити драбину швидкості 🔍
          </button>
          <div class="feedback-explanation" id="speedLadderFeedback"></div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  promptItemCategory(itemId) {
    const choice = confirm("Перемістити цей носій у кошик «Енергозалежна пам'ять»?\n(«ОК» — Енергозалежна, «Скасувати» — Енергонезалежна)");
    const targetCat = choice ? "volatile" : "non_volatile";
    this.moveItemToCategory(itemId, targetCat);
  }

  dragStart(e, itemId) {
    e.dataTransfer.setData("text/plain", itemId);
  }

  dragOverBucket(e) {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  }

  dragLeaveBucket(e) {
    e.currentTarget.classList.remove("drag-over");
  }

  dropItemToCategory(e, catId) {
    e.preventDefault();
    document.querySelectorAll(".sort-bucket").forEach(b => b.classList.remove("drag-over"));
    const itemId = e.dataTransfer.getData("text/plain");
    if (!itemId) return;

    if (catId === "pool") {
      this.removeItemFromBucket(itemId, "volatile");
      this.removeItemFromBucket(itemId, "non_volatile");
    } else {
      this.moveItemToCategory(itemId, catId);
    }
  }

  moveItemToCategory(itemId, targetCat) {
    this.removeItemFromBucket(itemId, "volatile", false);
    this.removeItemFromBucket(itemId, "non_volatile", false);

    if (targetCat === "volatile") {
      this.state.mod2Sorted.volatile.push(itemId);
    } else {
      this.state.mod2Sorted.non_volatile.push(itemId);
    }

    const itemObj = window.MODULES_DATA[1].sortingChallenge.items.find(i => i.id === itemId);
    const isCorrect = itemObj && itemObj.category === targetCat;
    this.playSound(isCorrect ? "success" : "error");

    this.recalculateMod2Score();
    this.renderModule(2);
  }

  removeItemFromBucket(itemId, catId, reRender = true) {
    if (catId === "volatile") {
      this.state.mod2Sorted.volatile = this.state.mod2Sorted.volatile.filter(id => id !== itemId);
    } else {
      this.state.mod2Sorted.non_volatile = this.state.mod2Sorted.non_volatile.filter(id => id !== itemId);
    }
    this.playSound("click");
    this.recalculateMod2Score();
    if (reRender) this.renderModule(2);
  }

  cycleLadderItem(slotIdx) {
    const items = window.MODULES_DATA[1].speedLadder.items;
    const currentId = this.state.mod2Ladder[slotIdx];
    const currentIndex = items.findIndex(i => i.id === currentId);
    const nextIndex = (currentIndex + 1) % (items.length + 1);

    if (nextIndex === items.length) {
      this.state.mod2Ladder[slotIdx] = null;
    } else {
      this.state.mod2Ladder[slotIdx] = items[nextIndex].id;
    }

    this.playSound("click");
    this.renderModule(2);
  }

  checkSpeedLadder() {
    const correct = window.MODULES_DATA[1].speedLadder.correctOrder;
    const userOrder = this.state.mod2Ladder;
    let isAllCorrect = true;

    for (let i = 0; i < 4; i++) {
      if (userOrder[i] !== correct[i]) {
        isAllCorrect = false;
        break;
      }
    }

    const fbEl = document.getElementById("speedLadderFeedback");
    if (fbEl) {
      fbEl.className = `feedback-explanation show ${isAllCorrect ? "success" : "error"}`;
      fbEl.textContent = isAllCorrect 
        ? "Чудово! Правильний порядок: Оптичний DVD (16 МБ/с) ➡️ HDD (150 МБ/с) ➡️ SATA SSD (550 МБ/с) ➡️ NVMe M.2 SSD (7000 МБ/с)!"
        : "Є помилки у швидкості! Пам'ятай: оптичний диск найповільніший, за ним магнітний HDD, далі SATA SSD, а найшвидший — NVMe M.2 SSD!";
    }

    this.playSound(isAllCorrect ? "success" : "error");
    this.recalculateMod2Score();
  }

  recalculateMod2Score() {
    let score = 0;
    const items = window.MODULES_DATA[1].sortingChallenge.items;

    // 7 items * 2 points = 14 points
    items.forEach(item => {
      const inVolatile = (this.state.mod2Sorted.volatile || []).includes(item.id);
      const inNonVolatile = (this.state.mod2Sorted.non_volatile || []).includes(item.id);

      if (item.category === "volatile" && inVolatile) score += 2;
      if (item.category === "non_volatile" && inNonVolatile) score += 2;
    });

    // 4 ladder slots * 1.5 points = 6 points
    const correct = window.MODULES_DATA[1].speedLadder.correctOrder;
    let ladderCorrect = 0;
    for (let i = 0; i < 4; i++) {
      if (this.state.mod2Ladder[i] === correct[i]) ladderCorrect++;
    }
    score += ladderCorrect * 1.5;

    this.state.moduleScores[2] = Math.min(Math.round(score), this.state.maxModuleScores[2]);
    if (score >= 14 && !this.state.completedModules.includes(2)) {
      this.state.completedModules.push(2);
    }
    this.updateHUD();
    this.saveState();
  }

  /* ==========================================================================
     MODULE 3: INPUT DEVICES DETECTIVE & TABLE CLASSIFICATION (15 POINTS)
     ========================================================================== */
  renderModule3(data, container) {
    let html = `
      <div class="workspace-title">🔍 Завдання 1: Детектив апаратного забезпечення (10 балів)</div>
      <p class="workspace-instruction">Уважно прочитай потреби кожного користувача та обери єдиний правильний пристрій введення (варіанти правдоподібні!):</p>
      <div class="detective-grid">
    `;

    data.cases.forEach(c => {
      html += `
        <div class="detective-case-card">
          <div class="case-client-badge">${c.role}</div>
          <div class="case-bubble">${c.problem}</div>
          <div class="case-device-options">
      `;

      c.devices.forEach(dev => {
        const isSelected = this.state.mod3Answers[c.id] === dev.id;
        const isCorrect = dev.id === c.targetDevice;
        const statusClass = isSelected ? (isCorrect ? "correct-choice" : "wrong-choice") : "";

        html += `
          <button class="case-opt-btn ${statusClass}" 
                  onclick="app.selectMod3Case('${c.id}', '${dev.id}', '${c.targetDevice}', '${c.successMessage.replace(/'/g, "\\'")}')">
            <img src="${dev.icon}" alt="${dev.name}" />
            <span>${dev.name}</span>
          </button>
        `;
      });

      html += `
          </div>
          <div class="feedback-explanation" id="caseFeedback_${c.id}"></div>
        </div>
      `;
    });

    html += `</div>`;

    // Interactive Table Classification Task
    const tableData = data.tableChallenge;
    html += `
      <div class="quiz-block">
        <div class="workspace-title">📊 Завдання 2: ${tableData.title} (5 балів)</div>
        <p class="workspace-instruction">${tableData.instruction}</p>
        
        <table class="grading-table" style="margin-top:10px;">
          <thead>
            <tr>
              <th style="width:35%;">Назва пристроїв</th>
              <th style="width:40%;">Обери тип вхідних даних</th>
              <th style="width:25%;">Статус відповіді</th>
            </tr>
          </thead>
          <tbody>
    `;

    tableData.rows.forEach(row => {
      const currentSelected = this.state.mod3TableAnswers[row.id];
      const isCorrect = currentSelected === row.correctType;

      html += `
        <tr>
          <td><strong>${row.devices}</strong></td>
          <td>
            <select class="form-input" style="padding:6px 10px;font-size:0.85rem;" onchange="app.selectMod3TableRow('${row.id}', this.value)">
              <option value="">-- Обери тип даних --</option>
              ${tableData.options.map(opt => `
                <option value="${opt.id}" ${currentSelected === opt.id ? 'selected' : ''}>${opt.name}</option>
              `).join("")}
            </select>
          </td>
          <td style="font-size:0.8rem;color:${currentSelected ? (isCorrect ? 'var(--green)' : 'var(--red)') : 'var(--text-dim)'};font-weight:700;">
            ${currentSelected ? (isCorrect ? '✅ Вірно' : '❌ Неправильно') : 'Очікує вибору'}
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  }

  selectMod3Case(caseId, selectedDevId, targetDevId, successMsg) {
    this.state.mod3Answers[caseId] = selectedDevId;
    const isCorrect = selectedDevId === targetDevId;

    const fbEl = document.getElementById(`caseFeedback_${caseId}`);
    if (fbEl) {
      fbEl.className = `feedback-explanation show ${isCorrect ? "success" : "error"}`;
      fbEl.textContent = isCorrect ? successMsg : "Цей пристрій не відповідає ключовим технічним вимогам кейсу. Спробуй інший!";
    }

    this.playSound(isCorrect ? "success" : "error");
    this.recalculateMod3Score();
    this.renderModule(3);
  }

  selectMod3TableRow(rowId, selectedVal) {
    this.state.mod3TableAnswers[rowId] = selectedVal || null;
    const rowObj = window.MODULES_DATA[2].tableChallenge.rows.find(r => r.id === rowId);
    const isCorrect = rowObj && rowObj.correctType === selectedVal;
    this.playSound(isCorrect ? "success" : "error");
    this.recalculateMod3Score();
    this.renderModule(3);
  }

  recalculateMod3Score() {
    let score = 0;
    // 4 cases * 2.5 = 10 points
    const cases = window.MODULES_DATA[2].cases;
    cases.forEach(c => {
      if (this.state.mod3Answers[c.id] === c.targetDevice) {
        score += 2.5;
      }
    });

    // 4 table rows * 1.25 = 5 points
    const rows = window.MODULES_DATA[2].tableChallenge.rows;
    rows.forEach(r => {
      if (this.state.mod3TableAnswers[r.id] === r.correctType) {
        score += 1.25;
      }
    });

    this.state.moduleScores[3] = Math.min(Math.round(score), this.state.maxModuleScores[3]);
    if (score >= 10 && !this.state.completedModules.includes(3)) {
      this.state.completedModules.push(3);
    }
    this.updateHUD();
    this.saveState();
  }

  /* ==========================================================================
     MODULE 4: OUTPUT DEVICES MATCHING (SHUFFLED) (15 POINTS)
     ========================================================================== */
  renderModule4(data, container) {
    const pairs = data.matchingPairs;
    const matchedList = this.state.mod4PairsMatched || [];
    const displayOrder = data.matchingDisplayOrder || pairs.map(p => p.id);

    let html = `
      <div class="workspace-title">🔗 Завдання 1: Встановлення відповідностей (12 балів)</div>
      <p class="workspace-instruction">
        Натисни на пристрій ліворуч, а потім на відповідний опис сфери застосування праворуч (описи перемішано!):
      </p>
      <div class="matching-board">
        <div class="matching-col">
    `;

    pairs.forEach(p => {
      const isMatched = matchedList.includes(p.id);
      const isSelected = this.state.mod4SelectedSource === p.id;
      html += `
        <div class="match-device-card ${isMatched ? 'match-paired' : ''} ${isSelected ? 'selected-source' : ''}"
             onclick="app.selectMod4Source('${p.id}')">
          <img src="${p.icon}" alt="${p.device}" />
          <div class="title">${p.device}</div>
          ${isMatched ? `<span style="margin-left:auto;color:var(--green);">✅ З'єднано</span>` : ''}
        </div>
      `;
    });

    html += `
        </div>
        <div class="matching-col">
    `;

    // Render right column in SHUFFLED order!
    displayOrder.forEach(pId => {
      const p = pairs.find(pair => pair.id === pId);
      if (!p) return;
      const isMatched = matchedList.includes(p.id);
      html += `
        <div class="match-desc-card ${isMatched ? 'match-paired' : ''}"
             onclick="app.selectMod4Target('${p.id}')">
          ${p.targetDesc}
          ${isMatched ? ` <strong style="color:var(--green);">(З'єднано)</strong>` : ''}
        </div>
      `;
    });

    html += `
        </div>
      </div>
      <div class="feedback-explanation" id="mod4MatchFeedback"></div>
    `;

    // Blitz quiz (3 points)
    html += `
      <div class="quiz-block">
        <div class="workspace-title">🖨️ Завдання 2: Бліц-тест вибору принтера (3 бали)</div>
    `;
    data.quiz.forEach((q, idx) => {
      html += `
        <div class="quiz-card">
          <div class="quiz-question">${q.question}</div>
          <div class="quiz-options">
      `;
      q.options.forEach((opt, oIdx) => {
        const isSelected = this.state.mod4Answers && this.state.mod4Answers[`quiz_${idx}`] === oIdx;
        const statusClass = isSelected ? (oIdx === q.correct ? "correct-choice" : "wrong-choice") : "";
        html += `
          <button class="quiz-opt-btn ${statusClass}" onclick="app.selectMod4Quiz(${idx}, ${oIdx}, ${q.correct}, '${q.explanation.replace(/'/g, "\\'")}')">
            ${opt}
          </button>
        `;
      });
      html += `
          </div>
          <div class="feedback-explanation" id="mod4QuizFb_${idx}"></div>
        </div>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;
  }

  selectMod4Source(pairId) {
    if (this.state.mod4PairsMatched.includes(pairId)) return;
    this.state.mod4SelectedSource = pairId;
    this.playSound("click");
    this.renderModule(4);
  }

  selectMod4Target(pairId) {
    if (!this.state.mod4SelectedSource) {
      alert("Спочатку обери пристрій зі стовпчика ліворуч!");
      return;
    }

    const fbEl = document.getElementById("mod4MatchFeedback");
    if (this.state.mod4SelectedSource === pairId) {
      if (!this.state.mod4PairsMatched.includes(pairId)) {
        this.state.mod4PairsMatched.push(pairId);
      }
      this.playSound("success");
      if (fbEl) {
        fbEl.className = "feedback-explanation show success";
        fbEl.textContent = "Чудово! Правильна відповідність!";
      }
    } else {
      this.playSound("error");
      if (fbEl) {
        fbEl.className = "feedback-explanation show error";
        fbEl.textContent = "Невірна відповідність! Уважно зістав призначення пристрою з описом.";
      }
    }

    this.state.mod4SelectedSource = null;
    this.recalculateMod4Score();
    this.renderModule(4);
  }

  selectMod4Quiz(qIdx, oIdx, correctIdx, explanation) {
    if (!this.state.mod4Answers) this.state.mod4Answers = {};
    this.state.mod4Answers[`quiz_${qIdx}`] = oIdx;
    const isCorrect = oIdx === correctIdx;
    const fbEl = document.getElementById(`mod4QuizFb_${qIdx}`);
    if (fbEl) {
      fbEl.className = `feedback-explanation show ${isCorrect ? "success" : "error"}`;
      fbEl.textContent = isCorrect ? `Правильно! ${explanation}` : `Спробуй ще раз. ${explanation}`;
    }
    this.playSound(isCorrect ? "success" : "error");
    this.recalculateMod4Score();
    this.renderModule(4);
  }

  recalculateMod4Score() {
    let score = (this.state.mod4PairsMatched || []).length * 2; // 6 * 2 = 12 points
    if (this.state.mod4Answers && this.state.mod4Answers[`quiz_0`] === 1) {
      score += 3; // 3 points
    }
    this.state.moduleScores[4] = Math.min(score, this.state.maxModuleScores[4]);
    if (score >= 10 && !this.state.completedModules.includes(4)) {
      this.state.completedModules.push(4);
    }
    this.updateHUD();
    this.saveState();
  }

  /* ==========================================================================
     MODULE 5: NETWORK DEVICES (SHUFFLED PALETTE & PLAUSIBLE QUIZ) (20 POINTS)
     ========================================================================== */
  renderModule5(data, container) {
    const slots = data.topologyChallenge.slots;
    const available = data.topologyChallenge.shuffledPalette;

    let html = `
      <div class="workspace-title">🌐 Завдання 1: ${data.topologyChallenge.title} (14 балів)</div>
      <p class="workspace-instruction">${data.topologyChallenge.instruction}</p>
      
      <div class="network-builder-wrapper">
        <div class="network-slots-chain">
    `;

    slots.forEach(slot => {
      const assignedDevId = this.state.mod5Slots[slot.step];
      const devObj = available.find(d => d.id === assignedDevId);
      const isCorrect = assignedDevId === slot.correctDevice;

      html += `
        <div class="net-slot-card ${devObj ? 'slot-filled' : ''}" 
             onclick="app.clearMod5Slot(${slot.step})"
             ondragover="event.preventDefault()"
             ondrop="app.dropDeviceToNetSlot(event, ${slot.step})">
          <div class="net-slot-step-num">Крок ${slot.step}</div>
          ${devObj ? `
            <img src="${devObj.icon}" style="width:42px;height:42px;margin:6px 0;" />
            <div class="net-slot-name">${devObj.name}</div>
            <div style="font-size:0.75rem;color:${isCorrect ? 'var(--green)' : 'var(--red)'};">
              ${isCorrect ? '✅ Правильно' : '❌ Не на своєму місці'}
            </div>
            <span style="font-size:0.7rem;color:var(--text-dim);">(Натисни для скидання)</span>
          ` : `
            <div style="font-size:2rem;opacity:0.4;">⚡</div>
            <div class="net-slot-name">${slot.name}</div>
            <div class="net-slot-desc">${slot.desc}</div>
            <span style="font-size:0.7rem;color:var(--cyan);margin-top:6px;">[Обери пристрій нижче]</span>
          `}
        </div>
      `;
    });

    html += `
        </div>
        
        <div class="pool-label" style="text-align:center;">Обери або перетягни пристрій у потрібний слот мережі (варіанти перемішано):</div>
        <div class="net-devices-palette">
    `;

    available.forEach(dev => {
      html += `
        <div class="net-device-item" draggable="true"
             ondragstart="app.dragStartNetDevice(event, '${dev.id}')"
             onclick="app.assignNetDeviceClick('${dev.id}')">
          <img src="${dev.icon}" alt="${dev.name}" />
          <span>${dev.name}</span>
        </div>
      `;
    });

    html += `
        </div>
        <div class="feedback-explanation" id="mod5NetFb"></div>
      </div>
    `;

    // Quiz Questions (2 * 3 = 6 points)
    html += `
      <div class="quiz-block">
        <div class="workspace-title">📡 Завдання 2: Перевірка знань про мережеві технології (6 балів)</div>
    `;

    data.quiz.forEach((q, idx) => {
      html += `
        <div class="quiz-card">
          <div class="quiz-question">${idx + 1}. ${q.question}</div>
          <div class="quiz-options">
      `;
      q.options.forEach((opt, oIdx) => {
        const isSelected = this.state.mod5Answers && this.state.mod5Answers[`quiz_${idx}`] === oIdx;
        const statusClass = isSelected ? (oIdx === q.correct ? "correct-choice" : "wrong-choice") : "";
        html += `
          <button class="quiz-opt-btn ${statusClass}" onclick="app.selectMod5Quiz(${idx}, ${oIdx}, ${q.correct}, '${q.explanation.replace(/'/g, "\\'")}')">
            ${opt}
          </button>
        `;
      });
      html += `
          </div>
          <div class="feedback-explanation" id="mod5QuizFb_${idx}"></div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  dragStartNetDevice(e, devId) {
    e.dataTransfer.setData("text/plain", devId);
  }

  dropDeviceToNetSlot(e, slotStep) {
    e.preventDefault();
    const devId = e.dataTransfer.getData("text/plain");
    if (devId) {
      this.assignDeviceToSlot(devId, slotStep);
    }
  }

  assignNetDeviceClick(devId) {
    let targetStep = null;
    for (let s = 1; s <= 5; s++) {
      if (!this.state.mod5Slots[s]) {
        targetStep = s;
        break;
      }
    }
    if (targetStep) {
      this.assignDeviceToSlot(devId, targetStep);
    } else {
      alert("Всі 5 слотів вже заповнені! Натисни на будь-який слот, щоб звільнити його.");
    }
  }

  assignDeviceToSlot(devId, slotStep) {
    this.state.mod5Slots[slotStep] = devId;
    const isCorrect = window.MODULES_DATA[4].topologyChallenge.slots.find(s => s.step === slotStep).correctDevice === devId;
    this.playSound(isCorrect ? "success" : "error");

    this.checkMod5Topology();
    this.recalculateMod5Score();
    this.renderModule(5);
  }

  clearMod5Slot(slotStep) {
    if (this.state.mod5Slots[slotStep]) {
      this.state.mod5Slots[slotStep] = null;
      this.playSound("click");
      this.recalculateMod5Score();
      this.renderModule(5);
    }
  }

  checkMod5Topology() {
    let allFilled = true;
    let allCorrect = true;
    for (let s = 1; s <= 5; s++) {
      const assigned = this.state.mod5Slots[s];
      if (!assigned) allFilled = false;
      const expected = window.MODULES_DATA[4].topologyChallenge.slots.find(slot => slot.step === s).correctDevice;
      if (assigned !== expected) allCorrect = false;
    }

    const fbEl = document.getElementById("mod5NetFb");
    if (fbEl && allFilled) {
      fbEl.className = `feedback-explanation show ${allCorrect ? "success" : "error"}`;
      fbEl.textContent = allCorrect
        ? "🎉 Топологію мережі зібрано бездоганно! Трафік вільно проходить від модема через роутер і свіч до учнівських ПК та Wi-Fi!"
        : "Є помилки у ланцюжку передачі сигналу! Перевір черговість Модем ➡️ Роутер ➡️ Свіч ➡️ ПК.";
    }
  }

  selectMod5Quiz(qIdx, oIdx, correctIdx, explanation) {
    if (!this.state.mod5Answers) this.state.mod5Answers = {};
    this.state.mod5Answers[`quiz_${qIdx}`] = oIdx;
    const isCorrect = oIdx === correctIdx;
    const fbEl = document.getElementById(`mod5QuizFb_${qIdx}`);
    if (fbEl) {
      fbEl.className = `feedback-explanation show ${isCorrect ? "success" : "error"}`;
      fbEl.textContent = isCorrect ? `Правильно! ${explanation}` : `Невірно. ${explanation}`;
    }
    this.playSound(isCorrect ? "success" : "error");
    this.recalculateMod5Score();
    this.renderModule(5);
  }

  recalculateMod5Score() {
    let score = 0;
    // 5 slots * 2.8 = 14 points
    const slots = window.MODULES_DATA[4].topologyChallenge.slots;
    slots.forEach(s => {
      if (this.state.mod5Slots[s.step] === s.correctDevice) {
        score += 2.8;
      }
    });

    // 2 quiz * 3 = 6 points
    const quiz = window.MODULES_DATA[4].quiz;
    quiz.forEach((q, idx) => {
      if (this.state.mod5Answers && this.state.mod5Answers[`quiz_${idx}`] === q.correct) {
        score += 3;
      }
    });

    this.state.moduleScores[5] = Math.min(Math.round(score), this.state.maxModuleScores[5]);
    if (score >= 12 && !this.state.completedModules.includes(5)) {
      this.state.completedModules.push(5);
    }
    this.updateHUD();
    this.saveState();
  }

  /* ==========================================================================
     MODULE 6: COMPUTER TYPES (SHUFFLED OPTIONS) (15 POINTS)
     ========================================================================== */
  renderModule6(data, container) {
    let html = `
      <div class="workspace-title">💻 Експертний консиліум: Види сучасних комп'ютерів (15 балів)</div>
      <p class="workspace-instruction">Обери найкращий комп'ютер для кожного із 5 реалістичних кейсів (варіанти перемішано):</p>
      <div class="pc-types-grid">
    `;

    data.scenarios.forEach(sc => {
      html += `
        <div class="pc-scenario-card">
          <div class="pc-scenario-title">${sc.title}</div>
          <div class="pc-scenario-desc">${sc.description}</div>
          <div class="pc-options-list">
      `;

      sc.options.forEach(opt => {
        const isSelected = this.state.mod6Answers[sc.id] === opt.type;
        const statusClass = isSelected ? (opt.correct ? "correct-choice" : "wrong-choice") : "";

        html += `
          <div class="pc-option-card ${statusClass}" 
               onclick="app.selectMod6Scenario('${sc.id}', '${opt.type}', ${opt.correct}, '${sc.explanation.replace(/'/g, "\\'")}')">
            <img src="${opt.icon}" alt="${opt.name}" />
            <span>${opt.name}</span>
          </div>
        `;
      });

      html += `
          </div>
          <div class="feedback-explanation" id="mod6Fb_${sc.id}"></div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  selectMod6Scenario(scId, optType, isCorrect, explanation) {
    this.state.mod6Answers[scId] = optType;
    const fbEl = document.getElementById(`mod6Fb_${scId}`);
    if (fbEl) {
      fbEl.className = `feedback-explanation show ${isCorrect ? "success" : "error"}`;
      fbEl.textContent = isCorrect ? `Відмінно! ${explanation}` : `Не зовсім підходить. ${explanation}`;
    }
    this.playSound(isCorrect ? "success" : "error");
    this.recalculateMod6Score();
    this.renderModule(6);
  }

  recalculateMod6Score() {
    let score = 0;
    const scenarios = window.MODULES_DATA[5].scenarios;
    scenarios.forEach(sc => {
      const userChoice = this.state.mod6Answers[sc.id];
      const correctOpt = sc.options.find(o => o.correct);
      if (userChoice === correctOpt.type) {
        score += 3; // 5 * 3 = 15 points
      }
    });

    this.state.moduleScores[6] = Math.min(score, this.state.maxModuleScores[6]);
    if (score >= 9 && !this.state.completedModules.includes(6)) {
      this.state.completedModules.push(6);
    }
    this.updateHUD();
    this.saveState();
  }

  /* ==========================================================================
     FINISH QUEST & CERTIFICATE DISPLAY
     ========================================================================== */
  finishQuest() {
    this.playSound("fanfare");
    this.startConfetti();

    const gradeData = this.calculateTotalGrade();

    const resNameEl = document.getElementById("resStudentName");
    const resGradeEl = document.getElementById("resGradeValue");
    const resLevelEl = document.getElementById("resLevelValue");
    const resScoreEl = document.getElementById("resScoreValue");
    const resPercentEl = document.getElementById("resPercentValue");
    const resCommentEl = document.getElementById("resCommentary");

    if (resNameEl) resNameEl.textContent = this.state.student.fullName;
    if (resGradeEl) {
      resGradeEl.textContent = `${gradeData.grade} з 12`;
      resGradeEl.style.color = gradeData.color;
    }
    if (resLevelEl) resLevelEl.textContent = gradeData.level;
    if (resScoreEl) resScoreEl.textContent = `${gradeData.pointsEarned} / 100`;
    if (resPercentEl) resPercentEl.textContent = `${gradeData.percentage}%`;
    if (resCommentEl) resCommentEl.textContent = gradeData.commentary;

    window.certificateManager.renderCertificateData(this.state.student, gradeData);
    this.navigateToScreen("resultsView");
  }

  startConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#00f3ff", "#38bdf8", "#a855f7", "#f59e0b", "#10b981", "#ef4444", "#ffffff"];
    const particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        velX: (Math.random() - 0.5) * 4,
        velY: Math.random() * 4 + 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8
      });
    }

    let frames = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.velX;
        p.y += p.velY;
        p.rot += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });

      frames++;
      if (frames < 300) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    animate();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new HardwareQuestApp();
});
