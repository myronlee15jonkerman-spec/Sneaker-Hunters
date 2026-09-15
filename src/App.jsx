import { useState, useMemo, useEffect } from "react";
import { ShoppingBag, X, Plus, Minus, ArrowLeft } from "lucide-react";
import { supabase } from "./supabaseClient";

import airforce1 from "./assets/products/airforce1-white.png";
import p6000 from "./assets/products/p6000-silver.png";
import zoomx from "./assets/products/zoomx-invincible.png";
import jordan1Sail from "./assets/products/jordan1-low-sail.png";
import airmax90grey from "./assets/products/airmax90-grey-blue.png";
import jordan1Grey from "./assets/products/jordan1-low-grey.png";
import airmax90white from "./assets/products/airmax90-white-blue.png";
import spizike from "./assets/products/spizike-low-white.png";
import jordan5 from "./assets/products/jordan5-black-blue.png";
import airmax95 from "./assets/products/airmax95-white-grey.png";
import dunkLow from "./assets/products/dunk-low-khaki.png";
import jordan1Chicago from "./assets/products/jordan1-mid-chicago.png";

const COLORS = {
  ink: "#1C1E1B",
  inkSoft: "#3A3C37",
  paper: "#EDEAE2",
  card: "#E3DDCE",
  cardLine: "#CFC7B3",
  brick: "#96432B",
  brickDark: "#7A3521",
  brass: "#B08D4F",
  cream: "#F5F2EA",
  red: "#A8402E",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
`;

const CATEGORIES = ["All", "Basketball", "Lifestyle", "Running"];

const IMAGES = {
  "af1-white": airforce1,
  "p6000-silver": p6000,
  "zoomx-invincible": zoomx,
  "jordan1-sail": jordan1Sail,
  "airmax90-grey": airmax90grey,
  "jordan1-grey": jordan1Grey,
  "airmax90-blue": airmax90white,
  "spizike-white": spizike,
  "jordan5-blue": jordan5,
  "airmax95-grey": airmax95,
  "dunk-khaki": dunkLow,
  "jordan1-chicago": jordan1Chicago,
};

function money(n) {
  return `$${n.toFixed(2)}`;
}

function Stamp({ label, sub, size = 92, tilt = -7 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1.5px dashed ${COLORS.brass}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `rotate(${tilt}deg)`,
        flexShrink: 0,
        color: COLORS.brass,
      }}
    >
      <span style={{ fontFamily: "Oswald", fontSize: size * 0.13, letterSpacing: 1, fontWeight: 600 }}>{label}</span>
      {sub && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: size * 0.1, marginTop: 2 }}>{sub}</span>}
    </div>
  );
}

function ProductPhoto({ src, alt }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "4 / 3",
        borderRadius: 8,
        overflow: "hidden",
        background: COLORS.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

function CategoryPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "Inter",
        fontSize: 13,
        fontWeight: 500,
        padding: "7px 16px",
        borderRadius: 999,
        border: `1px solid ${active ? COLORS.ink : COLORS.cardLine}`,
        background: active ? COLORS.ink : "transparent",
        color: active ? COLORS.cream : COLORS.inkSoft,
        cursor: "pointer",
        letterSpacing: 0.2,
      }}
    >
      {label}
    </button>
  );
}

function ProductCard({ product, onOpen }) {
  return (
    <div
      onClick={() => onOpen(product)}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.cardLine}`,
        borderRadius: 10,
        padding: 14,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
      }}
    >
      <ProductPhoto src={product.image} alt={product.name} />
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: COLORS.cream,
          border: `1px solid ${COLORS.brass}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "rotate(-8deg)",
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: COLORS.brickDark, textAlign: "center", lineHeight: 1.1 }}>
          US {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}
        </span>
      </div>
      <div>
        <p style={{ fontFamily: "Inter", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: COLORS.brickDark, margin: 0 }}>
          {product.category}
        </p>
        <h3 style={{ fontFamily: "Oswald", fontSize: 19, fontWeight: 600, margin: "2px 0 0", color: COLORS.ink }}>
          {product.name}
        </h3>
        <p style={{ fontFamily: "Inter", fontSize: 12.5, color: COLORS.inkSoft, margin: "2px 0 0" }}>{product.color}</p>
      </div>
      <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 15, color: COLORS.ink, margin: 0 }}>{money(product.price)}</p>
    </div>
  );
}

function ProductModal({ product, onClose, onAdd }) {
  const [size, setSize] = useState(null);
  const [error, setError] = useState("");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(28,30,27,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.paper,
          borderRadius: 14,
          maxWidth: 480,
          width: "100%",
          padding: 24,
          position: "relative",
          maxHeight: "88vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: COLORS.inkSoft }}
        >
          <X size={22} />
        </button>
        <ProductPhoto src={product.image} alt={product.name} />
        <p style={{ fontFamily: "Inter", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: COLORS.brickDark, margin: "16px 0 0" }}>
          {product.category} · {product.color}
        </p>
        <h2 style={{ fontFamily: "Oswald", fontSize: 28, fontWeight: 600, margin: "4px 0 8px", color: COLORS.ink }}>
          {product.name}
        </h2>
        <p style={{ fontFamily: "Inter", fontSize: 14, lineHeight: 1.6, color: COLORS.inkSoft, margin: "0 0 12px" }}>{product.desc}</p>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 20, color: COLORS.ink, margin: "0 0 18px" }}>{money(product.price)}</p>

        <p style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, margin: "0 0 8px", letterSpacing: 0.3 }}>
          SELECT SIZE (US)
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSize(s);
                setError("");
              }}
              style={{
                width: 42,
                height: 42,
                borderRadius: 8,
                border: `1.5px solid ${size === s ? COLORS.ink : COLORS.cardLine}`,
                background: size === s ? COLORS.ink : "transparent",
                color: size === s ? COLORS.cream : COLORS.ink,
                fontFamily: "'JetBrains Mono'",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        {error && <p style={{ color: COLORS.red, fontSize: 13, fontFamily: "Inter", margin: "4px 0 12px" }}>{error}</p>}

        <button
          onClick={() => {
            if (!size) {
              setError("Pick a size first.");
              return;
            }
            onAdd(product, size);
          }}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "13px 0",
            background: COLORS.brick,
            color: COLORS.cream,
            border: "none",
            borderRadius: 8,
            fontFamily: "Oswald",
            fontSize: 15,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Add to bag
        </button>
      </div>
    </div>
  );
}

function CartDrawer({ items, onClose, onQty, onRemove, onCheckout, subtotal }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(28,30,27,0.5)" }} onClick={onClose} />
      <div
        style={{
          position: "relative",
          width: "min(400px, 100%)",
          background: COLORS.paper,
          height: "100%",
          padding: 22,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "Oswald", fontSize: 22, fontWeight: 600, margin: 0, color: COLORS.ink }}>Your bag</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.inkSoft }}>
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <p style={{ fontFamily: "Inter", fontSize: 14, color: COLORS.inkSoft }}>
            Nothing in your bag yet. Add a pair to get started.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            {items.map((it) => (
              <div key={it.key} style={{ display: "flex", gap: 12, borderBottom: `1px solid ${COLORS.cardLine}`, paddingBottom: 14 }}>
                <div style={{ width: 64, height: 56, borderRadius: 6, background: COLORS.card, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                  <img src={it.image} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "Oswald", fontSize: 15, fontWeight: 600, margin: 0, color: COLORS.ink }}>{it.name}</p>
                  <p style={{ fontFamily: "Inter", fontSize: 12.5, color: COLORS.inkSoft, margin: "2px 0 6px" }}>Size {it.size}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => onQty(it.key, -1)} style={qtyBtnStyle}><Minus size={12} /></button>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13 }}>{it.qty}</span>
                    <button onClick={() => onQty(it.key, 1)} style={qtyBtnStyle}><Plus size={12} /></button>
                    <button
                      onClick={() => onRemove(it.key)}
                      style={{ marginLeft: "auto", background: "none", border: "none", color: COLORS.brickDark, fontFamily: "Inter", fontSize: 12.5, cursor: "pointer", textDecoration: "underline" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, color: COLORS.ink, margin: 0 }}>{money(it.price * it.qty)}</p>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontFamily: "Inter", fontSize: 14, color: COLORS.inkSoft }}>Subtotal</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, color: COLORS.ink }}>{money(subtotal)}</span>
            </div>
            <button
              onClick={onCheckout}
              style={{
                width: "100%",
                padding: "13px 0",
                background: COLORS.ink,
                color: COLORS.cream,
                border: "none",
                borderRadius: 8,
                fontFamily: "Oswald",
                fontSize: 15,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const qtyBtnStyle = {
  width: 24,
  height: 24,
  borderRadius: 6,
  border: `1px solid ${COLORS.cardLine}`,
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: COLORS.ink,
};

function inputStyle() {
  return {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 8,
    border: `1px solid ${COLORS.cardLine}`,
    background: COLORS.cream,
    fontFamily: "Inter",
    fontSize: 14,
    color: COLORS.ink,
    boxSizing: "border-box",
  };
}

function Field({ label, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}>{label}</span>
      <input style={inputStyle()} {...props} />
    </label>
  );
}

function CheckoutView({ items, subtotal, onBack, onPlaceOrder }) {
  const [form, setForm] = useState({
    name: "", email: "", address: "", city: "", zip: "",
    card: "", exp: "", cvc: "",
  });
  const [errors, setErrors] = useState({});

  const shipping = subtotal > 0 ? 12 : 0;
  const total = subtotal + shipping;

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function submit() {
    const required = ["name", "email", "address", "city", "zip", "card", "exp", "cvc"];
    const next = {};
    required.forEach((k) => {
      if (!form[k].trim()) next[k] = "Required";
    });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    onPlaceOrder(form, total);
  }

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "40px 20px 80px" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: COLORS.inkSoft, fontFamily: "Inter", fontSize: 13.5, marginBottom: 24 }}>
        <ArrowLeft size={16} /> Back to shop
      </button>
      <h1 style={{ fontFamily: "Oswald", fontSize: 32, fontWeight: 700, color: COLORS.ink, margin: "0 0 24px" }}>Checkout</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 40 }}>
        <div>
          <p style={sectionLabel}>Shipping details</p>
          <Field label="Full name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jordan Alvarez" />
          {errors.name && <ErrorText t={errors.name} />}
          <Field label="Email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jordan@email.com" />
          {errors.email && <ErrorText t={errors.email} />}
          <Field label="Address" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="120 Cobbler Street" />
          {errors.address && <ErrorText t={errors.address} />}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Field label="City" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Cape Town" />
              {errors.city && <ErrorText t={errors.city} />}
            </div>
            <div style={{ width: 130 }}>
              <Field label="ZIP / postal" value={form.zip} onChange={(e) => update("zip", e.target.value)} placeholder="8001" />
              {errors.zip && <ErrorText t={errors.zip} />}
            </div>
          </div>

          <p style={{ ...sectionLabel, marginTop: 26 }}>Payment (test mode)</p>
          <Field label="Card number" value={form.card} onChange={(e) => update("card", e.target.value)} placeholder="4242 4242 4242 4242" />
          {errors.card && <ErrorText t={errors.card} />}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Field label="Expiry" value={form.exp} onChange={(e) => update("exp", e.target.value)} placeholder="MM/YY" />
              {errors.exp && <ErrorText t={errors.exp} />}
            </div>
            <div style={{ width: 120 }}>
              <Field label="CVC" value={form.cvc} onChange={(e) => update("cvc", e.target.value)} placeholder="123" />
              {errors.cvc && <ErrorText t={errors.cvc} />}
            </div>
          </div>
        </div>

        <div>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardLine}`, borderRadius: 12, padding: 20 }}>
            <p style={sectionLabel}>Order summary</p>
            {items.map((it) => (
              <div key={it.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: "Inter", fontSize: 13.5, color: COLORS.inkSoft }}>
                  {it.name} · Sz {it.size} × {it.qty}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13.5, color: COLORS.ink }}>{money(it.price * it.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${COLORS.cardLine}`, marginTop: 10, paddingTop: 10 }}>
              <Row label="Subtotal" value={money(subtotal)} />
              <Row label="Shipping" value={money(shipping)} />
              <Row label="Total" value={money(total)} bold />
            </div>
          </div>
          <button
            onClick={submit}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "14px 0",
              background: COLORS.brick,
              color: COLORS.cream,
              border: "none",
              borderRadius: 8,
              fontFamily: "Oswald",
              fontSize: 15,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Place order
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorText({ t }) {
  return <p style={{ color: COLORS.red, fontSize: 12.5, fontFamily: "Inter", margin: "-8px 0 12px" }}>{t}</p>;
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontFamily: "Inter", fontSize: bold ? 14.5 : 13.5, fontWeight: bold ? 600 : 400, color: bold ? COLORS.ink : COLORS.inkSoft }}>{label}</span>
      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: bold ? 16 : 13.5, color: COLORS.ink }}>{value}</span>
    </div>
  );
}

const sectionLabel = {
  fontFamily: "Inter",
  fontSize: 11.5,
  fontWeight: 600,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: COLORS.brickDark,
  margin: "0 0 14px",
};

function Confirmation({ order, onContinue }) {
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "70px 20px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Stamp label="ORDER" sub="CONFIRMED" size={110} tilt={-6} />
      </div>
      <h1 style={{ fontFamily: "Oswald", fontSize: 30, fontWeight: 700, color: COLORS.ink, margin: "0 0 8px" }}>
        Thanks, {order.form.name.split(" ")[0]}.
      </h1>
      <p style={{ fontFamily: "Inter", fontSize: 14.5, color: COLORS.inkSoft, margin: "0 0 4px" }}>
        Order <span style={{ fontFamily: "'JetBrains Mono'" }}>{order.id}</span> is confirmed.
      </p>
      <p style={{ fontFamily: "Inter", fontSize: 14.5, color: COLORS.inkSoft, margin: "0 0 28px" }}>
        A receipt was sent to {order.form.email}.
      </p>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardLine}`, borderRadius: 12, padding: 20, textAlign: "left", marginBottom: 24 }}>
        {order.items.map((it) => (
          <div key={it.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "Inter", fontSize: 13.5, color: COLORS.inkSoft }}>{it.name} · Sz {it.size} × {it.qty}</span>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13.5 }}>{money(it.price * it.qty)}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${COLORS.cardLine}`, marginTop: 10, paddingTop: 10 }}>
          <Row label="Total paid" value={money(order.total)} bold />
        </div>
      </div>
      <button
        onClick={onContinue}
        style={{
          padding: "13px 28px",
          background: COLORS.ink,
          color: COLORS.cream,
          border: "none",
          borderRadius: 8,
          fontFamily: "Oswald",
          fontSize: 14.5,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Continue shopping
      </button>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("shop");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [openProduct, setOpenProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase.from("products").select("*").order("id");
      if (error) {
        setLoadError(error.message);
        setLoading(false);
        return;
      }
      const mapped = data.map((row) => ({
        id: row.slug,
        name: row.name,
        category: row.category,
        price: row.price,
        color: row.color,
        desc: row.description,
        sizes: row.sizes.split(",").map((s) => Number(s.trim())),
        image: IMAGES[row.slug],
      }));
      setProducts(mapped);
      setLoading(false);
    }
    loadProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");

    if (paymentStatus === "success") {
      const pending = localStorage.getItem("pendingOrder");
      if (pending) {
        const { form, items, total } = JSON.parse(pending);
        (async () => {
          const id = "SH-" + Math.floor(100000 + Math.random() * 900000);
          const { error } = await supabase.from("orders").insert([
            {
              order_number: id,
              customer_name: form.name,
              customer_email: form.email,
              address: form.address,
              city: form.city,
              zip: form.zip,
              total: total,
              items: JSON.stringify(items),
            },
          ]);
          if (!error) {
            setOrder({ id, form, items, total });
            setView("confirm");
          } else {
            console.error(error);
          }
          localStorage.removeItem("pendingOrder");
          window.history.replaceState({}, "", window.location.pathname);
        })();
      }
    } else if (paymentStatus === "cancelled" || paymentStatus === "failed") {
      localStorage.removeItem("pendingOrder");
      window.history.replaceState({}, "", window.location.pathname);
      alert("Payment was not completed. Your cart is still saved.");
    }
  }, []);

  const filtered = useMemo(
    () => (category === "All" ? products : products.filter((p) => p.category === category)),
    [category, products]
  );

  const subtotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  const cartCount = cart.reduce((sum, it) => sum + it.qty, 0);

  function addToCart(product, size) {
    const key = `${product.id}-${size}`;
    setCart((prev) => {
      const existing = prev.find((it) => it.key === key);
      if (existing) {
        return prev.map((it) => (it.key === key ? { ...it, qty: it.qty + 1 } : it));
      }
      return [...prev, { key, id: product.id, name: product.name, price: product.price, size, qty: 1, image: product.image }];
    });
    setOpenProduct(null);
    setDrawerOpen(true);
  }

  function changeQty(key, delta) {
    setCart((prev) => prev.map((it) => (it.key === key ? { ...it, qty: Math.max(1, it.qty + delta) } : it)));
  }

  function removeItem(key) {
    setCart((prev) => prev.filter((it) => it.key !== key));
  }

  async function placeOrder(form, total) {
    try {
      const response = await fetch(
        "https://stabutfvkrxbglgjkelk.supabase.co/functions/v1/create-yoco-checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amountInCents: Math.round(total * 100),
            currency: "ZAR",
            successUrl: window.location.origin + "?payment=success",
            cancelUrl: window.location.origin + "?payment=cancelled",
            failureUrl: window.location.origin + "?payment=failed",
          }),
        }
      );

      const data = await response.json();

      if (data.redirectUrl) {
        localStorage.setItem("pendingOrder", JSON.stringify({ form, items: cart, total }));
        window.location.href = data.redirectUrl;
      } else {
        alert("Something went wrong starting the payment. Please try again.");
        console.error(data);
      }
    } catch (error) {
      alert("Something went wrong starting the payment. Please try again.");
      console.error(error);
    }
  }

  return (
    <div style={{ background: COLORS.paper, minHeight: "100vh", width: "100%" }}>
      <style>{FONTS}</style>

      {view !== "confirm" && (
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 28px",
            borderBottom: `1px solid ${COLORS.cardLine}`,
            position: "sticky",
            top: 0,
            background: COLORS.paper,
            zIndex: 10,
          }}
        >
          <span style={{ fontFamily: "Oswald", fontSize: 22, fontWeight: 700, letterSpacing: 1, color: COLORS.ink }}>
            Sneaker Hunters<span style={{ color: COLORS.brick }}>.</span>
          </span>
          {view === "shop" && (
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                position: "relative",
                background: "none",
                border: `1px solid ${COLORS.cardLine}`,
                borderRadius: 8,
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                color: COLORS.ink,
                fontFamily: "Inter",
                fontSize: 13.5,
              }}
            >
              <ShoppingBag size={17} />
              Bag
              {cartCount > 0 && (
                <span
                  style={{
                    background: COLORS.brick,
                    color: COLORS.cream,
                    borderRadius: 999,
                    fontSize: 11,
                    minWidth: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    fontFamily: "'JetBrains Mono'",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </header>
      )}

      {view === "shop" && (
        <>
          <section style={{ padding: "56px 28px 40px", display: "flex", alignItems: "center", gap: 30, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 320px" }}>
              <p style={{ fontFamily: "Inter", fontSize: 12.5, letterSpacing: 2, textTransform: "uppercase", color: COLORS.brickDark, margin: "0 0 10px" }}>
                The hunt starts here
              </p>
              <h1 style={{ fontFamily: "Oswald", fontSize: "clamp(38px, 6vw, 58px)", fontWeight: 700, lineHeight: 1.02, color: COLORS.ink, margin: "0 0 16px" }}>
                Rare kicks.<br />Real hunters.
              </h1>
              <p style={{ fontFamily: "Inter", fontSize: 15.5, color: COLORS.inkSoft, maxWidth: 420, lineHeight: 1.6, margin: "0 0 22px" }}>
                We track down the pairs everyone's chasing, so you don't have to.
              </p>
              <a href="#grid" style={{ display: "inline-block", padding: "13px 26px", background: COLORS.ink, color: COLORS.cream, borderRadius: 8, fontFamily: "Oswald", fontSize: 14.5, letterSpacing: 0.5, textTransform: "uppercase", textDecoration: "none" }}>
                Start the hunt
              </a>
            </div>
            <Stamp label="100%" sub="AUTHENTIC" size={104} tilt={-8} />
          </section>

          <section id="grid" style={{ padding: "0 28px 70px" }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <CategoryPill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
              ))}
            </div>
            {loading && (
              <p style={{ fontFamily: "Inter", fontSize: 14, color: COLORS.inkSoft }}>Loading products…</p>
            )}
            {loadError && (
              <p style={{ fontFamily: "Inter", fontSize: 14, color: COLORS.red }}>
                Couldn't load products: {loadError}
              </p>
            )}
            {!loading && !loadError && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={setOpenProduct} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {view === "checkout" && (
        <CheckoutView items={cart} subtotal={subtotal} onBack={() => setView("shop")} onPlaceOrder={placeOrder} />
      )}

      {view === "confirm" && order && (
        <Confirmation order={order} onContinue={() => { setOrder(null); setView("shop"); }} />
      )}

      {openProduct && (
        <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} onAdd={addToCart} />
      )}

      {drawerOpen && (
        <CartDrawer
          items={cart}
          onClose={() => setDrawerOpen(false)}
          onQty={changeQty}
          onRemove={removeItem}
          subtotal={subtotal}
          onCheckout={() => { setDrawerOpen(false); setView("checkout"); }}
        />
      )}
    </div>
  );
}