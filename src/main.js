import "./css/main.css";
import { renderAdminProducts, adminCharts } from "./js/admin";

document.addEventListener("DOMContentLoaded", () => {
  renderAdminProducts();
  adminCharts();
});
