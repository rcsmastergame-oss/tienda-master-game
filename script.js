const MAKE_WEBHOOK_URL = "TU_URL_DE_WEBHOOK_AQUI";

document.getElementById('form-recarga').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btnEnviar = document.getElementById('btn-enviar');
    const statusMessage = document.getElementById('status-message');
    
    btnEnviar.disabled = true;
    btnEnviar.innerText = "ENVIANDO DATOS AL OPERADOR...";

    const paqueteSeleccionado = document.querySelector('input[name="paquete"]:checked');
    
    // Agrupamos la información incluyendo qué juego se está recargando
    const datosPedido = {
        juego: juegoActual === "free_fire" ? "Free Fire" : "Blood Strike",
        id_jugador: document.getElementById('player_id').value,
        nombre_jugador: document.getElementById('player_name').value || "No indicado",
        paquete_id: paqueteSeleccionado.value,
        paquete_nombre: paqueteSeleccionado.getAttribute('data-name'),
        precio: parseFloat(paqueteSeleccionado.getAttribute('data-price')),
        metodo_pago: "Pago Movil", 
        referencia: document.getElementById('referencia').value,
        fecha: new Date().toLocaleString()
    };

    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPedido)
        });

        if (response.ok) {
            statusMessage.textContent = "¡Excelente! Pago registrado. Tu recarga estará lista en breve.";
            statusMessage.className = "mt-4 p-4 rounded-xl text-center font-bold bg-green-500/20 text-green-400 border border-green-500/30";
            statusMessage.classList.remove('hidden');
            document.getElementById('form-recarga').reset();
            
            // Regresar al Home automáticamente a los 4 segundos
            setTimeout(() => {
                statusMessage.classList.add('hidden');
                showSection('home-view');
            }, 4000);

        } else {
            throw new Error("Error del servidor");
        }
    } catch (error) {
        statusMessage.textContent = "Error de conexión. Por favor verifica los datos o comunícate por soporte.";
        statusMessage.className = "mt-4 p-4 rounded-xl text-center font-bold bg-red-500/20 text-red-400 border border-red-500/30";
        statusMessage.classList.remove('hidden');
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.innerText = "Procesar e Informar Pago";
    }
});
