const fallbackSlug = "pizzeria-orion";
const pathSegments = window.location.pathname.split("/").filter(Boolean);
let slug = pathSegments[pathSegments.length - 1] || fallbackSlug;
if (slug === "[slug]") {
  slug = fallbackSlug;
}

const menuList = document.getElementById("menu-list");
const tabContainer = document.getElementById("category-tabs");
const gallery = document.getElementById("menu-gallery");
const nameEl = document.getElementById("restaurant-name");
const taglineEl = document.getElementById("restaurant-tagline");
const modal = document.getElementById("image-modal");
const modalImage = modal.querySelector(".modal-image");
const modalClose = modal.querySelector(".modal-close");

const formatPrice = (price) => `$${price.toFixed(2)}`;

const renderMenuItems = (items) => {
  menuList.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-card";

    const header = document.createElement("div");
    header.className = "menu-card-header";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const price = document.createElement("span");
    price.className = "menu-price";
    price.textContent = formatPrice(item.price);

    header.append(title, price);

    const description = document.createElement("p");
    description.textContent = item.description;

    card.append(header, description);
    menuList.appendChild(card);
  });
};

const setActiveTab = (button) => {
  tabContainer.querySelectorAll(".tab-button").forEach((tab) => {
    tab.classList.toggle("active", tab === button);
  });
};

const openModal = (src) => {
  modalImage.src = src;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
};

const renderGallery = (images) => {
  gallery.innerHTML = "";
  images.forEach((src) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Foto del menú";
    img.loading = "lazy";

    card.appendChild(img);
    card.addEventListener("click", () => openModal(src));
    gallery.appendChild(card);
  });
};

const loadRestaurant = async () => {
  const response = await fetch(`/data/restaurants/${slug}.json`);
  if (!response.ok) {
    throw new Error("No se pudo cargar el menú.");
  }
  return response.json();
};

const initialize = async () => {
  try {
    const data = await loadRestaurant();
    nameEl.textContent = data.name;
    taglineEl.textContent = data.tagline;
    document.title = `${data.name} · ${data.tagline}`;

    data.menu.items.forEach((category, index) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "tab-button";
      tab.textContent = category.category;
      if (index === 0) {
        tab.classList.add("active");
        renderMenuItems(category.items);
      }

      tab.addEventListener("click", () => {
        setActiveTab(tab);
        renderMenuItems(category.items);
      });

      tabContainer.appendChild(tab);
    });

    renderGallery(data.menu.images);
  } catch (error) {
    nameEl.textContent = "Pizzería ORIÓN";
    taglineEl.textContent = "Horno de piedra • Masa madre • Ingredientes reales";
    menuList.innerHTML = `<div class="menu-card">${error.message}</div>`;
  }
};

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

initialize();
