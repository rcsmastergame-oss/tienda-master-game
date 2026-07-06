document.getElementById('form-recarga').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btnEnviar = document.getElementById('btn-enviar'); // o el ID que tenga tu botón
    const statusMessage = document.getElementById('status-message'); // o el contenedor del error
    
    // Cambiar estado visual del botón
    if(btnEnviar) {
        btnEnviar.disabled = true;
        btnEnviar.innerText = "PROCESANDO ORDEN...";
    }

    // PON AQUÍ TU URL REAL DE MAKE
    const URL_WEBHOOK_MAKE = "https://hook.us1.make.com/tu_enlace_aqui";

    const playerId = document.getElementById('player_id').value;
    const referencia = document.getElementById('referencia').value;
    const fileInput = document.getElementById('screenshot_file');
    
    const paqueteSeleccionado = document.querySelector('input[name="paquete"]:checked');
    const juego = typeof juegoActual !== 'undefined' ? juegoActual : "No especificado";
    
    let infoPaquete = "Ninguno";
    let precioPaquete = "0.00";
    
    if (paqueteSeleccionado) {
        infoPaquete = paqueteSeleccionado.getAttribute('data-name') || paqueteSeleccionado.value;
        precioPaquete = paqueteSeleccionado.getAttribute('data-price') || "0.00";
    }

    // Función interna para convertir la imagen a texto Base64 seguro
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    let imagenBase64 = "";
    let nombreImagen = "";

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        nombreImagen = file.name;
        // Si la imagen es muy pesada, se convierte de forma segura
        imagenBase64 = await toBase64(file);
    }

    // Estructura JSON pura (Mucho más limpia y compatible para Make)
    const datosOrden = {
        juego: juego,
        player_id: playerId,
        paquete: infoPaquete,
        precio_bs: precioPaquete,
        referencia: referencia,
        comprobante_nombre: nombreImagen,
        comprobante_archivo: imagenBase64 // Aquí viaja la foto como texto seguro
    };

    try {
        const response = await fetch(URL_WEBHOOK_MAKE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosOrden)
        });

        // Remueve clases de error previas si existen
        statusMessage.classList.remove('bg-rose-500/10', 'text-rose-400', 'border-rose-500/20');

        if (response.ok) {
            // Éxito total
            statusMessage.className = "mt-4 p-4 rounded-xl text-center font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
            statusMessage.innerText = "¡Orden enviada con éxito! Tu recarga será procesada en breve.";
            statusMessage.classList.remove('hidden');
            document.getElementById('form-recarga').reset();
            if(document.getElementById('file-name')) {
                document.getElementById('file-name').classList.add('hidden');
            }
        } else {
            throw new Error("Rechazado por el servidor");
        }
    } catch (error) {
        // Muestra el error en pantalla
        statusMessage.className = "mt-4 p-4 rounded-xl text-center font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20";
        statusMessage.innerText = "Error al enviar. Inténtalo de nuevo o comprueba el peso de la imagen.";
        statusMessage.classList.remove('hidden');
    } finally {
        if(btnEnviar) {
            btnEnviar.disabled = false;
            btnEnviar.innerText = "ENVIAR PEDIDO A OPERADOR";
        }
    }
});
