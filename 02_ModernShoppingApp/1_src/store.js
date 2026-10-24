const ModernMarket = (() => {
  const products = window.ModernMarketProducts;
  const cartStorageKey = "modern-market-cart";

  function formatPrice(price) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
  }

  function getCart() {
    try {
      const savedCart = JSON.parse(window.sessionStorage.getItem(cartStorageKey) || "{}");
      return new Map(
        Object.entries(savedCart).filter(
          ([productId, quantity]) =>
            products.some((product) => product.id === productId) &&
            Number.isInteger(quantity) &&
            quantity > 0,
        ),
      );
    } catch (error) {
      console.error("Unable to read the shopping cart from session storage.", error);
      return null;
    }
  }

  function updateCart(countElement, summaryElement) {
    const cart = getCart();
    if (!cart) {
      countElement.textContent = "—";
      summaryElement.textContent = "Cart unavailable. Check your browser storage settings.";
      return;
    }

    const itemCount = [...cart.values()].reduce((total, quantity) => total + quantity, 0);
    const subtotal = products.reduce(
      (total, product) => total + product.price * (cart.get(product.id) || 0),
      0,
    );

    countElement.textContent = String(itemCount);
    summaryElement.textContent =
      itemCount === 0
        ? "Your cart is empty."
        : `${itemCount} ${itemCount === 1 ? "item" : "items"} · Subtotal ${formatPrice(subtotal)}`;
  }

  function addToCart(productId, countElement, summaryElement) {
    if (!products.some((product) => product.id === productId)) {
      throw new Error(`Cannot add unknown product "${productId}" to cart.`);
    }

    const cart = getCart();
    if (!cart) {
      countElement.textContent = "—";
      summaryElement.textContent = "Cart unavailable. Check your browser storage settings.";
      return;
    }

    cart.set(productId, (cart.get(productId) || 0) + 1);
    try {
      window.sessionStorage.setItem(cartStorageKey, JSON.stringify(Object.fromEntries(cart)));
    } catch (error) {
      console.error("Unable to save the shopping cart to session storage.", error);
      summaryElement.textContent = "Cart could not be saved. Please check your browser storage settings.";
      return;
    }
    updateCart(countElement, summaryElement);
  }

  return { formatPrice, updateCart, addToCart };
})();
