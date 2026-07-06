// Reemplaza esto con la URL del webhook de tu Custom Webhook en Make
const MAKE_WEBHOOK_URL = "https://eu1.make.com/2051113/scenarios/6380627/edit";

document.getElementById('form-recarga').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btnEnviar = document.getElementById('btn-enviar');
    const statusMessage = document.getElementById('status-message');
    
    // Bloquear botón para evitar doble envío
    btnEnviar.disabled = true;
    btnEnviar.innerText = "Procesando pedido...";

    // Obtener el paquete seleccionado y sus atributos de datos
    const paqueteSeleccionado = document.querySelector('input[name="paquete"]:checked');
    
    const datosPedido = {
        id_jugador: document.getElementById('player_id').value,
        nombre_jugador: document.getElementById('player_name').value,
        paquete_id: paqueteSeleccionado.value,
        paquete_nombre: paqueteSeleccionado.getAttribute('data-name'),
        precio: parseFloat(paqueteSeleccionado.getAttribute('data-price')),
        metodo_pago: document.getElementById('metodo_pago').value,
        referencia: document.getElementById('referencia').value,
        fecha: new Date().toISOString()
    };

    try {
        // Enviar datos directamente a Make (reemplazando a Tally)
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPedido)
        });

        if (response.ok) {
            statusMessage.textContent = "¡Pedido enviado con éxito! Tu recarga será procesada.";
            statusMessage.className = "mt-4 p-4 rounded-xl text-center font-medium bg-green-500/20 text-green-400 border border-green-500";
            statusMessage.classList.remove('hidden');
            document.getElementById('form-recarga').reset();
        } else {
            throw new Error("Error en la respuesta del servidor");
        }
    } catch (error) {
        statusMessage.textContent = "Hubo un problema al enviar tu pedido. Inténtalo de nuevo o contacta al soporte.";
        statusMessage.className = "mt-4 p-4 rounded-xl text-center font-medium bg-red-500/20 text-red-400 border border-red-500";
        statusMessage.classList.remove('hidden');
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.innerText = "Confirmar y Enviar Pedido";
    }
});
