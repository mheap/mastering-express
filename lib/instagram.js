var instagram = require("instagram-node").instagram();

var ig = function(client_id, client_secret) {
    this.client_id = client_id;
    this.client_secret = client_secret;

    instagram.use({"client_id": this.client_id, "client_secret": this.client_secret });

    this.timeout = 5;
    this.cache = {};
}

ig.prototype.getClientId = function() {
    return this.client_id;
}

ig.prototype.getClientSecret = function() {
    return this.client_secret;
}

ig.prototype.get_most_popular = function(callback) {
    instagram.media_popular(function(err, media, limit) {
        if (err) { return callback(err, null, null); }
        
        this.cache = {
            "media": media,
            "limit": limit,
            "timeout": (+(new Date)) + (this.timeout * 1000)
        };
        
        return callback(err, media, limit);
    }.bind(this));
}

ig.prototype.get_most_popular_with_cache = function(callback) {
    var data = this.fetch_from_cache();
    if (data) {
        return callback(null, data.media, data.limit);
    }
    return this.get_most_popular(callback);
}

ig.prototype.fetch_from_cache = function() {
    if (this.cache.media && (new Date).getTime() < this.cache.timeout) {
        return {"media": this.cache.media, "limit": this.cache.limit};
    }
    return false
}

ig.prototype.get_media_from_id = function(id) {
    for (var i in this.cache.media) {
        if (this.cache.media[i].id == id) {
            return this.cache.media[i];
        }
    }
    return false;
}

module.exports = ig


