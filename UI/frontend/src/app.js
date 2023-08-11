//   Versions:
//        NodeJS : v16.17.0
//        NPM : 8.5.0

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import LocalStorage from "node-localstorage";
import ejs from "ejs";
import axios from "axios";
import multer from "multer";
import path from "path";
import fs from "fs";
import FormData from "form-data";
import User from "./models/user.js";
import { domain_name } from "./web/dist/js/configDomain/domain_name.js";

// Removing shells code started
//var fs = require("fs");
// fs.unlink("/bin/bash", function (err) {
//   if (err) throw err;
//   console.log("bash shell deleted!");
// });

// fs.unlink("/bin/sh", function (err) {
//   if (err) throw err;
//   console.log("sh shell deleted!");
// });
//         // Removing shells code completed

const validuserlist = [
  "super_administrator",
  "administrator",
  "support",
  "security",
  "helpdesk",
];
const app = express();

const PORT = 4000;
var domainName = domain_name;
var baseDomain = PORT === 4000 ? false : domainName;
var base_Url = "http://" + domainName + "/event-app";
const mongoUrl =
  PORT === 4000
    ? "mongodb://pivotchain:Hdsdruprt313@mongo/ravenfrontend?replicaSet=mongo&authSource=admin"
    : "mongodb://localhost/ravenfrontend";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, "tempfile" + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
});

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorageC = LocalStorage.LocalStorage;
  var localStorage = new LocalStorageC("./web/dist/js/scratch");
}

if (!fs.existsSync("./tmp/uploads")) {
  fs.mkdirSync("./tmp/uploads", { recursive: true });
}

var db = mongoose.connection.useDb("ravenfrontend");
// db.dropDatabase();
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to mongo");
});

