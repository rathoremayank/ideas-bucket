const productDetails = document.querySelector("#productDetails");
const cartCount = document.querySelector("#cartCount");
const cartSummary = document.querySelector("#cartSummary");
const params = new URLSearchParams(window.location.search);
const product = window.ModernMarketProducts.find((item) => item.id === params.get("id"));
const resultsParams = new URLSearchParams({
  q: params.get("q") || "",
  focus: params.get("focus") || "",
  budget: params.get("budget") || "",
});
document.querySelector("#backToResults").href = `results.html?${resultsParams.toString()}`;

function renderProduct() {
  if (!product) {
    document.title = "Product not found | Modern Market";
    productDetails.innerHTML = `
      <div class="empty-state">
        <h1>We couldn't find that product.</h1>
        <p>It may have moved. Return to your search to explore available products.</p>
        <a class="primary-button link-button" href="index.html">Start a new search</a>
      </div>
    `;
    return;
  }

  document.title = `${product.name} | Modern Market`;
  productDetails.innerHTML = `
    <div class="detail-layout">
      <div class="detail-art" aria-hidden="true">${product.icon}</div>
      <div class="detail-copy">
        <p class="eyebrow">Thoughtfully selected</p>
        <h1>${product.name}</h1>
        <p class="detail-rating">★ ${product.rating.toFixed(1)} <span>/ 10</span> · ${
          product.reviewCount
        } customer reviews</p>
        <p class="detail-description">${product.details}</p>
        <p class="detail-price">${ModernMarket.formatPrice(product.price)}</p>
        <button class="primary-button detail-add-button" type="button" data-product-id="${
          product.id
        }">Add to cart</button>
        <div class="detail-features">
          <h2>Product details</h2>
          <ul>${product.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
        </div>
      </div>
    </div>
    <section class="customer-reviews" aria-labelledby="reviewsTitle">
      <div class="reviews-heading">
        <div>
          <p class="eyebrow">From our customers</p>
          <h2 id="reviewsTitle">Reviews & feedback</h2>
        </div>
        <p class="reviews-overall">★ ${product.rating.toFixed(1)} <span>/ 10</span></p>
      </div>
      <div class="review-list">
        ${product.customerReviews
          .map(
            (review) => `
              <article class="review">
                <div class="review-meta"><strong>${review.name}</strong><span>★ ${review.rating} / 10</span></div>
                <p>${review.text}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

productDetails.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (button && product) {
    ModernMarket.addToCart(button.dataset.productId, cartCount, cartSummary);
  }
});

renderProduct();
ModernMarket.updateCart(cartCount, cartSummary);
