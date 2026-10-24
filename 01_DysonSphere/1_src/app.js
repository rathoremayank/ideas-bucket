const DEFAULT_STATE = {
  stats: [
    { label: 'Health score', value: '8.2', delta: '+1.1 this month' },
    { label: 'Habit streak', value: '14 days', delta: '6 day best' },
    { label: 'Goal completion', value: '62%', delta: '+9% from last week' },
    { label: 'Debt focus', value: '3 actions', delta: 'Priority this month' }
  ],
  areas: [
    { name: 'Physical Health', score: 8.4, goal: 'Gym 4x/week', progress: 72, tone: 'health' },
    { name: 'Career Growth', score: 7.8, goal: 'MLOps transition path', progress: 68, tone: 'learning' },
    { name: 'Finances', score: 5.1, goal: 'Reduce debt burden', progress: 44, tone: 'finance' },
    { name: 'Relationships', score: 6.3, goal: 'Repair trust + communication', progress: 58, tone: 'relationships' },
    { name: 'Mindset', score: 7.2, goal: 'Less contempt, more awareness', progress: 66, tone: 'learning' },
    { name: 'Productivity', score: 6.8, goal: 'Deep work + less doomscrolling', progress: 61, tone: 'health' }
  ],
  habits: [
    { name: 'Gym session', type: 'Fitness', done: true },
    { name: 'Sleep by 11:00 PM', type: 'Recovery', done: true },
    { name: 'No phone in washroom', type: 'Focus', done: false },
    { name: 'Read 20 pages', type: 'Learning', done: true },
    { name: 'Journaling', type: 'Reflection', done: false },
    { name: 'Deep work block', type: 'Productivity', done: false },
    { name: 'Hydration target', type: 'Wellbeing', done: true }
  ],
  goals: [
    {
      title: 'Healthset Sprint-01',
      category: 'Health',
      tag: 'health',
      due: '30 days',
      progress: 72,
      status: 'Active',
      reason: 'Build consistency before adding more complexity.'
    },
    {
      title: 'Clear the credit card revolve',
      category: 'Finance',
      tag: 'finance',
      due: 'Next 90 days',
      progress: 46,
      status: 'In progress',
      reason: 'Reduce the highest-cost debt before stacking more obligations.'
    },
    {
      title: 'Learn MLOps/LLMOps roadmap',
      category: 'Learning',
      tag: 'learning',
      due: '2 quarters',
      progress: 63,
      status: 'Ahead of plan',
      reason: 'Transition from DevOps leadership into AI platform work.'
    },
    {
      title: 'Repair communication with wife',
      category: 'Relationships',
      tag: 'relationships',
      due: 'This month',
      progress: 52,
      status: 'Needs attention',
      reason: 'Address contempt pattern before relationship goals can move.'
    }
  ],
  journalEntries: [
    {
      date: 'Today',
      mood: 'Focused',
      entry: 'Gym was skipped because of work fatigue, but I kept my sleep target intact and reduced doomscrolling after dinner. The real win is not perfection — it is protecting the daily anchor.'
    },
    {
      date: 'Yesterday',
      mood: 'Motivated',
      entry: 'Made progress on the finance decision. The plan is to use the cheapest route first and avoid adding another revolving balance. I need to be stricter about my spending triggers.'
    },
    {
      date: '2 days ago',
      mood: 'Calm',
      entry: 'I noticed a tendency to judge others too quickly. I am choosing to slow down, listen more, and treat my home life with the same discipline I bring to work.'
    }
  ],
  planner: [
    { text: 'Complete the health reset blocks: gym, sleep, hydration, and deep work', priority: 'high' },
    { text: 'Resolve the finance decision on the margin demand before it snowballs', priority: 'high' },
    { text: 'Set one direct relationship repair conversation this week', priority: 'medium' },
    { text: 'Review spending and update the debt payoff tracker', priority: 'medium' },
    { text: 'Finish two MLOps learning modules and capture key notes', priority: 'medium' },
    { text: 'Plan meals and grocery shopping for the next five days', priority: 'low' },
    { text: 'Schedule a no-screen recovery block this weekend', priority: 'low' }
  ],
  trend: [54, 61, 59, 68, 72, 74]
};

