
var dataSet = {
    useAuth: true,
    repos: {
        'test': '/Users/barry/Documents/test/ILEditor.git'
    },
    users: {
        'admin': 'pass'
    }
}

exports.obj = {
    addRepo: function(key, path) {
        var result = {success: true};

        if (dataSet.repos[key] === undefined)
            dataSet.repos[key] = path;
        else {
            result.message = "Key already exists.";
            result.success = false;
        }

        return result;
    },

    getRepo: function(key) {
        return dataSet.repos[key];
    },

    useAuth: function() {
        return dataSet.useAuth;
    },

    addUser: function(user, pass) {
        var result = {success: true};

        if (dataSet.users[user] === undefined)
            dataSet.users[user] = pass;
        else {
            result.success = false;
            result.message = "User already exists.";
        }

        return result;
    },

    userAuth: function(username, password) {
        console.log(this.dataSet);
        if (dataSet.users[username] !== undefined)
            if (dataSet.users[username] === password)
                return true;

        return false;
    }
}