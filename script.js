window.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded ✅");

  // =========================================================
  // SAFE HELPERS
  // =========================================================
  const $ = (id) => document.getElementById(id);

  function on(id, evt, fn) {
    const el = $(id);
    if (!el) {
      console.warn(`⚠️ #${id} not found in HTML`);
      return;
    }
    el.addEventListener(evt, fn);
  }

  // =========================================================
  // CHAOS LEVEL
  // =========================================================
  const slider = $("chaosSlider");
  const label = $("chaosLabel");

  function getChaosLabel(value) {
    if (value < 20) return "This is freedom";
    if (value < 40) return "Handling it";
    if (value < 60) return "Balanced";
    if (value < 80) return "Surviving";
    return "Certified disaster 🔥";
  }

  
    on("chaosSlider", "input", () => {
  if (!slider || !label) return;
  const val = parseInt(slider.value, 10);
  label.textContent = getChaosLabel(val);

  // color shifting
  const labelEl = $("chaosLabel");
  if (!labelEl) return;
  if (val < 20) labelEl.style.background = "#b8ff3d";       // lime
  else if (val < 40) labelEl.style.background = "#00f0ff";  // cyan
  else if (val < 60) labelEl.style.background = "#ffe600";  // yellow
  else if (val < 80) labelEl.style.background = "#ff8a3d";  // orange
  else labelEl.style.background = "#ff2fb9";                // hot pink
});
    

  on("logChaosBtn", "click", () => {
    if (!slider || !label) return;
    const today = new Date().toLocaleDateString();
    const entry = {
      date: today,
      value: slider.value,
      label: label.textContent,
    };
    localStorage.setItem("todayMood", JSON.stringify(entry));
    const lastLogged = $("chaosLog");
    if (lastLogged) lastLogged.textContent = `Logged: ${entry.label} on ${entry.date}`;
  });

  // restore saved mood on load
  const savedMood = localStorage.getItem("todayMood");
  if (savedMood) {
    try {
      const entry = JSON.parse(savedMood);
      const lastLogged = $("chaosLog");
      if (lastLogged) lastLogged.textContent = `Logged: ${entry.label} on ${entry.date}`;
    } catch (e) {}
  }

  // =========================================================
  // DEADLINE COUNTDOWN
  // =========================================================
  function getUrgencyMessage(daysLeft) {
    if (daysLeft < 0) return "This one's overdue. It's okay. Breathe.";
    if (daysLeft === 0) return "It's TODAY. Go.";
    if (daysLeft <= 1) return "Tomorrow. No pressure (there's pressure).";
    if (daysLeft <= 3) return "Complete it today so we can read!!!";
    if (daysLeft <= 7) return "This week. You've got time, use it wisely.";
    return "Chill... for now.";
  }

  function renderCountdown(name, dateStr) {
    const display = $("deadlineOutput");
    if (!display) return;

    const target = new Date(dateStr);
    const now = new Date();
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const daysLeft = Math.round((target - now) / 86400000);

    display.innerHTML = `
      <div class="deadline ${daysLeft < 0 ? "overdue" : daysLeft <= 3 ? "soon" : ""}">
        <strong>${name}</strong><br>
        ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left<br>
        <em>${getUrgencyMessage(daysLeft)}</em>
      </div>
    `;
  }

  on("setDeadlineBtn", "click", () => {
    const nameInput = $("deadlineName");
    const dateInput = $("deadlineDate");
    if (!nameInput || !dateInput) return;

    const name = nameInput.value.trim() || "Untitled deadline";
    const dateStr = dateInput.value;
    if (!dateStr) return;

    localStorage.setItem("nextDeadline", JSON.stringify({ name, dateStr }));
    renderCountdown(name, dateStr);
  });

  const savedDeadline = localStorage.getItem("nextDeadline");
  if (savedDeadline) {
    try {
      const { name, dateStr } = JSON.parse(savedDeadline);
      renderCountdown(name, dateStr);
    } catch (e) {}
  }

  // =========================================================
  // HOW COOKED AM I
  // =========================================================
  const verdicts = [
    "Main character energy. Nothing can stop you today.",
    "You're surviving on caffeine and vibes. Respect.",
    "Certified disaster, but a charming one.",
    "Productivity levels: suspiciously high. Don't question it.",
    "You opened 14 tabs and closed none. A moment of silence.",
    "Today you are powered entirely by coffee and deadlines.",
    "Somehow still standing. Iconic, honestly.",
    "You've achieved peak procrastination. A rare skill.",
    "Plot twist: today might actually go well.",
    "Your GPA and your sleep schedule are in a custody battle.",
  ];

  on("cookBtn", "click", () => {
    const out = $("cookOutput");
    if (!out) return;
    out.textContent = verdicts[Math.floor(Math.random() * verdicts.length)];
  });

  // =========================================================
  // TO-DO
  // =========================================================
  const todoInput = $("todoInput");
  const todoList = $("todoList");
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function renderTodos() {
    if (!todoList) return;
    todoList.innerHTML = "";
    todos.forEach((todo, index) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.done;
      checkbox.addEventListener("change", () => {
        todos[index].done = checkbox.checked;
        saveTodos();
        renderTodos();
      });

      const text = document.createElement("span");
      text.textContent = todo.text;
      if (todo.done) text.classList.add("done");

      const del = document.createElement("button");
      del.textContent = "✕";
      del.addEventListener("click", () => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
      });

      li.append(checkbox, text, del);
      todoList.appendChild(li);
    });
  }

  function addTodo() {
    if (!todoInput) return;
    const text = todoInput.value.trim();
    if (!text) return;
    todos.push({ text, done: false });
    todoInput.value = "";
    saveTodos();
    renderTodos();
  }

  on("addTodo", "click", addTodo);
  on("todoInput", "keydown", (e) => {
    if (e.key === "Enter") addTodo();
  });

  renderTodos();

  // =========================================================
  // STUDY HOURS
  // =========================================================
  const studySubject = $("studySubject");
  const studyHours = $("studyHours");
  const studyTotals = $("studyTotals");
  const studyList = $("studyList");

  let studyLogs = JSON.parse(localStorage.getItem("studyLogs")) || [];
  const getTodayKey = () => new Date().toLocaleDateString("en-CA");
  const roundHours = (n) => Math.round(n * 10) / 10;

  function saveStudy() {
    localStorage.setItem("studyLogs", JSON.stringify(studyLogs));
  }

  function renderStudy() {
    if (!studyTotals || !studyList) return;
    const today = getTodayKey();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 6);
    const weekStart = cutoff.toLocaleDateString("en-CA");

    const todayTotal = studyLogs
      .filter((l) => l.date === today)
      .reduce((s, l) => s + l.hours, 0);

    const weekTotal = studyLogs
      .filter((l) => l.date >= weekStart)
      .reduce((s, l) => s + l.hours, 0);

    studyTotals.textContent = `Today: ${roundHours(todayTotal)}h · Last 7 days: ${roundHours(weekTotal)}h`;

    studyList.innerHTML = "";
    studyLogs.forEach((log, index) => {
      if (log.date !== today) return;
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = `${log.subject}: ${log.hours}h`;
      const del = document.createElement("button");
      del.textContent = "✕";
      del.addEventListener("click", () => {
        studyLogs.splice(index, 1);
        saveStudy();
        renderStudy();
      });
      li.append(span, del);
      studyList.appendChild(li);
    });
  }

  on("addStudy", "click", () => {
    if (!studyHours || !studySubject) return;
    const hours = parseFloat(studyHours.value);
    if (!hours || hours <= 0) return;
    const subject = studySubject.value.trim() || "General";
    studyLogs.push({ date: getTodayKey(), subject, hours });
    studySubject.value = "";
    studyHours.value = "";
    saveStudy();
    renderStudy();
  });

  renderStudy();

  // =========================================================
  // JOURNAL
  // =========================================================
  const journalInput = $("journalInput");
  const journalStatus = $("journalStatus");
  const journalList = $("journalList");

  let journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];

  function saveJournalData() {
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
  }

  function renderJournal() {
    if (!journalList) return;
    const today = getTodayKey();
    journalList.innerHTML = "";
    const past = journalEntries
      .filter((e) => e.date !== today)
      .sort((a, b) => b.date.localeCompare(a.date));

    past.forEach((entry) => {
      const li = document.createElement("li");
      const dateLine = document.createElement("strong");
      dateLine.textContent = entry.date;
      const body = document.createElement("p");
      body.textContent = entry.text;
      body.classList.add("journal-text");
      const del = document.createElement("button");
      del.textContent = "✕";
      del.addEventListener("click", () => {
        journalEntries = journalEntries.filter((e) => e.date !== entry.date);
        saveJournalData();
        renderJournal();
      });
      li.append(dateLine, body, del);
      journalList.appendChild(li);
    });
  }

  on("saveJournal", "click", () => {
    if (!journalInput) return;
    const text = journalInput.value.trim();
    if (!text) return;
    const today = getTodayKey();
    const existing = journalEntries.find((e) => e.date === today);
    if (existing) existing.text = text;
    else journalEntries.push({ date: today, text });
    saveJournalData();
    if (journalStatus) journalStatus.textContent = `Saved for ${today}`;
    renderJournal();
  });

  const todaysEntry = journalEntries.find((e) => e.date === getTodayKey());
  if (todaysEntry && journalInput) journalInput.value = todaysEntry.text;
  renderJournal();

  // =========================================================
  // EXCUSE GENERATOR
  // =========================================================
  const excuseTemplates = [
    "My commute is rickshaw and a prayer, so I couldn't make it.",
    "I was going to come, but then I blinked and it was {time}.",
    "I'm doing the assignments. Isn't that what matters?",
    "The rickshaw had other plans for me today.",
    "I was studying so hard I forgot it was a class day.",
    "My laptop died. My phone died. My will to live died. In that order.",
    "I thought class was canceled. I was wrong. I'm sorry.",
    "I got stuck in my room and time just...stopped.",
    "Traffic. Just... traffic. You know how it is.",
    "My alarm didn't go off. Yes, again. No, I don't know why.",
    "I was there in spirit!!! Does that count for attendance?",
    "I was going to come but I saw the weather and chose sleep (IT'S FALL)",
    "I was staring at my ceiling for 2 days",
    "I was finishing the assignment I missed last time :(",
    "The hangout with friends was calling and I answered!!!",
  ];

  const transports = ["2 buses", "3 buses", "a rickshaw", "a metro ride", "one very slow auto", "a borrowed bike"];
  const times = ["4pm", "8pm", "tomorrow", "next week", "midnight"];
  const places = ["cafeteria", "library", "parking lot", "campus gate", "study room"];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  on("excuseBtn", "click", () => {
    const out = $("excuseOutput");
    if (!out) return;
    let excuse = pick(excuseTemplates);
    excuse = excuse.replace("{transport}", pick(transports));
    excuse = excuse.replace("{time}", pick(times));
    excuse = excuse.replace("{place}", pick(places));
    out.textContent = excuse;
    out.classList.remove("pop");
    void out.offsetWidth;
    out.classList.add("pop");
  });

  on("copyExcuseBtn", "click", () => {
    const out = $("excuseOutput");
    if (!out) return;
    navigator.clipboard.writeText(out.textContent).then(() => {
      const btn = $("copyExcuseBtn");
      if (!btn) return;
      btn.textContent = "Copied! ✓";
      setTimeout(() => (btn.textContent = "Copy to clipboard"), 1500);
    });
  });

  // =========================================================
  // KICKOUT COUNTER
  // =========================================================
  const MAX_ABSENCES = 6;
  let missed = parseInt(localStorage.getItem("missed") || "0", 10);
  let attended = parseInt(localStorage.getItem("attended") || "0", 10);

  function updateKickout() {
    const left = Math.max(MAX_ABSENCES - missed, 0);
    const numberEl = $("absencesLeft");
    const verdictEl = $("kickoutVerdict");
    const fillEl = $("progressFill");

    if (numberEl) numberEl.textContent = left;

    let color = "#a3e635";
    if (left <= 3 && left > 1) color = "#facc15";
    if (left <= 1) color = "#ef4444";
    if (numberEl) numberEl.style.color = color;
    if (fillEl) {
      fillEl.style.background = color;
      fillEl.style.width = Math.min((missed / MAX_ABSENCES) * 100, 100) + "%";
    }

    if (!verdictEl) return;
    if (missed === 0) verdictEl.textContent = "Perfect attendance. Who even are you?";
    else if (left > 3) verdictEl.textContent = `${left} absences left. You're fine. Chill.`;
    else if (left > 1) verdictEl.textContent = `${left} left. Maybe show up soon? Just a thought.`;
    else if (left === 1) verdictEl.textContent = "ONE absence left. Do NOT sneeze wrong.";
    else verdictEl.textContent = "You're cooked. Write your goodbye letter. 💀";
  }

  on("missedBtn", "click", () => {
    missed++;
    localStorage.setItem("missed", missed);
    updateKickout();
  });

  on("attendedBtn", "click", () => {
    attended++;
    if (missed > 0) missed--;
    localStorage.setItem("missed", missed);
    localStorage.setItem("attended", attended);
    updateKickout();
  });

  on("resetBtn", "click", () => {
    if (confirm("Reset all attendance data?")) {
      missed = 0;
      attended = 0;
      localStorage.setItem("missed", 0);
      localStorage.setItem("attended", 0);
      updateKickout();
    }
  });

  updateKickout();
    // =========================================================
  // GUESTBOOK
  // =========================================================
  const guestName = $("guestName");
  const guestMessage = $("guestMessage");
  const guestbookList = $("guestbookList");
  let guestbookEntries = JSON.parse(localStorage.getItem("guestbook")) || [];

  function saveGuestbook() {
    localStorage.setItem("guestbook", JSON.stringify(guestbookEntries));
  }

  function renderGuestbook() {
    if (!guestbookList) return;
    guestbookList.innerHTML = "";

    if (guestbookEntries.length === 0) {
      const empty = document.createElement("li");
      empty.className = "guestbook-empty";
      empty.textContent = "No entries yet. Be the first to leave your mark!";
      empty.style.border = "2px dashed #999";
      empty.style.borderLeft = "2px dashed #999";
      empty.style.boxShadow = "none";
      guestbookList.appendChild(empty);
      return;
    }

    // newest first
    [...guestbookEntries].reverse().forEach((entry) => {
      const li = document.createElement("li");

      const nameEl = document.createElement("span");
      nameEl.className = "guest-name";
      nameEl.textContent = `> ${entry.name}`;

      const dateEl = document.createElement("span");
      dateEl.className = "guest-date";
      dateEl.textContent = entry.date;

      const msgEl = document.createElement("div");
      msgEl.className = "guest-message";
      msgEl.textContent = entry.message;

      li.append(nameEl, dateEl, msgEl);
      guestbookList.appendChild(li);
    });
  }

  on("signGuestbook", "click", () => {
    if (!guestName || !guestMessage) return;
    const name = guestName.value.trim() || "Anonymous";
    const message = guestMessage.value.trim();
    if (!message) {
      alert("You have to write a message, bestie 💖");
      return;
    }

    guestbookEntries.push({
      name,
      message,
      date: new Date().toLocaleString(),
    });

    saveGuestbook();
    renderGuestbook();

    guestName.value = "";
    guestMessage.value = "";
  });

  renderGuestbook();

  // =========================================================
  // UNDER CONSTRUCTION — last updated date
  // =========================================================
  const lastUpdatedEl = $("lastUpdated");
  if (lastUpdatedEl) {
    lastUpdatedEl.textContent = new Date().toLocaleDateString();
  }

  // =========================================================
  // CURSOR TRAIL (Y2K sparkle trail)
  // =========================================================
  let lastTrailTime = 0;
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 40) return; // throttle so it doesn't spam
    lastTrailTime = now;

    const dot = document.createElement("div");
    dot.className = "trail-dot";
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    document.body.appendChild(dot);

    // remove after animation ends
    setTimeout(() => dot.remove(), 700);
  });

  console.log("All listeners attached ✅");
});