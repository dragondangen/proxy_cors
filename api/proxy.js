const fetch = require('node-fetch');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type'); // <-- важно
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url } = req.query;
    if (!url) return res.status(400).send('Missing url');

    const headers = {
        'User-Agent': 'Mozilla/5.0...',
        'Accept': 'application/json',
    };
    if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
    }

    const response = await fetch(url, { headers });
    const text = await response.text();
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.send(text);
};