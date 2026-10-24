# Modern Shopping App — User Stories

## Epic 1: Product discovery

### 1.1 Browse products

As a shopper, I want to browse a product catalog so that I can find items I may want to buy.

Acceptance criteria:

- Each product card shows a name, description, and price.
- The catalog adapts to mobile and desktop screen sizes.
- An empty catalog or empty search result has a clear message.

### 1.2 Search products

As a shopper, I want to search by product name or description so that I can find relevant items quickly.

Acceptance criteria:

- Search results update to match the entered query.
- Search is case-insensitive.
- Clearing the query restores the full catalog.

## Epic 2: Cart

### 2.1 Add products

As a shopper, I want to add products to my cart so that I can collect items before checkout.

Acceptance criteria:

- Adding a product updates the cart item count.
- The cart subtotal reflects the products added.
- The cart gives clear feedback after an item is added.

### 2.2 Manage cart items

As a shopper, I want to change quantities or remove products so that my cart matches what I intend to purchase.

Acceptance criteria:

- Quantity changes update the item count and subtotal.
- Items can be removed from the cart.
- An empty cart has a clear empty state.

## Epic 3: Checkout

### 3.1 Place an order

As a shopper, I want to enter my shipping and contact information and review the total so that I can place an order with confidence.

Acceptance criteria:

- Required information is validated before order placement.
- The order summary shows all costs and the final total.
- A successful order displays a confirmation.

## Epic 4: Responsive and accessible experience

### 4.1 Shop on any device

As a shopper, I want the storefront to work on my phone, tablet, or desktop so that I can shop wherever I am.

Acceptance criteria:

- Layouts remain usable at narrow viewport widths.
- Interactive controls are keyboard accessible and have accessible names.
- Text and controls have sufficient visual contrast.

## MVP roadmap

1. Catalog and search
2. Product details and cart management
3. Checkout and order confirmation
4. Cart persistence, accounts, and order history
