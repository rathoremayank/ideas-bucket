const products = [
  {
    id: "ceramic-mug",
    name: "Everyday Ceramic Mug",
    description: "A comfortable, durable mug for your daily coffee or tea.",
    price: 18,
    icon: "☕",
    keywords: ["mug", "coffee", "tea", "drink", "morning", "gift", "friend"],
    focus: "practical",
  },
  {
    id: "canvas-tote",
    name: "Market Canvas Tote",
    description: "A sturdy reusable carryall for errands and everyday essentials.",
    price: 24,
    icon: "👜",
    keywords: ["tote", "bag", "carry", "shopping", "errands", "gift", "travel"],
    focus: "practical",
  },
  {
    id: "desk-lamp",
    name: "Soft Glow Desk Lamp",
    description: "Warm, focused light for a calmer workspace.",
    price: 48,
    icon: "💡",
    keywords: ["lamp", "light", "desk", "office", "reading", "work", "gift"],
    focus: "calm",
  },
  {
    id: "notebook-set",
    name: "Pocket Notebook Set",
    description: "Three handy notebooks for plans, lists, and ideas.",
    price: 14,
    icon: "📓",
    keywords: ["notebook", "journal", "writing", "notes", "planning", "work", "gift"],
    focus: "writing",
  },
];

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#productSearch");
const searchHint = document.querySelector(".search-hint");
const questions = document.querySelector("#questions");
const results = document.querySelector("#results");
const cartCount = document.querySelector("#cartCount");
const cartSummary = document.querySelector("#cartSummary");
const cart = new Map();
const preferences = { focus: "", budget: "" };
let searchQuery = "";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

function renderQuestion(step) {
  questions.hidden = false;
  results.hidden = true;
  searchHint.hidden = true;

  if (step === 1) {
    questions.innerHTML = `
      <p class="step-label">A couple of quick questions <span>1 of 2</span></p>
      <fieldset>
        <legend>What matters most?</legend>
        <div class="choice-list">
            <label class="choice"><input type="radio" name="focus" value="practical" ${
              preferences.focus === "practical" ? "checked" : ""
            } /><span>Everyday practicality</span></label>
            <label class="choice"><input type="radio" name="focus" value="calm" ${
              preferences.focus === "calm" ? "checked" : ""
            } /><span>A calmer space</span></label>
            <label class="choice"><input type="radio" name="focus" value="writing" ${
              preferences.focus === "writing" ? "checked" : ""
            } /><span>Writing things down</span></label>
            <label class="choice"><input type="radio" name="focus" value="gift" ${
              preferences.focus === "gift" ? "checked" : ""
            } /><span>A thoughtful gift</span></label>
        </div>
      </fieldset>
      <div class="step-actions">
        <button class="text-button" type="button" data-action="edit-search">← Edit search</button>
        <button class="primary-button" type="button" data-action="next" ${
          preferences.focus ? "" : "disabled"
        }>Next <span aria-hidden="true">→</span></button>
      </div>
    `;
    return;
  }

  questions.innerHTML = `
    <p class="step-label">A couple of quick questions <span>2 of 2</span></p>
    <fieldset>
      <legend>What feels right for your budget?</legend>
      <div class="choice-list">
        <label class="choice"><input type="radio" name="budget" value="20" ${
          preferences.budget === "20" ? "checked" : ""
        } /><span>Under $20</span></label>
        <label class="choice"><input type="radio" name="budget" value="40" ${
          preferences.budget === "40" ? "checked" : ""
        } /><span>$20–$40</span></label>
        <label class="choice"><input type="radio" name="budget" value="any" ${
          preferences.budget === "any" ? "checked" : ""
        } /><span>I'm flexible</span></label>
      </div>
    </fieldset>
    <div class="step-actions">
      <button class="text-button" type="button" data-action="back">← Back</button>
      <button class="primary-button" type="button" data-action="recommend" ${
        preferences.budget ? "" : "disabled"
      }>Show my matches <span aria-hidden="true">→</span></button>
    </div>
  `;
}