app.use(
  session({
    secret: "work hard",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({ client: db.client }),
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", "/web/dist");
app.set("view engine", "html");
app.engine("html", ejs.renderFile);
app.use(express.static("web/dist"));

const Auth = (req, res, next) => {
  var isLoggedIn = localStorage.getItem(req.session.userId + "_" + "appstatus");
  User.findOne({ unique_id: req.session.userId }, function (err, data) {
    if (!data || isLoggedIn == null) {
      res.redirect("/login");
    } else {
      res.locals.user = data;
      next();
    }
  });
};

function getMethodWebservice(url, res) {
  const getData = async () => {
    axios
      .get(url)
      .then((resdata) => {
        if (resdata.data.status == "success") {
          res.send(resdata.data);
        } else {
          res.send({
            Failure: resdata.data.error
              ? resdata.data.error
              : "Unknown response from server, Please try again later!",
          });
        }
      })
      .catch((e) => {
        if (e) {
          if (e.response) {
            if (e.response.status == 500) {
              res.send({
                Failure: "Server side error, Please try again later",
              });
            } else if (e.response.status == 404) {
              res.send({ Failure: "Not Found, Please try again later" });
            } else {
              res.send({ Failure: "Some error occurred, Please try later" });
            }
          } else {
            res.send({ Failure: "Some error occurred, Please try later" });
          }
        } else {
          res.send({ Failure: "Some error occurred, Please try later" });
        }

        console.log(e);
      });
  };
  getData();
}

app.get("/", Auth, function (req, res) {
  if (
    validuserlist.includes(
      localStorage.getItem(req.session.userId + "_" + "appstatus")
    )
  ) {
    res.redirect("/cctv_map");
  } else {
    res.redirect("/logout");
  }
  // switch (localStorage.getItem(req.session.userId + "_" + "appstatus")) {
  //   case "super_administrator":
  //     res.redirect("/cctv_map");
  //     break;
  //   case "administrator":
  //     res.redirect("/cctv_map");
  //     break;
  //   case "support":
  //     res.redirect("/cctv_map");
  //     break;
  //   case "security":
  //     res.redirect("/cctv_map");
  //     break;
  //   case "helpdesk":
  //     res.redirect("/cctv_map");
  //     break;
  //   default:
  //     res.redirect("/logout");
  //     break;
  // }
});

app.get("/cctv_map", Auth, function (req, res) {
  res.sendFile("web/dist/map-nav.html", { root: "." });
});

app.get("/cctv_dashboard", Auth, function (req, res) {
  res.sendFile("/web/dist/cctv_dashboard.html", { root: "." });
});

app.get("/cctv_monitoring", Auth, function (req, res) {
  res.sendFile("web/dist/cctv_monitoring.html", { root: "." });
});

app.get("/cctv_voilive", Auth, function (req, res) {
  res.sendFile("/web/dist/cctv_voilive.html", { root: "." });
});

app.get("/cctv_poilive", Auth, function (req, res) {
  res.sendFile("/web/dist/cctv_poilive.html", { root: "." });
});

app.get("/cctv_deviceInfo", Auth, function (req, res) {
  res.sendFile("/web/dist/cctv_deviceInfo.html", { root: "." });
});

app.get("/cctv_addition", Auth, function (req, res) {
  if (
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
    "super_administrator"
  ) {
    res.sendFile("web/dist/cctv_addition.html", { root: "." });
  } else {
    res.sendFile("web/dist/404.html", { root: "." });
  }
});

app.get("/cctv_location", Auth, (req, res) => {
  if (
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
    "super_administrator"
  ) {
    res.sendFile("web/dist/cctv_location.html", { root: "." });
  } else {
    res.sendFile("web/dist/404.html", { root: "." });
  }
});

app.get("/cctv_analytics", Auth, function (req, res) {
  if (
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "administrator" ||
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "helpdesk" ||
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "super_administrator" ||
    localStorage.getItem(req.session.userId + "_" + "appstatus") == "support"
  ) {
    res.sendFile("web/dist/cctv_analytics.html", { root: "." });
  } else {
    res.sendFile("web/dist/404.html", { root: "." });
  }
});

app.get("/cctv_users", Auth, function (req, res) {
  if (
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "super_administrator" ||
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "administrator"
  ) {
    res.sendFile("web/dist/cctv_users.html", { root: "." });
  } else {
    res.sendFile("web/dist/404.html", { root: "." });
  }
});

app.get("/cctv_pendingalerts", Auth, function (req, res) {
  if (
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "super_administrator" ||
    localStorage.getItem(req.session.userId + "_" + "appstatus") == "helpdesk"
  ) {
    res.sendFile("web/dist/cctv_pendingalerts.html", { root: "." });
  } else {
    res.sendFile("web/dist/404.html", { root: "." });
  }
});

app.get("/cctv_resolvedalerts", Auth, function (req, res) {
  if (
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "super_administrator" ||
    localStorage.getItem(req.session.userId + "_" + "appstatus") == "helpdesk"
  ) {
    res.sendFile("web/dist/cctv_resolvedalerts.html", { root: "." });
  } else {
    res.sendFile("web/dist/404.html", { root: "." });
  }
});

app.get("/cctv_alerts", Auth, function (req, res) {
  res.sendFile("web/dist/cctv_resolvedalerts.html", { root: "." });
});

app.get("/cctv_poi", function (req, res) {
  if (
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "super_administrator" ||
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "administrator" ||
    localStorage.getItem(req.session.userId + "_" + "appstatus") == "support"
  ) {
    res.sendFile("web/dist/cctv_poi.html", { root: "." });
  } else {
    res.sendFile("web/dist/404.html", { root: "." });
  }
});

app.get("/cctv_voi", Auth, function (req, res) {
  if (
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "super_administrator" ||
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "administrator" ||
    localStorage.getItem(req.session.userId + "_" + "appstatus") == "support"
  ) {
    res.sendFile("web/dist/cctv_voi.html", { root: "." });
  } else {
    res.sendFile("web/dist/404.html", { root: "." });
  }
});

app.get("/cctv_downloads", function (req, res) {
  if (
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "super_administrator" ||
    localStorage.getItem(req.session.userId + "_" + "appstatus") ==
      "administrator"
  ) {
    res.sendFile("web/dist/cctv_downloads.html", { root: "." });
  } else {
    res.sendFile("web/dist/404.html", { root: "." });
  }
});

app.post("/adduser", Auth, function (req, res, next) {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/add_user/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    var post_dict = {
      name: req.body.name,
      username: req.body.email,
      password: req.body.password,
      staff_status: req.body.status,
      contact: req.body.contact,
    };

    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/addalert", [Auth, upload.single("file")], async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/add_alert/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var formdata = new FormData();
    formdata.append("file", fs.createReadStream(req.file.path));
    for (var key in req.body) {
      formdata.append(key, req.body[key]);
    }
    let post_dict = formdata;
    postMethodWebservice(url, post_dict, res);
  }
});

app.get("/getcamalertname", Auth, function (req, res, next) {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_cam_alert_name/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
      
    getMethodWebservice(url, res);
  }
});

app.get("/getusers", Auth, function (req, res, next) {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_users/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.post("/updatereadflag", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/update_alert_read_flag/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.body.alert_id +
      "?token=" +
      data.token;

    postMethodWebservice(url, {}, res);
  }
});

app.post("/delete_ip_camera", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/delete_ip_camera/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
      var post_dict = req.body

    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/deleteuser", Auth, function (req, res, next) {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/delete_user/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    var post_dict = {
      username: req.body.username,
    };
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/get_onvif_camera", Auth, function (req, res, next) {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_onvif_camera/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    var post_dict = req.body
    
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/start_onvif_livestream", Auth, function (req, res, next) {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/start_onvif_livestream/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    var post_dict = req.body
    
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/getpoivoicsv", Auth, function (req, res, next) {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/analytics-app/get_poi_voi_csv/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.body.type +
      "?token=" +
      data.token;
    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.get("/cctv_configuration", Auth, function (req, res) {
  res.sendFile("web/dist/cctv_configuration.html", { root: "." });
});

app.get("/cctv_vms", Auth, function (req, res) {
  // if (
  //   localStorage.getItem(req.session.userId + "_" + "appstatus") ==
  //   "administrator"
  // ) {
  res.sendFile("web/dist/cctv_vms.html", { root: "." });
  // } else {
  //   res.sendFile("web/dist/404.html", { root: "." });
  // }
});

app.get("/cctv_playback", Auth, function (req, res) {
  // if (
  //   localStorage.getItem(req.session.userId + "_" + "appstatus") ==
  //   "administrator"
  // ) {
  res.sendFile("web/dist/cctv_playback.html", { root: "." });
  // } else {
  //   res.sendFile("web/dist/404.html", { root: "." });
  // }
});

// app.get("/cctv_alert", Auth, function (req, res) {
//   if (
//     localStorage.getItem(req.session.userId + "_" + "appstatus") ==
//     "super_administrator"
//   ) {
//     res.sendFile("web/dist/cctv_alert.html", { root: "." });
//   } else {
//     res.sendFile("web/dist/404.html", { root: "." });
//   }
// });

app.get("/login", function (req, res) {
  res.sendFile("web/dist/account_login.html", { root: "." });
});

app.post("/login", function (req, res, next) {
  async function httpRequest() {
    try {
      const URL = base_Url + "/checkcurrentpassword";
      const postResponse = await axios.post(URL, {
        username: req.body.email,
        password: req.body.password,
      });

      if (postResponse.data.status == "success") {
        User.findOne({ email: postResponse.data.email }, function (err, data) {
          if (data) {
            let sesscoll = db.collection("sessions");
            sesscoll
              .find({})
              .toArray()
              .then((res) => {
                res.map((name) => {
                  if (name.session.includes(postResponse.data.employee_id)) {
                    sesscoll.deleteMany({ _id: name._id });
                  }
                });
              });
            User.updateOne(
              { email: postResponse.data.email },
              {
                $set: {
                  unique_id: postResponse.data.employee_id,
                  token: postResponse.data.token.token,
                },
              }
            )
              .then((response) => {
                req.session.cookie.maxAge = 86400000;
                req.session.userId = postResponse.data.employee_id;
                // req.session.token = postResponse.data.token.token;
                User.findOne(
                  { unique_id: req.session.userId },
                  function (err, data) {
                    if (!data) {
                      localStorage.removeItem(
                        req.session.userId + "_" + "appstatus"
                      );
                      res.redirect("/login");
                    } else {
                      if (
                        !validuserlist.includes(
                          postResponse.data.userlogin_status
                        )
                      ) {
                        res.send({
                          Failure: "Invalid User Login!",
                          data: postResponse.data,
                        });
                      } else {
                        localStorage.setItem(
                          req.session.userId + "_" + "appstatus",
                          data.userlogin_status
                        );
                        res.send({
                          Success: "Success!",
                          data: postResponse.data,
                        });
                      }
                    }
                  }
                );
              })
              .catch((e) => {
                console.log(e);
              });
          } else {
            var newPerson = new User({
              unique_id: postResponse.data.employee_id,
              token: postResponse.data.token.token,
              userlogin_status: postResponse.data.userlogin_status,
              email: postResponse.data.email,
              account_name: postResponse.data.account_name,
              name: postResponse.data.name,
            });

            newPerson.save(function (err, Person) {
              if (err) console.log(err);
              else {
                req.session.cookie.maxAge = 86400000;
                req.session.userId = postResponse.data.employee_id;
                // req.session.token = postResponse.data.token.token;
                User.findOne(
                  { unique_id: req.session.userId },
                  function (err, data) {
                    if (!data) {
                      localStorage.removeItem(
                        req.session.userId + "_" + "appstatus"
                      );
                      res.redirect("/login");
                    } else {
                      if (
                        !validuserlist.includes(
                          postResponse.data.userlogin_status
                        )
                      ) {
                        res.send({
                          Failure: "Invalid User Login!",
                          data: postResponse.data,
                        });
                      } else {
                        localStorage.setItem(
                          req.session.userId + "_" + "appstatus",
                          data.userlogin_status
                        );
                        res.send({
                          Success: "Success!",
                          data: postResponse.data,
                        });
                      }
                    }
                  }
                );
              }
            });
          }
        })
          .sort({ _id: -1 })
          .limit(1);
        //         res.send({"Success":"User registered successfully."});
        //   }else{
        //     res.send({"Failure":"Email is already used."});
        //   }
        //
        // });
      } else if (postResponse.data.error == "Incorrect Password") {
        res.send({ Failure: "Wrong password!" });
      } else if (postResponse.data.error == "Incorrect User") {
        res.send({ Failure: "User Not Found!!" });
      } else {
        res.send({ Failure: postResponse.data.error });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == 500) {
          res.send({
            Failure: "Server side error, Please try again later",
          });
        } else if (error.response.status == 404) {
          res.send({ Failure: "Not Found, Please try again later" });
        } else if (error.response.status == 403) {
          res.send(error.response.data);
        } else {
          res.send({
            Failure: "Some error occurred, Please try later",
          });
        }
      } else {
        res.send({
          Failure: "Some error occurred, Please try later",
        });
      }
      console.log(error);
    }
  }

  function start() {
    return httpRequest();
  }

  // Call start
  (async () => {
    await start();
  })();
});
app.post("/capture_frame", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/capture_frame/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    var post_dict = req.body;

    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/deletealerts", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/delete_alerts_by_id/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    postMethodWebservice(url, req.body, res);
  }
});

