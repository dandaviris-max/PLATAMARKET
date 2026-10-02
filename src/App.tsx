import { useState, useEffect, useRef } from "react";

type View = "home" | "catalogo" | "negociacion" | "pagos" | "seguimiento";
type UserRole = "comprador" | "productor";
type AuthScreen = "choose" | "login" | "register";
type PayMethod = "PSE" | "Nequi" | "Bancolombia" | null;

interface Notif {
  id: string; title: string; body: string; time: string; read: boolean;
  type: "oferta" | "compra" | "pago" | "mensaje";
}

const C = {
  bg: "#f5fbf5", bgCard: "#ffffff", bgSide: "#ffffff",
  green: "#2d8a4e", greenLight: "#e8f5ec", greenMid: "#a8d5b5",
  yellow: "#f5d642", yellowLight: "#fffbe6", yellowDark: "#c9ab1a",
  text: "#1a3a1a", textMid: "#4a7c59", textLight: "#7aad8a",
  border: "#d0eada", red: "#e8614d", blue: "#2563eb",
};

const OFERTAS = [
  { id: "o1", productor: "Finca El Paraíso", region: "Turbo, Urabá", variedad: "Plátano Hartón", calidad: "Premium A", cantidad: 120, precioCanastilla: 42000, precioTon: 840000, fechaDisp: "18 Sep 2025", img: "	https://mimercadosaludable.com/1303-large_default/platano-verde-x-unidad-de-pequenas-fincas.jpg", cert: true },
  { id: "o2", productor: "Agrícola Nariño Urabá", region: "Necoclí, Urabá", variedad: "Plátano Dominico", calidad: "Estándar B", cantidad: 80, precioCanastilla: 35000, precioTon: 700000, fechaDisp: "20 Sep 2025", img: "	https://img.magnific.com/foto-gratis/platano-verde_74190-4937.jpg?semt=ais_hybrid&w=740&q=80", cert: false },
  { id: "o3", productor: "Hacienda Los Cedros", region: "San Juan de Urabá", variedad: "Plátano Cavendish", calidad: "Premium A", cantidad: 200, precioCanastilla: 38000, precioTon: 760000, fechaDisp: "22 Sep 2025", img: " https://services.meteored.com/img/article/cuando-es-mejor-comerse-un-platano-propiedades-segun-su-punto-de-maduracion-1728370767300_512.jpeg", cert: true },
  { id: "o4", productor: "Platanera del Darién", region: "Arboletes, Urabá", variedad: "Plátano Hartón Verde", calidad: "Estándar B", cantidad: 60, precioCanastilla: 40000, precioTon: 800000, fechaDisp: "25 Sep 2025", img: "https://upload.wikimedia.org/wikipedia/commons/3/3f/PlatanosVerdesBarranquilla.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original", cert: false },
];

const NOTIFS_COMPRADOR: Notif[] = [
  { id: "nc1", title: "Nueva oferta disponible", body: "Finca El Paraíso publicó 120 canastillas de Hartón Premium a $42.000/u.", time: "Hace 5 min", read: false, type: "oferta" },
  { id: "nc2", title: "Propuesta aceptada", body: "El productor Hacienda Los Cedros aceptó tu propuesta de $36.000/canastilla.", time: "Hace 22 min", read: false, type: "mensaje" },
  { id: "nc3", title: "Pago en custodia confirmado", body: "Tu pago de $3.200.000 COP está retenido de forma segura 🔒.", time: "Hace 1h", read: true, type: "pago" },
  { id: "nc4", title: "Pedido en camino", body: "Agrícola Nariño marcó tu pedido como despachado. Entrega estimada: 18 Sep.", time: "Hace 2h", read: true, type: "compra" },
    { id: "nc5", title: "Pedido preparado", body: "Tu pedido fue preparado por el productor y esta listo para despacho.", time: "Hace 1h", read: false, type: "compra" },
    { id: "nc6", title: "Pedido en transito", body: "Tu pedido salio del punto de origen y se encuentra en transito.", time: "Hace 45 min", read: false, type: "compra" },
    { id: "nc7", title: "Pedido proximo a entrega", body: "Tu pedido se encuentra proximo a llegar al punto de entrega.", time: "Hace 20 min", read: false, type: "compra" },
    { id: "nc8", title: "Pedido entregado", body: "El pedido fue registrado como entregado. Confirma la recepcion para continuar.", time: "Ahora", read: false, type: "compra" },
];
const NOTIFS_PRODUCTOR: Notif[] = [
  { id: "np1", title: "Nueva propuesta recibida", body: "Un comprador propone $38.000/canastilla por 80 unidades de Hartón Verde.", time: "Hace 8 min", read: false, type: "mensaje" },
  { id: "np2", title: "Oferta publicada", body: "Tu oferta de 200 canastillas de Cavendish ya está visible en el catálogo.", time: "Hace 30 min", read: false, type: "oferta" },
  { id: "np3", title: "Pago liberado ✓", body: "El comprador confirmó la entrega. $3.200.000 COP han sido transferidos.", time: "Hace 3h", read: true, type: "pago" },
  { id: "np4", title: "Pedido confirmado", body: "Nuevo pedido de 80 canastillas. Confirma disponibilidad antes de 18 Sep.", time: "Ayer", read: true, type: "compra" },
    { id: "np5", title: "Pedido preparado", body: "El pedido fue marcado como preparado y esta listo para despacho.", time: "Hace 1h", read: false, type: "compra" },
    { id: "np6", title: "Pedido despachado", body: "El pedido fue despachado y ahora se encuentra en transito.", time: "Hace 45 min", read: false, type: "compra" },
    { id: "np7", title: "Pedido proximo a entrega", body: "El pedido se encuentra proximo al punto de entrega.", time: "Hace 20 min", read: false, type: "compra" },
    { id: "np8", title: "Entrega registrada", body: "La entrega fue registrada. Esperando confirmacion del comprador.", time: "Ahora", read: false, type: "compra" },
];
const notifIcon: Record<string, string> = { oferta: "📦", compra: "🛒", pago: "💰", mensaje: "💬" };

