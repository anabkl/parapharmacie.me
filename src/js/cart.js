const CART_KEY = "parapharmacie_cart";

export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const item = cart.find(i => i.id === product.id);
  if (item) item.qty += qty;
  else cart.push({ ...product, qty });
  saveCart(cart);
}

export function updateQty(id, qty) {
  const cart = getCart().map(i => i.id === id ? { ...i, qty } : i);
  saveCart(cart);
}

export function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}
