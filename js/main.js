/* =========================================================
   PASTASTIC CONFIG
   Everything you might need to change lives here.
   ========================================================= */
const CONFIG = {
  // Google Form (headless). From the form's public link.
  FORM_ID: "1FAIpQLSe68WvsQqD9xxQE5lwq8wXIk12gNac__p1lpSvHaxVYRsKvuQ",

  // entry.XXXX ids of each form question
  // The form has "Collect email addresses" ON (responder input), so Google
  // rejects any order without an email. If the group turns that setting OFF,
  // set ASK_EMAIL to false and the Email field disappears.
  ASK_EMAIL: true,

  ENTRY: {
    email: "emailAddress",
    name: "entry.1591794253",
    age: "entry.178329093",
    campus: "entry.519252925",
    section: "entry.1490564174",
    otherCampus: "entry.607255097",
    flavor: "entry.1135911514",
    qty: "entry.2058762806",
    notes: "entry.1133305288", // "Special requests" paragraph: gets contact, total, notes
    payment: "entry.886754866",
  },

  // The form has page breaks, so Google needs to know which pages were "visited".
  PAGE_HISTORY: "0,1,2,3,4,5",

  // Menu. `formLabel` must match the form's choice text EXACTLY.
  DISHES: [
    {
      id: "garlic",
      name: "Garlic Parmesan Chicken Pasta",
      price: 109,
      img: "assets/dish-garlic-parmesan.jpg",
      desc: "Fettuccine in a creamy garlic parmesan sauce with tender chicken and fresh parsley.",
      tag: "Crowd favorite",
      formLabel: "🍗 Garlic Parmesan Chicken Pasta | ₱109",
    },
    {
      id: "cajun",
      name: "Creamy Cajun Sausage Penne",
      price: 109,
      img: "assets/dish-cajun-penne.jpg",
      desc: "Penne tossed in a smoky, creamy Cajun sauce with sliced sausage and a little kick.",
      tag: "A bit spicy",
      formLabel: "🌭 Creamy Cajun Sausage Penne | ₱109",
    },
    {
      id: "tuna",
      name: "Tuna Salpicao Pasta",
      price: 105,
      img: "assets/dish-tuna-salpicao.jpg",
      desc: "Garlicky salpicao-style pasta with tuna and beef, finished with grated cheese.",
      tag: "Garlic lovers",
      formLabel: "🍣 Tuna Salpicao Pasta | ₱105",
    },
  ],

  AGE_OPTIONS: ["Under 18 years old", "18-24 years old", "24-34 years old"],

  // Must match the form's dropdown text EXACTLY.
  CAMPUS_OPTIONS: [
    "LA SALLE COLLEGE ANTIPOLO",
    "DE LA SALLE UNIVERSITY",
    "UNIVERSITY OF THE PHILIPPINES",
    "ATENEO DE MANILA UNIVERSITY",
    "UNIVERSITY OF SANTO TOMAS",
    "SUMULONG MEMORIAL HIGH SCHOOL",
    "SUN HWA INTERNATIONAL ACADEMY",
    "GOLDEN SUNBEAMS CHRISTIAN SCHOOL",
    "ST. JOHN'S WORT INTEGRATED SCHOOL",
    "DE LA SALLE COLLEGE OF SAINT-BENILDE",
    "HOLY SPIRIT INTEGRATED SCHOOL",
    "ENGLISH CHRISTIAN ACADEMY",
    "RECHAB ACADEMY",
    "OUR LADY OF PEACE SCHOOL",
    "WORLD CITY COLLEGES ANTIPOLO",
    "UNIVERSITY OF RIZAL SYSTEM ANTIPOLO",
    "OTHER(s)",
  ],
  DEFAULT_CAMPUS: "LA SALLE COLLEGE ANTIPOLO",
  OTHER_CAMPUS: "OTHER(s)",

  // TODO: replace with the group's Messenger / Instagram / Facebook link
  messageUrl: "https://m.me/REPLACE_WITH_PAGE",

  // TODO: fill these in (leave "" to hide)
  groupLabel: "Est. 2026", // e.g. "12-E, Group 3 | Est. 2026"
  scheduleText: "", // e.g. "Pickup at the canteen, Mon to Fri, 11:30 AM to 1 PM"
};

/* ========================================================= */

const $ = (sel, el = document) => el.querySelector(sel);
const peso = (n) => "₱" + n.toLocaleString("en-PH");
const cart = Object.fromEntries(CONFIG.DISHES.map((d) => [d.id, 0]));
const MAX_QTY = 20;

/* ---------- Config text / links ---------- */
document.querySelectorAll("[data-config]").forEach((el) => {
  const v = CONFIG[el.dataset.config];
  if (v) el.textContent = v;
  else el.hidden = true;
});
document.querySelectorAll("[data-config-href]").forEach((el) => {
  el.href = CONFIG[el.dataset.configHref];
});

