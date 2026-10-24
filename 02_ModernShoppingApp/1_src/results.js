const resultsContainer = document.querySelector("#productResults");
const resultsDescription = document.querySelector("#resultsDescription");
const params = new URLSearchParams(window.location.search);
const query = (params.get("q") || "").trim();
const focus = params.get("focus") || "";
const budget = params.get("budget") || "any";
const maxBudget = budget === "any" ? Infinity : Number(budget);
const queryWords = query.toLowerCase().match(/[a-z0-9]+/g) || [];
const ignoredWords = new Set(["a", "an", "the", "for", "to", "my", "with", "and", "of", "in"]);
const meaningfulWords = queryWords.filter((word) => !ignoredWords.has(word));
const products = window.ModernMarketProducts;
const cartCount = document.querySelector("#cartCount");
const cartSummary = document.querySelector("#cartSummary");

function renderResults() {
  resultsDescription.textContent = query ? `Products matching “${query}”` : "Enter a search to find products.";
  const productParams = (productId) =>
    new URLSearchParams({
      id: productId,
      q: query,
      focus,
      budget: params.get("budget") || "",
    }).toString();

  const matches = products
    .map((product) => {
      const searchableText =
        `${product.name} ${product.description} ${product.keywords.join(" ")}`.toLowerCase();
      const queryScore = meaningfulWords.reduce(
        (score, word) => score + (searchableText.includes(word) ? 1 : 0),
        0,
      );
      const focusScore = product.focus === focus || focus === "gift" ? 1 : 0;
      const budgetScore = product.price <= maxBudget ? 1 : 0;
      return { product, queryScore, focusScore, budgetScore };
    })
    .filter(({ queryScore }) => queryScore > 0)
    .sort(
      (a, b) =>
        b.queryScore - a.queryScore ||
        b.focusScore - a.focusScore ||
        b.budgetScore - a.budgetScore ||
        a.product.price - b.product.price,
    );

  if (matches.length === 0) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <h2>No matching products yet</h2>
        <p>Try a different description or a broader search.</p>
        <a class="text-button" href="index.html">← Start a new search</a>
      </div>
    `;
    return;
  }

  resultsDescription.textContent = `${matches.length} ${
    matches.length === 1 ? "product" : "products"
  } matching “${query}”`;
  resultsContainer.innerHTML = matches
    .map(
      ({ product }) => `
        <article class="result-card">
          <a class="result-link" href="product.html?${productParams(product.id)}">
            <div class="result-art" aria-hidden="true">${product.icon}</div>
            <div class="result-card-info">
              <div class="result-card-heading">
                <h2>${product.name}</h2>
                <span class="result-rating">★ ${product.rating.toFixed(1)}<span class="rating-scale"> / 10</span></span>
              </div>
              <p class="result-card-description">${product.description}</p>
              <span class="result-price">${ModernMarket.formatPrice(product.price)}</span>
            </div>
            <div class="feedback-preview">
              <span class="feedback-label">Customer feedback</span>
              <span class="feedback-rating">★ ${product.rating.toFixed(1)} / 10 · ${product.reviewCount} reviews</span>
              <span class="feedback-quote">${product.feedback}</span>
              <span class="feedback-more">View product details →</span>
            </div>
          </a>
          <button class="add-button" type="button" data-product-id="${product.id}">Add to cart</button>
        </article>
      `,
    )
    .join("");
}

resultsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (button) {
    ModernMarket.addToCart(button.dataset.productId, cartCount, cartSummary);
  }
});

renderResults();
ModernMarket.updateCart(cartCount, cartSummary);
