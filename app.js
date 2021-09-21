var express = require('express'),
  ejs = require('ejs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  url = "mongodb://localhost:27017",
  dbName = 'dailytask',
  fileUpload = require('express-fileupload'),
  MongoClient = require('mongodb').MongoClient,
  Server = require('mongodb').Server,
  objectId = require('mongodb').ObjectID,
  assert = require('assert'),
  http = require('http'),
  Swal = require('sweetalert2'),
  fs = require('fs'),
  faker = require('faker'),
  app = express(),
  _date = require('moment'),
  helmet = require('helmet'),
  port = '4000';


app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

//path of website........
app.use(express.static('views'));

app.use(express.static(path.join(__dirname, 'views')));

app.use(fileUpload());

var BaseUrl = "http://localhost:" + port;

// console.log(BaseUrl);
// console.log(url)
app.use(session({
  secret: 'fsd84h547JKNJ989&jndas*(jnjzcz',
  resave: true,
  saveUninitialized: true
}));

app.use(helmet());


// function responseData(file, data, res) {
//   data['BaseUrl'] = BaseUrl;
// data['active'] = typeof sess.active != 'undefined' ? sess.active : 'dashboard';
// res.render(file, data);
// }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = app.listen(port, () => {
  console.log("We are live on " + port);
});


