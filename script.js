const MAKE_WEBHOOK_URL = "TU_URL_DE_WEBHOOK_AQUI";

// Función auxiliar para convertir el archivo de imagen a Base64
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            
            <div onclick="openStore('free_fire')" class="game-card group cursor-pointer bg-slate-900/60 border-2 border-slate-800 hover:border-amber-500 rounded-3xl overflow-hidden p-6 transition-all duration-300 shadow-xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20">
                <div class="h-44 bg-slate-800 rounded-2xl mb-4 overflow-hidden flex items-center justify-center relative">
                    <img src="https://i.imgur.com/39w6mep.jpeg" alt="Free Fire" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute bottom-3 left-3 bg-slate-950/80 text-amber-400 text-xs font-bold px-3 py-1 rounded-md border border-amber-500/30">ID Directo</div>
                </div>
                <h3 class="text-2xl font-black tracking-wide group-hover:text-amber-400 transition-colors">FREE FIRE</h3>
                <p class="text-slate-400 text-sm mt-1">Diamantes oficiales abonados por ID de jugador en minutos.</p>
                <button class="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    Recargar Ahora <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            </div>

            <div onclick="openStore('blood_strike')" class="game-card group cursor-pointer bg-slate-900/60 border-2 border-slate-800 hover:border-red-500 rounded-3xl overflow-hidden p-6 transition-all duration-300 shadow-xl bg-gradient-to-b from-slate-900 via-slate-900 to-red-950/20">
                <div class="h-44 bg-slate-800 rounded-2xl mb-4 overflow-hidden flex items-center justify-center relative">
                    <img src="https://i.imgur.com/vH3I04w.jpeg" alt="Blood Strike" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute bottom-3 left-3 bg-slate-950/80 text-red-400 text-xs font-bold px-3 py-1 rounded-md border border-red-500/30">Oro / Pases</div>
                </div>
                <h3 class="text-2xl font-black tracking-wide group-hover:text-red-400 transition-colors">BLOOD STRIKE</h3>
                <p class="text-slate-400 text-sm mt-1">Monedas de oro y pases de batalla para dominar la zona.</p>
                <button class="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    Recargar Ahora <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            </div>

        </div>
