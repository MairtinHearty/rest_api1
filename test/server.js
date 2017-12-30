const _ = require('lodash');
const supertest = require('supertest');
const server = require('../server');

describe('server', () => {
    const posts = {};
    const request = supertest(server(posts));

    describe('GET /posts', () => {
        //test data that is returned by the posts controller stub
        const data = [{id: 1, author: 'Mr. Smith', content: 'Now GET /posts works'}];

        //test method now returns test data
        before(() => {
            posts.index = () =>
                new Promise((resolve, reject) =>
                    resolve(data)
                );
        });

        //checks that server responds with the proper HTTP code and exactly with the
        //same data it received from the controller
        it('responds with OK', () =>
            request
                .get('/posts')
                .expect(data)
                .expect(200)
        );
    });


    describe('POST /posts', () => {
        //data that is sent to the server
        const data = [{ author: 'Mr. Rogers', content: 'Now POST /posts works' }];

        before(() => {
            //so we expect server to return attributes for the new post
            posts.create = (attrs) =>
                new Promise((resolve, reject) =>
                    resolve(_.merge({ id: 2 }, data))
                );
        });

        it('responds with Created and returns content of the newly create post', () =>
            request
                .post('/posts')
                .send({ post: data })
                .expect(_.merge({ id: 2 }, data))
                .expect(201)
        );
    });

    describe('GET /posts/:id', () => {
        //data that is returned from the controller stub
        const data = [{ author: 'Mr. Williams', content: 'Now GET /posts/:id works' }];

        //show action stub. it merges specified id with the predefined data
        //to imitate real controller behaviour at one hand and
        //check that proper id was passed to the controller at another one
        before(() => {
            posts.show = (id) =>
                new Promise((resolve, reject) =>
                    resolve(_.merge({ id: id }, data))
                );
        });

        //checks that server just pass id to the controller and
        //returns its result.
        it('responds with OK and returns content of the post', () =>
            request
                .get('/posts/3')
                .send(data)
                .expect(_.merge({ id: 3 }, data))
                .expect(200)
        );

        context('when there is no post with the specified id', () => {
            //here its assumed that controller will return rejected promice
            //when post with the specified id is not found
            before(() => {
                posts.show = (id) =>
                    new Promise((resolve, reject) =>
                        reject(id)
                    );
            });

            //test that server responds with 404 code if post was not found
            it('responds with NotFound', () =>
                request
                    .get('/posts/3')
                    .send(data)
                    .expect(404)
            );
        });
    });

    describe('POST /posts/:id', () => {
        //data that is sent to the server
        var data = [{ author: 'Mr. Williams', content: 'Now POST /posts/:id works' }];

        //test actions returns specified attributes merged with the
        //specified identified so it's possible to control correctness
        //of the parameters that were passed to the controller stub
        before(() => {
            posts.update = (id, attrs) =>
                new Promise((resolve, reject) =>
                    resolve(_.merge({ id: id }, data))
                );
        });

        //and in the test below response data and status are verified
        it('responds with Created and returns content of the updated post', () =>
            request
                .post('/posts/4')
                .send({ post: data })
                .expect(_.merge({ id: 4 }, data))
                .expect(200)
        );

        context('when there is no post with the specified id', () => {
            before(() => {
                posts.update = (id) =>
                    new Promise((resolve, reject) =>
                        reject(id)
                    );
            });

            it('responds with 404 HTTP response', () =>
                request
                    .post('/posts/3')
                    .send({ post: data })
                    .expect(404)
            );
        });
    });

    describe('DELETE /posts/:id', () => {
        //imitate action that always returns id of the deleted post
        before(() =>
            posts.destroy = (id) =>
                new Promise((resolve, reject) =>
                    resolve({ id: id })
                )
        );

        //checks that server returns deleted post identified
        it('responds with the id of the deleted post', () =>
            request
                .delete('/posts/5')
                .expect({ id: 5 })
        );

        context('when there is no post with the specified id', () => {
            before(() =>
                posts.destroy = (id) =>
                    new Promise((resolve, reject) =>
                        reject(id)
                    )
            );

            it('responds with NotFound', () =>
                request
                    .delete('/posts/5')
                    .expect(404)
            );
        });

    });

});
