// PROCESAMIENTO GENERAL DEL FORMULARIO Y ENVÍO A MAKE
document.getElementById('form-recarga').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('btn-enviar');
    const statusMsg = document.getElementById('status-message');
    
    btn.disabled = true;
    btn.innerText = "Validando Pago...";
    
    const selectedRadio = document.querySelector('input[name="paquete"]:checked');
    if (!selectedRadio) {
        alert("Por favor, selecciona un lote de recarga primero.");
        btn.disabled = false;
        btn.innerText = "Procesar Recarga";
        return;
    }
    
    const packageName = selectedRadio.getAttribute('data-name');
    const packageUsd = parseFloat(selectedRadio.getAttribute('data-usd'));
    const tasaValue = parseFloat(document.getElementById('tasa_cambio').value) || 0;
    
    // Formatear precio final calculado en Bs para el reporte del webhook
    const finalPriceBs = (packageUsd * tasaValue).toFixed(2) + " Bs.";
    
    const playerId = document.getElementById('player_id').value;
    const referencia = document.getElementById('referencia').value;
    const fileInput = document.getElementById('screenshot_file');
    
    let base64File = "";
    let fileName = "";
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileName = file.name;
        base64File = await toBase64(file);
    }
    
    const payload = {
        juego: juegoActual === 'free_fire' ? 'Free Fire' : 'Blood Strike',
        id_jugador: playerId,
        paquete_seleccionado: packageName,
        precio: finalPriceBs,
        referencia_pago: referencia,
        comprobante_base64: base64File,
        comprobante_nombre: fileName
    };
    
    try {
        const response = await fetch('https://eu1.make.com/2051113/scenarios/6380627/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        statusMsg.classList.remove('hidden', 'bg-red-950/30', 'border-red-500/20', 'text-red-400');
        statusMsg.classList.add('bg-emerald-950/30', 'border', 'border-emerald-500/20', 'text-emerald-400');
        statusMsg.innerHTML = `<i class="fa-solid fa-circle-check mr-1"></i> ¡Orden procesada con éxito! Tus recursos están en camino.`;
        
        document.getElementById('form-recarga').reset();
        document.getElementById('file-name').classList.add('hidden');
        
    } catch (error) {
        console.error("Error en la conexión a la base de datos:", error);
        statusMsg.classList.remove('hidden', 'bg-emerald-950/30', 'border-emerald-500/20', 'text-emerald-400');
        statusMsg.classList.add('bg-red-950/30', 'border', 'border-red-500/20', 'text-red-400');
        statusMsg.innerHTML = `<i class="fa-solid fa-circle-xmark mr-1"></i> Error de pasarela. Intenta de nuevo o contacta a soporte.`;
    } finally {
        btn.disabled = false;
        btn.innerText = "Procesar Recarga";
    }
});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

// 🔐 PANEL DE CONTROL ADMINISTRATIVO TOTALMENTE OCULTO
// Haz doble clic en computadoras, o doble toque rápido en celulares sobre el logo de TMK Gaming.
document.getElementById('logo-admin-trigger').addEventListener('dblclick', function(e) {
    e.preventDefault();
    
    const tasaInput = document.getElementById('tasa_cambio');
    const tasaActual = tasaInput.value;
    
    const nuevaTasa = prompt("🔐 SISTEMA ADM - TMK GAMING\n\nModificar la tasa referencial del día (Bs/$):", tasaActual);
    
    if (nuevaTasa !== null && !isNaN(nuevaTasa) && nuevaTasa > 0) {
        tasaInput.value = parseFloat(nuevaTasa).toFixed(2);
        recalculateAllPrices();
        alert("📊 Tasa sincronizada de forma segura a: " + nuevaTasa + " Bs.");
    }
});
