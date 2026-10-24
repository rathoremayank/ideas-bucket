const products = [
  {
    id: "ceramic-mug",
    name: "Everyday Ceramic Mug",
    description: "A comfortable, durable mug for your daily coffee or tea.",
    price: 18,
    icon: "☕",
  },
  {
    id: "canvas-tote",
    name: "Market Canvas Tote",
    description: "A sturdy reusable carryall for errands and everyday essentials.",
    price: 24,
    icon: "👜",
  },
  {
    id: "desk-lamp",
    name: "Soft Glow Desk Lamp",
    description: "Warm, focused light for a calmer workspace.",
    price: 48,
    icon: "💡",
  },
  {
    id: "notebook-set",
    name: "Pocket Notebook Set",
    description: "Three handy notebooks for plans, lists, and ideas.",
    price: 14,
    icon: "📓",
  },
];

const productGrid = document.querySelector("#productGrid");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#productSearch");
const resultSummary = document.querySelector("#resultSummary");
const cartCount = document.querySelector("#cartCount");
const cartButton = document.querySelector(".cart-button");
const cartSummary = document.querySelector("#cartSummary");
const cart = new Map();

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

function renderProducts(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const matchingProducts = products.filter((product) =>
    `${product.name} ${product.description}`.toLowerCase().includes(normalizedQuery),
  );

  resultSummary.textContent = `${matchingProducts.length} ${
    matchingProducts.length === 1 ? "product" : "products"
  }`;

  if (matchingProducts.length === 0) {
    productGrid.innerHTML = '<p class="empty-state">No products found. Try another search.</p>';
    return;
  }

  productGrid.innerHTML = matchingProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-art" aria-hidden="true">${product.icon}</div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-actions">
              <span class="product-price">${formatPrice(product.price)}</span>
              <button class="add-button" type="button" data-product-id="${product.id}">
                Add to cart
              </button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function updateCartSummary() {
  const itemCount = [...cart.values()].reduce((total, quantity) => total + quantity, 0);
  const subtotal = products.reduce(
    (total, product) => total + product.price * (cart.get(product.id) ?? 0),
    0,
  );

  cartCount.textContent = String(itemCount);
  cartButton.setAttribute(
    "aria-label",
    `Shopping cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`,
  );
  cartSummary.textContent =
    itemCount === 0
      ? "Your cart is empty."
      : `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart · Subtotal ${formatPrice(
          subtotal,
        )}`;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderProducts(searchInput.value);
});

searchInput.addEventListener("input", () => renderProducts(searchInput.value));

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-product-id]");
  if (!addButton) return;

  const productId = addButton.dataset.productId;
  cart.set(productId, (cart.get(productId) ?? 0) + 1);
  updateCartSummary();
});

renderProducts();
updateCartSummary();