// ─── Tracking steps data ──────────────────────────────────────────────────────
const TRACKING_STEPS = [
  { id: 0, label: "Pedido confirmado", desc: "Tu pedido #PM-2409 fue registrado exitosamente en el sistema.", icon: "✅", lugar: "PlataMarket Urabá", fecha: "14 Sep 2025 · 10:32 am" },
  { id: 1, label: "Pago recibido en custodia", desc: "El pago de $3.200.000 COP fue recibido y retenido de forma segura 🔒.", icon: "🔒", lugar: "Plataforma PlataMarket", fecha: "14 Sep 2025 · 10:35 am" },
  { id: 2, label: "Productor preparando lote", desc: "Finca El Paraíso está seleccionando y empacando las 80 canastillas de Plátano Hartón.", icon: "🌱", lugar: "Finca El Paraíso · Turbo, Urabá", fecha: "15 Sep 2025 · 07:00 am" },
  { id: 3, label: "Lote despachado", desc: "El camión cargó las 80 canastillas. El lote salió de la finca con guía de transporte #GT-4821.", icon: "🚚", lugar: "Turbo → Medellín (Autopista al Mar)", fecha: "16 Sep 2025 · 05:30 am" },
  { id: 4, label: "En tránsito — Checkpoint 1", desc: "El vehículo pasó el puesto de control en Puerto Valdivia. Todo en orden.", icon: "📍", lugar: "Puerto Valdivia, Antioquia", fecha: "16 Sep 2025 · 09:15 am" },
  { id: 5, label: "En tránsito — Checkpoint 2", desc: "El lote llegó al centro de distribución de Medellín para clasificación final.", icon: "🏭", lugar: "Centro Logístico Medellín Norte", fecha: "17 Sep 2025 · 06:45 am" },
  { id: 6, label: "Salida para entrega final", desc: "El repartidor local tiene el lote. Entrega estimada hoy antes de las 2:00 pm.", icon: "🛵", lugar: "Medellín (zona de entrega)", fecha: "18 Sep 2025 · 08:00 am" },
  { id: 7, label: "Pedido entregado", desc: "El pedido llegó a tu dirección. Por favor confirma la recepción para liberar el pago al productor.", icon: "📦", lugar: "Tu dirección · Medellín", fecha: "18 Sep 2025 · 01:22 pm" },
];

