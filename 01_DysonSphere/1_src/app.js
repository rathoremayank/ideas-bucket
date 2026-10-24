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
    { text: 'Set one direct relationship repair conversation this week', priority: 'medium' }
  ],
  trend: [54, 61, 59, 68, 72, 74]
};

const STORAGE_KEY = 'dysonsphere-state-v1';
const THEME_KEY = 'dysonsphere-theme';

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadState() {
  const fallback = cloneDefaultState();

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
      habits: Array.isArray(parsed.habits) ? parsed.habits : fallback.habits,
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
            <span>${stat.label}</span>
            <span>↗</span>
          </div>
          <strong>${stat.value}</strong>
          <div><small>${stat.delta}</small></div>
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
      (area) => `
        <div class="area-row">
          <span>${area.name}</span>
          <div class="score-bar">
            <div class="score-fill" style="width: ${area.score * 10}%"></div>
          </div>
          <strong>${area.score.toFixed(1)}</strong>
        </div>
      `
    )
    .join('');

  areasGrid.innerHTML = appState.areas
    .map(
      (area) => `
        <article class="area-card">
          <div class="area-top">
            <h4>${area.name}</h4>
            <span class="area-pill">${area.tone}</span>
          </div>
          <div class="area-score">${area.score.toFixed(1)}</div>
          <p>${area.goal}</p>
          <div class="progress-line"><span style="width: ${area.progress}%"></span></div>
        </article>
      `
    )
    .join('');
}

function renderHabits() {
  const habitList = document.getElementById('habitList');
  const summary = document.getElementById('habitSummary');
  const completed = appState.habits.filter((habit) => habit.done).length;

  summary.textContent = `${completed} of ${appState.habits.length} completed`;

  habitList.innerHTML = appState.habits
    .map(
      (habit, index) => `
        <div class="habit-item">
          <div class="habit-name">
            <span class="habit-badge"></span>
            <div>
              <strong>${habit.name}</strong>
              <div class="habit-type">${habit.type}</div>
            </div>
          </div>
          <button class="toggle ${habit.done ? 'done' : ''}" data-index="${index}">
            ${habit.done ? 'Done' : 'Mark done'}
          </button>
        </div>
      `
    )
    .join('');

  document.querySelectorAll('.toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      appState.habits[index].done = !appState.habits[index].done;
      saveState();
      renderHabits();
    });
  });
}

function renderGoals() {
  const goalsList = document.getElementById('goalsList');

  goalsList.innerHTML = appState.goals
    .map(
      (goal) => `
        <article class="goal-item">
          <div class="goal-header">
            <h4>${goal.title}</h4>
            <span class="goal-tag ${goal.tag}">${goal.category}</span>
          </div>
          <div class="goal-meta">
            <span>${goal.due}</span>
            <span>•</span>
            <span>${goal.status}</span>
          </div>
          <p>${goal.reason}</p>
          <div class="progress-line goal-progress"><span style="width: ${goal.progress}%"></span></div>
        </article>
      `
    )
    .join('');
}

function renderJournal() {
  const journalEntries = document.getElementById('journalEntries');
  journalEntries.innerHTML = appState.journalEntries
    .map(
      (entry) => `
        <article class="journal-entry">
          <div class="journal-entry-header">
            <strong>${entry.date}</strong>
            <span class="entry-mood">${entry.mood}</span>
          </div>
          <p>${entry.entry}</p>
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
            <p>${item.text}</p>
          </div>
          <span class="priority-tag ${item.priority}">${item.priority}</span>
        </article>
      `
    )
    .join('');
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
        habits: Array.isArray(parsed.habits) ? parsed.habits : cloneDefaultState().habits,
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
