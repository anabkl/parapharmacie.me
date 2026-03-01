import "./css/main.css";
import { renderShop } from "./js/shop";
import { renderAdmin, bindAdminForm } from "./js/admin";

document.addEventListener("DOMContentLoaded", ()=>{
  renderShop();
  renderAdmin();
  bindAdminForm();
});
