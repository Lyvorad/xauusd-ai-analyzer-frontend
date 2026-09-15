const el = (id) => document.getElementById(id);

const ui = {
  formatoUSD(numero) {
    if (numero === null || numero === undefined) return "—";
    return "$" + Number(numero).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  formatoFecha(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  },

  pintarReporte(reporte) {
    if (!reporte) return;
    el("precioActual").textContent = this.formatoUSD(reporte.precio);
    el("precioMeta").textContent =
      `Fuentes: ${reporte.fuentes_precio || "—"} · ${this.formatoFecha(reporte.creado_en)} · origen: ${reporte.origen}`;

    const badge = el("badgeDireccion");
    badge.textContent = reporte.direccion;
    badge.className = "badge " + reporte.direccion;

    el("valConfianza").textContent = reporte.confianza + "%";
    el("barraConfianza").style.width = reporte.confianza + "%";
    el("valSoporte").textContent = this.formatoUSD(reporte.soporte);
    el("valResistencia").textContent = this.formatoUSD(reporte.resistencia);
    el("txtResumen").textContent = reporte.resumen;
    el("txtRiesgos").textContent = reporte.riesgos;
    
    // Si la API enviara los indicadores técnicos en el reporte, podríamos rellenarlos.
    // Como el modelo envía rsi, ema_20, ema_50, los mostramos:
    const indicadoresHTML = `
      <span class="indicador-tag">RSI: ${reporte.rsi || '—'}</span>
      <span class="indicador-tag">EMA 20: ${reporte.ema_20 || '—'}</span>
      <span class="indicador-tag">EMA 50: ${reporte.ema_50 || '—'}</span>
      <span class="indicador-tag">Tendencia: ${reporte.tendencia_tecnica || '—'}</span>
    `;
    el("indicadoresTecnicos").innerHTML = indicadoresHTML;
  },

  pintarHistorial(data) {
    const cont = el("listaHistorial");
    if (data.length === 0) {
      cont.className = "vacio";
      cont.textContent = "Sin reportes todavía";
      return;
    }

    cont.className = "";
    cont.innerHTML = data.map(r => `
      <div class="fila-historial">
        <span class="izq">${this.formatoFecha(r.creado_en)} · ${r.origen}</span>
        <span class="badge ${r.direccion}" style="font-size:11px;">${r.direccion} · ${r.confianza}%</span>
      </div>
    `).join("");
  },

  pintarPrecision(data) {
    if (data.total_evaluados === 0) {
      el("precisionNumero").textContent = "—";
      el("precisionDetalle").textContent = "Todavía sin reportes evaluados (esperan 1h desde su creación)";
      return;
    }

    el("precisionNumero").textContent = data.porcentaje_precision + "%";
    el("precisionDetalle").textContent = `${data.aciertos} de ${data.total_evaluados} proyecciones acertadas`;
  },
  
  setConexionEstado(ok) {
    const estado = el("estadoConexion");
    if (ok) {
      estado.innerHTML = '<span class="punto ok"></span>backend conectado';
    } else {
      estado.innerHTML = '<span class="punto mal"></span>no se pudo conectar';
    }
  },
  
  setMensaje(msg, esError = false) {
    const div = el("mensajeAccion");
    div.className = esError ? "mensaje error" : "mensaje";
    div.textContent = msg;
  },
  
  setBotonAnalizar(disabled) {
    el("btnAnalizar").disabled = disabled;
  }
};
