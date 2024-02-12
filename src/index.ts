import * as path from "path";
import { createServer as createServerHttp, Server } from "http";
import * as dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(__filename);


console.log(`Path segment separator is "${path.sep}"`);

console.log(`Path to current file is ${__filename}`);
console.log(`Path to current directory is ${__dirname}`);

const myServer = createServerHttp((_, res) => {
    res.end('Request accepted');
});

const PORT = parseInt(process.env.PORT || '3000');

myServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('To terminate it, use Ctrl+C combination');
});
