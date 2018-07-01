exports.obj = {
    dataSet: {
        useAuth: false,
        repos: {},
        users: {
            'admin': 'pass'
        }
    },

    addRepo: function(key, path) {
        var result = {success: true};

        if (this.dataSet.repos[key] === undefined)
            this.dataSet.repos[key] = path;
        else {
            result.message = "Key already exists.";
            result.success = false;
        }

        return result;
    },

    getRepo: function(key) {
        return this.dataSet.repos[key];
    },

    useAuth: function() {
        return this.dataSet.useAuth;
    },

    addUser: function(user, pass) {
        var result = {success: true};

        if (this.dataSet.users[user] === undefined)
            this.dataSet.users[user] = pass;
        else {
            result.success = false;
            result.message = "User already exists.";
        }

        return result;
    },

    userAuth: function(username, password) {
        if (this.dataSet.users[username] !== undefined)
            if (this.dataSet.users[username] === password)
                return true;

        return false;
    }
}