const app = {
  async init() {
    await this.verificarConexion();
    await this.cargarUltimoReporte();
    await this.cargarHistorial();
    await this.cargarPrecision();
  },

  async verificarConexion() {
    try {
      await api.getSalud();
      ui.setConexionEstado(true);
    } catch (e) {
      ui.setConexionEstado(false);
    }
  },

  async cargarUltimoReporte() {
    try {
      const reporte = await api.getUltimoReporte();
      if (reporte) {
        ui.pintarReporte(reporte);
      }
    } catch (e) {
      console.error(e);
    }
  },

  async cargarHistorial() {
    try {
      const data = await api.getHistorial();
      ui.pintarHistorial(data);
    } catch (e) {
      console.error(e);
    }
  },

  async cargarPrecision() {
    try {
      const data = await api.getPrecision();
      ui.pintarPrecision(data);
    } catch (e) {
      console.error(e);
    }
  },

  async pedirAnalisisAhora() {
    ui.setBotonAnalizar(true);
    ui.setMensaje("Analizando mercado... esto puede tardar unos segundos.");

    try {
      const reporte = await api.postAnalisisAhora();
      ui.pintarReporte(reporte);
      ui.setMensaje("Reporte actualizado correctamente.");
      
      // Refrescamos paneles
      this.cargarHistorial();
      this.cargarPrecision();
    } catch (e) {
      ui.setMensaje(e.message, true);
    } finally {
      ui.setBotonAnalizar(false);
    }
  }
};

// Arrancar la app cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
