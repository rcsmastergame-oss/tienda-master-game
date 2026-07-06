const MAKE_WEBHOOK_URL = "https://eu1.make.com/2051113/scenarios/6380627/edit";

const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

document.getElementById('form-recarga').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btnEnviar = document.getElementById('btn-enviar');
    const statusMessage = document.getElementById('status-message');
    const fileInput = document.getElementById('screenshot_file');
    
    btnEnviar.disabled = true;
    btnEnviar.innerText = "PROCESANDO CAPTURA E INFORME...";

    const paqueteSeleccionado = document.querySelector('input[name="paquete"]:checked');
    
    try {
        let base64Image = "";
        if (fileInput.files && fileInput.files[0]) {
            base64Image = await convertFileToBase64(fileInput.files[0]);
        }

        const datosPedido = {
            juego: juegoActual === "free_fire" ? "Free Fire" : "Blood Strike",
            id_jugador: document.getElementById('player_id').value,
            paquete_id: paqueteSeleccionado.value,
            paquete_nombre: paqueteSeleccionado.getAttribute('data-name'),
            precio: parseFloat(paqueteSeleccionado.getAttribute('data-price')),
            metodo_pago: "Pago Movil",
            referencia: document.getElementById('referencia').value, // ¡Aquí viaja el texto de la referencia!
            captura_base64: base64Image, 
            fecha: new Date().toLocaleString()
        };

        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPedido)
        });

        if (response.ok) {
            statusMessage.textContent = "¡Pedido enviado con éxito! Tu captura, referencia e ID están en proceso de revisión.";
            statusMessage.className = "mt-4 p-4 rounded-xl text-center font-bold bg-green-500/20 text-green-400 border border-green-500/30";
            statusMessage.classList.remove('hidden');
            document.getElementById('form-recarga').reset();
            
            setTimeout(() => {
                statusMessage.classList.add('hidden');
                showSection('home-view');
            }, 5000);
        } else {
            throw new Error("Error en el canal de comunicación.");
        }
    } catch (error) {
        statusMessage.textContent = "Error al enviar. Inténtalo de nuevo o comprueba el peso de la imagen.";
        statusMessage.className = "mt-4 p-4 rounded-xl text-center font-bold bg-red-500/20 text-red-400 border border-red-500/30";
        statusMessage.classList.remove('hidden');
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.innerText = "Enviar Pedido a Operador";
    }
});
