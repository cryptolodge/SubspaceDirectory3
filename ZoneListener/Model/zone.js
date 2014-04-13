var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ZoneSchema = new Schema({
        metadata: {
            created: {type : Date, default : Date.now},
            lastUpdated: {type : Date, default : Date.now},
        },
    ip: String,
    port: Number,
    name: String,  
    password: String, 
    description: String,
    playerCount: {type: Number, default: 0},
    serverVersion: Number,
    scoreKeeping: {type: Boolean, default: false}
    });

ZoneSchema.path("ip").required(true,"Zone IP cannot be blank");
ZoneSchema.path("port").required(true,"Zone Port cannot be blank");
ZoneSchema.path("name").required(true,"Zone Name cannot be blank");
ZoneSchema.path("password").required(true,"Zone Password cannot be blank");

ZoneSchema.statics = {
    findByNameAndPassword:  function (name, password, callback) {
        return this.findOne({ name: name, password: password }, callback);
    }
}


mongoose.model('Zone', ZoneSchema);