function getRecommendations() {
  const queryWords = searchQuery.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const ignoredWords = new Set(["a", "an", "the", "for", "to", "my", "with", "and", "of", "in"]);
  const meaningfulWords = queryWords.filter((word) => !ignoredWords.has(word));
  const budget = preferences.budget === "any" ? Infinity : Number(preferences.budget);

  return products
    .map((product) => {
      const searchableText = `${product.name} ${product.description} ${product.keywords.join(" ")}`.toLowerCase();
      const queryScore = meaningfulWords.reduce(
        (score, word) => score + (searchableText.includes(word) ? 3 : 0),
        0,
      );
      const focusScore = product.focus === preferences.focus || preferences.focus === "gift" ? 2 : 0;
      const budgetScore = product.price <= budget ? 1 : 0;
      return { product, queryScore, score: queryScore + focusScore + budgetScore };
    })
    .filter(({ queryScore }) => queryScore > 0)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, 3)
    .map(({ product }) => product);
}

function renderResults() {
  const recommendations = getRecommendations();
  questions.hidden = true;
  results.hidden = false;

  if (recommendations.length === 0) {
    results.innerHTML = `
      <p class="step-label">Your shortlist</p>
      <div class="empty-state">
        <h2>No close matches just yet.</h2>
        <p>Try describing the item a different way, or use a broader search.</p>
        <button class="text-button" type="button" data-action="start-over">← Start a new search</button>
      </div>
    `;
    return;
  }

  results.innerHTML = `
    <div class="results-heading">
      <div>
        <p class="step-label">Your shortlist</p>
        <h2>A few good matches</h2>
        <p class="results-query">For “${searchQuery.replace(/[&<>"']/g, "")}”</p>
      </div>
      <button class="text-button" type="button" data-action="start-over">Start over</button>
    </div>
    <div class="product-list">
      ${recommendations
        .map(
          (product) => `
            <article class="product-card">
              <div class="product-art" aria-hidden="true">${product.icon}</div>
              <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
              </div>
              <div class="product-actions">
                <span class="product-price">${formatPrice(product.price)}</span>
                <button class="add-button" type="button" data-product-id="${product.id}">
                  Add to cart
                </button>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
    <button class="text-button refine-button" type="button" data-action="refine">← Change preferences</button>
  `;
}

function updateCartSummary() {
  const itemCount = [...cart.values()].reduce((total, quantity) => total + quantity, 0);
  const subtotal = products.reduce(
    (total, product) => total + product.price * (cart.get(product.id) ?? 0),
    0,
  );

  cartCount.textContent = String(itemCount);
  cartSummary.textContent =
    itemCount === 0
      ? "Your cart is empty."
      : `${itemCount} ${itemCount === 1 ? "item" : "items"} · Subtotal ${formatPrice(subtotal)}`;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchQuery = searchInput.value.trim();
  if (!searchQuery) {
    searchInput.focus();
    return;
  }
  preferences.focus = "";
  preferences.budget = "";
  results.hidden = true;
  renderQuestion(1);
});

questions.addEventListener("change", (event) => {
  if (event.target.name === "focus") {
    preferences.focus = event.target.value;
    renderQuestion(1);
  }
  if (event.target.name === "budget") {
    preferences.budget = event.target.value;
    renderQuestion(2);
  }
});

questions.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "edit-search") {
    questions.hidden = true;
    searchHint.hidden = false;
    searchInput.focus();
  } else if (action === "next") {
    renderQuestion(2);
  } else if (action === "back") {
    renderQuestion(1);
  } else if (action === "recommend") {
    renderResults();
  }
});

results.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "start-over") {
    results.hidden = true;
    questions.hidden = true;
    searchHint.hidden = false;
    searchInput.value = "";
    searchQuery = "";
    preferences.focus = "";
    preferences.budget = "";
    searchInput.focus();
    return;
  }
  if (action === "refine") {
    renderQuestion(1);
    return;
  }

  const addButton = event.target.closest("[data-product-id]");
  if (!addButton) return;
  const productId = addButton.dataset.productId;
  cart.set(productId, (cart.get(productId) ?? 0) + 1);
  updateCartSummary();
});

updateCartSummary();
