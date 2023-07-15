import http from 'node:http';
import TamperQueue from './queue.js';

async function main() {
    const port = process.env.PORT || 5000;
    const queue = new TamperQueue((enqueue) => {
        const server = http.createServer((req, res) => {
            enqueue({req, res});
        })

        server.listen(port, () => {
            console.log('Listening on port %d', port);
        })
    })
    
    while (true) {
        const {req, res} = await queue.dequeue();
        res.writeHead(200, {'Content-Type': 'application.json'});
        res.end(JSON.stringify({message: new Date().toISOString()}));
    }
}

main().catch(err => console.log(err));