/* ============================================================
   KOKO – Módulo central de datos (localStorage simulando backend)
   ============================================================ */

const KK = {

  /* ── PRODUCTOS ──────────────────────────────────────────── */
  productos: [
    { id:'p01', nombre:'Figuras de Kimetsu No Yaiba',  precio:25,  stock:15, categoria:'figuras',       img:'imagenes/pr1.jpg',          desc:'14-19cm Demon Slayer: Kimetsu No Yaiba Tanjiro, Nezuko… Anime PVC figura' },
    { id:'p02', nombre:'Figuras de Sailor Moon',        precio:200, stock:8,  categoria:'figuras',       img:'imagenes/pr2.jpg',          desc:'Eternal Sailor Moon & Eternal Sailor Chibi Moon (Guardianes marineros eternos), 17 cm.' },
    { id:'p03', nombre:'Cosplay de Inuyasha Kikyō',     precio:350, stock:5,  categoria:'ropa',          img:'imagenes/pr3.webp',         desc:'Conjunto completo de Kimono: Top + Falda plisada + cinturón + lazo + Collar. Tallas S a XL.' },
    { id:'p04', nombre:'Pocillos Personalizados',        precio:25,  stock:30, categoria:'figuras',       img:'imagenes/pr4.jpg',          desc:'Disfruta tu bebida favorita en este mug. Puede ser personalizado con tu nombre.' },
    { id:'p05', nombre:'Figuras de Dragon Ball Z',       precio:40,  stock:12, categoria:'figuras',       img:'imagenes/pr5.jpg',          desc:'15 cm Dragon Ball Z Son Goku Super Saiyan. Figura de PVC de alta calidad.' },
    { id:'p06', nombre:'Hoodie de Tokyo Revengers',      precio:140, stock:7,  categoria:'ropa',          img:'imagenes/pr6.jpg',          desc:'Luce como la pandilla Manji Tokyo. Hecho con técnica de sublimación duradera.' },
    { id:'p07', nombre:'Humidificador Luna',              precio:40,  stock:10, categoria:'humidificadores', img:'imagenes/luna.jpg',       desc:'Tecnología única para aromaterapia en casa con estético modificador de aromas.' },
    { id:'p08', nombre:'Humidificador Bombillo',          precio:40,  stock:10, categoria:'humidificadores', img:'imagenes/bombillo.jpg',   desc:'En forma de foco, proyector con base moldeable.' },
    { id:'p09', nombre:'Humidificador de Flor',           precio:40,  stock:9,  categoria:'humidificadores', img:'imagenes/florecita.jpg',  desc:'La nueva aromaterapia, especialmente para personas asmáticas.' },
    { id:'p10', nombre:'Humidificador con Luces',          precio:40,  stock:6,  categoria:'humidificadores', img:'imagenes/humificador.webp',desc:'Ambiente cómodo y saludable. Incluye luces nocturnas, temporizadores y control de velocidad.' },
    { id:'p11', nombre:'Pantuflas Anime',                  precio:40,  stock:20, categoria:'pantuflas',    img:'imagenes/pantuflas.webp',   desc:'Suaves y cómodas pantuflas temáticas con diseños de tus animes favoritos.' },
    { id:'p12', nombre:'Pantuflas de Gato',                precio:40,  stock:18, categoria:'pantuflas',    img:'imagenes/pantuflagato.jpg', desc:'Encantadoras con textura suave, te dan una sensación esponjosa y muy fresca.' },
    { id:'p13', nombre:'Pantuflas de Vaca',                precio:40,  stock:14, categoria:'pantuflas',    img:'imagenes/chanclas.jfif',    desc:'De algodón y lino con punta abierta, frescas y muy lindas.' },
    { id:'p14', nombre:'Oso Panda',                        precio:40,  stock:11, categoria:'peluches',     img:'imagenes/peluche.jfif',     desc:'Alta calidad y ternura, textura suave y redondeada. Disponible en tamaño grande o pequeño.' },
    { id:'p15', nombre:'Peluche Brillante',                precio:40,  stock:8,  categoria:'peluches',     img:'imagenes/peluchebrillante.jfif', desc:'Peluche especial con detalles brillantes, ideal como regalo o decoración kawaii.' },
    { id:'p16', nombre:'Termo Anime',                      precio:40,  stock:16, categoria:'figuras',      img:'imagenes/termo.jfif',       desc:'Personalizado con tu anime favorito, mantiene fría o caliente tu bebida por horas.' },
  ],

  /* ── CUPONES ────────────────────────────────────────────── */
  cupones: { 'KOKO10': 10, 'ANIME20': 20, 'OTAKU15': 15 },

  /* ── AUTH ────────────────────────────────────────────────── */
  getUser()    { try { return JSON.parse(localStorage.getItem('kk_user')); } catch(e){ return null; } },
  getSession() { return localStorage.getItem('kk_session') === 'activa'; },

  registrar(nombre, email, pass) {
    // Hash simple (XOR base64) — en producción usar bcrypt del lado servidor
    const hash = btoa(unescape(encodeURIComponent(pass + '_koko_salt_2025')));
    const user = { nombre, email, hash, fechaRegistro: new Date().toISOString() };
    localStorage.setItem('kk_user', JSON.stringify(user));
    return user;
  },

  login(email, pass) {
    const user = this.getUser();
    if (!user) return false;
    const hash = btoa(unescape(encodeURIComponent(pass + '_koko_salt_2025')));
    if (user.email === email && user.hash === hash) {
      localStorage.setItem('kk_session', 'activa');
      localStorage.setItem('kk_logueado', user.nombre || email);
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem('kk_session');
    localStorage.removeItem('kk_logueado');
    window.location.href = 'inicioSesion.html';
  },

  requireAuth() {
    if (!this.getSession()) { window.location.href = 'inicioSesion.html'; }
  },

  actualizarPerfil(nombre, email) {
    const user = this.getUser();
    if (!user) return;
    user.nombre = nombre;
    user.email = email;
    localStorage.setItem('kk_user', JSON.stringify(user));
    localStorage.setItem('kk_logueado', nombre);
  },

  /* ── CARRITO ─────────────────────────────────────────────── */
  getCarrito()    { try { return JSON.parse(localStorage.getItem('kk_carrito')) || []; } catch(e){ return []; } },
  setCarrito(arr) { localStorage.setItem('kk_carrito', JSON.stringify(arr)); },

  agregarAlCarrito(productoId, cantidad = 1) {
    const prod = this.productos.find(p => p.id === productoId);
    if (!prod || prod.stock < 1) return false;
    const carrito = this.getCarrito();
    const idx = carrito.findIndex(p => p.id === productoId);
    if (idx > -1) {
      const nueva = carrito[idx].cantidad + cantidad;
      carrito[idx].cantidad = Math.min(nueva, prod.stock);
    } else {
      carrito.push({ id: productoId, nombre: prod.nombre, precio: prod.precio, img: prod.img, cantidad: Math.min(cantidad, prod.stock) });
    }
    this.setCarrito(carrito);
    return true;
  },

  eliminarDelCarrito(productoId) {
    this.setCarrito(this.getCarrito().filter(p => p.id !== productoId));
  },

  cambiarCantidad(productoId, delta) {
    const prod = this.productos.find(p => p.id === productoId);
    const carrito = this.getCarrito();
    const idx = carrito.findIndex(p => p.id === productoId);
    if (idx === -1) return;
    carrito[idx].cantidad = Math.max(1, Math.min(carrito[idx].cantidad + delta, prod ? prod.stock : 99));
    if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
    this.setCarrito(carrito);
  },

  vaciarCarrito() { this.setCarrito([]); },

  totalCarrito() {
    return this.getCarrito().reduce((s, p) => s + p.precio * p.cantidad, 0);
  },

  /* ── INVENTARIO ──────────────────────────────────────────── */
  descontarStock(carrito) {
    carrito.forEach(item => {
      const prod = this.productos.find(p => p.id === item.id);
      if (prod) prod.stock = Math.max(0, prod.stock - item.cantidad);
    });
    // Guardamos estado de stock en localStorage para persistir
    localStorage.setItem('kk_stock', JSON.stringify(this.productos.map(p => ({ id: p.id, stock: p.stock }))));
  },

  cargarStock() {
    try {
      const stocks = JSON.parse(localStorage.getItem('kk_stock')) || [];
      stocks.forEach(s => {
        const p = this.productos.find(p => p.id === s.id);
        if (p) p.stock = s.stock;
      });
    } catch(e){}
  },

  /* ── VENTAS / HISTORIAL ──────────────────────────────────── */
  getHistorial()      { try { return JSON.parse(localStorage.getItem('kk_historial')) || []; } catch(e){ return []; } },
  setHistorial(arr)   { localStorage.setItem('kk_historial', JSON.stringify(arr)); },

  registrarVenta(datosEnvio, metodoPago, carrito, descuento) {
    const subtotal  = this.totalCarrito();
    const envio     = subtotal > 0 ? 12000 : 0;
    const impuesto  = Math.round(subtotal * 0.19); // IVA 19%
    const total     = subtotal + envio - descuento;
    const orderId   = 'KOKO-' + Math.floor(100000 + Math.random() * 900000);
    const fecha     = new Date().toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });

    const venta = {
      id: orderId,
      fecha,
      fechaISO: new Date().toISOString(),
      items: [...carrito],
      subtotal,
      impuesto,
      envio,
      descuento,
      total,
      metodoPago,
      estado: 'confirmado',
      envioInfo: datosEnvio,
    };

    const historial = this.getHistorial();
    historial.unshift(venta);
    this.setHistorial(historial);
    this.descontarStock(carrito);
    this.vaciarCarrito();
    return venta;
  },

  /* ── FACTURA HTML ────────────────────────────────────────── */
  generarFacturaHTML(venta) {
    const items = venta.items.map(p =>
      `<tr>
        <td>${p.nombre}</td>
        <td style="text-align:center">${p.cantidad}</td>
        <td style="text-align:right">$${p.precio.toFixed(2)}</td>
        <td style="text-align:right">$${(p.precio * p.cantidad).toFixed(2)}</td>
      </tr>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Factura ${venta.id}</title>
<style>
  body { font-family: 'Arial', sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #222; }
  .logo { color: rgb(221,33,71); font-size: 48px; font-weight: 900; letter-spacing: -2px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid rgb(91,91,229); padding-bottom: 20px; }
  .factura-info h2 { font-size: 22px; color: rgb(91,91,229); }
  .factura-info p { font-size: 13px; color: #888; margin: 2px 0; }
  .secciones { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
  .seccion h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #aaa; margin-bottom: 8px; }
  .seccion p { font-size: 14px; margin: 2px 0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  thead th { background: rgb(91,91,229); color: #fff; padding: 10px 12px; text-align: left; font-size: 13px; }
  tbody tr:nth-child(even) { background: #f7f8ff; }
  tbody td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #eee; }
  .totales { text-align: right; }
  .totales table { width: 280px; margin-left: auto; }
  .totales td { padding: 6px 12px; font-size: 14px; }
  .totales .grand td { font-size: 16px; font-weight: 900; color: rgb(221,33,71); border-top: 2px solid rgb(91,91,229); }
  .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Koko</div>
      <p style="font-size:13px;color:#888;">kokotienda@correo.com · +57 319 285 8588</p>
      <p style="font-size:13px;color:#888;">Medellín, Antioquia – Colombia</p>
    </div>
    <div class="factura-info">
      <h2>FACTURA DE VENTA</h2>
      <p><strong>N°:</strong> ${venta.id}</p>
      <p><strong>Fecha:</strong> ${venta.fecha}</p>
      <p><strong>Método de pago:</strong> ${venta.metodoPago}</p>
      <p><strong>Estado:</strong> Confirmada ✅</p>
    </div>
  </div>

  <div class="secciones">
    <div class="seccion">
      <h4>Cliente</h4>
      <p><strong>${venta.envioInfo.nombre} ${venta.envioInfo.apellido}</strong></p>
      <p>${venta.envioInfo.email}</p>
      <p>${venta.envioInfo.telefono}</p>
    </div>
    <div class="seccion">
      <h4>Dirección de entrega</h4>
      <p>${venta.envioInfo.direccion}</p>
      <p>${venta.envioInfo.ciudad}, ${venta.envioInfo.departamento}</p>
      <p>CP: ${venta.envioInfo.codigoPostal} · ${venta.envioInfo.pais}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Producto</th><th style="text-align:center">Cant.</th><th style="text-align:right">Precio unit.</th><th style="text-align:right">Subtotal</th></tr>
    </thead>
    <tbody>${items}</tbody>
  </table>

  <div class="totales">
    <table>
      <tr><td>Subtotal</td><td>$${venta.subtotal.toFixed(2)}</td></tr>
      <tr><td>IVA (19%)</td><td>$${venta.impuesto.toFixed(2)}</td></tr>
      <tr><td>Envío</td><td>$${venta.envio.toFixed(2)}</td></tr>
      ${venta.descuento > 0 ? `<tr><td>Descuento</td><td>–$${venta.descuento.toFixed(2)}</td></tr>` : ''}
      <tr class="grand"><td><strong>TOTAL</strong></td><td><strong>$${venta.total.toFixed(2)}</strong></td></tr>
    </table>
  </div>

  <div class="footer">
    <p>¡Gracias por tu compra en KOKO Store! 🎌</p>
    <p>Este documento sirve como comprobante de pago. Conserva este número de orden: <strong>${venta.id}</strong></p>
  </div>

  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`;
  },

  /* ── REPORTES (admin) ────────────────────────────────────── */
  getReporte() {
    const historial = this.getHistorial();
    const totalVentas   = historial.length;
    const totalIngresos = historial.reduce((s, v) => s + v.total, 0);
    const prodsVendidos = {};
    historial.forEach(v => v.items.forEach(i => {
      prodsVendidos[i.nombre] = (prodsVendidos[i.nombre] || 0) + i.cantidad;
    }));
    const topProducto = Object.entries(prodsVendidos).sort((a,b) => b[1]-a[1])[0];
    return { totalVentas, totalIngresos, prodsVendidos, topProducto };
  },

  /* ── DESCUENTOS (admin) ──────────────────────────────────── */
  getCupones() {
    try { return JSON.parse(localStorage.getItem('kk_cupones')) || this.cupones; } catch(e){ return this.cupones; }
  },
  agregarCupon(codigo, pct) {
    const c = this.getCupones();
    c[codigo.toUpperCase()] = parseInt(pct);
    localStorage.setItem('kk_cupones', JSON.stringify(c));
  },
  eliminarCupon(codigo) {
    const c = this.getCupones();
    delete c[codigo];
    localStorage.setItem('kk_cupones', JSON.stringify(c));
  },

  /* ── NAVBAR helper ───────────────────────────────────────── */
  initNavbar(cerrarSesionId) {
    const user = localStorage.getItem('kk_logueado');
    const el = document.getElementById('navUsuario');
    if (el && user) el.textContent = '👤 ' + user;
    const btn = document.getElementById(cerrarSesionId || 'btnCerrarSesion');
    if (btn) btn.addEventListener('click', e => { e.preventDefault(); KK.logout(); });
  }
};

// Cargar stock persistido al iniciar
KK.cargarStock();