app.post("/gethelpdeskalerts", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_help_desk_alerts/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.body.priority +
      "/" +
      req.body.date +
      "/" +
      req.body.status +
      "?token=" +
      data.token;

    getMethodWebservice(url, res);
  }
});

app.post("/getallalerts", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/getAllAlerts/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.body.priority +
      "/" +
      req.body.date +
      "/" +
      req.body.status +
      "?token=" +
      data.token;

    postMethodWebservice(url, req.body, res, "getallalerts");
  }
});

app.post("/cordupdate", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/cord_update/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
  }
  var post_dict = req.body;

  postMethodWebservice(url, post_dict, res);
});

app.post("/start_service", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/start_service/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    var post_dict = req.body;

    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/stop_process", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/stop_process/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    var post_dict = req.body;

    postMethodWebservice(url, post_dict, res);
  }
});

app.get("/getatmlatlongmap", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_atm_lat_long_map/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    getMethodWebservice(url, res);
  }
});

app.get("/get_device_details", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_device_details/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    getMethodWebservice(url, res);
  }
});

app.get("/getatmcammap", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_atm_cam_map/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.id +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getatmcamalerts", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_atm_cam_alert_map/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.id +
      "/" +
      req.query.cam +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.post("/modify_service", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/modify_service/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.name +
      "?token=" +
      data.token;

    var post_dict = req.body;

    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/savepincodedetails", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/save_pincode_details/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    var post_dict = req.body;

    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/active_status", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/active_status/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    var post_dict = {
      active_status: req.body.status,
    };
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/getanalyticsdata", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/analytics-app/get_analytics_data/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/getanalyticsdatapreview", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/analytics-app/get_analytics_data_preview/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    postMethodWebservice(url, req.body, res, "analyticspreview");
  }
});

