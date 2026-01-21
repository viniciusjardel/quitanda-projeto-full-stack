const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    if (req.url === '/api/health') {
        res.end(JSON.stringify({ status: 'online', message: 'Backend OK!' }));
    } else if (req.url === '/api/gerar-pix' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.parse(body);
            res.end(JSON.stringify({
                success: true,
                pixCode: data.pixKey,
                pixKey: data.pixKey,
                amount: data.amount,
                message: 'OK'
            }));
        });
    } else {
        res.end(JSON.stringify({ message: 'Quitanda Backend' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Backend rodando na porta ${PORT}`);
});

