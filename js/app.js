/**
 * HardwareQuest: Збери свій ПК
 * Core Game Engine, UI Controller and Sound Synthesizer
 */

class HardwareQuestApp {
  constructor() {
    this.storageKey = "hardware_quest_save_v1";
    this.audioEnabled = true;
    this.audioCtx = null;
    
    // Default State
    this.state = {
      student: {
        fullName: "",
        studentClass: "8-А",
        certId: ""
      },
      currentScreen: "start", // 'start', 'module_1'..'module_6', 'results'
      currentModuleId: 1,
      moduleScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      maxModuleScores: { 1: 15, 2: 20, 3: 15, 4: 15, 5: 20, 6: 15 },
      completedModules: [],
      // Transient module interaction states
      mod1Answers: {},
      mod2Sorted: { volatile: [], non_volatile: [] },
      mod2Ladder: [],
      mod3Answers: {},
      mod4PairsMatched: [],
      mod4SelectedSource: null,
      mod5Slots: { 1: null, 2: null, 3: null, 4: null, 5: null },
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
     AUDIO SYNTHESIZER (Web Audio API - 100% self-contained, no external mp3s)
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
      // Pleasant dual chime
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
      // Victory celebration chord progression
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
     LOCAL STORAGE STATE MANAGEMENT
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
     EVENT LISTENERS & SCREEN SWITCHING
     ========================================================================== */
  setupEventListeners() {
    // Audio Toggle
    const audioBtn = document.getElementById("audioToggleBtn");
    if (audioBtn) {
      audioBtn.addEventListener("click", () => this.toggleAudio());
    }

    // Rules Modal Triggers
    const openRulesBtn = document.getElementById("btnOpenRules");
    const closeRulesBtn = document.getElementById("btnCloseRules");
    const modal = document.getElementById("rulesModal");
    if (openRulesBtn && modal) {
      openRulesBtn.addEventListener("click", () => modal.classList.add("active"));
    }
    if (closeRulesBtn && modal) {
      closeRulesBtn.addEventListener("click", () => modal.classList.remove("active"));
    }
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });
    }