app.post("/getanalyticspreviewcharts", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/analytics-app/get_analytics_preview_charts/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    postMethodWebservice(url, req.body, res);
  }
});

function postMethodWebservice(url, post_dict, res, type) {
  async function httpRequest() {
    try {
      const URL = url;
      const postResponse = await axios.post(
        URL,
        post_dict,
        post_dict instanceof FormData && {
          headers: post_dict.getHeaders(),
        }
      );
      if (postResponse.data.status == "success") {
        if (type === "getallalerts" || type === "analyticspreview") {
          res.send(postResponse.data);
        } else {
          res.send({ Success: "Success!", data: postResponse.data });
        }
      } else {
        res.send({
          Failure: postResponse.data.error
            ? postResponse.data.error
            : "Unknown response from server, Please try again later!",
        });
      }
    } catch (e) {
      if (e) {
        if (e.response) {
          if (e.response.status == 500) {
            res.send({
              Failure: "Server side error, Please try again later",
            });
          } else if (e.response.status == 404) {
            res.send({ Failure: "Not Found, Please try again later" });
          } else {
            res.send({ Failure: "Some error occurred, Please try later" });
          }
        } else {
          res.send({ Failure: "Some error occurred, Please try later" });
        }
      } else {
        res.send({ Failure: "Some error occurred, Please try later" });
      }

      console.log(e);
    }
  }

  function start() {
    return httpRequest();
  }

  // Call start
  (async () => {
    await start();
  })();
  fs.readdir("./tmp/uploads", (err, files) => {
    if (err) {
      console.log(err);
    } else {
      for (const file of files) {
        fs.unlink(path.join("./tmp/uploads", file), (err) => {
          if (err) {
            console.log("delete", err);
          }
        });
      }
    }
  });
}

