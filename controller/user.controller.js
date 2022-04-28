const userModel = require("../models/user.model");
var jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");

// find all user with pagination
exports.findAllUser = async function (req, res) {
  var perPage = parseInt(req.params.perPage)
    ? parseInt(req.params.perPage)
    : 10;
  var page = parseInt(req.params.page) || 1;
  var alldeal = await userModel
    .find()
    .skip(perPage * page - perPage)
    .limit(perPage);

    userModel
      .find()
      .countDocuments()
      .exec(function (err, count) {
        if (count != null) {
      res.json({
        success: true,
        users: alldeal,
        currentpage: page,
        totalpages: Math.ceil(count / perPage),
      });
  } else {
    res.json({
      success: false,
      error: "Internal Server Error. Please try again.",
    });
  }
});
};

exports.findAll = async function (req, res) {
    var alldeal = await userModel
    .find()
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving User",
      });
    });
};
// find perticuler user by passing id
exports.findOneUser = (req, res) => {
  try {
    userModel
      .findById({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: "User not found",
          });
        } else {
          res.status(200).send(user);
        }
      })
      .catch((err) => {
        return res.status(500).send({
          message: "Error retrieving User",
        });
      });
  } catch (e) {
    res.status(400).send({ response: e });
  }
};

// Update perticular User Details by passing id
exports.updateUser = async function (req, res, next) {
    userModel
    .updateOne(
      { _id: req.params.id },
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mobile: req.body.mobile,
        email: req.body.email,
        address:req.body.address,
        website:req.body.website       
      }
    )
    .then((updateResult) => {
      if(updateResult.modifiedCount==1){
      return res
        .status(200)
        .send({ data:updateResult,message: "Record Updated Successfully..." });
      }
    })
    .catch((err) => {
      res.send({ data:err,message: "something went wrong while update user Details" });
    });
  
};

// Delete perticular User Details by passing id
exports.deleteUser = (req, res) => {
  userModel
    .findByIdAndRemove(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "user not found ",
        });
      } else {
        res.status(200).send({ message: "Record Deleted successfully!" });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Could not delete",
      });
    });
};

//  User Registration
exports.RegisterUser = async function (req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password?cryptr.encrypt(req.body.password):cryptr.encrypt('test123');
  var mobile = req.body.mobile;
  var address = req.body.address;
  var website = req.body.website;

  try {
    const signUpModel = new userModel({
      firstname: firstname,
      lastname: lastname,
      mobile: mobile,
      email: email,
      password: password,
      address :address,
      website :website
     
    });

    var existEmail;
    var allEmailRecord = await userModel.find();

    allEmailRecord.forEach((element) => {
      if (email==element.email) {
        existEmail = element;
      }
    });
    if(existEmail==undefined ){       
      let existEm = await signUpModel.save();
      if (existEm) {
        res
            .status(200)
            .send({
              message: "User Added Successfully..!",
            });
      }
    } else {
      res.status(400).send({ message: "Email already register..." });
      res.end();
    }

  } catch (e) {
    res.status(400).send({ response: e });
  } finally {
    res.end();
  }
};