const STORAGE_KEY = 'dysonsphere-state-v1';
const THEME_KEY = 'dysonsphere-theme';

function todayKey() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function normalizeHabits(habits) {
  const today = todayKey();
  return habits.map((habit) => {
    const completions = habit.completions && typeof habit.completions === 'object'
      ? { ...habit.completions }
      : {};

    if (habit.done && !Object.keys(completions).length) {
      completions[today] = true;
    }

    return { ...habit, completions, done: Boolean(completions[today]) };
  });
}

function loadState() {
  const fallback = cloneDefaultState();
  fallback.habits = normalizeHabits(fallback.habits);

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object') {
      return fallback;
    }

    return {
      ...fallback,
      ...parsed,
      stats: Array.isArray(parsed.stats) ? parsed.stats : fallback.stats,
      areas: Array.isArray(parsed.areas) ? parsed.areas : fallback.areas,
      habits: normalizeHabits(Array.isArray(parsed.habits) ? parsed.habits : fallback.habits),
      goals: Array.isArray(parsed.goals) ? parsed.goals : fallback.goals,
      journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries : fallback.journalEntries,
      planner: Array.isArray(parsed.planner) ? parsed.planner : fallback.planner,
      trend: Array.isArray(parsed.trend) ? parsed.trend : fallback.trend
    };
  } catch (error) {
    return fallback;
  }
}

const appState = loadState();
const sections = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel');
const themeButton = document.querySelector('.theme-toggle');
const exportButton = document.getElementById('exportDataBtn');
const importButton = document.getElementById('importDataBtn');
const importFileInput = document.getElementById('importFileInput');
const detailDialog = document.getElementById('detailDialog');
const detailContent = document.getElementById('detailContent');
let activeDetail = null;
let detailEditing = false;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (error) {
    console.warn('Unable to save app state to localStorage', error);
  }
}

function renderStats() {
  const statsGrid = document.getElementById('statsGrid');
  statsGrid.innerHTML = appState.stats
    .map(
      (stat) => `
        <div class="stat-card">
          <div class="label">
            <span>${escapeHtml(stat.label)}</span>
            <span>↗</span>
          </div>
          <strong>${escapeHtml(stat.value)}</strong>
          <div><small>${escapeHtml(stat.delta)}</small></div>
        </div>
      `
    )
    .join('');
}

function renderAreas() {
  const areaScorecard = document.getElementById('areaScorecard');
  const areasGrid = document.getElementById('areasGrid');

  areaScorecard.innerHTML = appState.areas
    .map(
      (area, index) => `
        <button class="area-row" type="button" data-detail-type="area" data-index="${index}">
          <span>${escapeHtml(area.name)}</span>
          <div class="score-bar">
            <div class="score-fill" style="width: ${area.score * 10}%"></div>
          </div>
          <strong>${area.score.toFixed(1)}</strong>
        </button>
      `
    )
    .join('');

  areasGrid.innerHTML = appState.areas
    .map(
      (area, index) => `
        <button class="area-card ${escapeHtml(area.tone)}" type="button" data-detail-type="area" data-index="${index}">
          <div class="area-top">
            <h4>${escapeHtml(area.name)}</h4>
            <span class="area-pill ${escapeHtml(area.tone)}">${escapeHtml(area.tone)}</span>
          </div>
          <div class="area-score">${area.score.toFixed(1)}</div>
          <p>${escapeHtml(area.goal)}</p>
          <div class="progress-line"><span style="width: ${area.progress}%"></span></div>
          <span class="card-open-hint">Open area details →</span>
        </button>
      `
    )
    .join('');
}

