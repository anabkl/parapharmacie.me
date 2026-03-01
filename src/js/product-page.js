import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function setMetaTag(name, content, property = false) {
  let tag = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    if (property) tag.setAttribute("property", name);
    else tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(url) {
  let link = document.querySelector(`link[rel="canonical"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function injectJSONLD(product) {
  const data = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": [product.image],
    "description": product.description,
    "brand": "Parapharmacie.me",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "MAD",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  };

  let script = document.getElementById("jsonld-product");
  if (!script) {
    script = document.createElement("script");
    script.id = "jsonld-product";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

async function loadProduct() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return;
  const product = snap.data();

  document.title = `${product.title} | Parapharmacie.me`;

  setMetaTag("description", product.description);
  setMetaTag("og:title", product.title, true);
  setMetaTag("og:description", product.description, true);
  setMetaTag("og:image", product.image, true);
  setMetaTag("og:url", location.href, true);

  setCanonical(location.href);
  injectJSONLD(product);

  document.getElementById("productDetail").innerHTML = `
    <h1>${product.title}</h1>
    <img src="${product.image}" alt="${product.title}" loading="lazy" />
    <p>${product.description}</p>
    <strong>${product.price} MAD</strong>
  `;
}

loadProduct();
