document.getElementById('form-recarga').addEventListener('submit', async function(e) {
    e.preventDefault(); // Evita que la página se recargue

    const btnEnviar = document.getElementById('btn-enviar') || e.submitter;
    const statusMessage = document.getElementById('status-message');
    
    // Cambiar estado visual del botón para evitar doble envío
    if (btnEnviar) {
        btnEnviar.disabled = true;
        btnEnviar.innerText = "PROCESANDO ORDEN...";
    }

    // ============================================================
    // 1. PEGA AQUÍ LA URL DE TU CUSTOM WEBHOOK DE MAKE (EL CÍRCULO AZUL)
    // ============================================================
    const URL_WEBHOOK_MAKE ="https://hook.eu1.make.com/7fuiqeer2btukdvc4z1qnh6oed9g3p7k";

    // 2. Capturar los datos de los campos de la página
    const playerId = document.getElementById('player_id').value;
    const referencia = document.getElementById('referencia').value;
    const fileInput = document.getElementById('screenshot_file');
    
    // Capturar paquete seleccionado
    const paqueteSeleccionado = document.querySelector('input[name="paquete"]:checked');
    const juego = typeof juegoActual !== 'undefined' ? juegoActual : "No especificado";
    
    let infoPaquete = "Ninguno";
    let precioPaquete = "0.00";
    
    if (paqueteSeleccionado) {
        infoPaquete = paqueteSeleccionado.getAttribute('data-name') || paqueteSeleccionado.value;
        precioPaquete = paqueteSeleccionado.getAttribute('data-price') || "0.00";
    }

    // Función interna para convertir la imagen a texto Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    let imagenBase64 = "";
    let nombreImagen = "";

    try {
        // Convertir la imagen si el usuario subió una
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            nombreImagen = file.name;
            imagenBase64 = await toBase64(file);
        }

        // 3. Crear el objeto de datos limpio en JSON
        const datosOrden = {
            juego: juego,
            player_id: playerId,
            paquete: infoPaquete,
            precio_bs: precioPaquete,
            referencia: referencia,
            comprobante_nombre: nombreImagen,
            comprobante_archivo: imagenBase64 // La imagen viaja aquí convertida en texto seguro
        };

        // 4. Enviar la petición POST a Make
        const response = await fetch(URL_WEBHOOK_MAKE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosOrden)
        });

        // Limpiar estilos previos del cuadro de mensaje
        statusMessage.removeAttribute('class');

        if (response.ok) {
            // ÉXITO TOTAL
            statusMessage.className = "mt-4 p-4 rounded-xl text-center font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
            statusMessage.innerText = "¡Orden enviada con éxito! Tu recarga será procesada en breve.";
            statusMessage.classList.remove('hidden');
            
            // Limpiar el formulario
            document.getElementById('form-recarga').reset();
            const fileNameLabel = document.getElementById('file-name');
            if (fileNameLabel) fileNameLabel.classList.add('hidden');
        } else {
            throw new Error("El servidor de Make rechazó la petición");
        }

    } catch (error) {
        // MANEJO DE ERRORES
        console.error("Error detectado:", error);
        statusMessage.removeAttribute('class');
        statusMessage.className = "mt-4 p-4 rounded-xl text-center font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20";
        statusMessage.innerText = "Error al enviar la orden. Inténtalo de nuevo o comprueba que la imagen no sea extremadamente pesada.";
        statusMessage.classList.remove('hidden');
    } finally {
        // Devolver el botón a su estado original
        if (btnEnviar) {
            btnEnviar.disabled = false;
            btnEnviar.innerText = "ENVIAR PEDIDO A OPERADOR";
        }
    }
});