function renderHabits() {
  const habitList = document.getElementById('habitList');
  const summary = document.getElementById('habitSummary');
  const today = todayKey();
  const completed = appState.habits.filter((habit) => habit.completions?.[today]).length;

  summary.textContent = `${completed} of ${appState.habits.length} completed`;

  habitList.innerHTML = appState.habits
    .map(
      (habit, index) => `
        <button class="habit-item ${habit.completions?.[today] ? 'is-complete' : ''}" type="button" data-detail-type="habit" data-index="${index}">
          <div class="habit-name">
            <span class="habit-badge"></span>
            <div>
              <strong>${escapeHtml(habit.name)}</strong>
              <div class="habit-type">${escapeHtml(habit.type)}</div>
            </div>
          </div>
          <span class="habit-open-hint">Open 13-week sheet →</span>
        </button>
      `
    )
    .join('');
}

function renderGoals() {
  const goalsList = document.getElementById('goalsList');

  goalsList.innerHTML = appState.goals
    .map(
      (goal, index) => `
        <button class="goal-item ${escapeHtml(goal.tag)}" type="button" data-detail-type="goal" data-index="${index}">
          <div class="goal-header">
            <h4>${escapeHtml(goal.title)}</h4>
            <span class="goal-tag ${escapeHtml(goal.tag)}">${escapeHtml(goal.category)}</span>
          </div>
          <div class="goal-meta">
            <span>${escapeHtml(goal.due)}</span>
            <span>•</span>
            <span>${escapeHtml(goal.status)}</span>
          </div>
          <p>${escapeHtml(goal.reason)}</p>
          <div class="progress-line goal-progress"><span style="width: ${goal.progress}%"></span></div>
          <span class="card-open-hint">Open goal details →</span>
        </button>
      `
    )
    .join('');
}

function renderJournal() {
  const journalEntries = document.getElementById('journalEntries');
  journalEntries.innerHTML = appState.journalEntries
    .map(
      (entry, index) => `
        <article class="journal-entry">
          <div class="journal-entry-header">
            <strong>${escapeHtml(entry.date)}</strong>
            <span class="entry-mood">${escapeHtml(entry.mood)}</span>
          </div>
          <p>${escapeHtml(entry.entry)}</p>
          <button class="text-button delete-entry" type="button" data-delete-entry="${index}">Delete entry</button>
        </article>
      `
    )
    .join('');
}

function renderPlanner() {
  const plannerList = document.getElementById('plannerList');
  plannerList.innerHTML = appState.planner
    .map(
      (item, index) => `
        <article class="planner-item">
          <div class="planner-index">${index + 1}</div>
          <div>
            <p>${escapeHtml(item.text)}</p>
          </div>
          <span class="priority-tag ${escapeHtml(item.priority)}">${escapeHtml(item.priority)}</span>
        </article>
      `
    )
    .join('');
}

function openDetail(type, index, editing = false) {
  activeDetail = { type, index };
  detailEditing = editing;
  renderDetailDialog();
  detailDialog.showModal();
}

function detailItem() {
  if (!activeDetail) {
    return null;
  }

  const collection = {
    area: appState.areas,
    habit: appState.habits,
    goal: appState.goals
  }[activeDetail.type];
  return collection?.[activeDetail.index] ?? null;
}

function getHabitDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mondayOffset = (today.getDay() + 6) % 7;
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - mondayOffset - 12 * 7);

  return Array.from({ length: 13 * 7 }, (_, index) => {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + index);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
  });
}

