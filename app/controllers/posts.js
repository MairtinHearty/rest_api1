const _ = require('lodash');

module.exports = class {
    //index and type names should be specified outside now
    constructor(client, indexName, type) {
        this.client = client;
        this.indexName = indexName;
        this.type = type;
    }

    //index returns list of posts attributes merged with corresponding
    //identifiers
    index() {
        //pass index name and object type to the controller
        return this.client.search({
            index: this.indexName,
            type: this.type
        })
            .then((res) =>
                _.map(res.hits.hits, (hit) =>
                    _.merge(hit._source, { id: hit._id })
                )
            );
    }
};