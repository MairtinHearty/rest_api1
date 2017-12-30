const restify = require('restify');

module.exports = (posts) => {
    const server = restify.createServer()

    //we need that parser to work with params that are defined in
    //the request body
    server.use(restify.plugins.bodyParser())
    server.get('/posts', (req, res, next) =>
        posts.index().then((result) =>
            res.send(200, result)
        )
    );

    server.post('/posts', (req, res, next) =>
        posts.create(req.params.post).then((result) =>
            res.send(201, result)
        )
    );

    server.get('/posts/:id', (req, res, next) =>
        posts.show(req.params.id).then((result) =>
            res.send(200, result)
        ).catch(() => res.send(404))
    );

    server.post('/posts/:id', (req, res, next) =>
        posts.update(req.params.id, req.params.post).then((result) =>
            res.send(200, result)
        ).catch(() => res.send(404))
    );
    server.del('/posts/:id', (req, res, next) =>
        posts.destroy(req.params.id).then((result) =>
            res.send(200, { id: req.params.id })
        ).catch(() => res.send(404))
    );
    return server;
};