function renderDetailDialog() {
  const item = detailItem();
  if (!item || !activeDetail) {
    detailDialog.close();
    return;
  }

  const isEditing = detailEditing;
  const type = activeDetail.type;
  const title = type === 'area' ? item.name : type === 'habit' ? item.name : item.title;
  const titleId = 'detailTitle';
  let body = '';

  if (isEditing) {
    if (type === 'area') {
      body = `
        <form id="detailEditForm" class="detail-form">
          <label>Name<input name="name" required maxlength="60" value="${escapeHtml(item.name)}"></label>
          <label>Current score (1–10)<input name="score" type="number" min="1" max="10" step="0.1" required value="${escapeHtml(item.score)}"></label>
          <label>Current focus<input name="goal" required maxlength="120" value="${escapeHtml(item.goal)}"></label>
          <label>Progress (%)<input name="progress" type="number" min="0" max="100" required value="${escapeHtml(item.progress)}"></label>
          <label>Color category
            <select name="tone">
              ${['health', 'learning', 'finance', 'relationships', 'lifestyle'].map((tone) => `<option value="${tone}" ${item.tone === tone ? 'selected' : ''}>${tone}</option>`).join('')}
            </select>
          </label>
          <div class="detail-actions">
            <button class="secondary-button" type="button" data-detail-cancel>Cancel</button>
            <button class="primary-button" type="submit">Save changes</button>
          </div>
        </form>
      `;
    } else if (type === 'habit') {
      body = `
        <form id="detailEditForm" class="detail-form">
          <label>Habit name<input name="name" required maxlength="60" value="${escapeHtml(item.name)}"></label>
          <label>Category<input name="type" required maxlength="40" value="${escapeHtml(item.type)}"></label>
          <div class="detail-actions">
            <button class="secondary-button" type="button" data-detail-cancel>Cancel</button>
            <button class="primary-button" type="submit">Save changes</button>
          </div>
        </form>
      `;
    } else {
      body = `
        <form id="detailEditForm" class="detail-form">
          <label>Goal title<input name="title" required maxlength="80" value="${escapeHtml(item.title)}"></label>
          <label>Category<input name="category" required maxlength="40" value="${escapeHtml(item.category)}"></label>
          <label>Target date<input name="due" required maxlength="40" value="${escapeHtml(item.due)}"></label>
          <label>Status<input name="status" required maxlength="40" value="${escapeHtml(item.status)}"></label>
          <label>Progress (%)<input name="progress" type="number" min="0" max="100" required value="${escapeHtml(item.progress)}"></label>
          <label>Why it matters<textarea name="reason" rows="4" required maxlength="400">${escapeHtml(item.reason)}</textarea></label>
          <div class="detail-actions">
            <button class="secondary-button" type="button" data-detail-cancel>Cancel</button>
            <button class="primary-button" type="submit">Save changes</button>
          </div>
        </form>
      `;
    }
  } else if (type === 'area') {
    body = `
      <div class="detail-stat-row">
        <div class="detail-stat"><span>Current score</span><strong>${Number(item.score).toFixed(1)}<small> / 10</small></strong></div>
        <div class="detail-stat"><span>Progress</span><strong>${escapeHtml(item.progress)}<small>%</small></strong></div>
      </div>
      <div class="detail-copy"><span class="eyebrow">Current focus</span><p>${escapeHtml(item.goal)}</p></div>
      <div class="progress-line"><span style="width: ${Number(item.progress)}%"></span></div>
      <p class="detail-caption">Select edit to update this area’s score, focus, and progress.</p>
    `;
  } else if (type === 'habit') {
    const dates = getHabitDates();
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const checkedCount = dates.filter((date) => item.completions?.[date]).length;
    body = `
      <div class="habit-sheet-summary"><span>${checkedCount} of 91 days complete</span><span>13 weeks · 3 months</span></div>
      <div class="habit-sheet-scroll">
        <div class="habit-sheet-grid" role="group" aria-label="Daily completions for the previous 13 weeks">
          ${dayLabels.map((day) => `<span class="habit-weekday">${day}</span>`).join('')}
          ${dates.map((date) => {
            const dayNumber = Number(date.slice(-2));
            return `<label class="habit-day ${item.completions?.[date] ? 'checked' : ''}" title="${date}">
              <input type="checkbox" data-habit-date="${date}" ${item.completions?.[date] ? 'checked' : ''} aria-label="${date}">
              <span>${dayNumber}</span>
            </label>`;
          }).join('')}
        </div>
      </div>
      <p class="detail-caption">Check a date to record a completed habit. Your changes save automatically.</p>
    `;
  } else {
    body = `
      <div class="goal-detail-tags"><span class="goal-tag ${escapeHtml(item.tag)}">${escapeHtml(item.category)}</span><span class="priority-tag medium">${escapeHtml(item.status)}</span></div>
      <div class="detail-stat-row">
        <div class="detail-stat"><span>Progress</span><strong>${escapeHtml(item.progress)}<small>%</small></strong></div>
        <div class="detail-stat"><span>Target</span><strong class="detail-date">${escapeHtml(item.due)}</strong></div>
      </div>
      <div class="progress-line"><span style="width: ${Number(item.progress)}%"></span></div>
      <div class="detail-copy"><span class="eyebrow">Why this matters</span><p>${escapeHtml(item.reason)}</p></div>
    `;
  }

  detailContent.innerHTML = `
    <header class="detail-header">
      <div>
        <p class="eyebrow">${type === 'area' ? 'Life area' : type === 'habit' ? 'Habit sheet' : 'Goal details'}</p>
        <h2 id="${titleId}">${escapeHtml(title || 'New item')}</h2>
      </div>
      <div class="detail-header-actions">
        ${!isEditing ? '<button class="secondary-button" type="button" data-detail-edit>Edit</button>' : ''}
        <button class="icon-button" type="button" data-detail-close aria-label="Close details">×</button>
      </div>
    </header>
    ${body}
  `;
}