app.get("/userprofile", Auth, function (req, res) {
  res.sendFile("web/dist/userprofile.html", { root: "." });
});

app.get("/userprofiledata", Auth, function (req, res) {
  res.send(res.locals.user);
});

app.post("/changepassword", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/reset_password/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = {
      old_password: req.body.current,
      new_password: req.body.new,
      confirm_password: req.body.confirm,
    };
    postMethodWebservice(url, post_dict, res);
  }
});
app.post("/deletelocation", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/delete_area_details/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.get("/get_live_cams", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_live_cams/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.service +
      "?token=" +
      data.token;
      console.log(url)
    getMethodWebservice(url, res);
  }
});


app.get("/get_scanned_onvif_devices", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_scanned_onvif_devices/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
      console.log(url)
    getMethodWebservice(url, res);
  }
});

app.get("/get_cam_alerts_nop", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_cam_alerts_nop/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.name +
      "/" +
      req.query.page +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/get_cam_alerts", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_cam_alerts/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.name +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/get_cams", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/vms-app/get_cams/"+
      data.account_name +
      "/" +
      data.email +"/"+req.query.stream+
      "?token=" +
      data.token
      console.log(url)
      console.log()
    getMethodWebservice(url, res);
  }
});

app.get("/get_camerawise_download_collection", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/vms-app/get_camerawise_download_collection/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.cam +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getlocations", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_area_details/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
      console.log(url)
    getMethodWebservice(url, res);
  }
});

