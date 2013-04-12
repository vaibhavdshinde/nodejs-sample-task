var ElasticSearchClient = require('elasticsearchclient');

Search = function () {
    var bonsaiHost;
    var serverOptions = {
        host: "localhost",
        port: 9200
    };

    if (process.env.BONSAI_URL) {
        bonsaiHost = process.env.BONSAI_URL;
        var match = /http:\/\/(\w+):(\w+)@(.+)/g.exec(bonsaiHost);

        serverOptions.auth = match[1] + ":" + match[2];
        serverOptions.host = match[3];
        serverOptions.port = 80;

        console.log("Env var for bonsai is " + bonsaiHost);
        console.log("Server options are  " + JSON.stringify(serverOptions));
    }

    this.elasticSearchClient = new ElasticSearchClient(serverOptions);
};


Search.prototype.index = function (indexName, typeName, document, id, options, cb) {
    this.elasticSearchClient
        .index(indexName, typeName, document, id, options, cb).on('data',function (data) {
            cb(data)
        }
    ).exec();
};

Search.prototype.search = function (indexName, typeName, queryObj, options, cb) {
    this.elasticSearchClient
        .search(indexName, typeName, queryObj, options, cb).on('data',function (data) {
            cb(data)
        }).on('error',function (error) {
            cb(error)
        }).exec();
};

exports.Search = Search;

