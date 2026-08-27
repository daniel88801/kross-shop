const PRODUCTS = [
  {
    id: "apex",
    name: "Kross Apex",
    extra: "Sustainable Materials",
    category: "Basketball Shoe",
    gender: ["men"],
    type: "basketball",
    colors: 3,
    price: 459,
    sizes: [41, 42, 43, 44, 45, 46],
    image: "images/apex.jpg",
    isNew: true,
    featured: true,
    desc: "Knit upper, mint cushioning. Made for indoor courts and the walk home.",
  },
  {
    id: "volt",
    name: "Kross Volt",
    category: "Men's Shoe",
    gender: ["men"],
    type: "lifestyle",
    colors: 1,
    price: 799,
    sizes: [40, 41, 42, 43, 44, 45, 46],
    image: "images/volt.jpg",
    isNew: true,
    featured: true,
    desc: "Black mesh with a lime cage. A heavy lifestyle trainer.",
  },
  {
    id: "halo",
    name: "Kross Halo",
    category: "Lifestyle Shoe",
    gender: ["men", "women"],
    type: "lifestyle",
    colors: 7,
    price: 379,
    originalPrice: 459,
    sale: true,
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    image: "images/halo.jpg",
    featured: true,
    desc: "White leather overlays on ice-grey mesh. Everyday court lines.",
  },
  {
    id: "terra",
    name: "Kross Terra",
    extra: "Gum Outsole",
    category: "Trail Shoe",
    gender: ["men"],
    type: "trail",
    colors: 2,
    price: 429,
    sizes: [41, 42, 43, 44, 45, 46, 47],
    image: "images/terra.jpg",
    isNew: true,
    desc: "Olive suede and mesh. Lugged gum rubber for wet streets and dirt.",
  },
  {
    id: "nova",
    name: "Kross Nova",
    category: "Men's Shoe",
    gender: ["men"],
    type: "lifestyle",
    colors: 2,
    price: 329,
    sale: true,
    originalPrice: 389,
    sizes: [40, 41, 42, 43, 44, 45],
    image: "images/nova.jpg",
    desc: "Navy leather cupsole. Orange foxing for a clean court look.",
  },
  {
    id: "pulse",
    name: "Kross Pulse",
    category: "Running Shoe",
    gender: ["women", "men"],
    type: "running",
    colors: 4,
    price: 349,
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    image: "images/pulse.jpg",
    isNew: true,
    featured: true,
    desc: "Cream knit and taupe suede. A quiet daily runner.",
  },
  {
    id: "arc",
    name: "Kross Arc",
    category: "Men's Shoe",
    gender: ["men"],
    type: "lifestyle",
    colors: 3,
    price: 519,
    sizes: [41, 42, 43, 44, 45, 46],
    image: "images/arc.jpg",
    featured: true,
    desc: "Graphite panels on a chunky white sole. Built to take space.",
  },
  {
    id: "ember",
    name: "Kross Ember",
    category: "Women's Shoe",
    gender: ["women"],
    type: "running",
    colors: 2,
    price: 299,
    originalPrice: 359,
    sale: true,
    sizes: [36, 37, 38, 39, 40, 41, 42],
    image: "images/ember.jpg",
    desc: "Burgundy mesh runner. Light enough for the commute.",
  },
  {
    id: "ice",
    name: "Kross Ice",
    extra: "Junior fit",
    category: "Kids' Shoe",
    gender: ["kids"],
    type: "running",
    colors: 3,
    price: 219,
    sizes: [35, 36, 37, 38, 39, 40],
    image: "images/ice.jpg",
    isNew: true,
    desc: "Ice-blue knit with a clear sole. Light, washable, everyday.",
  },
];

const TITLES = {
  home: "Men's Trainers & Shoes",
  men: "Men's Trainers & Shoes",
  women: "Women's Trainers & Shoes",
  kids: "Kids' Trainers & Shoes",
  new: "New Releases",
  sale: "Sale",
  collections: "Collections",
};

const state = {
  nav: "men",
  type: "all",
  size: 45,
  sizeTouched: false,
  maxPrice: 799,
  sale: "all",
  sort: "latest",
  search: "",
  sports: [],
  cart: JSON.parse(localStorage.getItem("kross-cart") || "[]"),
  wish: JSON.parse(localStorage.getItem("kross-wish") || "[]"),
  user: localStorage.getItem("kross-user"),
  pickedSize: null,
};

const grid = document.getElementById("grid");
const toastEl = document.getElementById("toast");
const scrim = document.getElementById("scrim");