function saveDetail(event) {
  event.preventDefault();
  const item = detailItem();
  if (!item || !activeDetail) {
    return;
  }

  const values = Object.fromEntries(new FormData(event.target).entries());
  if (activeDetail.type === 'area') {
    Object.assign(item, {
      name: values.name.trim(),
      score: Number(values.score),
      goal: values.goal.trim(),
      progress: Number(values.progress),
      tone: values.tone
    });
  } else if (activeDetail.type === 'habit') {
    Object.assign(item, { name: values.name.trim(), type: values.type.trim() });
  } else {
    Object.assign(item, {
      title: values.title.trim(),
      category: values.category.trim(),
      tag: values.category.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      due: values.due.trim(),
      status: values.status.trim(),
      progress: Number(values.progress),
      reason: values.reason.trim()
    });
  }

  saveState();
  renderAll();
  detailEditing = false;
  renderDetailDialog();
}

function renderTrendChart() {
  const trendChart = document.getElementById('trendChart');
  const labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];

  trendChart.innerHTML = appState.trend
    .map(
      (value, index) => `
        <div class="chart-bar" data-label="${labels[index]}" style="height: ${value}%"></div>
      `
    )
    .join('');
}

function renderAll() {
  renderStats();
  renderAreas();
  renderHabits();
  renderGoals();
  renderJournal();
  renderPlanner();
  renderTrendChart();
}

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeButton.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}

function toggleTheme() {
  applyTheme(!document.body.classList.contains('dark'));
}

function exportData() {
  const json = JSON.stringify(appState, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dysonsphere-data.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    try {
      const parsed = JSON.parse(loadEvent.target.result);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON structure');
      }

      const mergedState = {
        ...cloneDefaultState(),
        ...parsed,
        stats: Array.isArray(parsed.stats) ? parsed.stats : cloneDefaultState().stats,
        areas: Array.isArray(parsed.areas) ? parsed.areas : cloneDefaultState().areas,
        habits: normalizeHabits(Array.isArray(parsed.habits) ? parsed.habits : cloneDefaultState().habits),
        goals: Array.isArray(parsed.goals) ? parsed.goals : cloneDefaultState().goals,
        journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries : cloneDefaultState().journalEntries,
        planner: Array.isArray(parsed.planner) ? parsed.planner : cloneDefaultState().planner,
        trend: Array.isArray(parsed.trend) ? parsed.trend : cloneDefaultState().trend
      };

      Object.keys(appState).forEach((key) => {
        delete appState[key];
      });

      Object.assign(appState, mergedState);
      saveState();
      renderAll();
    } catch (error) {
      console.error('Unable to import JSON data', error);
      alert('The selected file is not valid DysonSphere data.');
    } finally {
      event.target.value = '';
    }
  };

  reader.readAsText(file);
}

sections.forEach((button) => {
  button.addEventListener('click', () => {
    sections.forEach((item) => item.classList.toggle('active', item === button));
    panels.forEach((panel) => {
      panel.classList.toggle('visible', panel.id === button.dataset.section);
    });
  });
});

