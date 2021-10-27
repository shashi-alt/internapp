const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://shashi:Srk694307@cluster0.u8vio.mongodb.net/customers?retryWrites=true&w=majority',{ useNewUrlParser: true});
var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true,
        }
    },

    Email: {
        type: String,
        required: true,
        index: {
            unique: true,
        }
    },

    image: {
        type: String,
        required: true,
        index: {
            unique: true,
        }
    },

    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var userModel = mongoose.model('users', userSchema);
module.exports = userModel;