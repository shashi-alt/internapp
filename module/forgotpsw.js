const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://shashi:Srk694307@cluster0.u8vio.mongodb.net/customers?retryWrites=true&w=majority', { useNewUrlParser: true });
var conn = mongoose.Collection;
var newpasswordSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var newpasswordModel = mongoose.model('newpassword', newpasswordSchema);
module.exports = newpasswordModel;