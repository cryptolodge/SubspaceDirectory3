var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ZoneStatisticSchema = new Schema({
        metadata: {
                created: {type : Date, default : Date.now},
                lastUpdated: {type : Date, default : Date.now},
            },
        zone : {type : Schema.ObjectId, ref : 'Zone'},
        daily: Number,
        hourly: [{ hour: Number, value: Number}],
        minute: [{ minute: Number, value: Number}]
    });

ZoneStatisticSchema.path("zone").required(true,"Zone reference is required");

mongoose.model('ZoneStatistic', ZoneStatisticSchema);

