const API_BASE = "https://xauusd-ai-analyzer-h7of.onrender.com";

const api = {
  async getSalud() {
    const r = await fetch(`${API_BASE}/salud`);
    if (!r.ok) throw new Error("Error en conexión");
    return r.json();
  },

  async getUltimoReporte() {
    const r = await fetch(`${API_BASE}/reporte/ultimo`);
    if (r.status === 404) return null;
    if (!r.ok) throw new Error("No se pudo cargar el último reporte");
    return r.json();
  },

  async getHistorial() {
    const r = await fetch(`${API_BASE}/reporte/historial?limite=8`);
    if (!r.ok) throw new Error("No se pudo cargar el historial");
    return r.json();
  },

  async getPrecision() {
    const r = await fetch(`${API_BASE}/reporte/precision?ventana=24h`);
    if (!r.ok) throw new Error("No se pudo cargar la precisión");
    return r.json();
  },

  async postAnalisisAhora() {
    const r = await fetch(`${API_BASE}/reporte/ahora`, { method: "POST" });
    
    if (r.status === 429) {
      const data = await r.json();
      throw new Error(data.detail || "Demasiadas peticiones");
    }
    
    if (r.status >= 500) {
      throw new Error("El servidor no pudo procesar el análisis. Verifica las API keys en Render.");
    }
    
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      throw new Error(data.detail || "Error al generar el análisis");
    }
    
    return r.json();
  }
};