app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', "*");

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  assert.equal(null, err);
  if (err) throw err;
  // console.log(err)
  const db = client.db(dbName);
  console.log("mongodb is connected with database =", dbName)


  //helping to display login failed data........................
  function responseData(file, data, res) {
    data['BaseUrl'] = BaseUrl;
    data['active'] = typeof sess.active != 'undefined' ? sess.active : 'dashboard';
    res.render(file, data);
  }

  app.get('/sssss', (req, res) => {
    if (sess.email) {
      item = {
        email: sess.email
      }
      var c = [];
      db.collection("admin_login").findOne(item, function (err, result) {
        // console.log(result._id);
        db.collection("project").find({ HR: result._id.toString() }).toArray((err, result1) => {
          db.collection("project").find({ PM: result._id.toString() }).toArray((err, result2) => {
            db.collection("project").find({ TL: result._id.toString() }).toArray((err, result3) => {
              if (result1.length > 0) {
                var h = [];
                for (var i = 0; i < result1.length; i++) {
                  h = result1[i].HR
                  c.push(h);
                }
                var data = { data000: c.length }
                return res.send(data)
              } else if (result2.length > 0) {
                var h = [];
                for (var i = 0; i < result2.length; i++) {
                  h = result2[i].HR
                  c.push(h);
                }
                var data = { data000: c.length, leav: 2 }
                return res.send(data)
              } else if (result3.length > 0) {
                var h = [];
                for (var i = 0; i < result3.length; i++) {
                  h = result3[i].HR
                  c.push(h);
                }
                var data = { data000: c.length }
                return res.send(data)
              }
            })
          })
        })
      })
    } else if (sess.emailid) {
      item = {
        emailid: sess.emailid
      }
      var c = [];
      db.collection("employee_login").findOne(item, function (err, result) {
        // console.log(result._id);
        db.collection("project").find({ HR: result._id.toString() }).toArray((err, result1) => {
          db.collection("project").find({ PM: result._id.toString() }).toArray((err, result2) => {
            db.collection("project").find({ TL: result._id.toString() }).toArray((err, result3) => {
              if (result1.length > 0) {
                var h = [];
                for (var i = 0; i < result1.length; i++) {
                  h = result1[i].HR
                  c.push(h);
                }
                var data = { data000: c.length }
                return res.send(data)
              } else if (result2.length > 0) {
                var h = [];
                for (var i = 0; i < result2.length; i++) {
                  h = result2[i].HR
                  c.push(h);
                }
                var data = { data000: c.length }
                return res.send(data)
              } else if (result3.length > 0) {
                var h = [];
                for (var i = 0; i < result3.length; i++) {
                  h = result3[i].HR
                  c.push(h);
                }
                var data = { data000: c.length }
                return res.send(data)
              }
            })
          })
        })
      })
    }
  })

  app.post('/login', (req, res) => {
    sess = req.session;

    var emailid = req.body.emailid;
    var password = req.body.password;

    // console.log('  :: ' + sess)
    // sess.active = 'dashboard';
    if (emailid && password) {
      db.collection("employee_login").findOne({ emailid: emailid, password: password }, function (err, result, fields) {
        db.collection("task").find({ emailid: emailid }).sort({ _id: -1 }).toArray((err, results) => {
          for (var i = 0; i < results.length; i++) {
            results[i].date = _date(results[i].date).format('DD MMMM, YYYY ');
          }
          if (err) {
            console.log(err);
          }

          else if (result) {
            sess.emailid = req.body.emailid;

            res.redirect('/histories/1');
          }
          else {
            responseData('employee/html/login.html', {
              msg: 'email and password not metch',
              msgs: '',
              error: true
            }, res);
          }
          res.end();
        });
      })
    }
    else {
      responseData('employee/html/login.html', {
        msg: '',
        msgs: 'Please Enter Email And Password',
        error: true
      }, res);
      res.end();
    }
  });

  app.get('/histories/:page', (req, res) => {
    sess = req.session;
    if (typeof sess.emailid != 'undefined') {
      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;

      db.collection("employee_login").findOne({ emailid: sess.emailid }, function (err, result) {
        // console.log(result._id);
        db.collection('task').find({ id: result._id.toString() }).count((err, userCount) => {

          db.collection("task").find({ id: result._id.toString() }).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, results) => {

            console.table(results)



            // console.log(results)
            for (var i = 0; i < results.length; i++) {
              results[i].date = _date(results[i].date).format('DD MMMM, YYYY ');

              // console.log(results[i].starttime)
              // console.log(results.length)


              var date1, date2;

              date1 = new Date("01/01/2011 " + results[i].starttime);
              date2 = new Date("01/01/2011 " + results[i].endtime);
              var ss = Math.abs(date1 - date2) / 1000;
              var hours = Math.floor(ss / 3600) % 24;
              var minutes = Math.floor(ss / 60) % 60;

              n = parseInt(hours);
              var hour = hours > 9 ? "" + hours : "0" + hours;

              r = parseInt(minutes);
              var minute = minutes > 9 ? "" + minutes : "0" + minutes;

              results[i].diff = hour + ':' + minute;

            }

            var data = {
              title: "index",
              data: result,
              data1: results
            }
            data['search'] = {};
            data['current'] = page;
            data['pages'] = Math.ceil(userCount / perPage);
            responseData('employee/html/index.html', data, res);

          });
        })
      })
    } else {
      res.redirect('/');
    }
  })

  app.get('/next', function (req, res) {
    sess = req.session;
    if (sess.emailid) {
      res.redirect('/list');
    } else {
      res.redirect('/');
    }
    res.end();
  });


  app.get('/login', (req, res) => {
    responseData('employee/html/login.html', {
      msg: '',
      msgs: '',
      error: true
    }, res);
  });


  app.get('/task', (req, res) => {
    sess = req.session;
    if (typeof sess.emailid != 'undefined') {
      db.collection("employee_login").findOne({ emailid: sess.emailid }, (err, result) => {

        var data = {
          data: result
        }
        responseData('employee/html/dashboard.html', data, res);
      })
    } else {
      res.redirect('/login');
    }
  })





  // app.get('/histories', (req, res) => {
  //   sess = req.session;
  //   if (typeof sess.emailid != 'undefined') {
  //     db.collection("employee_login").findOne({ emailid: sess.emailid }, function (err, results) {
  //       db.collection("task").find({ emailid: sess.emailid }).sort({ _id: -1 }).toArray((err, result) => {
  //         for (var i = 0; i < result.length; i++) {
  //           result[i].date = _date(result[i].date).format('dd MMMM, YYYY ');
  //         }

  //         var data = {
  //           data1: result,
  //           data: results
  //         }
  //         responseData('employee/html/index.html', data, res);
  //       })
  //     })
  //   } else {
  //     res.redirect('/login');
  //   }
  // })

  app.get('/editwork/:_id', function (req, res) {
    sess = req.session;
    if (typeof sess.emailid != 'undefined') {
      db.collection("employee_login").findOne({ emailid: sess.emailid }, function (err, result2) {
        db.collection("task").findOne({ _id: objectId(req.params._id) }, (err, result) => {
          result.date = _date(result.date).format('DD MMMM, YYYY ');

          var data = {
            data1: result,
            data: result2
          }
          responseData('employee/html/notes.html', data, res);
        });
      })
    } else {
      res.redirect('/login');
    }
  });


  app.post('/editworkdone/:_id', function (req, res, next) {
    sess = req.session;

    var datas = {
      starttime: req.body.starttime,
      endtime: req.body.endtime,
      title: req.body.title,
      description: req.body.description,
    };
    var id = req.params._id;
    if (typeof sess.emailid != 'undefined') {
      db.collection('task').updateOne({ _id: objectId(id) }, { $set: datas }, function (err, result) {
        res.redirect('/histories/1')
      })
    }
    else {
      res.redirect('/login');
    }
  })



  // update data.................
  app.post('/inserttask', function (req, res, next) {
    sess = req.session;
    data = req.body;

    var item = {
      id: data.id,
      title: data.title,
      starttime: data.starttime,
      endtime: data.endtime,
      description: data.description,
      note: 'N/A',
      note_status: '',
      edit_status: '0',
      seen: '0',
      notify: '',
      admin_notify: '0',
      date: new Date()
    };
    if (typeof sess.emailid != 'undefined') {
      db.collection("task").insertOne(item, function (err, res1) {
        res.redirect('/histories/1')
      })
    }
    else {
      res.redirect('/login')
    }
  })


  // app.post('/list/searchimage', (req, res) => {
  //   var query = {};
  //   if (req.body.name) {
  //      query.name = {
  //           $regex: req.body.name,
  //           $options: '$i'
  //         }
  //      }

  //   if (req.body.descriptions) {
  //       query.descriptions = {
  //           $regex: req.body.descriptions,
  //           $options: '$i'
  //         }
  //   }
  //   var perPage = 10
  //   var paged = req.params.paged || 1
  //     db.collection("itms_courses").find(query).skip((perPage * paged) - perPage).limit(perPage).toArray(function (err, docs) {
  //          db.collection("image").countDocuments(query, (err, count) => {
  //           // console.log(count)
  //           res.render('usermanagement.html', {
  //             title:"usermanagement",
  //             data1:docs,
  //             data:'',
  //             current: paged,
  //             pagesearch: Math.ceil(count / perPage),
  //             pages:''
  //           });
  //      })
  //    }) 
  //   })  

  app.get('/', (req, res) => {
    sess = req.session;
    sess.active = 'dashboard';

    if (sess.email) {
      res.redirect('/dashboard/1');
    } else if (sess.emailid) {
      res.redirect('/histories/1');
    } else if (typeof req.body.user == 'undefined' || typeof req.body.password == 'undefined') {
      return res.redirect('/login');
    }
  })

  //logout.....................
  app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
      res.redirect('/next');
    })
  })

  ////////////////////////////////////////////////////////---------Admin-side-code--------///////////////////////////////////////////////////////////


  app.post('/adminlogin', (req, res) => {
    sess = req.session;
    // sess.active = 'dashboard';
    var email = req.body.email;
    var password = req.body.password;

    if (email && password) {

      db.collection("admin_login").findOne({ email: email, password: password }, function (err, results) {
        db.collection("task").find().sort({ _id: -1 }).toArray((err, result1) => {
          for (var i = 0; i < result1.length; i++) {
            result1[i].date = _date(result1[i].date).format('DD MMMM, YYYY ');
          }
          if (err) {
            console.log(err);
          }
          else if (results) {
            sess.email = req.body.email;
            // console.log('create email => ',sess.email)
            res.redirect('/dashboard/1');
          }
          else {
            responseData('admin/html/login.html', {
              msg: 'Email and Password Are Incorect!!',
              msgs: '',
              error: true
            }, res);
          }
          res.end();
        });
      })
    } else {
      responseData('admin/html/login.html', {
        msg: '',
        msgs: 'Please Enter Email And Password',
        error: true
      }, res);
      res.end();
    }
  });

  // app.get('/dashboardadmin', (req, res) => {
  //   sess = req.session;
  //   if (typeof sess.email != 'undefined') {

  //     db.collection("admin_login").findOne({ email: sess.email }, function (err, result) {
  //       db.collection("task").find({}).sort({ _id: -1 }).toArray((err, results) => {

  //         for (var i = 0; i < results.length; i++) {
  //           results[i].date = _date(results[i].date).format('DD MMMM, YYYY ');
  //         }
  //         var data = {
  //           title: "index",
  //           data: results,
  //           data1: result
  //         }

  //         responseData('admin/html/index.html', data, res);
  //       });
  //     })
  //   } else {
  //     res.redirect('/admin');
  //   }
  // })


  // app.get('/adminlist', (req, res) => {
  //   sess = req.session;
  //   if (typeof sess.email != 'undefined') {
  //     db.collection("admin_login").findOne({ email: sess.email }, function (err, results) {
  //       db.collection("task").find({}).toArray((err, result1) => {
  //         if (!!err) {
  //           console.log("Error in the query");
  //         } else {
  //           var data = {
  //             title: "index",
  //             data: result1,
  //             data1: results
  //           }
  //           responseData('admin/html/index.html', data, res);

  //         }
  //       })
  //     })
  //   }
  //   else {
  //     res.redirect('/admin');
  //   }
  // })

  app.get('/adminUrl', function (req, res) {
    sess = req.session;
    if (sess.email) {
      res.redirect('/admindata');
    } else {
      res.redirect('/admin');
    }
    res.end();
  });


  app.get('/admin', (req, res) => {
    responseData('admin/html/login.html', {
      msg: '',
      msgs: '',
      error: true
    }, res);
  });


  app.post('/insertuser', function (req, res) {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      message = '';
      if (req.method == "POST") {
        var data = req.body;
        if (!req.files)
          return res.status(400).send('No files were uploaded.');

        var file = req.files.uploaded_image;
        var img_name = Date.now() + '_' + file.name;

        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

          file.mv('views/admin/assets/img/' + img_name, function (err) {

            if (err)
              return res.status(500).send(err);

            var insertData = {
              name: data.name,
              emailid: data.emailid,
              date: new Date(),
              password: data.password,
              mobile: data.mobile,
              image: img_name
            }
            db.collection("employee_login").insertOne(insertData, function (err, result) {
              db.collection("admin_login").findOne({ email: sess.email }, function (err, result2) {
                db.collection("employee_login").find({}).toArray((err, result1) => {
                  var data = {
                    title: "index",
                    data: result1,
                    data1: result2
                  }
                  responseData('admin/html/user.html', data, res);
                });
              })
            })
          });
        } else {
          message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
          res.render('index.ejs', { message: message });
        }
      } else {
        res.render('index');
      }
    } else {
      res.redirect('/admin');
    }
  });

  app.get('/seen', (req, res) => {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      db.collection('task').updateMany({ seen: '0' }, { $set: { seen: '1' } }, function (err, result3) {
        var data = { data: result3 }
        res.redirect('/dashboard/1')
      })
    } else {
      res.redirect('/admin')
    }
  })

  app.post('/projects', function (req, res, next) {
    sess = req.session;
    data = req.body;

    var item = {
      HR: data.HR,
      PM: data.PM,
      TL: data.TL,
      EMPLOYEE: data.EMPLOYEE,
      date: new Date()
    };

    if (typeof sess.email != 'undefined') {
      db.collection("project").findOne({ EMPLOYEE: data.EMPLOYEE }, function (err, res1) {
        if (!res1) {
          db.collection("project").insertOne(item, function (err, res2) {
            res.redirect('/user');
          })
        } else {
          db.collection("project").updateOne({ EMPLOYEE: data.EMPLOYEE }, { $set: item }, function (err, res2) {
            res.redirect('/user');
          })
        }
      })
    }
    else {
      res.redirect('/login')
    }
  })

  app.get('/project', (req, res) => {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      db.collection("admin_login").findOne({ email: sess.email }, function (err, result) {
        db.collection('employee_login').find({}).toArray((err, result1) => {
          console.log(result1)
          var data = {
            data1: result,
            data2: result1
          }
          responseData('admin/html/leave.html', data, res);
        })
      })
    } else {
      res.redirect('/admin')
    }
  })

  app.post('/leaves', (req, res) => {
    sess = req.session;
    data = req.body;

    if (typeof sess.emailid != 'undefined') {

      db.collection("project").findOne({ EMPLOYEE: data.id }, function (err, result) {
        console.log(result.id);

        if (result.TL == data.id) {

          var item = {
            id: data.id,
            starttime: data.starttime,
            endtime: data.endtime,
            reason: data.reason,
            HR: '0',
            PM: '0',
            date: new Date()
          };
          db.collection("leave").insertOne(item);
          return res.redirect("/leave")

        } else if (result.PM == data.id) {

          var item = {
            id: data.id,
            starttime: data.starttime,
            endtime: data.endtime,
            reason: data.reason,
            HR: '0',
            date: new Date()
          };
          db.collection("leave").insertOne(item);
          return res.redirect("/leave")

        } else {

          var item = {
            id: data.id,
            starttime: data.starttime,
            endtime: data.endtime,
            reason: data.reason,
            HR: '0',
            PM: '0',
            TL: '0',
            date: new Date()
          };
          db.collection("leave").insertOne(item);
          return res.redirect("/leave")

        }

      })

    } else if (typeof sess.email != 'undefined') {

      db.collection("project").findOne({ EMPLOYEE: data.id }, function (err, result) {

        if (result.TL == data.id) {

          var item = {
            id: data.id,
            starttime: data.starttime,
            endtime: data.endtime,
            reason: data.reason,
            HR: '0',
            PM: '0',
            date: new Date()
          };
          db.collection("leave").insertOne(item);
          return res.redirect("/leave")

        } else if (result.PM == data.id) {

          var item = {
            id: data.id,
            starttime: data.starttime,
            endtime: data.endtime,
            reason: data.reason,
            HR: '0',
            date: new Date()
          };
          db.collection("leave").insertOne(item);
          return res.redirect("/leave")

        } else {

          var item = {
            id: data.id,
            starttime: data.starttime,
            endtime: data.endtime,
            reason: data.reason,
            HR: '0',
            PM: '0',
            TL: '0',
            date: new Date()
          };
          db.collection("leave").insertOne(item);
          return res.redirect("/leave")

        }

      })

    }

  })

  app.get('/unseen', (req, res) => {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      db.collection("task").countDocuments({ seen: '0' }, (err, result3) => {
        var data = { data: result3 }
        return res.send(data)
      })
    } else {
      res.redirect('/admin')
    }
  })


  app.get('/admin_notify', (req, res) => {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      db.collection("employee_login").find({}, function (err, result) {
        db.collection("task").find({ admin_notify: '0' }).toArray((err, result1) => {

          db.collection("employee_login").find({}).sort({ _id: -1 }).toArray((err, result2) => {
            var dta = [];
            var cc = [];
            for (var i = 0; i < result1.length; i++) {
              dta = {
                _id: result1[i]['_id'],
                title: result1[i]['title'],
                starttime: result1[i]['starttime'],
                endtime: result1[i]['endtime'],
                description: result1[i]['description'],
                date: result1[i]['date'],
                note: result1[i]['note'],
                note_status: result1[i]['note_status'],
                edit_status: result1[i]['edit_status']
              }
              for (var j = 0; j < result2.length; j++) {
                if (result1[i]['id'] == result2[j]['_id']) {
                  dta['name'] = result2[j]['name'];
                  dta['emailid'] = result2[j]['emailid'];
                  dta['image'] = result2[j]['image']
                }
              }
              cc.push(dta)
            }
            var data = {
              data: result1.length,
              data1: cc,
            }
            return res.send(data)
          })
        })
      })
    } else {
      res.redirect('/admin')
    }
  })

  app.get('/admin_notify_update', (req, res) => {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      db.collection('task').updateMany({ admin_notify: '0' }, { $set: { admin_notify: '1' } });
    } else {
      res.redirect('/admin')
    }
  })

  app.get('/unseen_note', (req, res) => {
    sess = req.session;
    if (typeof sess.emailid != 'undefined') {
      db.collection("employee_login").findOne({ emailid: sess.emailid }, function (err, result) {
        db.collection("task").find({ id: result._id.toString(), note_status: '0' }).toArray((err, result1) => {
          var data = {
            data: result1.length
          }
          return res.send(data)
        })
      })
    } else {
      res.redirect('/admin')
    }
  })

  app.get('/notify_update', (req, res) => {
    sess = req.session;
    if (typeof sess.emailid != 'undefined') {
      db.collection('task').updateMany({ notify: '0' }, { $set: { notify: '1' } });
    } else {
      res.redirect('/admin')
    }
  })

  app.get('/notify', (req, res) => {
    sess = req.session;
    if (typeof sess.emailid != 'undefined') {
      db.collection("employee_login").findOne({ emailid: sess.emailid }, function (err, result) {
        db.collection("task").find({ id: result._id.toString(), notify: '0' }).toArray((err, result1) => {

          db.collection("employee_login").find({}).sort({ _id: -1 }).toArray((err, result2) => {
            var dta = [];
            var cc = [];
            for (var i = 0; i < result1.length; i++) {
              dta = {
                _id: result1[i]['_id'],
                title: result1[i]['title'],
                starttime: result1[i]['starttime'],
                endtime: result1[i]['endtime'],
                description: result1[i]['description'],
                date: result1[i]['date'],
                note: result1[i]['note'],
                note_status: result1[i]['note_status'],
                edit_status: result1[i]['edit_status']
              }
              for (var j = 0; j < result2.length; j++) {
                if (result1[i]['id'] == result2[j]['_id']) {
                  dta['name'] = result2[j]['name'];
                  dta['emailid'] = result2[j]['emailid'];
                  dta['image'] = result2[j]['image']
                }
              }
              cc.push(dta)
            }
            var data = {
              data: result1.length,
              data1: cc,
            }
            return res.send(data)
          })
        })
      })
    } else {
      res.redirect('/admin')
    }
  })

  app.get('/update_note', (req, res) => {
    sess = req.session;
    if (typeof sess.emailid != 'undefined') {
      db.collection("employee_login").findOne({ emailid: sess.emailid }, function (err, result) {
        db.collection('task').updateMany({ id: result._id.toString(), note_status: '0' }, { $set: { note_status: '1' } }, function (err, result3) {
          var data = { data: result3 }
          res.redirect('/histories/1')
        })
      })
    } else {
      res.redirect('/admin')
    }
  })


  app.get('/dashboard/:page', (req, res) => {
    sess = req.session;
    // console.log(sess.email)
    if (typeof sess.email != 'undefined') {
      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;
      db.collection('task').countDocuments((err, userCount) => {
        db.collection("admin_login").findOne({ email: sess.email }, function (err, results) {
          db.collection("task").find({}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, result1) => {
            db.collection("employee_login").find({}).toArray((err, result2) => {
              // console.log(result3)

              var dta = [];
              var cc = [];
              for (var i = 0; i < result1.length; i++) {
                dta = {
                  _id: result1[i]['_id'],
                  title: result1[i]['title'],
                  starttime: result1[i]['starttime'],
                  endtime: result1[i]['endtime'],
                  description: result1[i]['description'],
                  date: result1[i]['date'],
                  note: result1[i]['note'],
                  note_status: result1[i]['note_status'],
                  edit_status: result1[i]['edit_status']
                }
                for (var j = 0; j < result2.length; j++) {
                  if (result1[i]['id'] == result2[j]['_id']) {
                    dta['name'] = result2[j]['name'];
                    dta['emailid'] = result2[j]['emailid'];
                    dta['image'] = result2[j]['image']
                  }
                }

                var date1, date2, diff;
                date1 = new Date("01/01/2011 " + result1[i].starttime);
                date2 = new Date("01/01/2011 " + result1[i].endtime);
                var ss = Math.abs(date1 - date2) / 1000;
                var hours = Math.floor(ss / 3600) % 24;
                var minutes = Math.floor(ss / 60) % 60;

                n = parseInt(hours);
                var hour = hours > 9 ? "" + hours : "0" + hours;

                r = parseInt(minutes);
                var minute = minutes > 9 ? "" + minutes : "0" + minutes;

                dta['diff'] = hour + ':' + minute;
                cc.push(dta)
              }

              for (var i = 0; i < cc.length; i++) {
                cc[i].date = _date(cc[i].date).format('DD MMMM, YYYY ');
              }

              var data = {
                title: "index",
                data: cc,
                data1: results
              }
              // data['data'] = result1;
              // data['data1'] = results;
              data['search'] = {};
              data['current'] = page;
              data['pages'] = Math.ceil(userCount / perPage);

              responseData('admin/html/index.html', data, res);
            })
          })
        })
      })
    } else {
      res.redirect('/admin');
    }
  })

  // app.get('/ff', (req, res) => {
  //   db.collection("employee_login").find({}).toArray((err, result2) => {
  //     db.collection("admin_login").find({}).toArray((err, result4) => {
  //       var c=[], v=[], y=[], z=[], b=[];
  //       for (var i = 0; i < result2.length; i++) {
  //         c = {
  //           _id: result2[i]['_id'],
  //           name: result2[i]['name']
  //         }
  //         y.push(c)
  //       }
  //       for (var i = 0; i < result4.length; i++) {
  //         v = {
  //           _id: result4[i]['_id'],
  //           name: result4[i]['name']
  //         }
  //         z.push(v)
  //       }
  //       b= y.concat(z); 

  //     })
  //   })
  // })

  app.get('/leavs/:page', (req, res) => {
    sess = req.session;
    // console.log(sess.email)
    if (typeof sess.email != 'undefined') {
      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;
      db.collection('leave').countDocuments((err, userCount) => {
        db.collection("admin_login").findOne({ email: sess.email }, function (err, results) {
          db.collection("leave").find({}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, result1) => {
            db.collection("employee_login").find({}).toArray((err, result2) => {
              db.collection("admin_login").find({}).toArray((err, result4) => {
                db.collection("project").find({ HR: results._id.toString() }).toArray((err, HRR) => {
                  db.collection("project").find({ PM: results._id.toString() }).toArray((err, PMM) => {
                    db.collection("project").find({ TL: results._id.toString() }).toArray((err, TLL) => {
                      // db.collection("project").findOne({ 'EMPLOYEE': results._id.toString() }, (err, employee) => {

                        if(HRR.length > 0) {
                          db.collection("project").findOne({HR: results._id.toString() }, (err, employee) => {
                            db.collection("project").find({ 'HR': employee.HR}).sort({ _id: -1 }).toArray((err, project) => {
                            var dd = [];
                            for(var i = 0; i < project.length; i++){
                              dd.push(project[i]['EMPLOYEE'], project[i]['TL'], project[i]['PM'])
                            }
                            db.collection("leave").find({$and:[ 
                              {id :{$in: dd}}, 
                              {id :{$nin: [employee.HR]}}
                            ]}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, result1) => {
                              // console.log('4')

                              var c=[], v=[], y=[], z=[], b=[];
                              for (var i = 0; i < result2.length; i++) {
                                c = {
                                  _id: result2[i]['_id'],
                                  name: result2[i]['name'],
                                  emailid: result2[i]['emailid'],
                                  image: result2[i]['image']
                                }
                                y.push(c)
                              }
                              for (var i = 0; i < result4.length; i++) {
                                v = {
                                  _id: result4[i]['_id'],
                                  name: result4[i]['name'],
                                  emailid: result4[i]['emailid'],
                                  image: result4[i]['image']
                                }
                                z.push(v)
                              }
                              b = y.concat(z); 

                              var dta = [];
                              var cc = [];
                              for (var i = 0; i < result1.length; i++) {

                                dta = {
                                  _id: result1[i]['_id'],
                                  starttime: result1[i]['starttime'],
                                  endtime: result1[i]['endtime'],
                                  reason: result1[i]['reason'],
                                  date: result1[i]['date'],
                                  HR: result1[i]['HR'],
                                  PM: result1[i]['PM'],
                                  TL: result1[i]['TL'],
                                  HRPMTL: result1[i]['HR']
                                }
                                for (var j = 0; j < b.length; j++) {
                                  if (result1[i]['id'] == b[j]['_id']) {
                                    dta['name'] = b[j]['name'];
                                    dta['emailid'] = b[j]['emailid'];
                                    dta['image'] = b[j]['image'];
                                  }
                                }

                                var date1, date2;
                                date1 = new Date(result1[i].starttime);
                                date2 = new Date(result1[i].endtime);
                                var ss = Math.abs(date1 - date2) / 1000;
                                var hours = Math.floor(ss / 3600) % 24;
                                var days = Math.floor(ss / 86400);
                                var minutes = Math.floor(ss / 60) % 60;

                                n = parseInt(hours);
                                var hour = hours > 9 ? "" + hours : "0" + hours;
                                r = parseInt(minutes);
                                var minute = minutes > 9 ? "" + minutes : "0" + minutes;
                                dta['diff'] = days + ' day ' + hour + ':' + minute;
                                cc.push(dta)
                              }

                              for (var i = 0; i < cc.length; i++) {
                                cc[i].date = _date(cc[i].date).format('DD MMMM, YYYY ');
                              }

                              var data = {
                                title: "index",
                                data: cc,
                                data1: results,
                              }
                              data['search'] = {};
                              data['current'] = page;
                              data['pages'] = Math.ceil(userCount / perPage);

                              responseData('admin/html/leave.html', data, res);
                            })
                          })
                        })
                      }else if (PMM.length > 0) {
                        db.collection("project").findOne({ 'PM': results._id.toString() }, (err, employee) => {
                          db.collection("project").find({PM: employee.PM}).sort({ _id: -1 }).toArray((err, project) => {
                            var dd = [];
                            for(var i = 0; i < project.length; i++){
                              dd.push(project[i]['EMPLOYEE'], project[i]['TL'])
                            }
                            db.collection("leave").find({$and:[ 
                              {id :{$in: dd}}, 
                              {id :{$nin: [employee.PM, employee.HR]}}
                            ]}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, result1) => {

                              var dta = [];
                              var cc = [];
                              for (var i = 0; i < result1.length; i++) {

                                dta = {
                                  _id: result1[i]['_id'],
                                  starttime: result1[i]['starttime'],
                                  endtime: result1[i]['endtime'],
                                  reason: result1[i]['reason'],
                                  date: result1[i]['date'],
                                  HR: result1[i]['HR'],
                                  PM: result1[i]['PM'],
                                  TL: result1[i]['TL'],
                                  HRPMTL: result1[i]['PM']
                                }
                                for (var j = 0; j < result2.length; j++) {
                                  if (result1[i]['id'] == result2[j]['_id']) {
                                    dta['name'] = result2[j]['name'];
                                    dta['emailid'] = result2[j]['emailid'];
                                    dta['image'] = result2[j]['image']
                                  }
                                }

                                var date1, date2;
                                date1 = new Date(result1[i].starttime);
                                date2 = new Date(result1[i].endtime);
                                var ss = Math.abs(date1 - date2) / 1000;
                                var hours = Math.floor(ss / 3600) % 24;
                                var days = Math.floor(ss / 86400);
                                var minutes = Math.floor(ss / 60) % 60;

                                n = parseInt(hours);
                                var hour = hours > 9 ? "" + hours : "0" + hours;
                                r = parseInt(minutes);
                                var minute = minutes > 9 ? "" + minutes : "0" + minutes;
                                dta['diff'] = days + ' day ' + hour + ':' + minute;
                                cc.push(dta)
                              }

                              for (var i = 0; i < cc.length; i++) {
                                cc[i].date = _date(cc[i].date).format('DD MMMM, YYYY ');
                              }

                              var data = {
                                title: "index",
                                data: cc,
                                data1: results,
                              }
                              data['search'] = {};
                              data['current'] = page;
                              data['pages'] = Math.ceil(userCount / perPage);

                              responseData('admin/html/leave.html', data, res);
                            })
                          })
                        })
                      } else if (TLL.length > 0) {
                          db.collection("project").findOne({ 'TL': results._id.toString() }, (err, employee) => {
                            db.collection("project").find({TL: employee.TL}).sort({ _id: -1 }).toArray((err, project) => {
                            var dd = [];
                              for(var i = 0; i < project.length; i++){
                               
                                dd.push(project[i]['EMPLOYEE'])
                              }
                                db.collection("leave").find({$and:[ 
                                  {id :{$in: dd}}, 
                                  {id :{$nin: [employee.TL, employee.PM, employee.HR]}}
                                ]}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, result1) => {
                              var dta = [];
                              var cc = [];
                              for (var i = 0; i < result1.length; i++) {

                                dta = {
                                  _id: result1[i]['_id'],
                                  starttime: result1[i]['starttime'],
                                  endtime: result1[i]['endtime'],
                                  reason: result1[i]['reason'],
                                  date: result1[i]['date'],
                                  HR: result1[i]['HR'],
                                  PM: result1[i]['PM'],
                                  TL: result1[i]['TL'],
                                  HRPMTL: result1[i]['TL']
                                }
                                for (var j = 0; j < result2.length; j++) {
                                  if (result1[i]['id'] == result2[j]['_id']) {
                                    dta['name'] = result2[j]['name'];
                                    dta['emailid'] = result2[j]['emailid'];
                                    dta['image'] = result2[j]['image']
                                  }
                                }

                                var date1, date2;
                                date1 = new Date(result1[i].starttime);
                                date2 = new Date(result1[i].endtime);
                                var ss = Math.abs(date1 - date2) / 1000;
                                var hours = Math.floor(ss / 3600) % 24;
                                var days = Math.floor(ss / 86400);
                                var minutes = Math.floor(ss / 60) % 60;

                                n = parseInt(hours);
                                var hour = hours > 9 ? "" + hours : "0" + hours;
                                r = parseInt(minutes);
                                var minute = minutes > 9 ? "" + minutes : "0" + minutes;
                                dta['diff'] = days + ' day ' + hour + ':' + minute;
                                cc.push(dta)
                              }

                              for (var i = 0; i < cc.length; i++) {
                                cc[i].date = _date(cc[i].date).format('DD MMMM, YYYY ');
                              }

                              var data = {
                                title: "index",
                                data: cc,
                                data1: results,
                              }
                              data['search'] = {};
                              data['current'] = page;
                              data['pages'] = Math.ceil(userCount / perPage);

                              responseData('admin/html/leave.html', data, res);
                            })
                          })
                          })
                        }
                      })
                    })
                  })
                })
              })
            })
          })
        })
      // })
    } else if (sess.emailid) {
      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;
      db.collection('leave').countDocuments((err, userCount) => {
        db.collection("employee_login").findOne({ emailid: sess.emailid }, function (err, results) {
          // db.collection("leave").find({'id' : { $nin : [results._id.toString()]}}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, result1) => {
          db.collection("employee_login").find({}).toArray((err, result2) => {
            db.collection("project").find({ HR: results._id.toString() }).toArray((err, HRR) => {
              db.collection("project").find({ PM: results._id.toString() }).toArray((err, PMM) => {
                db.collection("project").find({ TL: results._id.toString() }).toArray((err, TLL) => {
                  db.collection("project").findOne({ 'EMPLOYEE': results._id.toString() }, (err, employee) => {
                    if (HRR.length > 0) {
                      db.collection("leave").find({ 'id': { $nin: [employee.HR] } }).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, result1) => {
                        var dta = [];
                        var cc = [];
                        for (var i = 0; i < result1.length; i++) {

                          dta = {
                            _id: result1[i]['_id'],
                            starttime: result1[i]['starttime'],
                            endtime: result1[i]['endtime'],
                            reason: result1[i]['reason'],
                            date: result1[i]['date'],
                            HR: result1[i]['HR'],
                            PM: result1[i]['PM'],
                            TL: result1[i]['TL'],
                            HRPMTL: result1[i]['HR']
                          }
                          for (var j = 0; j < result2.length; j++) {
                            if (result1[i]['id'] == result2[j]['_id']) {
                              dta['name'] = result2[j]['name'];
                              dta['emailid'] = result2[j]['emailid'];
                              dta['image'] = result2[j]['image']
                            }
                          }

                          var date1, date2;
                          date1 = new Date(result1[i].starttime);
                          date2 = new Date(result1[i].endtime);
                          var ss = Math.abs(date1 - date2) / 1000;
                          var hours = Math.floor(ss / 3600) % 24;
                          var days = Math.floor(ss / 86400);
                          var minutes = Math.floor(ss / 60) % 60;

                          n = parseInt(hours);
                          var hour = hours > 9 ? "" + hours : "0" + hours;
                          r = parseInt(minutes);
                          var minute = minutes > 9 ? "" + minutes : "0" + minutes;
                          dta['diff'] = days + ' day ' + hour + ':' + minute;
                          cc.push(dta)
                        }

                        for (var i = 0; i < cc.length; i++) {
                          cc[i].date = _date(cc[i].date).format('DD MMMM, YYYY ');
                        }

                        var data = {
                          title: "index",
                          data1: cc,
                          data: results,
                        }
                        data['search'] = {};
                        data['current'] = page;
                        data['pages'] = Math.ceil(userCount / perPage);

                        responseData('employee/html/leave.html', data, res);
                      })
                    } else if (PMM.length > 0) {
                      db.collection("project").findOne({ 'PM': results._id.toString() }, (err, employee) => {
                      db.collection("project").find({PM: employee.PM}).sort({ _id: -1 }).toArray((err, project) => {
                        var dd = [];
                          for(var i = 0; i < project.length; i++){
                            dd.push(project[i]['EMPLOYEE'], project[i]['TL'])
                          }
                      db.collection("leave").find({$and:[ 
                        {id :{$in: dd}}, 
                        {id :{$nin: [employee.PM, employee.HR]}}
                      ]}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, result1) => {
                        var dta = [];
                        var cc = [];
                        for (var i = 0; i < result1.length; i++) {

                          dta = {
                            _id: result1[i]['_id'],
                            starttime: result1[i]['starttime'],
                            endtime: result1[i]['endtime'],
                            reason: result1[i]['reason'],
                            date: result1[i]['date'],
                            HR: result1[i]['HR'],
                            PM: result1[i]['PM'],
                            TL: result1[i]['TL'],
                            HRPMTL: result1[i]['PM']
                          }
                          for (var j = 0; j < result2.length; j++) {
                            if (result1[i]['id'] == result2[j]['_id']) {
                              dta['name'] = result2[j]['name'];
                              dta['emailid'] = result2[j]['emailid'];
                              dta['image'] = result2[j]['image']
                            }
                          }

                          var date1, date2;
                          date1 = new Date(result1[i].starttime);
                          date2 = new Date(result1[i].endtime);
                          var ss = Math.abs(date1 - date2) / 1000;
                          var hours = Math.floor(ss / 3600) % 24;
                          var days = Math.floor(ss / 86400);
                          var minutes = Math.floor(ss / 60) % 60;

                          n = parseInt(hours);
                          var hour = hours > 9 ? "" + hours : "0" + hours;
                          r = parseInt(minutes);
                          var minute = minutes > 9 ? "" + minutes : "0" + minutes;
                          dta['diff'] = days + ' day ' + hour + ':' + minute;
                          cc.push(dta)
                        }

                        for (var i = 0; i < cc.length; i++) {
                          cc[i].date = _date(cc[i].date).format('DD MMMM, YYYY ');
                        }

                        var data = {
                          title: "index",
                          data1: cc,
                          data: results,
                        }
                        data['search'] = {};
                        data['current'] = page;
                        data['pages'] = Math.ceil(userCount / perPage);

                        responseData('employee/html/leave.html', data, res);
                      })
                      })
                    })
                    } else if (TLL.length > 0) {


                    db.collection("project").findOne({ 'TL': results._id.toString() }, (err, employee) => {

                      for (var l = 0; l < employee.length; l++) {
                        console.log("employee", employee[l].EMPLOYEE);
                        console.log("TL", employee[l].TL)
                        console.log("PM", employee[l].PM)
                      }

                      db.collection("project").find({TL: employee.TL}).sort({ _id: -1 }).toArray((err, project) => {
                        var dd = [];
                          for(var i = 0; i < project.length; i++){
                           
                            dd.push(project[i]['EMPLOYEE'])
                          }
                      db.collection("leave").find({$and:[ 
                        {id :{$in: dd}}, 
                        {id :{$nin: [employee.TL, employee.PM, employee.HR]}}
                      ]}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, result1) => {

                       console.log(result1);
                        var dta = [];
                        var cc = [];
                        for (var i = 0; i < result1.length; i++) {

                          dta = {
                            _id: result1[i]['_id'],
                            starttime: result1[i]['starttime'],
                            endtime: result1[i]['endtime'],
                            reason: result1[i]['reason'],
                            date: result1[i]['date'],
                            HR: result1[i]['HR'],
                            PM: result1[i]['PM'],
                            TL: result1[i]['TL'],
                            HRPMTL: result1[i]['TL']
                          }
                          for (var j = 0; j < result2.length; j++) {
                            if (result1[i]['id'] == result2[j]['_id']) {
                              dta['name'] = result2[j]['name'];
                              dta['emailid'] = result2[j]['emailid'];
                              dta['image'] = result2[j]['image']
                            }
                          }

                          var date1, date2;
                          date1 = new Date(result1[i].starttime);
                          date2 = new Date(result1[i].endtime);
                          var ss = Math.abs(date1 - date2) / 1000;
                          var hours = Math.floor(ss / 3600) % 24;
                          var days = Math.floor(ss / 86400);
                          var minutes = Math.floor(ss / 60) % 60;

                          n = parseInt(hours);
                          var hour = hours > 9 ? "" + hours : "0" + hours;
                          r = parseInt(minutes);
                          var minute = minutes > 9 ? "" + minutes : "0" + minutes;
                          dta['diff'] = days + ' day ' + hour + ':' + minute;
                          cc.push(dta)
                        }

                        for (var i = 0; i < cc.length; i++) {
                          cc[i].date = _date(cc[i].date).format('DD MMMM, YYYY ');
                        }

                        var data = {
                          title: "index",
                          data1: cc,
                          data: results,
                        }
                        data['search'] = {};
                        data['current'] = page;
                        data['pages'] = Math.ceil(userCount / perPage);

                        responseData('employee/html/leave.html', data, res);
                      })
                        })
                      })
                    }
                  })
                })
              })
            })
          })
        })
      })
    } else {
      res.redirect('/logoutadmin');
    }
  })

  app.get('/deleteleave/:_id', (req, res) => {
    sess.session;
    if (typeof sess.emailid != 'undefined') {
      db.collection('leave').deleteOne({ _id: objectId(req.params._id) }, (err, deletes) => {
        res.redirect('/leave');
      })
    } else if (typeof sess.email != 'undefined') {
      db.collection('leave').deleteOne({ _id: (objectId(req.params._id)) }, (err, deletes) => {
        res.redirect('/leave');
      })
    } else {
      res.redirect('/');
    }
  })

  app.get('/leave', (req, res) => {
    sess = req.session;
    if (typeof sess.email != 'undefined') {

      db.collection("admin_login").findOne({ email: sess.email }, function (err, result) {
        db.collection('leave').find({ id: result._id.toString() }).sort({ _id: -1 }).toArray((err, results) => {
          for (var i = 0; i < results.length; i++) {
            results[i].date = _date(results[i].date).format('DD MMMM, YYYY ');

            console.log(results[i].starttime)
            console.log(results.length)

            var date1, date2;
            date1 = new Date(results[i].starttime);
            date2 = new Date(results[i].endtime);
            var ss = Math.abs(date1 - date2) / 1000;
            var hours = Math.floor(ss / 3600) % 24;
            var days = Math.floor(ss / 86400);
            var minutes = Math.floor(ss / 60) % 60;

            n = parseInt(hours);
            var hour = hours > 9 ? "" + hours : "0" + hours;
            r = parseInt(minutes);
            var minute = minutes > 9 ? "" + minutes : "0" + minutes;
            results[i].diff = days + ' Day ' + hour + ':' + minute;
          }

          var data = {
            title: "index",
            data1: result,
            data: results
          }
          responseData('admin/html/leav.html', data, res);
        })
      })
    } else if (typeof sess.emailid != 'undefined') {

      db.collection("employee_login").findOne({ emailid: sess.emailid }, function (err, result) {
        db.collection('leave').find({ id: result._id.toString() }).sort({ _id: -1 }).toArray((err, results) => {
          for (var i = 0; i < results.length; i++) {
            results[i].date = _date(results[i].date).format('DD MMMM, YYYY ');

            console.log(results[i].starttime)
            console.log(results.length)

            var date1, date2;
            date1 = new Date(results[i].starttime);
            date2 = new Date(results[i].endtime);
            var ss = Math.abs(date1 - date2) / 1000;
            var hours = Math.floor(ss / 3600) % 24;
            var days = Math.floor(ss / 86400);
            var minutes = Math.floor(ss / 60) % 60;

            n = parseInt(hours);
            var hour = hours > 9 ? "" + hours : "0" + hours;
            r = parseInt(minutes);
            var minute = minutes > 9 ? "" + minutes : "0" + minutes;
            results[i].diff = days + ' Day ' + hour + ':' + minute;
          }

          var data = {
            title: "index",
            data: result,
            data1: results
          }
          responseData('employee/html/leav.html', data, res);
        })
      })
    } else {
      res.redirect('/');
    }
  })

  app.get('/addnote/:_id', function (req, res) {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      db.collection("task").findOne({ _id: objectId(req.params._id) }, (err, result) => {
        result.date = _date(result.date).format('DD MMMM, YYYY ');
        db.collection("admin_login").findOne({ email: sess.email }, function (err, result2) {
          var data = {
            title: "index",
            data: result,
            data1: result2
          }
          responseData('admin/html/notes.html', data, res);
        })
      })
    } else {
      res.redirect('/admin');
    }
  })


  app.post('/updatenote/:_id', function (req, res, next) {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      var id = req.params._id;
      var datas = {
        note: req.body.note,
        note_status: "0",
        notify: "0"
      };
      db.collection('task').updateOne({ _id: objectId(id) }, { $set: datas }, function (err, results) {
        db.collection("admin_login").findOne({ email: sess.email }, function (err, result1) {
          res.redirect('/dashboard/1');
        })
      })
    } else {
      res.redirect('/admin');
    }
  })


  app.get('/approve/:_id', function (req, res) {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      db.collection('task').updateOne({ _id: objectId(req.params._id) }, { $set: { edit_status: '1' } }, function (err, results) {
        db.collection("admin_login").findOne({ email: sess.email }, function (err, result1) {
          res.redirect('/dashboard/1');
        })
      })
    } else {
      res.redirect('/admin');
    }
  })

  app.get('/leaveapprove/:_id', function (req, res) {
    sess = req.session;

    if (typeof sess.email != 'undefined') {
      db.collection("admin_login").findOne({ email: sess.email }, function (err, result) {
        db.collection("project").find({ HR: result._id.toString() }).toArray((err, result1) => {
          if (result1.length > 0) {
            db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { HR: '1' } }, function (err, results) {
              res.redirect('/leavs/1');
            })
          }

          db.collection("project").find({ PM: result._id.toString() }).toArray((err, result1) => {
            if (result1.length > 0) {
              db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { PM: '1' } }, function (err, results) {
                res.redirect('/leavs/1');
              })
            }

            db.collection("project").find({ TL: result._id.toString() }).toArray((err, result1) => {
              if (result1.length > 0) {
                db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { TL: '1' } }, function (err, results) {
                  res.redirect('/leavs/1');
                })
              }
            })
          })
        })
      })
    } else if (typeof sess.emailid != 'undefined') {
      db.collection("employee_login").findOne({ emailid: sess.emailid }, function (err, result6) {
        db.collection("project").find({ HR: result6._id.toString() }).toArray((err, result1) => {
          if (result1.length > 0) {
            db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { HR: '1' } }, function (err, results) {
              res.redirect('/leavs/1');
            })
          }

          db.collection("project").find({ PM: result6._id.toString() }).toArray((err, result1) => {
            if (result1.length > 0) {
              db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { PM: '1' } }, function (err, results) {
                res.redirect('/leavs/1');
              })
            }

            db.collection("project").find({ TL: result6._id.toString() }).toArray((err, result1) => {
              if (result1.length > 0) {
                db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { TL: '1' } }, function (err, results) {
                  res.redirect('/leavs/1');
                })
              }
            })
          })
        })
      })
    } else if (typeof sess.emailid != 'undefined') {
      db.collection("employee_login").findOne({ emailid: sess.emailid }, function (err, result6) {
        db.collection("project").find({ PM: result6._id.toString() }).toArray((err, result1) => {
          if (result1.length > 0) {
            db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { PM: '1' } }, function (err, results) {
              res.redirect('/leavs/1');
            })
          }

          db.collection("project").find({ PM: result6._id.toString() }).toArray((err, result1) => {
            if (result1.length > 0) {
              db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { PM: '1' } }, function (err, results) {
                res.redirect('/leavs/1');
              })
            }

            db.collection("project").find({ PM: result6._id.toString() }).toArray((err, result1) => {
              if (result1.length > 0) {
                db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { PM: '1' } }, function (err, results) {
                  res.redirect('/leavs/1');
                })
              }
            })
          })
        })
      })
    } else if (typeof sess.emailid != 'undefined') {
      db.collection("admin_login").findOne({ emailid: sess.emailid }, function (err, result6) {
        db.collection("project").find({ PM: result6._id.toString() }).toArray((err, result1) => {
          if (result1.length > 0) {
            db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { PM: '1' } }, function (err, results) {
              res.redirect('/leavs/1');
            })
          }

          db.collection("project").find({ PM: result6._id.toString() }).toArray((err, result1) => {
            if (result1.length > 0) {
              db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { PM: '1' } }, function (err, results) {
                res.redirect('/leavs/1');
              })
            }

            db.collection("project").find({ PM: result6._id.toString() }).toArray((err, result1) => {
              if (result1.length > 0) {
                db.collection('leave').updateOne({ _id: objectId(req.params._id) }, { $set: { PM: '1' } }, function (err, results) {
                  res.redirect('/leavs/1');
                })
              }
            })
          })
        })
      })
    }
  })

  app.get('/user', (req, res) => {
    sess = req.session;
    // console.log('get sesseion',sess.email)
    if (typeof sess.email != 'undefined') {
      db.collection("admin_login").findOne({ email: sess.email }, function (err, results) {
        db.collection("employee_login").find({}).toArray((err, result1) => {
          var data = {
            title: "index",
            data: result1,
            data1: results
          }
          responseData('admin/html/user.html', data, res);
        })
      })
    } else {
      res.redirect('/admin');
    }
  })

  // app.get('/adminindex', (req, res) => {
  //   db.collection("task").find({}).toArray((err, result) => {
  //     db.collection("admin_login").find({}).toArray((err, results) => {
  //       res.render('admin/html/index.html', {
  //         title: "index",
  //         data: result,
  //         data1: results,
  //       })
  //     })
  //   })
  // })


  //delete selected row.................
  app.get('/deleteuser/:_id', (req, res) => {
    db.collection("employee_login").deleteOne({ _id: objectId(req.params._id) }, (err, rows) => {
      // console.log("id deleted succeessfully")
      res.redirect('/user')
    });
  });

  app.get('/edituser/:_id', function (req, res) {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      db.collection("employee_login").findOne({ _id: objectId(req.params._id) }, (err, result) => {
        assert.equal(null, err);
        db.collection("admin_login").findOne({ email: sess.email }, function (err, result2) {
          db.collection("admin_login").find({}).toArray((err, result1) => {
            db.collection("employee_login").find({}).toArray((err, result3) => {
              var data = {
                title: "index",
                data: result,
                data1: result2,
                data2: result1,
                data3: result3
              }
              responseData('admin/html/edituser.html', data, res);
            })
          })
        });
      })
    } else {
      res.redirect('/admin');
    }
  });

  app.get('/adminprofile', function (req, res) {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      db.collection("admin_login").findOne({ email: sess.email }, (err, result) => {
        assert.equal(null, err);
        var data = {
          title: "index",
          data: result,
          data1: result
        }
        responseData('admin/html/adminprofile.html', data, res);
      })
    } else {
      res.redirect('/admin');
    }
  })


  app.post('/updateuserimage/:_id', function(req, res, next){
    sess = req.session;

    if (typeof sess.email != 'undefined') {
      
        datas = req.body;
        var file = req.files.uploaded_image;
        var img_name = Date.now() + '_' + file.name;
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg") {
          file.mv('views/admin/assets/img/' + img_name, function (err) {
            if (err)
              return res.status(500).send(err);
            var item = {
              image: img_name
            };
            var id = req.params._id;
            db.collection('employee_login').updateOne({ _id: objectId(id) }, { $set: item }, function (err, result) {
              db.collection("admin_login").findOne({ email: sess.email }, function (err, result2) {
                db.collection("employee_login").find({}).toArray((err, result1) => {
                  //   var data = {
                  //     title: "index",
                  //     data: result1,
                  //     data1: result2
                  //   }
                  //   responseData('admin/html/user.html', data, res);
                  res.redirect('/user')
                })
              })
            })
          })
        }
      }else{
        res.redirect('/admin');
      }
  })


  // update data.................
  app.post('/updateuser/:_id', function (req, res, next) {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      
        datas = req.body;
        var item = {
          name: datas.name,
          emailid: datas.emailid,
          date: new Date(),
          mobile: datas.mobile
        };
        var id = req.params._id;
        db.collection('employee_login').updateOne({ _id: objectId(id) }, { $set: item }, function (err, result) {
          db.collection("admin_login").findOne({ email: sess.email }, function (err, result2) {
            db.collection("employee_login").find({}).toArray((err, result1) => {
              // var data = {
              //   title: "index",
              //   data: result1,
              //   data1: result2
              // }
              // responseData('admin/html/user.html', data, res);
              res.redirect('/user');
            })
          })
        })
      } else {
      res.redirect('/admin');
    }
  })