/* ---------- Menu cards ---------- */
const dishesEl = $("#dishes");
dishesEl.innerHTML = CONFIG.DISHES.map(
  (d) => `
  <article class="dish" data-id="${d.id}">
    <div class="dish-img">
      <img src="${d.img}" alt="${d.name}" loading="lazy" width="800" height="1067">
      ${d.tag ? `<span class="dish-tag">${d.tag}</span>` : ""}
    </div>
    <div class="dish-body">
      <div class="dish-top">
        <h3>${d.name}</h3>
        <span class="price">${peso(d.price)}</span>
      </div>
      <p>${d.desc}</p>
      <div class="stepper" role="group" aria-label="${d.name} quantity">
        <button type="button" class="step minus" data-step="-1" aria-label="Remove one ${d.name}">&minus;</button>
        <output class="qty" aria-live="polite">0</output>
        <button type="button" class="step plus" data-step="1" aria-label="Add one ${d.name}">+</button>
      </div>
    </div>
  </article>`
).join("");

dishesEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-step]");
  if (!btn) return;
  const id = btn.closest(".dish").dataset.id;
  cart[id] = Math.max(0, Math.min(MAX_QTY, cart[id] + Number(btn.dataset.step)));
  render();
  if (Number(btn.dataset.step) > 0) bump();
});

/* ---------- Form controls built from config ---------- */
if (!CONFIG.ASK_EMAIL) $("#emailField").remove();

const campusSel = $("#f-campus");
campusSel.innerHTML =
  `<option value="">Choose your school</option>` +
  CONFIG.CAMPUS_OPTIONS.map((c) => `<option value="${c.replace(/"/g, "&quot;")}">${titleCase(c)}</option>`).join("");
campusSel.value = CONFIG.DEFAULT_CAMPUS;
campusSel.addEventListener("change", () => {
  $("#otherCampusField").hidden = campusSel.value !== CONFIG.OTHER_CAMPUS;
});

$("#ageChips").innerHTML = CONFIG.AGE_OPTIONS.map(
  (a, i) => `<label class="chip"><input type="radio" name="age" value="${a}"><span>${a.replace(" years old", "")}</span></label>`
).join("");

document.querySelectorAll('input[name="payment"]').forEach((r) =>
  r.addEventListener("change", () => {
    $("#gcashBox").hidden = payment() !== "GCASH";
  })
);

function titleCase(s) {
  if (s === "OTHER(s)") return "Other school";
  return s
    .toLowerCase()
    .replace(/(^|[\s-])([a-z])/g, (m, a, b) => a + b.toUpperCase())
    .replace(/ (Of|The) /g, (m) => m.toLowerCase());
}
const payment = () => $('input[name="payment"]:checked').value;

/* ---------- Cart rendering ---------- */
function items() {
  return CONFIG.DISHES.filter((d) => cart[d.id] > 0).map((d) => ({ ...d, qty: cart[d.id], sub: d.price * cart[d.id] }));
}
const totals = () => items().reduce((a, i) => ({ bowls: a.bowls + i.qty, total: a.total + i.sub }), { bowls: 0, total: 0 });

function render() {
  const list = items();
  const { bowls, total } = totals();

  document.querySelectorAll(".dish").forEach((el) => {
    const q = cart[el.dataset.id];
    el.querySelector(".qty").textContent = q;
    el.classList.toggle("in-cart", q > 0);
    el.querySelector(".minus").disabled = q === 0;
  });

  $("#cartList").innerHTML = list
    .map((i) => `<li><span class="q">${i.qty}&times;</span><span class="n">${i.name}</span><span class="s">${peso(i.sub)}</span></li>`)
    .join("");
  $("#cartEmpty").hidden = list.length > 0;
  $("#cartTotal").textContent = peso(total);
  $("#barCount").textContent = bowls === 1 ? "1 bowl" : `${bowls} bowls`;
  $("#barTotal").textContent = peso(total);
  $("#cartbar").classList.toggle("show", bowls > 0);
  document.body.classList.toggle("has-cart", bowls > 0);
  if (bowls > 0) setErr("cart", "");
}

function bump() {
  const bar = $("#cartbar");
  bar.classList.remove("bump");
  void bar.offsetWidth;
  bar.classList.add("bump");
}

/* ---------- Validation ---------- */
function setErr(key, msg) {
  const el = $("#err-" + key);
  if (el) el.textContent = msg;
  const input = $("#f-" + key);
  if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
}

