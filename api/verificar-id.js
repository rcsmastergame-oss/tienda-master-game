export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { playerId } = req.body;

  if (!playerId) {
    return res.status(400).json({ message: 'El ID es requerido' });
  }

  const url = `https://id-game-checker.p.rapidapi.com/ff-global/${playerId.trim()}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'ece75fb231mshea44d6c7d2b7760p1ca90fjsn66b0967f03ac',
      'x-rapidapi-host': 'id-game-checker.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  };

  try {
    const apiResponse = await fetch(url, options);
    
    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ error: 'Error en la API externa' });
    }

    const data = await apiResponse.json();
    const nickname = data.username || data.nickname || data.name || (data.data && data.data.username);

    if (nickname) {
      return res.status(200).json({ success: true, nickname });
    } else {
      return res.status(404).json({ success: false, message: 'Jugador no encontrado' });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Error interno en el servidor' });
  }
}
