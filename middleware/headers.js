module.exports = (request, response, next) => {
    request.header('access-control-allow-origin', '*');
    request.header('access-control-allow-methods', 'GET, POST, PUT, DELETE');
    request.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    next();
}