function money(n) {
  return `USD ${n.toFixed(2)}`;
}

function save() {
  localStorage.setItem("kross-cart", JSON.stringify(state.cart));
  localStorage.setItem("kross-wish", JSON.stringify(state.wish));
}

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => {
    toastEl.hidden = true;
  }, 1800);
}

function productById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function filtered() {
  const genderMap = { men: "men", women: "women", kids: "kids" };
  return PRODUCTS.filter((p) => {
    if (state.search) {
      const q = state.search.toLowerCase();
      const blob = `${p.name} ${p.category} ${p.type} ${p.extra || ""}`.toLowerCase();
      return blob.includes(q);
    }
    if (state.nav === "new" && !p.isNew) return false;
    if (state.nav === "sale" && !p.sale) return false;
    if (state.nav === "collections" && !p.featured) return false;
    if (genderMap[state.nav] && !p.gender.includes(genderMap[state.nav])) return false;
    if (state.type !== "all" && p.type !== state.type) return false;
    if (state.sports.length && !state.sports.includes(p.type)) return false;
    if (state.sizeTouched && !p.sizes.includes(Number(state.size))) return false;
    if (p.price > Number(state.maxPrice)) return false;
    if (state.sale === "yes" && !p.sale) return false;
    if (state.sale === "no" && p.sale) return false;
    return true;
  }).sort((a, b) => {
    if (state.sort === "price-asc") return a.price - b.price;
    if (state.sort === "price-desc") return b.price - a.price;
    if (state.sort === "featured") return Number(b.featured) - Number(a.featured);
    return 0;
  });
}