document.addEventListener('click', (event) => {
  const target = event.target.closest('button, [data-detail-type]');
  if (!target) {
    return;
  }

  if (target.dataset.detailType) {
    openDetail(target.dataset.detailType, Number(target.dataset.index));
  } else if (target.hasAttribute('data-detail-edit')) {
    detailEditing = true;
    renderDetailDialog();
  } else if (target.hasAttribute('data-detail-cancel')) {
    detailEditing = false;
    renderDetailDialog();
  } else if (target.hasAttribute('data-detail-close')) {
    detailDialog.close();
  } else if (target.hasAttribute('data-delete-entry')) {
    const index = Number(target.dataset.deleteEntry);
    if (confirm('Delete this journal entry? This cannot be undone.')) {
      appState.journalEntries.splice(index, 1);
      saveState();
      renderJournal();
    }
  }
});

document.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-habit-date]');
  if (!checkbox || !activeDetail || activeDetail.type !== 'habit') {
    return;
  }

  const habit = detailItem();
  if (!habit) {
    return;
  }

  const date = checkbox.dataset.habitDate;
  if (checkbox.checked) {
    habit.completions[date] = true;
  } else {
    delete habit.completions[date];
  }
  habit.done = Boolean(habit.completions[todayKey()]);
  checkbox.closest('.habit-day').classList.toggle('checked', checkbox.checked);
  saveState();
  renderHabits();
  const summary = detailContent.querySelector('.habit-sheet-summary span');
  if (summary) {
    summary.textContent = `${getHabitDates().filter((day) => habit.completions[day]).length} of 91 days complete`;
  }
});

detailContent.addEventListener('submit', (event) => {
  if (event.target.id === 'detailEditForm') {
    saveDetail(event);
  }
});

detailDialog.addEventListener('click', (event) => {
  if (event.target === detailDialog) {
    detailDialog.close();
  }
});

document.getElementById('areasGrid').parentElement.querySelector('.primary-button').addEventListener('click', () => {
  appState.areas.push({ name: 'New life area', score: 5, goal: 'Add a current focus', progress: 0, tone: 'lifestyle' });
  saveState();
  renderAll();
  openDetail('area', appState.areas.length - 1, true);
});

document.querySelector('#goals .primary-button').addEventListener('click', () => {
  appState.goals.push({
    title: 'New goal',
    category: 'Personal',
    tag: 'learning',
    due: 'Set a target',
    progress: 0,
    status: 'Not started',
    reason: 'Add why this goal matters.'
  });
  saveState();
  renderAll();
  openDetail('goal', appState.goals.length - 1, true);
});

document.getElementById('addHabitBtn').addEventListener('click', () => {
  const name = prompt('What habit would you like to track?');
  if (!name?.trim()) {
    return;
  }

  const type = prompt('What category is this habit in?', 'Wellbeing');
  if (!type?.trim()) {
    return;
  }

  appState.habits.push({ name: name.trim(), type: type.trim(), done: false, completions: {} });
  saveState();
  renderHabits();
});

document.getElementById('addPlannerItemBtn').addEventListener('click', () => {
  const text = prompt('What is one focus item for this week?');
  if (!text?.trim()) {
    return;
  }

  const priority = prompt('Priority: high, medium, or low', 'medium');
  if (priority === null) {
    return;
  }

  const normalizedPriority = priority.trim().toLowerCase();
  if (!['high', 'medium', 'low'].includes(normalizedPriority)) {
    alert('Choose high, medium, or low for the priority.');
    return;
  }

  appState.planner.push({ text: text.trim(), priority: normalizedPriority });
  saveState();
  renderPlanner();
});

themeButton.addEventListener('click', toggleTheme);
exportButton.addEventListener('click', exportData);
importButton.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', importData);

document.getElementById('journalForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('journalInput');
  const mood = document.getElementById('journalMood');
  const value = input.value.trim();

  if (!value) {
    return;
  }

  appState.journalEntries.unshift({
    date: 'Just now',
    mood: mood.value,
    entry: value
  });

  input.value = '';
  saveState();
  renderJournal();
});

const savedTheme = localStorage.getItem(THEME_KEY);
applyTheme(savedTheme === 'light' ? false : true);

renderAll();
