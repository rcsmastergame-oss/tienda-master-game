document.getElementById('form-recarga').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('btn-enviar');
    const statusMsg = document.getElementById('status-message');
    
    btn.disabled = true;
    btn.innerText = "Procesando Pedido...";
    
    const selectedRadio = document.querySelector('input[name="paquete"]:checked');
    if (!selectedRadio) {
        alert("Por favor, selecciona un paquete de recarga.");
        btn.disabled = false;
        btn.innerText = "Confirmar Orden de Recarga";
        return;
    }
    
    const packageName = selectedRadio.getAttribute('data-name');
    const packageUsd = parseFloat(selectedRadio.getAttribute('data-usd'));
    const tasaValue = parseFloat(document.getElementById('tasa_cambio').value) || 0;
    
    // Calcular el monto exacto final en Bs para enviarlo limpio a Make
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
        precio: finalPriceBs, // Monto calculado en bolívares según la tasa del momento
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
        
        statusMsg.classList.remove('hidden', 'bg-red-950/40', 'border-red-500/30', 'text-red-400');
        statusMsg.classList.add('bg-emerald-950/40', 'border', 'border-emerald-500/30', 'text-emerald-400');
        statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> ¡Pedido Envíado! Tu recarga está siendo procesada.`;
        
        document.getElementById('form-recarga').reset();
        document.getElementById('file-name').classList.add('hidden');
        
    } catch (error) {
        console.error("Error enviando datos:", error);
        statusMsg.classList.remove('hidden', 'bg-emerald-950/40', 'border-emerald-500/30', 'text-emerald-400');
        statusMsg.classList.add('bg-red-950/40', 'border', 'border-red-500/30', 'text-red-400');
        statusMsg.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Hubo un problema al procesar tu orden. Intenta nuevamente.`;
    } finally {
        btn.disabled = false;
        btn.innerText = "Confirmar Orden de Recarga";
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
