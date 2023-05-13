const fs = require("fs");
const path = require("path");
const basename = path.basename(module.filename);
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");

mongoose.Promise = global.Promise;
mongoose.plugin(uniqueValidator);
mongoose.plugin(mongoosePaginate);
mongoose.plugin(require("mongoose-autopopulate"));
mongoose.plugin(require("mongoose-lean-virtuals"));
mongoose.plugin(require("mongoose-cast-aggregation"));

mongoose
  .connect(
    "mongodb+srv://quythanh24:admin123@mqttchat.8pos3kl.mongodb.net/HighTech?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"))
  .catch((err) => console.log(">>>>>>>>> DB Error: ", err));

const db = {};

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(mongoose);
    db[model.modelName] = model;
  });

db.mongoose = mongoose;
db.mongoose["language"] = "vi";
db.mongoose["userId"] = null;

module.exports = db;