function validate() {
  const f = $("#orderForm");
  const v = {
    name: f.name.value.trim(),
    section: f.section.value.trim(),
    contact: f.contact.value.trim(),
    email: CONFIG.ASK_EMAIL ? f.email.value.trim() : "",
    campus: campusSel.value,
    otherCampus: f.otherCampus.value.trim(),
    age: (f.querySelector('input[name="age"]:checked') || {}).value || "",
    payment: payment(),
    notes: f.notes.value.trim(),
  };
  const errs = {
    cart: totals().bowls > 0 ? "" : "Add at least 1 bowl from the menu.",
    name: v.name ? "" : "Please enter your name.",
    section: v.section ? "" : "Please enter your grade and section.",
    contact: v.contact.length >= 3 ? "" : "Add your Messenger name or mobile number.",
    email: !CONFIG.ASK_EMAIL || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) ? "" : "Please enter a valid email.",
    campus: v.campus ? "" : "Please choose your school.",
    otherCampus: v.campus === CONFIG.OTHER_CAMPUS && !v.otherCampus ? "Tell us your school (or N/A)." : "",
    age: v.age ? "" : "Please pick an age range.",
  };
  Object.entries(errs).forEach(([k, m]) => setErr(k, m));
  const first = Object.keys(errs).find((k) => errs[k]);
  return { ok: !first, first, v };
}

/* ---------- Build the Google Form payload ---------- */
function buildPayload(v) {
  const E = CONFIG.ENTRY;
  const list = items();
  const { bowls, total } = totals();
  const p = new URLSearchParams();
  const breakdown = list.map((i) => `${i.qty}x ${i.name}`).join(", ");

  if (CONFIG.ASK_EMAIL) p.append(E.email, v.email);
  p.append(E.name, v.name);
  p.append(E.age, v.age);
  p.append(E.campus, v.campus);
  p.append(E.section, v.section);
  if (v.campus === CONFIG.OTHER_CAMPUS) p.append(E.otherCampus, v.otherCampus);

  // Flavor: exact choice for a single dish, "Other" with a breakdown for mixed orders.
  if (list.length === 1) {
    p.append(E.flavor, list[0].formLabel);
  } else {
    p.append(E.flavor, "__other_option__");
    p.append(E.flavor + ".other_option_response", breakdown);
  }

  // How many: exact choice for 1 to 5, "Other" above that.
  if (bowls <= 5) {
    p.append(E.qty, bowls === 1 ? "1 bowl" : `${bowls} bowls`);
  } else {
    p.append(E.qty, "__other_option__");
    p.append(E.qty + ".other_option_response", `${bowls} bowls`);
  }

  p.append(
    E.notes,
    [
      `ORDER: ${breakdown}`,
      `TOTAL: ${peso(total)}`,
      `CONTACT: ${v.contact}`,
      `NOTES: ${v.notes || "None"}`,
      `(sent from the Pastastic website)`,
    ].join("\n")
  );
  p.append(E.payment, v.payment);
  p.append("pageHistory", CONFIG.PAGE_HISTORY);
  return p;
}

/* ---------- Submit ---------- */
const form = $("#orderForm");
const submitBtn = $("#submitBtn");
let sending = false;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (sending) return;
  $("#formError").textContent = "";

  const { ok, first, v } = validate();
  if (!ok) {
    const target = first === "cart" ? $(".summary-card") : first === "age" ? $("#ageChips") : $("#f-" + first);
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    if (target.focus && first !== "cart" && first !== "age") target.focus({ preventScroll: true });
    $("#formError").textContent = "Almost there! Please check the highlighted fields.";
    return;
  }

  const snapshot = { list: items(), ...totals(), payment: v.payment, name: v.name };
  sending = true;
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  submitBtn.querySelector(".btn-label").textContent = "Sending...";

  try {
    await fetch(`https://docs.google.com/forms/d/e/${CONFIG.FORM_ID}/formResponse`, {
      method: "POST",
      mode: "no-cors",
      body: buildPayload(v),
    });
    showConfirm(snapshot);
  } catch (err) {
    $("#formError").textContent = "We could not send your order. Check your internet connection and try again.";
  } finally {
    sending = false;
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    submitBtn.querySelector(".btn-label").textContent = "Send my order";
  }
});

/* ---------- Confirmation ---------- */
function showConfirm(s) {
  $("#confirmList").innerHTML = s.list
    .map((i) => `<li><span class="q">${i.qty}&times;</span><span class="n">${i.name}</span><span class="s">${peso(i.sub)}</span></li>`)
    .join("");
  $("#confirmTotal").textContent = peso(s.total);
  const first = s.name.includes(",") ? s.name.split(",")[1].trim().split(" ")[0] : s.name.split(" ")[0];
  $("#confirmMeta").textContent =
    `Thanks, ${first || "friend"}! ` +
    (s.payment === "GCASH" ? "Payment: GCash." : "Payment: cash on pickup. Please bring the exact amount if you can.") +
    " We will message you to confirm pickup.";
  $("#confirmGcash").hidden = s.payment !== "GCASH";
  $("#confirmGcashAmt").textContent = peso(s.total);
  const c = $("#confirm");
  c.hidden = false;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => c.classList.add("open"));
  $("#confirm-title").focus();
}

$("#newOrder").addEventListener("click", () => {
  Object.keys(cart).forEach((k) => (cart[k] = 0));
  form.notes.value = "";
  render();
  const c = $("#confirm");
  c.classList.remove("open");
  c.hidden = true;
  document.body.classList.remove("modal-open");
  $("#menu").scrollIntoView({ behavior: "smooth" });
});

render();
