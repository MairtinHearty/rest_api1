var PostsController = require('../../app/controllers/posts');
var should = require('should');
var sinon = require('sinon');
require('should-sinon');

describe('PostsController', function() {
    var client = {};
    const posts = new PostsController(client, 'index', 'type');
    describe('index', () => {
        before(() =>
            client.search = () =>
                new Promise((resolve, reject) =>
                    resolve({
                        "took": 27,
                        "timed_out": false,
                        "_shards": {
                            "total": 5,
                            "successful": 5,
                            "failed": 0
                        },
                        "hits": {
                            "total": 1,
                            "max_score": 1,
                            "hits": [
                                {
                                    "_index": 'index',
                                    "_type": 'type',
                                    "_id": "AVhMJLOujQMgnw8euuFI",
                                    "_score": 1,
                                    "_source": {
                                        "text": "Now PostController index works!",
                                        "author": "Mr.Smith"
                                    }
                                }
                            ]
                        }
                    })
                )
        );

        it('parses and returns post data', () =>
            posts.index().then((result) =>
                result.should.deepEqual([{
                    id: "AVhMJLOujQMgnw8euuFI",
                    author: "Mr.Smith",
                    text: "Now PostController index works!"
                }])
            )
        );
        it('specifies proper index and type while searching', () => {
            const spy = sinon.spy(client, 'search');

            //It's expected below that method search() is called once with
            //proper index name and object type as paramters.
            return posts.index().then(() => {
                spy.should.be.calledOnce();
                spy.should.be.calledWith({
                    index: 'index',
                    type: 'type'
                });
            });
        });
    });
});