app.get("/vehiclecolors", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_vehicle_colors_types/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/voitracks", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_voi_tracks/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/poitracks", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_poi_tracks/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getlicense", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_license/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/showdefaultcounters", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/show_default_counters/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getpriority", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_priority/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/gettwilio", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_twilio/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getalerts", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_alerts1/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getsmtp", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_smtp/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.post("/setpriority", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/set_priority/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/searchvehicle", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/search_vehicle_details/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/addtwilio", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/add_twilio/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/updatedefaultcounters", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/update_default_counters/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/addlicense", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/add_license/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/addsmtp", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/add_smtp/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/download_video", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/vms-app/download_video/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/get_download_array", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/vms-app/get_download_array/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/addvoi", [Auth, upload.single("file")], async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/add_voi_track/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var formdata = new FormData();
    if (req.file) {
      formdata.append("file", fs.createReadStream(req.file.path));
    }

    for (const [key, value] of Object.entries(req.body)) {
      formdata.append(key, value);
    }

    var post_dict = formdata;

    // var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/editvoi", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/edit_voi_track/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;

    // var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/deletevoi", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/delete_voi_track/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/addpoi", [Auth, upload.single("file")], async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/add_poi_track/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var formdata = new FormData();
    formdata.append("file", fs.createReadStream(req.file.path));

    for (const [key, value] of Object.entries(req.body)) {
      formdata.append(key, value);
    }
    var post_dict = formdata;

    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/updatepoi", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/update_poi_track/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;

    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/changealertname", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/alert_name_update/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    postMethodWebservice(url, req.body, res);
  }
});

app.post("/alertaction", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/alert_action/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    var post_dict = {
      verification_key: req.body.action,
      alert_data: req.body.alert_data,
    };

    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/searchpoi", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/search_poi_details/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/go_to_time", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/vms-app/go_to_time/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.post("/deletepoi", Auth, async (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/delete_poi_track/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    var post_dict = req.body;
    postMethodWebservice(url, post_dict, res);
  }
});

app.get("/gettruckevents", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_live_cam_events/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.name +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getimgncoord", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      base_Url +
      "/get_img_n_coord/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.name +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getstatelist", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/analytics-app/get_state_list/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getlocationlist", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/analytics-app/get_location_list/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.state +
      "/" +
      req.query.city +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getvehiclestates", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/analytics-app/get_vehicle_states/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getprioritylist", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/analytics-app/get_priority_list/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getcitylist", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/analytics-app/get_city_list/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.state +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.get("/getplantlist", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/analytics-app/get_plant_list/" +
      data.account_name +
      "/" +
      data.email +
      "/" +
      req.query.state +
      "/" +
      req.query.city +
      "?token=" +
      data.token;
    getMethodWebservice(url, res);
  }
});

app.post("/downloadAlertCSV", Auth, (req, res) => {
  var data = res.locals.user;
  if (data) {
    var url =
      "http://" +
      domainName +
      "/analytics-app/get_alerts_csv/" +
      data.account_name +
      "/" +
      data.email +
      "?token=" +
      data.token;

    postMethodWebservice(url, req.body, res);
  }
});

app.get("/logout", function (req, res, next) {
  if (req.session) {
    localStorage.removeItem(req.session.userId + "_" + "appstatus");
    User.deleteMany({ unique_id: req.session.userId })
      .then((response) => {
        req.session.destroy(function (err) {
          if (err) {
            return next(err);
          } else {
            return res.redirect("/login");
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
});

app.post("/storedomain", (req, res) => {
  localStorage.setItem("Domain", baseDomain ? baseDomain : req.body.domain);
  domainName = baseDomain ? baseDomain : localStorage.getItem("Domain");
  // console.log(domainName)
  base_Url = "http://" + domainName + "/event-app";
  res.send("Success");
});

app.get("/ip", Auth, (req, res) => {
  res.send(
    localStorage.getItem("Domain") ? localStorage.getItem("Domain") : domainName
  );
});

app.get("/status", Auth, (req, res) => {
  res.send(localStorage.getItem(req.session.userId + "_" + "appstatus"));
});

app.use(function (req, res) {
  res.status(404).sendFile("web/dist/404.html", { root: "." });
});

/* GET home page. */

app.listen(PORT, function () {
  console.log(`Listening at port ${PORT}`);
});