function renderGrid() {
  const items = filtered();
  const title = TITLES[state.nav] || TITLES.men;
  document.getElementById("page-title").textContent = title;
  document.getElementById("results-label").textContent = title;
  document.getElementById("results-count").textContent = `— ${items.length} result${items.length === 1 ? "" : "s"}`;
  document.title = `KROSS — ${title}`;

  document.querySelectorAll(".nav button").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.nav === state.nav);
  });

  const genderLabel = { men: "Men", women: "Women", kids: "Kids" }[state.nav] || "Men";
  document.getElementById("crumb").innerHTML = `
    <button data-nav="home">Home page</button>
    <span>→</span>
    <button data-nav="${state.nav === "women" || state.nav === "kids" ? state.nav : "men"}">${genderLabel}</button>
    <span>→</span>
    <span>Shoes</span>
  `;

  if (!items.length) {
    grid.innerHTML = `<div class="empty">No trainers match these filters.</div>`;
    return;
  }

  grid.innerHTML = items
    .map(
      (p) => `
      <article class="product" data-id="${p.id}">
        <div class="product-media" data-detail="${p.id}">
          <img src="${p.image}" alt="${p.name}" />
        </div>
        <div class="product-info">
          <h2>${p.name}</h2>
          ${p.extra ? `<p>${p.extra}</p>` : ""}
          <p>${p.category}</p>
          <p>${p.colors} Colour${p.colors === 1 ? "" : "s"}</p>
          <div class="product-buy">
            <span>${money(p.price)}${p.originalPrice ? `<span class="old-price">${money(p.originalPrice)}</span>` : ""}</span>
            <button type="button" class="add-cart" data-add="${p.id}">Add to cart</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function renderCart() {
  const body = document.getElementById("cart-body");
  const count = state.cart.reduce((n, i) => n + i.qty, 0);
  const badge = document.getElementById("cart-count");
  badge.hidden = count === 0;
  badge.textContent = count;

  if (!state.cart.length) {
    body.innerHTML = `<p class="fine">Your bag is empty.</p>`;
    return;
  }

  const total = state.cart.reduce((n, i) => n + productById(i.id).price * i.qty, 0);
  body.innerHTML =
    state.cart
      .map((i) => {
        const p = productById(i.id);
        return `
        <div class="line-item">
          <img src="${p.image}" alt="" />
          <div>
            <h3>${p.name}</h3>
            <p>EU ${i.size} · ${money(p.price)}</p>
            <div class="qty">
              <button data-qty="${p.id}:${i.size}:-1">−</button>
              <span>${i.qty}</span>
              <button data-qty="${p.id}:${i.size}:1">+</button>
            </div>
          </div>
          <button class="text-btn" data-remove="${p.id}:${i.size}">Remove</button>
        </div>`;
      })
      .join("") +
    `<div class="cart-total"><span>Total</span><span>${money(total)}</span></div>
     <button class="primary-btn" id="checkout">Checkout</button>`;
}

function renderWish() {
  const body = document.getElementById("wish-body");
  const badge = document.getElementById("wish-count");
  badge.hidden = state.wish.length === 0;
  badge.textContent = state.wish.length;

  if (!state.wish.length) {
    body.innerHTML = `<p class="fine">No favourites yet.</p>`;
    return;
  }

  body.innerHTML = state.wish
    .map((id) => {
      const p = productById(id);
      return `
      <div class="line-item">
        <img src="${p.image}" alt="" />
        <div>
          <h3>${p.name}</h3>
          <p>${money(p.price)}</p>
        </div>
        <button class="text-btn" data-unwish="${id}">Remove</button>
      </div>`;
    })
    .join("");
}

function typicalSize(nav) {
  if (nav === "women") return 39;
  if (nav === "kids") return 37;
  return 45;
}

function setSize(n, touched = false) {
  state.size = Number(n);
  state.sizeTouched = touched;
  document.getElementById("size-filter").value = String(n);
  document.getElementById("size-value").textContent = String(n);
}

function addToCart(id, size) {
  const product = productById(id);
  const pick = size || product.sizes[Math.floor(product.sizes.length / 2)];
  const found = state.cart.find((i) => i.id === id && i.size === pick);
  if (found) found.qty += 1;
  else state.cart.push({ id, size: pick, qty: 1 });
  save();
  renderCart();
  toast("Added to bag");
}

function openOverlay(name) {
  closeAll();
  scrim.hidden = false;
  document.body.classList.add("lock");
  if (name === "search") {
    document.getElementById("search-overlay").hidden = false;
    document.getElementById("search-input").focus();
  }
  if (name === "filters") document.getElementById("filter-drawer").hidden = false;
  if (name === "cart") document.getElementById("cart-drawer").hidden = false;
  if (name === "wishlist") document.getElementById("wish-drawer").hidden = false;
  if (name === "help") document.getElementById("help-modal").hidden = false;
  if (name === "promo") document.getElementById("promo-modal").hidden = false;
  if (name === "signin" || name === "join") {
    const join = name === "join";
    document.getElementById("auth-title").textContent = join ? "Join Us" : "Sign In";
    document.getElementById("auth-switch").textContent = join
      ? "Already have an account? Use Sign In."
      : "New here? Use Join Us.";
    document.getElementById("auth-modal").hidden = false;
  }
}

function closeAll() {
  scrim.hidden = true;
  document.body.classList.remove("lock");
  document.querySelectorAll(".overlay, .drawer, .modal").forEach((el) => {
    el.hidden = true;
  });
  document.getElementById("main-nav").classList.remove("is-open");
}

function openProduct(id) {
  const p = productById(id);
  state.pickedSize = p.sizes.includes(state.size) ? Number(state.size) : p.sizes[0];
  document.getElementById("product-detail").innerHTML = `
    <img src="${p.image}" alt="${p.name}" />
    <div>
      <h2>${p.name}</h2>
      <p class="fine">${p.category} · ${p.colors} colours</p>
      <p>${p.desc}</p>
      <p><strong>${money(p.price)}</strong></p>
      <div class="sizes">
        ${p.sizes.map((s) => `<button type="button" data-pick="${s}" class="${s === state.pickedSize ? "is-on" : ""}">${s}</button>`).join("")}
      </div>
      <div class="modal-actions">
        <button type="button" class="primary-btn" data-add="${p.id}">Add to cart</button>
        <button type="button" class="text-btn" data-wish="${p.id}">${state.wish.includes(p.id) ? "Saved" : "Save to favourites"}</button>
      </div>
    </div>
  `;
  closeAll();
  scrim.hidden = false;
  document.body.classList.add("lock");
  document.getElementById("product-modal").hidden = false;
}

document.body.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-nav]");
  if (nav) {
    e.preventDefault();
    state.nav = nav.dataset.nav === "home" ? "men" : nav.dataset.nav;
    setSize(typicalSize(state.nav));
    document.getElementById("main-nav").classList.remove("is-open");
    renderGrid();
  }

  const open = e.target.closest("[data-open]");
  if (open) openOverlay(open.dataset.open);

  const close = e.target.closest("[data-close]");
  if (close || e.target === scrim) closeAll();

  const add = e.target.closest("[data-add]");
  if (add) {
    const fromModal = add.closest("#product-detail");
    addToCart(add.dataset.add, fromModal ? state.pickedSize : undefined);
    openOverlay("cart");
  }

  const detail = e.target.closest("[data-detail]");
  if (detail) openProduct(detail.dataset.detail);

  const pick = e.target.closest("[data-pick]");
  if (pick) {
    state.pickedSize = Number(pick.dataset.pick);
    pick.parentElement.querySelectorAll("button").forEach((b) => b.classList.remove("is-on"));
    pick.classList.add("is-on");
  }

  const wish = e.target.closest("[data-wish]");
  if (wish) {
    const id = wish.dataset.wish;
    if (state.wish.includes(id)) state.wish = state.wish.filter((x) => x !== id);
    else state.wish.push(id);
    save();
    renderWish();
    wish.textContent = state.wish.includes(id) ? "Saved" : "Save to favourites";
  }

  const unwish = e.target.closest("[data-unwish]");
  if (unwish) {
    state.wish = state.wish.filter((x) => x !== unwish.dataset.unwish);
    save();
    renderWish();
  }

  const remove = e.target.closest("[data-remove]");
  if (remove) {
    const [id, size] = remove.dataset.remove.split(":");
    state.cart = state.cart.filter((i) => !(i.id === id && String(i.size) === size));
    save();
    renderCart();
  }

  const qty = e.target.closest("[data-qty]");
  if (qty) {
    const [id, size, delta] = qty.dataset.qty.split(":");
    const item = state.cart.find((i) => i.id === id && String(i.size) === size);
    if (item) {
      item.qty += Number(delta);
      if (item.qty <= 0) state.cart = state.cart.filter((i) => i !== item);
      save();
      renderCart();
    }
  }

  if (e.target.id === "checkout") {
    state.cart = [];
    save();
    renderCart();
    closeAll();
    toast("Order placed — thanks");
  }

  if (e.target.id === "shop-apex") {
    closeAll();
    openProduct("apex");
  }

  if (e.target.id === "apply-filters") {
    const gender = document.querySelector("input[name='gender-extra']:checked").value;
    if (gender !== "all") state.nav = gender;
    state.sports = [...document.querySelectorAll("input[name='sport-extra']:checked")].map((i) => i.value);
    closeAll();
    renderGrid();
  }

  if (e.target.id === "reset-filters") {
    state.type = "all";
    state.size = 45;
    state.sizeTouched = false;
    state.maxPrice = 799;
    state.sale = "all";
    state.sort = "latest";
    state.sports = [];
    state.search = "";
    document.getElementById("type-filter").value = "all";
    document.getElementById("size-filter").value = 45;
    document.getElementById("price-filter").value = 799;
    document.getElementById("sale-filter").value = "all";
    document.getElementById("sort-filter").value = "latest";
    document.getElementById("size-value").textContent = "45";
    document.getElementById("price-value").textContent = "799.00";
    document.querySelectorAll("input[name='sport-extra']").forEach((i) => (i.checked = false));
    document.querySelector("input[name='gender-extra'][value='all']").checked = true;
    renderGrid();
  }
});

document.getElementById("menu-toggle").addEventListener("click", (e) => {
  e.stopPropagation();
  const nav = document.getElementById("main-nav");
  const willOpen = !nav.classList.contains("is-open");
  closeAll();
  if (willOpen) {
    nav.classList.add("is-open");
    document.body.classList.add("lock");
  }
});

document.getElementById("nav-close").addEventListener("click", () => closeAll());

document.getElementById("type-filter").addEventListener("change", (e) => {
  state.type = e.target.value;
  renderGrid();
});
document.getElementById("sale-filter").addEventListener("change", (e) => {
  state.sale = e.target.value;
  renderGrid();
});
document.getElementById("sort-filter").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderGrid();
});
document.getElementById("size-filter").addEventListener("input", (e) => {
  setSize(e.target.value, true);
  renderGrid();
});
document.getElementById("price-filter").addEventListener("input", (e) => {
  state.maxPrice = Number(e.target.value);
  document.getElementById("price-value").textContent = Number(e.target.value).toFixed(2);
  renderGrid();
});
document.getElementById("search-input").addEventListener("input", (e) => {
  state.search = e.target.value.trim();
  renderGrid();
});

document.getElementById("auth-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.querySelector("input[type=email]").value;
  state.user = email;
  localStorage.setItem("kross-user", email);
  closeAll();
  toast(`Welcome, ${email.split("@")[0]}`);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAll();
});

renderGrid();
renderCart();
renderWish();
