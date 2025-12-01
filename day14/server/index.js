import http from 'node:http';
const PORT = 3000;

const server = http.createServer((req, res) => {
   const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const { pathname, searchParams } = parsedUrl;

    console.log(parsedUrl)
    console.log(pathname)
    console.log(searchParams)

   res.writeHead(200);
   res.end("hi~ i'm leeminjun");


});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