// ─── Payment modal ────────────────────────────────────────────────────────────
function PayModal({ method, total, onSuccess, onClose }: { method: PayMethod; total: number; onSuccess: () => void; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const [formData, setFormData] = useState({ banco: "Bancolombia", cuenta: "", tipo: "Ahorros", doc: "", telefono: "", pin: "" });
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function handlePay() {
    setStep("processing");
    setProgress(0);
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(intervalRef.current!);
        setTimeout(() => { setStep("done"); }, 400);
      }
      setProgress(Math.min(p, 100));
    }, 200);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  if (!method) return null;

  const BANCOS = ["Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA", "Nequi", "Daviplata"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-sm mx-4 rounded-2xl shadow-2xl overflow-hidden" style={{ background: C.bgCard }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{method === "PSE" ? "🏦" : method === "Nequi" ? "📱" : "🏛️"}</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: C.text }}>{method}</p>
              <p className="text-[10px] font-mono" style={{ color: C.textLight }}>Pago seguro · PCI DSS</p>
            </div>
          </div>
          {step === "form" && <button onClick={onClose} className="text-xl leading-none" style={{ color: C.textLight }}>×</button>}
        </div>

        {step === "form" && (
          <div className="p-5 space-y-3">
            <div className="rounded-xl p-3 text-center mb-1" style={{ background: C.greenLight }}>
              <p className="text-xs" style={{ color: C.textMid }}>Total a pagar</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.green }}>${Math.round(total * 1.02).toLocaleString()} COP</p>
            </div>

            {method === "PSE" && (
              <>
                <div>
                  <label className="text-[10px] font-mono mb-1 block" style={{ color: C.textMid }}>Banco</label>
                  <select value={formData.banco} onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={{ borderColor: C.border, background: C.bg, color: C.text }}>
                    {BANCOS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono mb-1 block" style={{ color: C.textMid }}>Tipo de cuenta</label>
                    <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={{ borderColor: C.border, background: C.bg, color: C.text }}>
                      <option>Ahorros</option><option>Corriente</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono mb-1 block" style={{ color: C.textMid }}>N° de documento</label>
                    <input placeholder="CC o NIT" value={formData.doc} onChange={(e) => setFormData({ ...formData, doc: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono mb-1 block" style={{ color: C.textMid }}>N° de cuenta</label>
                  <input placeholder="Número de cuenta bancaria" value={formData.cuenta} onChange={(e) => setFormData({ ...formData, cuenta: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border font-mono" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
                </div>
              </>
            )}

            {method === "Nequi" && (
              <>
                <div>
                  <label className="text-[10px] font-mono mb-1 block" style={{ color: C.textMid }}>Número de celular Nequi</label>
                  <input placeholder="3XX XXX XXXX" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border font-mono" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
                </div>
                <p className="text-xs rounded-xl p-3" style={{ background: C.yellowLight, color: C.textMid }}>
                  📲 Recibirás una notificación push en tu app Nequi para aprobar el pago.
                </p>
              </>
            )}

            {method === "Bancolombia" && (
              <>
                <div>
                  <label className="text-[10px] font-mono mb-1 block" style={{ color: C.textMid }}>N° de cuenta Bancolombia</label>
                  <input placeholder="Número de cuenta" value={formData.cuenta} onChange={(e) => setFormData({ ...formData, cuenta: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border font-mono" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
                </div>
                <div>
                  <label className="text-[10px] font-mono mb-1 block" style={{ color: C.textMid }}>PIN de transferencia</label>
                  <input type="password" placeholder="••••••" value={formData.pin} onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border font-mono" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
                </div>
              </>
            )}

            <button onClick={handlePay}
              className="w-full py-3 rounded-xl text-sm font-semibold mt-1 transition-opacity hover:opacity-90"
              style={{ background: C.yellow, color: C.text }}>
              Confirmar pago →
            </button>
            <p className="text-[10px] text-center" style={{ color: C.textLight }}>🔒 Tus datos están protegidos bajo estándar PCI DSS</p>
          </div>
        )}

        {step === "processing" && (
          <div className="p-8 text-center space-y-5">
            <div className="text-5xl animate-bounce">⏳</div>
            <p className="font-semibold" style={{ color: C.text }}>Procesando tu pago…</p>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: C.border }}>
              <div className="h-full rounded-full transition-all duration-200" style={{ width: `${progress}%`, background: C.green }} />
            </div>
            <p className="text-xs font-mono" style={{ color: C.textLight }}>{Math.round(progress)}% completado</p>
            <p className="text-xs" style={{ color: C.textMid }}>No cierres esta ventana</p>
          </div>
        )}

        {step === "done" && (
          <div className="p-8 text-center space-y-4">
            <div className="text-6xl">✅</div>
            <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.green }}>¡Pago realizado con éxito!</p>
            <p className="text-sm" style={{ color: C.textMid }}>Tu dinero está en custodia segura 🔒. Se liberará al productor cuando confirmes la entrega.</p>
            <div className="text-xs rounded-xl p-3" style={{ background: C.greenLight, color: C.textMid }}>
              <p>Referencia: <span className="font-mono" style={{ color: C.green }}>PM-{Date.now().toString().slice(-6)}</span></p>
              <p className="mt-0.5">Método: <span className="font-semibold">{method}</span></p>
            </div>
            <button onClick={() => { onSuccess(); onClose(); }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: C.yellow, color: C.text }}>
              Ver seguimiento del pedido →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Seguimiento ──────────────────────────────────────────────────────────────
function Seguimiento({ role, trackingStep, setTrackingStep, onConfirmDelivery }: {
  role: UserRole; trackingStep: number; setTrackingStep: (n: number) => void; onConfirmDelivery: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [toast, setToast] = useState("");

  const visibleSteps = TRACKING_STEPS.slice(0, trackingStep + 1);
  const isDelivered = trackingStep >= 7;
  const pct = Math.round(((trackingStep) / (TRACKING_STEPS.length - 1)) * 100);

  function advanceStep() {
    if (trackingStep < TRACKING_STEPS.length - 1) setTrackingStep(trackingStep + 1);
  }

  function confirmReceipt() {
    setConfirming(false);
    setConfirmed(true);
    setToast("¡Entrega confirmada! El pago ha sido liberado al productor ✓");
    onConfirmDelivery();
  }

  return (
    <div className="space-y-5 relative">
      {toast && (
        <div className="fixed top-5 right-5 z-50 text-sm font-semibold px-5 py-3 rounded-xl shadow-lg" style={{ background: C.yellow, color: C.text }}>{toast}</div>
      )}

      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-mono mb-1" style={{ color: C.textLight }}>Pedido #PM-2409</p>
          <h1 className="text-4xl" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: C.text }}>Seguimiento</h1>
        </div>
        <div className="rounded-xl px-4 py-2 border text-sm font-semibold" style={{ borderColor: isDelivered ? C.green : C.yellowDark, color: isDelivered ? C.green : C.yellowDark, background: isDelivered ? C.greenLight : C.yellowLight }}>
          {isDelivered ? "📦 Entregado" : "🚚 En tránsito"}
        </div>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border p-4 grid grid-cols-2 md:grid-cols-4 gap-4" style={{ background: C.bgCard, borderColor: C.border }}>
        {[["Producto", "Plátano Hartón Premium"], ["Cantidad", "80 canastillas"], ["Productor", "Finca El Paraíso"], ["Destino", "Medellín"]].map(([k, v]) => (
          <div key={k}>
            <p className="text-[10px] font-mono" style={{ color: C.textLight }}>{k}</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: C.text }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl border p-5" style={{ background: C.bgCard, borderColor: C.border }}>
        <div className="flex justify-between text-xs mb-2">
          <span style={{ color: C.textMid }}>Progreso del envío</span>
          <span className="font-mono font-bold" style={{ color: C.green }}>{pct}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: C.border }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(to right, ${C.green}, ${C.yellow})` }} />
        </div>
        <div className="flex justify-between text-[10px] font-mono mt-2" style={{ color: C.textLight }}>
          <span>🌱 Finca El Paraíso</span>
          <span>🏠 Tu dirección</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border p-5" style={{ background: C.bgCard, borderColor: C.border }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-5" style={{ color: C.textLight }}>Historial del recorrido</p>
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background: C.border }} />
          <div className="space-y-6">
            {TRACKING_STEPS.map((step, i) => {
              const done = i <= trackingStep;
              const active = i === trackingStep;
              return (
                <div key={step.id} className="flex gap-4 relative">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-all"
                    style={{
                      background: done ? (active ? C.yellow : C.green) : C.bgCard,
                      borderColor: done ? (active ? C.yellowDark : C.green) : C.border,
                      opacity: done ? 1 : 0.4,
                    }}>
                    {done ? <span className="text-sm">{active ? step.icon : "✓"}</span> : <span className="text-xs" style={{ color: C.textLight }}>{i + 1}</span>}
                  </div>
                  <div className={`flex-1 pb-1 ${!done ? "opacity-35" : ""}`}>
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold leading-snug" style={{ color: active ? C.green : done ? C.text : C.textLight }}>{step.label}</p>
                      {done && <p className="text-[10px] font-mono flex-shrink-0" style={{ color: C.textLight }}>{step.fecha}</p>}
                    </div>
                    {done && (
                      <>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: C.textMid }}>{step.desc}</p>
                        <p className="text-[10px] font-mono mt-1" style={{ color: C.textLight }}>📍 {step.lugar}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      {!confirmed && (
        <div className="rounded-2xl border p-5" style={{ background: C.bgCard, borderColor: C.border }}>
          {role === "productor" && !isDelivered && (
            <div className="space-y-3">
              <p className="text-sm font-semibold" style={{ color: C.text }}>Avanzar estado del pedido</p>
              <p className="text-xs" style={{ color: C.textMid }}>Actualiza el estado para que el comprador esté informado en tiempo real.</p>
              <button onClick={advanceStep}
                disabled={trackingStep >= TRACKING_STEPS.length - 1}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
                style={{ background: C.green, color: "#fff" }}>
                Marcar siguiente etapa →
              </button>
            </div>
          )}

          {role === "comprador" && isDelivered && (
            <div className="space-y-3">
              <p className="text-sm font-semibold" style={{ color: C.text }}>¿Recibiste tu pedido?</p>
              <p className="text-xs" style={{ color: C.textMid }}>Al confirmar la entrega, liberamos el pago al productor y tu compra queda completada.</p>
              <button onClick={() => setConfirming(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: C.yellow, color: C.text }}>
                Confirmar que recibí mi pedido ✓
              </button>
            </div>
          )}

          {role === "comprador" && !isDelivered && (
            <p className="text-xs" style={{ color: C.textMid }}>
              Cuando el pedido sea entregado, aparecerá aquí el botón para confirmar la recepción y liberar el pago.
            </p>
          )}
        </div>
      )}

      {confirmed && (
        <div className="rounded-2xl border p-6 text-center space-y-3" style={{ background: C.greenLight, borderColor: C.greenMid }}>
          <div className="text-5xl">🎉</div>
          <p className="font-bold text-lg" style={{ fontFamily: "var(--font-display)", color: C.green }}>¡Entrega confirmada!</p>
          <p className="text-sm" style={{ color: C.textMid }}>El pago fue liberado al productor. ¡Gracias por comprar en PlataMarket!</p>
        </div>
      )}

      {/* Confirm modal */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setConfirming(false)}>
          <div className="w-full max-w-sm mx-4 rounded-2xl p-6 shadow-xl" style={{ background: C.bgCard, border: `1px solid ${C.border}` }} onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-semibold mb-2" style={{ color: C.text }}>Confirmar recepción</p>
            <p className="text-sm mb-4" style={{ color: C.textMid }}>¿Confirmas que recibiste las <strong>80 canastillas de Plátano Hartón Premium</strong> en buen estado?</p>
            <div className="space-y-2 mb-5">
              {["Cantidad correcta: 80 canastillas", "Calidad: Premium A", "Producto en buen estado"].map((c) => (
                <div key={c} className="flex items-center gap-2 text-xs" style={{ color: C.green }}>
                  <span className="text-base">✓</span>{c}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={confirmReceipt} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: C.yellow, color: C.text }}>Sí, confirmar</button>
              <button onClick={() => setConfirming(false)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: C.border, color: C.textMid }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Notification panel ───────────────────────────────────────────────────────
function NotifPanel({ role, onClose }: { role: UserRole; onClose: () => void }) {
  const [notifs, setNotifs] = useState(role === "comprador" ? NOTIFS_COMPRADOR : NOTIFS_PRODUCTOR);
  const unread = notifs.filter((n) => !n.read).length;
  function markAll() { setNotifs((n) => n.map((x) => ({ ...x, read: true }))); }
  function markOne(id: string) { setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x)); }
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-sm h-full shadow-2xl flex flex-col" style={{ background: C.bgCard, borderLeft: `1px solid ${C.border}` }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: C.text }}>Notificaciones</p>
            <p className="text-xs" style={{ color: C.textMid }}>{unread} sin leer</p>
          </div>
          <div className="flex gap-3 items-center">
            {unread > 0 && <button onClick={markAll} className="text-xs font-medium" style={{ color: C.green }}>Marcar todas</button>}
            <button onClick={onClose} className="text-lg leading-none" style={{ color: C.textLight }}>×</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: C.border }}>
          {notifs.map((n) => (
            <div key={n.id} onClick={() => markOne(n.id)}
              className="px-5 py-4 cursor-pointer hover:opacity-80 transition-opacity flex gap-3"
              style={{ background: n.read ? C.bgCard : C.greenLight }}>
              <span className="text-xl flex-shrink-0 mt-0.5">{notifIcon[n.type]}</span>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-medium leading-snug" style={{ color: C.text }}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: C.green }} />}
                </div>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: C.textMid }}>{n.body}</p>
                <p className="text-[10px] font-mono mt-1" style={{ color: C.textLight }}>{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function AuthFlow({ onLogin }: { onLogin: (r: UserRole) => void }) {
  const [screen, setScreen] = useState<AuthScreen>("choose");
  const [role, setRole] = useState<UserRole>("comprador");
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  function goAuth(r: UserRole, s: "login" | "register") { setRole(r); setScreen(s); setError(""); }

  function handleSubmit() {
    if (!form.email || !form.password) { setError("Completa todos los campos."); return; }
    if (screen === "register" && form.password !== form.confirm) { setError("Las contraseñas no coinciden."); return; }
    onLogin(role);
  }

  if (screen === "choose") return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.greenLight} 0%, ${C.yellowLight} 100%)` }}>
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <span className="text-5xl">🍌</span>
          <h1 className="text-4xl mt-3" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: C.text }}>PlataMarket</h1>
          <p className="text-sm mt-1" style={{ color: C.textMid }}>Marketplace directo · Red de Plataneros de Urabá</p>
        </div>
        <p className="text-center text-sm font-semibold mb-5" style={{ color: C.text }}>¿Cómo deseas ingresar?</p>
        <div className="grid grid-cols-2 gap-4">
          {(["comprador", "productor"] as UserRole[]).map((r) => (
            <div key={r} className="rounded-2xl border-2 p-5 text-center" style={{ borderColor: C.border, background: C.bgCard }}>
              <div className="text-4xl mb-3">{r === "comprador" ? "🛒" : "🌱"}</div>
              <p className="font-semibold mb-4" style={{ color: C.text }}>{r === "comprador" ? "Comprador" : "Productor"}</p>
              <div className="space-y-2">
                <button onClick={() => goAuth(r, "login")} className="w-full py-2 rounded-xl text-sm font-semibold" style={{ background: C.yellow, color: C.text }}>Iniciar sesión</button>
                <button onClick={() => goAuth(r, "register")} className="w-full py-2 rounded-xl text-sm border" style={{ borderColor: C.green, color: C.green }}>Registrarme</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.greenLight} 0%, ${C.yellowLight} 100%)` }}>
      <div className="w-full max-w-sm px-6">
        <button onClick={() => setScreen("choose")} className="text-xs mb-6 flex items-center gap-1" style={{ color: C.textMid }}>← Volver</button>
        <div className="text-center mb-8">
          <span className="text-4xl">{role === "comprador" ? "🛒" : "🌱"}</span>
          <h2 className="text-2xl mt-2 font-semibold" style={{ fontFamily: "var(--font-display)", color: C.text }}>
            {screen === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h2>
          <p className="text-xs mt-1" style={{ color: C.textMid }}>como {role === "comprador" ? "Comprador" : "Productor"}</p>
        </div>
        <div className="rounded-2xl p-6 shadow-sm space-y-4" style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
          {screen === "register" && (
            <div>
              <label className="text-xs font-mono mb-1 block" style={{ color: C.textMid }}>Nombre completo</label>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
            </div>
          )}
          <div>
            <label className="text-xs font-mono mb-1 block" style={{ color: C.textMid }}>Correo electrónico</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
          </div>
          <div>
            <label className="text-xs font-mono mb-1 block" style={{ color: C.textMid }}>Contraseña</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
          </div>
          {screen === "register" && (
            <div>
              <label className="text-xs font-mono mb-1 block" style={{ color: C.textMid }}>Confirmar contraseña</label>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
            </div>
          )}
          {error && <p className="text-xs" style={{ color: C.red }}>{error}</p>}
          <button onClick={handleSubmit} className="w-full py-3 rounded-xl text-sm font-semibold mt-1 hover:opacity-90"
            style={{ background: C.yellow, color: C.text }}>
            {screen === "login" ? "Entrar →" : "Crear cuenta →"}
          </button>
          <p className="text-xs text-center" style={{ color: C.textMid }}>
            {screen === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button onClick={() => setScreen(screen === "login" ? "register" : "login")} className="font-semibold underline" style={{ color: C.green }}>
              {screen === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ role, setView }: { role: UserRole; setView: (v: View) => void }) {
  const stats = role === "comprador"
    ? [{ label: "Ofertas disponibles", val: "134", sub: "4 variedades" }, { label: "Mis pedidos activos", val: "3", sub: "1 en tránsito" }, { label: "En custodia", val: "$3.2M", sub: "COP seguros 🔒" }, { label: "Total comprado", val: "$18.4M", sub: "COP este mes" }]
    : [{ label: "Mis ofertas activas", val: "4", sub: "2 variedades" }, { label: "Pedidos recibidos", val: "12", sub: "3 pendientes" }, { label: "Ingresos del mes", val: "$24.8M", sub: "COP" }, { label: "Compradores contactados", val: "9", sub: "esta semana" }];

  const acciones = role === "comprador"
    ? [{ label: "Ver catálogo de ofertas", sub: "Explora y compra", v: "catalogo" as View }, { label: "Negociar precio", sub: "Propón tu oferta", v: "negociacion" as View }, { label: "Seguimiento de pedido", sub: "Rastrea tu compra", v: "seguimiento" as View }]
    : [{ label: "Publicar oferta", sub: "Sube tu producción", v: "catalogo" as View }, { label: "Gestionar negociaciones", sub: "Acepta o rechaza", v: "negociacion" as View }, { label: "Seguimiento de pedido", sub: "Avanza el estado", v: "seguimiento" as View }];

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-mono mb-1" style={{ color: C.textLight }}>Bienvenido/a de vuelta</p>
        <h1 className="text-4xl" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: C.text }}>
          {role === "comprador" ? "Panel del Comprador" : "Panel del Productor"}
        </h1>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-5 border" style={{ background: C.bgCard, borderColor: C.border }}>
            <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: C.textMid }}>{s.label}</p>
            <p className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: C.text }}>{s.val}</p>
            <p className="text-xs" style={{ color: C.textLight }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {acciones.map((a) => (
          <button key={a.label} onClick={() => setView(a.v)}
            className="text-left rounded-2xl p-5 border transition-all hover:shadow-md group"
            style={{ background: C.bgCard, borderColor: C.border }}>
            <p className="font-semibold text-sm group-hover:underline" style={{ color: C.green }}>{a.label}</p>
            <p className="text-xs mt-1" style={{ color: C.textMid }}>{a.sub}</p>
          </button>
        ))}
      </div>
      <div className="rounded-2xl p-5 border" style={{ background: C.yellowLight, borderColor: "#f5d64240" }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: C.yellowDark }}>PlataMarket garantiza</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[["🤝", "Negociación directa"], ["🔒", "Pago en custodia"], ["📍", "Seguimiento en tiempo real"], ["📦", "Trazabilidad del lote"], ["💳", "Pago seguro PCI DSS"], ["🔔", "Notificaciones al instante"]].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-2 text-xs" style={{ color: C.text }}><span>{icon}</span><span>{label}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Catálogo ─────────────────────────────────────────────────────────────────
function Catalogo({ role, setView }: { role: UserRole; setView: (v: View) => void }) {
  const [filtroV, setFiltroV] = useState("Todas");
  const [filtroC, setFiltroC] = useState("Todas");
  const [toast, setToast] = useState("");
  const [showPublicar, setShowPublicar] = useState(false);
  const [newOferta, setNewOferta] = useState({ variedad: "", cantidad: "", precio: "", fecha: "" });

  const variedades = ["Todas", "Plátano Hartón", "Plátano Dominico", "Banano Cavendish", "Plátano Hartón Verde"];
  const calidades = ["Todas", "Premium A", "Estándar B"];
  const filtered = OFERTAS.filter((o) => (filtroV === "Todas" || o.variedad === filtroV) && (filtroC === "Todas" || o.calidad === filtroC));

  function showToast(msg: string, cb?: () => void) { setToast(msg); setTimeout(() => { setToast(""); cb?.(); }, 1800); }
  function publicar() {
    if (!newOferta.variedad || !newOferta.cantidad || !newOferta.precio) return;
    setShowPublicar(false);
    showToast("¡Oferta publicada! Ya es visible para los compradores.");
    setNewOferta({ variedad: "", cantidad: "", precio: "", fecha: "" });
  }

  return (
    <div className="space-y-5 relative">
      {toast && <div className="fixed top-5 right-5 z-50 text-sm font-semibold px-5 py-3 rounded-xl shadow-lg" style={{ background: C.yellow, color: C.text }}>{toast}</div>}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-mono mb-1" style={{ color: C.textLight }}>{role === "comprador" ? "Explorar y comprar" : "Tus ofertas publicadas"}</p>
          <h1 className="text-4xl" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: C.text }}>Catálogo</h1>
        </div>
        {role === "productor" && (
          <button onClick={() => setShowPublicar(true)} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: C.green, color: "#fff" }}>+ Publicar oferta</button>
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-mono mb-1" style={{ color: C.textMid }}>Variedad</p>
          <div className="flex gap-1.5 flex-wrap">
            {variedades.map((v) => (
              <button key={v} onClick={() => setFiltroV(v)} className="text-[10px] font-mono px-3 py-1 rounded-full border transition-colors"
                style={{ background: filtroV === v ? C.green : "transparent", color: filtroV === v ? "#fff" : C.textMid, borderColor: filtroV === v ? C.green : C.border }}>{v}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-mono mb-1" style={{ color: C.textMid }}>Calidad</p>
          <div className="flex gap-1.5">
            {calidades.map((c) => (
              <button key={c} onClick={() => setFiltroC(c)} className="text-[10px] font-mono px-3 py-1 rounded-full border transition-colors"
                style={{ background: filtroC === c ? C.yellow : "transparent", color: filtroC === c ? C.text : C.textMid, borderColor: filtroC === c ? C.yellowDark : C.border }}>{c}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-2xl border overflow-hidden group hover:shadow-md transition-shadow" style={{ background: C.bgCard, borderColor: C.border }}>
            <div className="relative h-40">
              <img src={o.img} alt={o.variedad} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-2 left-3 flex gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: o.calidad === "Premium A" ? C.yellow : C.greenLight, color: o.calidad === "Premium A" ? C.text : C.green, border: `1px solid ${o.calidad === "Premium A" ? C.yellowDark : C.greenMid}` }}>{o.calidad}</span>
                {o.cert && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: C.greenLight, color: C.green, border: `1px solid ${C.greenMid}` }}>Cert. orgánico ✓</span>}
              </div>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-mono mb-0.5" style={{ color: C.textLight }}>{o.region}</p>
              <h3 className="font-semibold mb-0.5" style={{ color: C.text }}>{o.variedad}</h3>
              <p className="text-xs mb-3" style={{ color: C.textMid }}>{o.productor}</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[["Cantidad", `${o.cantidad} can.`], [`$${(o.precioCanastilla / 1000).toFixed(0)}k`, "/canastilla"], [`$${(o.precioTon / 1000).toFixed(0)}k`, "/tonelada"]].map(([v, u]) => (
                  <div key={u} className="rounded-xl p-2 text-center" style={{ background: C.bg }}>
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: C.text }}>{v}</p>
                    <p className="text-[10px] font-mono" style={{ color: C.textLight }}>{u}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono" style={{ color: C.textLight }}>📅 {o.fechaDisp}</span>
                <div className="flex gap-2">
                  {role === "comprador" && (
                    <button onClick={() => setView("negociacion")} className="text-xs px-3 py-1.5 rounded-lg border transition-colors" style={{ borderColor: C.green, color: C.green }}>Negociar</button>
                  )}
                  <button onClick={() => showToast(role === "comprador" ? "¡Oferta reservada! Continuando al pago…" : "¡Oferta actualizada!", role === "comprador" ? () => setView("pagos") : undefined)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: C.yellow, color: C.text }}>
                    {role === "comprador" ? "Comprar ahora" : "Editar oferta"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPublicar && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30" onClick={() => setShowPublicar(false)}>
          <div className="w-full max-w-md mx-4 rounded-2xl p-6 shadow-xl" style={{ background: C.bgCard, border: `1px solid ${C.border}` }} onClick={(e) => e.stopPropagation()}>
            <p className="font-semibold text-base mb-4" style={{ color: C.text }}>Publicar nueva oferta</p>
            <div className="space-y-3">
              {[["Variedad", "variedad", "Ej: Plátano Hartón"], ["Cantidad (canastillas)", "cantidad", "Ej: 100"], ["Precio por canastilla ($)", "precio", "Ej: 40000"], ["Fecha disponible", "fecha", "Ej: 25 Sep 2025"]].map(([label, key, ph]) => (
                <div key={key}>
                  <label className="text-xs font-mono mb-1 block" style={{ color: C.textMid }}>{label}</label>
                  <input placeholder={ph} value={(newOferta as Record<string, string>)[key]} onChange={(e) => setNewOferta({ ...newOferta, [key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none border" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={publicar} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: C.yellow, color: C.text }}>Publicar ✓</button>
              <button onClick={() => setShowPublicar(false)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: C.border, color: C.textMid }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Negociación ──────────────────────────────────────────────────────────────
function Negociacion({ role, setView }: { role: UserRole; setView: (v: View) => void }) {
  const [messages, setMessages] = useState([
    { from: "productor", text: "Buenos días. Tenemos 120 canastillas de Hartón Premium disponibles a $42.000/u." },
    { from: "comprador", text: "Hola, ¿podría hacer un precio por 80 canastillas? Propongo $38.000/u." },
    { from: "productor", text: "Puedo ceder hasta $40.000/u por ese volumen. ¿Le parece?" },
  ]);
  const [msg, setMsg] = useState("");
  const [cantidad, setCantidad] = useState("80");
  const [toast, setToast] = useState("");

  function send() {
    if (!msg.trim()) return;
    setMessages((m) => [...m, { from: role, text: msg }]);
    setMsg("");
    setTimeout(() => setMessages((m) => [...m, { from: role === "comprador" ? "productor" : "comprador", text: "Recibido. En un momento le confirmo." }]), 800);
  }

  function aceptar() {
    setToast("🤝 ¡Propuesta enviada! El productor fue notificado.");
    setTimeout(() => { setToast(""); setView("pagos"); }, 2000);
  }

  return (
    <div className="space-y-5 relative">
      {toast && <div className="fixed top-5 right-5 z-50 text-sm font-semibold px-5 py-3 rounded-xl shadow-lg" style={{ background: C.yellow, color: C.text }}>{toast}</div>}
      <div>
        <p className="text-xs font-mono mb-1" style={{ color: C.textLight }}>Negociación directa</p>
        <h1 className="text-4xl" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: C.text }}>Negociar precio</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl border p-5 space-y-3" style={{ background: C.bgCard, borderColor: C.border }}>
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: C.textLight }}>Oferta seleccionada</p>
          <p className="font-semibold" style={{ color: C.text }}>Plátano Hartón Premium</p>
          <p className="text-xs" style={{ color: C.textMid }}>Finca El Paraíso · Turbo, Urabá</p>
          <div className="space-y-2 text-xs pt-2 border-t" style={{ borderColor: C.border }}>
            {[["Precio base", "$42.000/can."], ["Disponible", "120 can."], ["Calidad", "Premium A"], ["Fecha", "18 Sep 2025"]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span style={{ color: C.textMid }}>{k}</span><span className="font-mono" style={{ color: C.text }}>{v}</span></div>
            ))}
          </div>
          <div className="pt-3 border-t" style={{ borderColor: C.border }}>
            <p className="text-[10px] font-mono mb-1" style={{ color: C.textMid }}>Cantidad a negociar</p>
            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min={1} max={120}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none border font-mono" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
            <p className="text-[10px] mt-1" style={{ color: C.textLight }}>Total: ${(Number(cantidad) * 40000).toLocaleString()} COP</p>
          </div>
        </div>
        <div className="lg:col-span-2 rounded-2xl border flex flex-col" style={{ background: C.bgCard, borderColor: C.border, height: 440 }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: C.border }}>
            <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: C.textMid }}>Chat de negociación</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => {
              const mine = m.from === role;
              return (
                <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[75%] rounded-2xl px-4 py-2.5 text-xs" style={{ background: mine ? C.yellow : C.greenLight, color: C.text }}>
                    <p className="text-[9px] font-mono mb-0.5" style={{ color: mine ? C.yellowDark : C.textMid }}>{m.from === "productor" ? "Productor" : "Comprador"}</p>
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-4 border-t flex gap-2" style={{ borderColor: C.border }}>
            <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Escribe tu propuesta…"
              className="flex-1 px-3 py-2 rounded-xl text-xs outline-none border" style={{ borderColor: C.border, background: C.bg, color: C.text }} />
            <button onClick={send} className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ background: C.green, color: "#fff" }}>Enviar</button>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border p-5" style={{ background: C.bgCard, borderColor: C.border }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: C.textLight }}>Acciones de la propuesta</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={aceptar} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: C.yellow, color: C.text }}>Aceptar → Continuar al pago</button>
          <button className="px-5 py-2.5 rounded-xl text-sm border" style={{ borderColor: C.red, color: C.red }}>Rechazar</button>
          <button className="px-5 py-2.5 rounded-xl text-sm border" style={{ borderColor: C.border, color: C.textMid }}>Contraoferta</button>
        </div>
      </div>
    </div>
  );
}

// ─── Pagos ────────────────────────────────────────────────────────────────────
function Pagos({ setView, setTrackingStep }: { setView: (v: View) => void; setTrackingStep: (n: number) => void }) {
  const [paso, setPaso] = useState<"confirmar" | "pago" | "custodia" | "gracias">("confirmar");
  const [selectedMethod, setSelectedMethod] = useState<PayMethod>(null);
  const [showModal, setShowModal] = useState(false);
  const total = 80 * 40000;

  const pasos = [
    { id: "confirmar", label: "Confirmar" },
    { id: "pago", label: "Pagar" },
    { id: "custodia", label: "En custodia 🔒" },
    { id: "gracias", label: "¡Listo!" },
  ] as const;
  const idx = pasos.findIndex((p) => p.id === paso);

  const methods: { id: PayMethod; label: string; icon: string; desc: string }[] = [
    { id: "PSE", label: "PSE", icon: "🏦", desc: "Débito bancario directo" },
    { id: "Nequi", label: "Nequi", icon: "📱", desc: "Aprobación desde tu app" },
    { id: "Bancolombia", label: "Bancolombia", icon: "🏛️", desc: "Transferencia segura" },
  ];

  function handlePaySuccess() {
    setPaso("custodia");
    setTrackingStep(2);
  }

  return (
    <div className="space-y-6">
      {showModal && selectedMethod && (
        <PayModal method={selectedMethod} total={total}
          onSuccess={() => { handlePaySuccess(); setView("seguimiento"); }}
          onClose={() => setShowModal(false)} />
      )}

      <div>
        <p className="text-xs font-mono mb-1" style={{ color: C.textLight }}>Proceso de compra segura</p>
        <h1 className="text-4xl" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: C.text }}>Pago & Custodia</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center overflow-x-auto pb-1 gap-0">
        {pasos.map((p, i) => (
          <div key={p.id} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                style={{ background: i < idx ? C.green : i === idx ? C.yellow : "transparent", borderColor: i < idx ? C.green : i === idx ? C.yellowDark : C.border, color: i < idx ? "#fff" : i === idx ? C.text : C.textLight }}>
                {i < idx ? "✓" : i + 1}
              </div>
              <p className="text-[9px] font-mono whitespace-nowrap" style={{ color: i === idx ? C.green : i < idx ? C.textLight : C.textLight }}>{p.label}</p>
            </div>
            {i < pasos.length - 1 && <div className="w-8 h-0.5 mb-4 mx-1" style={{ background: i < idx ? C.green : C.border }} />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-6" style={{ background: C.bgCard, borderColor: C.border }}>

        {paso === "confirmar" && (
          <div className="space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: C.textLight }}>Confirma tu pedido antes de pagar</p>
            <div className="space-y-2">
              {[["Producto", "Plátano Hartón Premium"], ["Productor", "Finca El Paraíso"], ["Cantidad", "80 canastillas"], ["Precio unitario", "$40.000 COP"], ["Fecha de entrega", "18 Sep 2025"]].map(([k, v]) => (
                <div key={k} className="flex justify-between pb-2 border-b text-sm" style={{ borderColor: C.border }}>
                  <span style={{ color: C.textMid }}>{k}</span><span className="font-mono" style={{ color: C.text }}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1">
                <span className="font-semibold" style={{ color: C.text }}>Total</span>
                <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.green }}>${total.toLocaleString()} COP</span>
              </div>
            </div>
            <p className="text-xs" style={{ color: C.textLight }}>El pago será retenido en custodia hasta verificar la entrega (PCI DSS).</p>
            <button onClick={() => setPaso("pago")} className="px-6 py-2.5 rounded-xl text-sm font-semibold" style={{ background: C.yellow, color: C.text }}>Confirmar pedido →</button>
          </div>
        )}

        {paso === "pago" && (
          <div className="space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: C.textLight }}>Selecciona tu método de pago</p>
            <div className="grid grid-cols-3 gap-3">
              {methods.map((m) => (
                <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                  className="rounded-xl border-2 p-4 text-center transition-all"
                  style={{ borderColor: selectedMethod === m.id ? C.green : C.border, background: selectedMethod === m.id ? C.greenLight : C.bgCard }}>
                  <div className="text-2xl mb-1">{m.icon}</div>
                  <p className="font-semibold text-sm" style={{ color: selectedMethod === m.id ? C.green : C.text }}>{m.label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: C.textLight }}>{m.desc}</p>
                </button>
              ))}
            </div>

            <div className="rounded-xl p-4 space-y-1 text-sm" style={{ background: C.bg }}>
              <div className="flex justify-between"><span style={{ color: C.textMid }}>Subtotal</span><span className="font-mono" style={{ color: C.text }}>${total.toLocaleString()}</span></div>
              <div className="flex justify-between"><span style={{ color: C.textMid }}>Comisión plataforma (2%)</span><span className="font-mono" style={{ color: C.text }}>${Math.round(total * 0.02).toLocaleString()}</span></div>
              <div className="flex justify-between font-bold border-t pt-1 mt-1" style={{ borderColor: C.border }}>
                <span style={{ color: C.text }}>Total a pagar</span><span style={{ color: C.green }}>${Math.round(total * 1.02).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => { if (selectedMethod) setShowModal(true); }}
              disabled={!selectedMethod}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
              style={{ background: C.yellow, color: C.text }}>
              {selectedMethod ? `Pagar con ${selectedMethod} 🔒` : "Selecciona un método"}
            </button>
          </div>
        )}

        {paso === "custodia" && (
          <div className="text-center space-y-4 py-4">
            <div className="text-6xl">🔒</div>
            <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: C.textLight }}>Dinero en custodia</p>
            <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.green }}>${total.toLocaleString()} COP</p>
            <p className="text-sm max-w-sm mx-auto" style={{ color: C.textMid }}>¡Pago realizado con éxito! El dinero está protegido hasta que confirmes la recepción del producto.</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: C.border, background: C.greenLight }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.green }} />
              <span className="text-xs font-mono" style={{ color: C.green }}>Dinero en custodia 🔒</span>
            </div>
            <div className="pt-2">
              <button onClick={() => setView("seguimiento")} className="px-6 py-2.5 rounded-xl text-sm font-semibold" style={{ background: C.green, color: "#fff" }}>
                Ver seguimiento del pedido →
              </button>
            </div>
          </div>
        )}

        {paso === "gracias" && (
          <div className="text-center space-y-5 py-6">
            <div className="text-7xl">🎉</div>
            <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: C.green }}>¡Gracias por tu compra!</p>
            <p className="text-sm" style={{ color: C.textMid }}>Tu pedido de <strong style={{ color: C.text }}>80 canastillas de Plátano Hartón</strong> se completó exitosamente.</p>
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl" style={{ background: C.greenLight, border: `1px solid ${C.greenMid}` }}>
              <span className="text-lg">✅</span>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: C.green }}>Pago liberado al productor</p>
                <p className="text-xs" style={{ color: C.textMid }}>${total.toLocaleString()} COP a Finca El Paraíso</p>
              </div>
            </div>
            <div className="max-w-sm mx-auto rounded-2xl p-5 border" style={{ background: C.yellowLight, borderColor: "#f5d64240" }}>
              <p className="text-base font-semibold mb-1" style={{ color: C.text }}>¡Esperamos verte pronto! 🍌</p>
              <p className="text-sm" style={{ color: C.textMid }}>Ojalá regreses. En PlataMarket siempre encontrarás el mejor plátano de Urabá, directo del productor.</p>
            </div>
            <button onClick={() => setPaso("confirmar")} className="px-6 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: C.green, color: C.green }}>Realizar otra compra</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "home" as View, label: "Inicio", icon: "◈" },
  { id: "catalogo" as View, label: "Catálogo", icon: "⊟" },
  { id: "negociacion" as View, label: "Negociación", icon: "⇄" },
  { id: "pagos" as View, label: "Pago & Custodia", icon: "🔒" },
  { id: "seguimiento" as View, label: "Seguimiento", icon: "📍" },
];

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [view, setView] = useState<View>("home");
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [trackingStep, setTrackingStep] = useState(1);

  if (!role) return <AuthFlow onLogin={(r) => { setRole(r); setView("home"); }} />;

  const unread = (role === "comprador" ? NOTIFS_COMPRADOR : NOTIFS_PRODUCTOR).filter((n) => !n.read).length;

  const views: Record<View, JSX.Element> = {
    home: <Dashboard role={role} setView={setView} />,
    catalogo: <Catalogo role={role} setView={setView} />,
    negociacion: <Negociacion role={role} setView={setView} />,
    pagos: <Pagos setView={setView} setTrackingStep={setTrackingStep} />,
    seguimiento: <Seguimiento role={role} trackingStep={trackingStep} setTrackingStep={setTrackingStep} onConfirmDelivery={() => setTrackingStep(7)} />,
  };

  return (
    <div className="flex min-h-screen" style={{ background: C.bg }}>
      {showNotifs && <NotifPanel role={role} onClose={() => setShowNotifs(false)} />}

      <aside className="flex-shrink-0 flex flex-col border-r transition-all duration-300" style={{ width: collapsed ? 56 : 212, background: C.bgSide, borderColor: C.border }}>
        <div className="flex items-center gap-2.5 px-3.5 py-5 border-b" style={{ borderColor: C.border }}>
          <span className="text-xl flex-shrink-0">🍌</span>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: C.green }}>PlataMarket</p>
              <p className="text-[9px] font-mono" style={{ color: C.textLight }}>Red de Plataneros · Urabá</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-xl border" style={{ background: C.greenLight, borderColor: C.greenMid }}>
            <p className="text-[9px] font-mono" style={{ color: C.textMid }}>Sesión activa</p>
            <p className="text-xs font-semibold" style={{ color: C.green }}>{role === "comprador" ? "🛒 Comprador" : "🌱 Productor"}</p>
          </div>
        )}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV.map((item) => (
            <button key={item.id} onClick={() => setView(item.id)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left transition-colors"
              style={{ background: view === item.id ? C.greenLight : "transparent", color: view === item.id ? C.green : C.textMid, fontWeight: view === item.id ? 600 : 400 }}>
              <span className="text-sm w-4 text-center flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="text-xs">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="px-2 pb-4 space-y-1">
          <button onClick={() => { setRole(null); setView("home"); }} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:opacity-70" style={{ color: C.red }}>
            <span className="text-sm w-4 text-center flex-shrink-0">⇐</span>
            {!collapsed && <span className="text-xs">Cerrar sesión</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="w-full h-7 rounded-xl border flex items-center justify-center text-xs hover:opacity-70" style={{ borderColor: C.border, color: C.textLight }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b" style={{ background: "rgba(245,251,245,0.92)", backdropFilter: "blur(8px)", borderColor: C.border }}>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span style={{ color: C.textLight }}>PlataMarket</span>
            <span style={{ color: C.border }}>/</span>
            <span style={{ color: C.green }}>{NAV.find((n) => n.id === view)?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowNotifs(true)} className="relative flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border hover:border-green-400 transition-colors" style={{ borderColor: C.border, color: C.textMid, background: C.bgCard }}>
              🔔 <span className="hidden sm:inline">Notificaciones</span>
              {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: C.green, color: "#fff" }}>{unread}</span>}
            </button>
            <span className="text-[10px] font-mono px-2 py-1 rounded-full" style={{ background: C.greenLight, color: C.green }}>
              {role === "comprador" ? "🛒 Comprador" : "🌱 Productor"}
            </span>
          </div>
        </div>
        <div className="px-6 py-6">{views[view]}</div>
      </main>
    </div>
  );
}