app.post('/adminimageupdate/:_id', function(req, res){
  sess = req.session

  if (typeof sess.email != 'undefined') {

    if(req.files.uploaded_image) {
      data = req.body;
      var file = req.files.uploaded_image;
      var img_name = Date.now() + '_' + file.name;

      if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('views/admin/assets/img/' + img_name, function (err) {
          if (err)
            return res.status(500).send(err);

          var item = {
            image: img_name
          };
          var id = req.params._id;
          db.collection('admin_login').updateOne({ _id: objectId(id) }, { $set: item }, function (err, result2) {
            res.redirect('/dashboard/1');
          })
        })
      }
    }
  } else {
    res.redirect('/admin');
  }
})

  //admin update data.................
  app.post('/adminprofileupdate/:_id', function (req, res) {
    sess = req.session;
    if (typeof sess.email != 'undefined') {
      data = req.body;
        var item = {
          name: data.name,
          email: data.email,
          lastupdate: new Date(),
          mobile: data.mobile
        };
        var id = req.params._id;
        db.collection('admin_login').updateOne({ _id: objectId(id) }, { $set: item }, function (err, result2) {
          res.redirect('/admin');
        })
      } else {
      res.redirect('/admin');
    }
  })


  //logout.....................
  app.get('/logoutadmin', function (req, res) {
    req.session.destroy(function (err) {
      console.log(err);
      res.redirect('/adminUrl');
    })
  })


  app.use(function (req, res) {
    // res.status(404).render('404.jade');
    res.send('<style>*{transition:all .6s}html{height:100%}body{font-family:Lato,sans-serif;color:#888;margin:0}#main{display:table;width:100%;height:100vh;text-align:center}.fof{display:table-cell;vertical-align:middle}.fof h1{font-size:50px;display:inline-block;padding-right:12px;animation:type .5s alternate infinite}@keyframes type{from{box-shadow:inset -3px 0 0 #888}to{box-shadow:inset -3px 0 0 transparent}}</style><div id="main"><div class="fof"><h1>Error 404, Page Not Found</h1></div></div>')
  });



});


