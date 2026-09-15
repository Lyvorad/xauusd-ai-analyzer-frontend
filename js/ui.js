const el = (id) => document.getElementById(id);

let ultimoReporteData = null; // Guardamos el reporte para poder recalcular si cambia el input de riesgo

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
    ultimoReporteData = reporte;
    
    // Topbar header
    el("precioActualHeader").textContent = this.formatoUSD(reporte.precio);
    el("timestampReporte").textContent = `Actualizado: ${this.formatoFecha(reporte.creado_en)} | Fuentes: ${reporte.fuentes_precio || "—"}`;

    // Signal badge
    const badge = el("badgeDireccion");
    badge.textContent = reporte.direccion;
    badge.className = "badge " + reporte.direccion;

    // Confidence
    el("valConfianza").textContent = reporte.confianza + "%";
    el("barraConfianza").style.width = reporte.confianza + "%";
    
    // Cambiar color de la barra dependiendo de la dirección
    const barra = el("barraConfianza");
    if (reporte.direccion === "compra") barra.style.backgroundColor = "var(--green)";
    else if (reporte.direccion === "venta") barra.style.backgroundColor = "var(--red)";
    else barra.style.backgroundColor = "var(--text-muted)";

    // Text Summary
    el("txtResumen").textContent = reporte.resumen;
    el("txtRiesgos").textContent = reporte.riesgos;
    
    // Technical Indicators
    const indicadoresHTML = `
      <span class="indicador-tag">RSI: ${reporte.rsi ? reporte.rsi.toFixed(2) : '—'}</span>
      <span class="indicador-tag">EMA 20: ${reporte.ema_20 ? reporte.ema_20.toFixed(2) : '—'}</span>
      <span class="indicador-tag">EMA 50: ${reporte.ema_50 ? reporte.ema_50.toFixed(2) : '—'}</span>
      <span class="indicador-tag">Tendencia: ${reporte.tendencia_tecnica || '—'}</span>
    `;
    el("indicadoresTecnicos").innerHTML = indicadoresHTML;
    
    this.actualizarCalculadora();
  },

  actualizarCalculadora() {
    if (!ultimoReporteData) return;
    const r = ultimoReporteData;
    
    el("calcEntrada").textContent = this.formatoUSD(r.precio);
    el("calcTP").textContent = r.direccion === "venta" ? this.formatoUSD(r.soporte) : this.formatoUSD(r.resistencia);
    el("calcSL").textContent = r.direccion === "venta" ? this.formatoUSD(r.resistencia) : this.formatoUSD(r.soporte);
    
    const riesgoInput = parseFloat(el("inputRiesgo").value) || 100;
    
    if (r.direccion === "neutral") {
      el("gananciaEstimada").textContent = "—";
      el("ratioRR").textContent = "—";
      el("gananciaEstimada").style.color = "var(--text-muted)";
      return;
    }
    
    let tpDist = 0;
    let slDist = 0;
    
    if (r.direccion === "compra") {
      tpDist = r.resistencia - r.precio;
      slDist = r.precio - r.soporte;
    } else { // Venta
      tpDist = r.precio - r.soporte;
      slDist = r.resistencia - r.precio;
    }
    
    if (slDist <= 0 || tpDist <= 0) {
      el("gananciaEstimada").textContent = "Error R/R";
      el("ratioRR").textContent = "Inválido";
      return;
    }
    
    const ratio = tpDist / slDist;
    const ganancia = riesgoInput * ratio;
    
    el("gananciaEstimada").textContent = "+$" + ganancia.toFixed(2);
    el("ratioRR").textContent = "1 : " + ratio.toFixed(2);
    el("gananciaEstimada").style.color = "var(--green)";
  },

  pintarHistorial(data) {
    const cont = el("listaHistorial");
    if (data.length === 0) {
      cont.innerHTML = '<tr><td colspan="7" class="vacio text-center">Sin reportes todavía</td></tr>';
      return;
    }

    cont.innerHTML = data.map(r => `
      <tr>
        <td>${this.formatoFecha(r.creado_en)}</td>
        <td class="font-mono">${r.origen}</td>
        <td><span class="badge ${r.direccion}" style="font-size:10px; padding: 4px 6px;">${r.direccion}</span></td>
        <td class="font-mono">${r.confianza}%</td>
        <td class="font-mono">${this.formatoUSD(r.precio)}</td>
        <td class="font-mono" style="color:var(--green)">${r.direccion === 'venta' ? this.formatoUSD(r.soporte) : this.formatoUSD(r.resistencia)}</td>
        <td class="font-mono" style="color:var(--red)">${r.direccion === 'venta' ? this.formatoUSD(r.resistencia) : this.formatoUSD(r.soporte)}</td>
      </tr>
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
    
    // Cambiar color
    const num = el("precisionNumero");
    if (data.porcentaje_precision >= 60) num.style.color = "var(--green)";
    else if (data.porcentaje_precision <= 40) num.style.color = "var(--red)";
    else num.style.color = "var(--gold)";
  },
  
  setConexionEstado(ok) {
    const estado = el("estadoConexion");
    if (ok) {
      estado.innerHTML = '<span class="punto ok"></span>ONLINE';
    } else {
      estado.innerHTML = '<span class="punto mal"></span>OFFLINE';
    }
  },
  
  setMensaje(msg, esError = false) {
    const div = el("mensajeAccion");
    div.className = esError ? "mensaje error" : "mensaje";
    div.textContent = msg;
  },
  
  setBotonAnalizar(disabled) {
    const btn = el("btnAnalizar");
    btn.disabled = disabled;
    if (disabled) {
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Analizando...`;
    } else {
      btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg> Analizar Ahora`;
    }
  }
};