    // Registration Form
    const startForm = document.getElementById("studentRegistrationForm");
    if (startForm) {
      startForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleStartQuest();
      });
    }

    // Resume button
    const resumeBtn = document.getElementById("btnResumeQuest");
    if (resumeBtn) {
      resumeBtn.addEventListener("click", () => {
        this.playSound("click");
        this.navigateToScreen(`module_${this.state.currentModuleId}`);
      });
    }

    // Progress bar step clicks
    document.querySelectorAll(".step-item").forEach(item => {
      item.addEventListener("click", () => {
        const modId = parseInt(item.getAttribute("data-module-id"));
        if (this.state.student.fullName) {
          this.navigateToModule(modId);
        }
      });
    });

    // Certificate Action Buttons
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

    const copyBtn = document.getElementById("btnCopyResults");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        this.playSound("click");
        const gradeData = this.calculateTotalGrade();
        window.certificateManager.copyResultsText(this.state.student, gradeData);
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
    const classInput = document.getElementById("studentClassSelect");

    const fullName = nameInput ? nameInput.value.trim() : "";
    const studentClass = classInput ? classInput.value : "8-А";

    if (!fullName || fullName.length < 3) {
      alert("Будь ласка, введи своє справжнє Прізвище та Ім'я для формування сертифіката!");
      if (nameInput) nameInput.focus();
      return;
    }

    this.state.student.fullName = fullName;
    this.state.student.studentClass = studentClass;
    this.state.student.certId = window.certificateManager.generateCertificateId(studentClass);
    
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
    // Student badge
    const studentTagEl = document.getElementById("hudStudentTag");
    if (studentTagEl) {
      if (this.state.student.fullName) {
        studentTagEl.style.display = "flex";
        studentTagEl.innerHTML = `👤 <strong>${this.state.student.fullName}</strong> (${this.state.student.studentClass})`;
      } else {
        studentTagEl.style.display = "none";
      }
    }

    // Score badge
    const hudScoreEl = document.getElementById("hudScoreValue");
    if (hudScoreEl) {
      const totalPoints = this.calculateEarnedPoints();
      hudScoreEl.textContent = `${totalPoints} б.`;
    }

    // Progress Steps
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
    return Object.values(this.state.moduleScores).reduce((a, b) => a + b, 0);
  }

  calculateTotalGrade() {
    const earned = this.calculateEarnedPoints();
    const maxPoints = Object.values(this.state.maxModuleScores).reduce((a, b) => a + b, 0);
    return window.calculateUkrainianGrade(earned, maxPoints);
  }

  /* ==========================================================================
     MODULE RENDERER ROUTER
     ========================================================================== */
  renderModule(modId) {
    const moduleData = window.MODULES_DATA.find(m => m.id === modId);
    if (!moduleData) return;

    // Header info
    document.getElementById("modMetaBadge").textContent = moduleData.badge;
    document.getElementById("modMainTitle").textContent = moduleData.title;
    document.getElementById("modDescText").textContent = moduleData.description;
    document.getElementById("modHeaderIcon").src = moduleData.icon;

    // Theory summary and points
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

    // Render interactive workspace
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

    // Setup Next / Finish button in footer
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
     MODULE 1: CPU CONFIGURATOR & QUIZ
     ========================================================================== */
  renderModule1(data, container) {
    let html = `
      <div class="workspace-title">⚙️ Завдання 1: Конфігуратор процесора під задачу</div>
      <p class="workspace-instruction">${data.configurator.instruction}</p>
      <div class="configurator-grid">
    `;

    data.configurator.scenarios.forEach((sc, scIdx) => {
      html += `
        <div class="config-card" id="configCard_${sc.id}">
          <div class="config-card-header">
            <span class="config-scenario-icon">${sc.icon}</span>
            <div>
              <div class="config-scenario-name">${sc.name}</div>
              <div class="config-scenario-desc">${sc.purpose}</div>
            </div>
          </div>
      `;

      Object.keys(sc.options).forEach(optKey => {
        const labelText = optKey === "cores" ? "Кількість ядер:" : optKey === "freq" ? "Тактова частота:" : optKey === "graphics" ? "Відеосистема:" : optKey === "cache" ? "Кеш-пам'ять:" : "Надійність:";
        html += `
          <div class="config-select-group">
            <span class="config-select-label">${labelText}</span>
            <div class="config-options">
        `;
        sc.options[optKey].forEach((opt, optIdx) => {
          const isSelected = this.state.mod1Answers[`${sc.id}_${optKey}`] === optIdx;
          const statusClass = isSelected ? (opt.correct ? "correct-choice" : "wrong-choice") : "";
          html += `
            <button class="config-option-btn ${statusClass}" 
                    onclick="app.selectMod1Option('${sc.id}', '${optKey}', ${optIdx}, ${opt.correct}, '${opt.feedback.replace(/'/g, "\\'")}')">
              ${opt.val}
            </button>
          `;
        });
        html += `</div></div>`;
      });

      html += `<div class="feedback-explanation" id="feedback_${sc.id}"></div></div>`;
    });

    html += `</div>`;

    // Quiz Questions
    html += `
      <div class="quiz-block">
        <div class="workspace-title">📝 Завдання 2: Перевірка знань про процесор</div>
    `;

    data.quiz.forEach((q, qIdx) => {
      html += `
        <div class="quiz-card">
          <div class="quiz-question">${qIdx + 1}. ${q.question}</div>
          <div class="quiz-options">
      `;
      q.options.forEach((optText, oIdx) => {
        const isSelected = this.state.mod1Answers[`quiz_${qIdx}`] === oIdx;
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

  selectMod1Option(scId, optKey, optIdx, isCorrect, feedback) {
    this.state.mod1Answers[`${scId}_${optKey}`] = optIdx;
    const fbEl = document.getElementById(`feedback_${scId}`);
    if (fbEl) {
      fbEl.className = `feedback-explanation show ${isCorrect ? "success" : "error"}`;
      fbEl.textContent = feedback;
    }
    this.playSound(isCorrect ? "success" : "error");
    this.recalculateMod1Score();
    this.renderModule(1);
  }

  selectMod1Quiz(qIdx, oIdx, correctIdx, explanation) {
    this.state.mod1Answers[`quiz_${qIdx}`] = oIdx;
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
    const m1Data = window.MODULES_DATA[0];
    
    // Check configurator
    m1Data.configurator.scenarios.forEach(sc => {
      let scenarioCorrect = true;
      Object.keys(sc.options).forEach(optKey => {
        const userChoice = this.state.mod1Answers[`${sc.id}_${optKey}`];
        if (userChoice !== undefined && sc.options[optKey][userChoice] && sc.options[optKey][userChoice].correct) {
          score += 1.5;
        } else {
          scenarioCorrect = false;
        }
      });
    });

    // Check quiz
    m1Data.quiz.forEach((q, idx) => {
      if (this.state.mod1Answers[`quiz_${idx}`] === q.correct) {
        score += 2.5;
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
     MODULE 2: MEMORY SORTING & SPEED LADDER
     ========================================================================== */
  renderModule2(data, container) {
    const allItems = data.sortingChallenge.items;
    const volatileItems = this.state.mod2Sorted.volatile || [];
    const nonVolatileItems = this.state.mod2Sorted.non_volatile || [];
    const poolItems = allItems.filter(item => !volatileItems.includes(item.id) && !nonVolatileItems.includes(item.id));

    let html = `
      <div class="workspace-title">💾 Завдання 1: ${data.sortingChallenge.title}</div>
      <p class="workspace-instruction">${data.sortingChallenge.instruction}</p>
      
      <!-- Pool of items to sort -->
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

      <!-- Sorting Buckets -->
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
                 onclick="app.removeItemFromBucket('${itemId}', '${cat.id}')" title="Натисни, щоб повернути у загальний список">
              <img src="${itemObj.icon}" alt="${itemObj.name}" />
              <span>${itemObj.name}</span>
              <span style="font-size:0.75rem;margin-left:auto;">${isCorrect ? '✅' : '❌'} (повернути)</span>
            </div>
          `;
        }
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `</div>`;

    // Speed Ladder
    html += `
      <div class="quiz-block">
        <div class="workspace-title">⚡ Завдання 2: ${data.speedLadder.title}</div>
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
    const choice = confirm("Перемістити цей накопичувач у кошик «Енергозалежна пам'ять»?\n(Натисни «ОК» для Енергозалежної або «Скасувати» для Енергонезалежної)");
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

    // Sorting scores (up to 12 points)
    items.forEach(item => {
      const inVolatile = (this.state.mod2Sorted.volatile || []).includes(item.id);
      const inNonVolatile = (this.state.mod2Sorted.non_volatile || []).includes(item.id);

      if (item.category === "volatile" && inVolatile) score += 1.7;
      if (item.category === "non_volatile" && inNonVolatile) score += 1.7;
    });

    // Ladder score (up to 8 points)
    const correct = window.MODULES_DATA[1].speedLadder.correctOrder;
    let ladderCorrect = 0;
    for (let i = 0; i < 4; i++) {
      if (this.state.mod2Ladder[i] === correct[i]) ladderCorrect++;
    }
    score += ladderCorrect * 2;

    this.state.moduleScores[2] = Math.min(Math.round(score), this.state.maxModuleScores[2]);
    if (score >= 12 && !this.state.completedModules.includes(2)) {
      this.state.completedModules.push(2);
    }
    this.updateHUD();
    this.saveState();
  }

  /* ==========================================================================
     MODULE 3: INPUT DEVICES DETECTIVE
     ========================================================================== */
  renderModule3(data, container) {
    let html = `
      <div class="workspace-title">🔍 Завдання 1: Детектив апаратного забезпечення</div>
      <p class="workspace-instruction">Уважно прочитай потреби кожного користувача та обери для нього правильний пристрій введення:</p>
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

    // Data type table
    html += `
      <div class="quiz-block">
        <div class="workspace-title">📊 Класифікація пристроїв за типом вхідних даних</div>
        <table class="grading-table" style="margin-top:10px;">
          <thead>
            <tr><th>Пристрій</th><th>Тип даних</th><th>Принцип роботи</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Клавіатура</strong></td><td>Символьні та командні</td><td>Замикання контактів або оптичний сенсор клавіш</td></tr>
            <tr><td><strong>Миша / Тачпад</strong></td><td>Координатні (просторові)</td><td>Оптичний лазер зчитує мікрорельєф поверхні</td></tr>
            <tr><td><strong>Сканер / Веб-камера</strong></td><td>Графічні (растрові зображення)</td><td>Фоточутлива матриця (CCD / CMOS) фіксує світло</td></tr>
            <tr><td><strong>Мікрофон</strong></td><td>Звукові (акустичні)</td><td>Мембрана коливається від звуку і генерує електричний імпульс</td></tr>
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
      fbEl.textContent = isCorrect ? successMsg : "Цей пристрій не відповідає потребам завдання. Спробуй інший!";
    }

    this.playSound(isCorrect ? "success" : "error");
    this.recalculateMod3Score();
    this.renderModule(3);
  }

  recalculateMod3Score() {
    let score = 0;
    const cases = window.MODULES_DATA[2].cases;
    cases.forEach(c => {
      if (this.state.mod3Answers[c.id] === c.targetDevice) {
        score += 3.75;
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
     MODULE 4: OUTPUT DEVICES MATCHING
     ========================================================================== */
  renderModule4(data, container) {
    const pairs = data.matchingPairs;
    const matchedList = this.state.mod4PairsMatched || [];

    let html = `
      <div class="workspace-title">🔗 Встановлення відповідностей (Matching Pairs)</div>
      <p class="workspace-instruction">
        Натисни на пристрій виведення ліворуч (блакитна рамка), а потім на його опис сфери застосування праворуч!
      </p>
      <div class="matching-board">
        <!-- Left Column: Devices -->
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
        <!-- Right Column: Descriptions -->
        <div class="matching-col">
    `;

    // Render shuffled or indexed descriptions
    pairs.forEach(p => {
      const isMatched = matchedList.includes(p.id);
      html += `
        <div class="match-desc-card ${isMatched ? 'match-paired' : ''}"
             onclick="app.selectMod4Target('${p.id}')">
          ${p.targetDesc}
          ${isMatched ? ` <strong style="color:var(--green);">(Правильно)</strong>` : ''}
        </div>
      `;
    });

    html += `
        </div>
      </div>
      <div class="feedback-explanation" id="mod4MatchFeedback"></div>
    `;

    // Blitz quiz
    html += `
      <div class="quiz-block">
        <div class="workspace-title">🖨️ Бліц-тест: Вибір принтера</div>
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
      // Correct Match!
      if (!this.state.mod4PairsMatched.includes(pairId)) {
        this.state.mod4PairsMatched.push(pairId);
      }
      this.playSound("success");
      if (fbEl) {
        fbEl.className = "feedback-explanation show success";
        fbEl.textContent = "Чудово! Правильна пара!";
      }
    } else {
      // Wrong Match
      this.playSound("error");
      if (fbEl) {
        fbEl.className = "feedback-explanation show error";
        fbEl.textContent = "Невірна відповідність! Спробуй зіставити уважніше.";
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
    let score = (this.state.mod4PairsMatched || []).length * 2;
    if (this.state.mod4Answers && this.state.mod4Answers[`quiz_0`] === 1) {
      score += 3;
    }
    this.state.moduleScores[4] = Math.min(score, this.state.maxModuleScores[4]);
    if (score >= 10 && !this.state.completedModules.includes(4)) {
      this.state.completedModules.push(4);
    }
    this.updateHUD();
    this.saveState();
  }

  /* ==========================================================================
     MODULE 5: NETWORK TOPOLOGY BUILDER
     ========================================================================== */
  renderModule5(data, container) {
    const slots = data.topologyChallenge.slots;
    const available = data.topologyChallenge.availableDevices;

    let html = `
      <div class="workspace-title">🌐 Завдання 1: ${data.topologyChallenge.title}</div>
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
        
        <!-- Palette of devices -->
        <div class="pool-label" style="text-align:center;">Обери або перетягни пристрій у потрібний слот мережі:</div>
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

    // Quiz Questions
    html += `
      <div class="quiz-block">
        <div class="workspace-title">📡 Завдання 2: Перевірка знань про мережу</div>
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
    // Find first empty slot
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
        ? "🎉 Топологію мережі зібрано бездоганно! Трафік вільно проходить від модема через роутер і світч до учнівських ПК та Wi-Fi!"
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
    // 5 topology slots * 2.5 = 12.5 points
    const slots = window.MODULES_DATA[4].topologyChallenge.slots;
    slots.forEach(s => {
      if (this.state.mod5Slots[s.step] === s.correctDevice) {
        score += 2.5;
      }
    });

    // 2 quiz questions * 3.75 = 7.5 points
    const quiz = window.MODULES_DATA[4].quiz;
    quiz.forEach((q, idx) => {
      if (this.state.mod5Answers && this.state.mod5Answers[`quiz_${idx}`] === q.correct) {
        score += 3.75;
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
     MODULE 6: COMPUTER TYPES SCENARIOS
     ========================================================================== */
  renderModule6(data, container) {
    let html = `
      <div class="workspace-title">💻 Експертний консиліум: Види сучасних комп'ютерів</div>
      <p class="workspace-instruction">Обери найкращий комп'ютер для кожного із 5 реалістичних кейсів:</p>
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
        score += 3;
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

    // Populate Results Screen
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
    if (resScoreEl) resScoreEl.textContent = `${gradeData.pointsEarned} / ${gradeData.maxPoints}`;
    if (resPercentEl) resPercentEl.textContent = `${gradeData.percentage}%`;
    if (resCommentEl) resCommentEl.textContent = gradeData.commentary;

    // Fill Certificate Template
    window.certificateManager.renderCertificateData(this.state.student, gradeData);

    this.navigateToScreen("resultsView");
  }

  /* ==========================================================================
     CONFETTI PARTICLE SYSTEM
     ========================================================================== */
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

// Global initialization
window.addEventListener("DOMContentLoaded", () => {
  window.app = new HardwareQuestApp();
});
