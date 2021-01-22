"use strict";

// importing dependencies
var uid = require('uid');

var fs = require('fs'); // importing models


var User = require("../models/user"),
    Activity = require("../models/activity"),
    Book = require("../models/book"),
    Issue = require("../models/issue"),
    Comment = require("../models/comment"); // importing utilities


var deleteImage = require('../utils/delete_image'); // GLOBAL_VARIABLES


var PER_PAGE = 5; //user -> dashboard

exports.getUserDashboard = function _callee(req, res, next) {
  var page, user_id, user, issues, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, issue, activities, activity_count;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          page = req.params.page || 1;
          user_id = req.user._id;
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findById(user_id));

        case 5:
          user = _context.sent;

          if (!(user.bookIssueInfo.length > 0)) {
            _context.next = 39;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(Issue.find({
            "user_id.id": user._id
          }));

        case 9:
          issues = _context.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 13;
          _iterator = issues[Symbol.iterator]();

        case 15:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 25;
            break;
          }

          issue = _step.value;

          if (!(issue.book_info.returnDate < Date.now())) {
            _context.next = 22;
            break;
          }

          user.violatonFlag = true;
          user.save();
          req.flash("warning", "You are flagged for not returning " + issue.book_info.title + " in time");
          return _context.abrupt("break", 25);

        case 22:
          _iteratorNormalCompletion = true;
          _context.next = 15;
          break;

        case 25:
          _context.next = 31;
          break;

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](13);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 31:
          _context.prev = 31;
          _context.prev = 32;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 34:
          _context.prev = 34;

          if (!_didIteratorError) {
            _context.next = 37;
            break;
          }

          throw _iteratorError;

        case 37:
          return _context.finish(34);

        case 38:
          return _context.finish(31);

        case 39:
          _context.next = 41;
          return regeneratorRuntime.awrap(Activity.find({
            "user_id.id": req.user._id
          }).sort('-entryTime').skip(PER_PAGE * page - PER_PAGE).limit(PER_PAGE));

        case 41:
          activities = _context.sent;
          _context.next = 44;
          return regeneratorRuntime.awrap(Activity.find({
            "user_id.id": req.user._id
          }).countDocuments());

        case 44:
          activity_count = _context.sent;
          res.render("user/index", {
            user: user,
            current: page,
            pages: Math.ceil(activity_count / PER_PAGE),
            activities: activities
          });
          _context.next = 52;
          break;

        case 48:
          _context.prev = 48;
          _context.t1 = _context["catch"](2);
          console.log(_context.t1);
          return _context.abrupt("return", res.redirect('back'));

        case 52:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 48], [13, 27, 31, 39], [32,, 34, 38]]);
}; // user -> profile


exports.getUserProfile = function (req, res, next) {
  res.render("user/profile");
}; // user -> update/change password


exports.putUpdatePassword = function _callee2(req, res, next) {
  var username, oldPassword, newPassword, user, activity;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          username = req.user.username;
          oldPassword = req.body.oldPassword;
          newPassword = req.body.password;
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findByUsername(username));

        case 6:
          user = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(user.changePassword(oldPassword, newPassword));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          // logging activity
          activity = new Activity({
            category: "Update Password",
            user_id: {
              id: req.user._id,
              username: req.user.username
            }
          });
          _context2.next = 14;
          return regeneratorRuntime.awrap(activity.save());

        case 14:
          req.flash("success", "Your password is recently updated. Please log in again to confirm");
          res.redirect("/auth/user-login");
          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](3);
          console.log(_context2.t0);
          return _context2.abrupt("return", res.redirect('back'));

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 18]]);
}; // user -> update profile


exports.putUpdateUserProfile = function _callee3(req, res, next) {
  var userUpdateInfo, activity;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userUpdateInfo = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "gender": req.body.gender,
            "address": req.body.address
          };
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, userUpdateInfo));

        case 4:
          // logging activity
          activity = new Activity({
            category: "Update Profile",
            user_id: {
              id: req.user._id,
              username: req.user.username
            }
          });
          _context3.next = 7;
          return regeneratorRuntime.awrap(activity.save());

        case 7:
          res.redirect('back');
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          return _context3.abrupt("return", res.redirect('back'));

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // upload image


exports.postUploadUserImage = function _callee4(req, res, next) {
  var user_id, user, imageUrl, filename, previousImagePath, imageExist, activity;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          user_id = req.user._id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(User.findById(user_id));

        case 4:
          user = _context4.sent;

          if (!req.file) {
            _context4.next = 16;
            break;
          }

          imageUrl = "".concat(uid(), "__").concat(req.file.originalname);
          filename = "images/".concat(imageUrl);
          previousImagePath = "images/".concat(user.image);
          imageExist = fs.existsSync(previousImagePath);

          if (imageExist) {
            deleteImage(previousImagePath);
          }

          _context4.next = 13;
          return regeneratorRuntime.awrap(sharp(req.file.path).rotate().resize(500, 500).toFile(filename));

        case 13:
          fs.unlink(req.file.path, function (err) {
            if (err) {
              console.log(err);
            }
          });
          _context4.next = 17;
          break;

        case 16:
          imageUrl = 'profile.png';

        case 17:
          user.image = imageUrl;
          _context4.next = 20;
          return regeneratorRuntime.awrap(user.save());

        case 20:
          activity = new Activity({
            category: "Upload Photo",
            user_id: {
              id: req.user._id,
              username: user.username
            }
          });
          _context4.next = 23;
          return regeneratorRuntime.awrap(activity.save());

        case 23:
          res.redirect("/user/1/profile");
          _context4.next = 30;
          break;

        case 26:
          _context4.prev = 26;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.redirect('back');

        case 30:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 26]]);
}; //user -> notification


exports.getNotification = function _callee5(req, res, next) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          res.render("user/notification");

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
}; //user -> issue a book


exports.postIssueBook = function _callee6(req, res, next) {
  var book, user, issue, activity;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (!req.user.violationFlag) {
            _context6.next = 3;
            break;
          }

          req.flash("error", "You are flagged for violating rules/delay on returning books/paying fines. Untill the flag is lifted, You can't issue any books");
          return _context6.abrupt("return", res.redirect("back"));

        case 3:
          if (!(req.user.bookIssueInfo.length >= 5)) {
            _context6.next = 6;
            break;
          }

          req.flash("warning", "You can't issue more than 5 books at a time");
          return _context6.abrupt("return", res.redirect("back"));

        case 6:
          _context6.prev = 6;
          _context6.next = 9;
          return regeneratorRuntime.awrap(Book.findById(req.params.book_id));

        case 9:
          book = _context6.sent;
          _context6.next = 12;
          return regeneratorRuntime.awrap(User.findById(req.params.user_id));

        case 12:
          user = _context6.sent;
          // registering issue
          book.stock -= 1;
          issue = new Issue({
            book_info: {
              id: book._id,
              title: book.title,
              author: book.author,
              ISBN: book.ISBN,
              category: book.category,
              stock: book.stock
            },
            user_id: {
              id: user._id,
              username: user.username
            }
          }); // putting issue record on individual user document

          user.bookIssueInfo.push(book._id); // logging the activity

          activity = new Activity({
            info: {
              id: book._id,
              title: book.title
            },
            category: "Issue",
            time: {
              id: issue._id,
              issueDate: issue.book_info.issueDate,
              returnDate: issue.book_info.returnDate
            },
            user_id: {
              id: user._id,
              username: user.username
            }
          }); // await ensure to synchronously save all database alteration

          _context6.next = 19;
          return regeneratorRuntime.awrap(issue.save());

        case 19:
          _context6.next = 21;
          return regeneratorRuntime.awrap(user.save());

        case 21:
          _context6.next = 23;
          return regeneratorRuntime.awrap(book.save());

        case 23:
          _context6.next = 25;
          return regeneratorRuntime.awrap(activity.save());

        case 25:
          res.redirect("/books/all/all/1");
          _context6.next = 32;
          break;

        case 28:
          _context6.prev = 28;
          _context6.t0 = _context6["catch"](6);
          console.log(_context6.t0);
          return _context6.abrupt("return", res.redirect("back"));

        case 32:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[6, 28]]);
}; // user -> show return-renew page


exports.getShowRenewReturn = function _callee7(req, res, next) {
  var user_id, issue;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          user_id = req.user._id;
          _context7.prev = 1;
          _context7.next = 4;
          return regeneratorRuntime.awrap(Issue.find({
            "user_id.id": user_id
          }));

        case 4:
          issue = _context7.sent;
          res.render("user/return-renew", {
            user: issue
          });
          _context7.next = 12;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](1);
          console.log(_context7.t0);
          return _context7.abrupt("return", res.redirect("back"));

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // user -> renew book working procedure

/*
    1. construct the search object
    2. fetch issues based on search object
    3. increament return date by 7 days set isRenewed = true
    4. Log the activity
    5. save all db alteration
    6. redirect to /books/return-renew
*/


exports.postRenewBook = function _callee8(req, res, next) {
  var searchObj, issue, time, activity;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          searchObj = {
            "user_id.id": req.user._id,
            "book_info.id": req.params.book_id
          };
          _context8.next = 4;
          return regeneratorRuntime.awrap(Issue.findOne(searchObj));

        case 4:
          issue = _context8.sent;
          // adding extra 7 days to that issue
          time = issue.book_info.returnDate.getTime();
          issue.book_info.returnDate = time + 7 * 24 * 60 * 60 * 1000;
          issue.book_info.isRenewed = true; // logging the activity

          activity = new Activity({
            info: {
              id: issue._id,
              title: issue.book_info.title
            },
            category: "Renew",
            time: {
              id: issue._id,
              issueDate: issue.book_info.issueDate,
              returnDate: issue.book_info.returnDate
            },
            user_id: {
              id: req.user._id,
              username: req.user.username
            }
          });
          _context8.next = 11;
          return regeneratorRuntime.awrap(activity.save());

        case 11:
          _context8.next = 13;
          return regeneratorRuntime.awrap(issue.save());

        case 13:
          res.redirect("/books/return-renew");
          _context8.next = 20;
          break;

        case 16:
          _context8.prev = 16;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          return _context8.abrupt("return", res.redirect("back"));

        case 20:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 16]]);
}; // user -> return book working procedure

/*
    1. Find the position of the book to be returned from user.bookIssueInfo
    2. Fetch the book from db and increament its stock by 1
    3. Remove issue record from db
    4. Pop bookIssueInfo from user by position
    5. Log the activity
    6. refirect to /books/return-renew
*/


exports.postReturnBook = function _callee9(req, res, next) {
  var book_id, pos, book, issue, activity;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          // finding the position
          book_id = req.params.book_id;
          pos = req.user.bookIssueInfo.indexOf(req.params.book_id); // fetching book from db and increament

          _context9.next = 5;
          return regeneratorRuntime.awrap(Book.findById(book_id));

        case 5:
          book = _context9.sent;
          book.stock += 1;
          _context9.next = 9;
          return regeneratorRuntime.awrap(book.save());

        case 9:
          _context9.next = 11;
          return regeneratorRuntime.awrap(Issue.findOne({
            "user_id.id": req.user._id
          }));

        case 11:
          issue = _context9.sent;
          _context9.next = 14;
          return regeneratorRuntime.awrap(issue.remove());

        case 14:
          // popping book issue info from user
          req.user.bookIssueInfo.splice(pos, 1);
          _context9.next = 17;
          return regeneratorRuntime.awrap(req.user.save());

        case 17:
          // logging the activity
          activity = new Activity({
            info: {
              id: issue.book_info.id,
              title: issue.book_info.title
            },
            category: "Return",
            time: {
              id: issue._id,
              issueDate: issue.book_info.issueDate,
              returnDate: issue.book_info.returnDate
            },
            user_id: {
              id: req.user._id,
              username: req.user.username
            }
          });
          _context9.next = 20;
          return regeneratorRuntime.awrap(activity.save());

        case 20:
          // redirecting
          res.redirect("/books/return-renew");
          _context9.next = 27;
          break;

        case 23:
          _context9.prev = 23;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          return _context9.abrupt("return", res.redirect("back"));

        case 27:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 23]]);
}; // user -> create new comment working procedure

/* 
    1. Find the book to be commented by id
    2. Create new Comment instance and fill information inside it
    3. Log the activity
    4. Redirect to /books/details/:book_id
*/


exports.postNewComment = function _callee10(req, res, next) {
  var comment_text, user_id, username, book_id, book, comment, activity;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          comment_text = req.body.comment;
          user_id = req.user._id;
          username = req.user.username; // fetching the book to be commented by id

          book_id = req.params.book_id;
          _context10.next = 7;
          return regeneratorRuntime.awrap(Book.findById(book_id));

        case 7:
          book = _context10.sent;
          // creating new comment instance
          comment = new Comment({
            text: comment_text,
            author: {
              id: user_id,
              username: username
            },
            book: {
              id: book._id,
              title: book.title
            }
          });
          _context10.next = 11;
          return regeneratorRuntime.awrap(comment.save());

        case 11:
          // pushing the comment id to book
          book.comments.push(comment._id);
          _context10.next = 14;
          return regeneratorRuntime.awrap(book.save());

        case 14:
          // logging the activity
          activity = new Activity({
            info: {
              id: book._id,
              title: book.title
            },
            category: "Comment",
            user_id: {
              id: user_id,
              username: username
            }
          });
          _context10.next = 17;
          return regeneratorRuntime.awrap(activity.save());

        case 17:
          res.redirect("/books/details/" + book_id);
          _context10.next = 24;
          break;

        case 20:
          _context10.prev = 20;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          return _context10.abrupt("return", res.redirect("back"));

        case 24:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 20]]);
}; // user -> update existing comment working procedure

/*
    1. Fetch the comment to be updated from db and update
    2. Fetch the book to be commented for logging book id, title in activity
    3. Log the activity
    4. Redirect to /books/details/"+book_id
*/


exports.postUpdateComment = function _callee11(req, res, next) {
  var comment_id, comment_text, book_id, username, user_id, book, activity;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          comment_id = req.params.comment_id;
          comment_text = req.body.comment;
          book_id = req.params.book_id;
          username = req.user.username;
          user_id = req.user._id;
          _context11.prev = 5;
          _context11.next = 8;
          return regeneratorRuntime.awrap(Comment.findByIdAndUpdate(comment_id, comment_text));

        case 8:
          _context11.next = 10;
          return regeneratorRuntime.awrap(Book.findById(book_id));

        case 10:
          book = _context11.sent;
          // logging the activity
          activity = new Activity({
            info: {
              id: book._id,
              title: book.title
            },
            category: "Update Comment",
            user_id: {
              id: user_id,
              username: username
            }
          });
          _context11.next = 14;
          return regeneratorRuntime.awrap(activity.save());

        case 14:
          // redirecting
          res.redirect("/books/details/" + book_id);
          _context11.next = 21;
          break;

        case 17:
          _context11.prev = 17;
          _context11.t0 = _context11["catch"](5);
          console.log(_context11.t0);
          return _context11.abrupt("return", res.redirect("back"));

        case 21:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[5, 17]]);
}; // user -> delete existing comment working procedure

/* 
    1. Fetch the book info for logging info
    2. Find the position of comment id in book.comments array in Book model
    3. Pop the comment id by position from Book
    4. Find the comment and remove it from Comment
    5. Log the activity
    6. Redirect to /books/details/" + book_id
*/


exports.deleteComment = function _callee12(req, res, next) {
  var book_id, comment_id, user_id, username, book, pos, activity;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          book_id = req.params.book_id;
          comment_id = req.params.comment_id;
          user_id = req.user._id;
          username = req.user.username;
          _context12.prev = 4;
          _context12.next = 7;
          return regeneratorRuntime.awrap(Book.findById(book_id));

        case 7:
          book = _context12.sent;
          // finding the position and popping comment_id
          pos = book.comments.indexOf(comment_id);
          book.comments.splice(pos, 1);
          _context12.next = 12;
          return regeneratorRuntime.awrap(book.save());

        case 12:
          _context12.next = 14;
          return regeneratorRuntime.awrap(Comment.findByIdAndRemove(comment_id));

        case 14:
          // logging the activity
          activity = new Activity({
            info: {
              id: book._id,
              title: book.title
            },
            category: "Delete Comment",
            user_id: {
              id: user_id,
              username: username
            }
          });
          _context12.next = 17;
          return regeneratorRuntime.awrap(activity.save());

        case 17:
          // redirecting
          res.redirect("/books/details/" + book_id);
          _context12.next = 24;
          break;

        case 20:
          _context12.prev = 20;
          _context12.t0 = _context12["catch"](4);
          console.log(_context12.t0);
          return _context12.abrupt("return", res.redirect("back"));

        case 24:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[4, 20]]);
}; // user -> delete user account


exports.deleteUserAccount = function _callee13(req, res, next) {
  var user_id, user, imagePath;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          user_id = req.user._id;
          _context13.next = 4;
          return regeneratorRuntime.awrap(User.findById(user_id));

        case 4:
          user = _context13.sent;
          _context13.next = 7;
          return regeneratorRuntime.awrap(user.remove());

        case 7:
          imagePath = "images/".concat(user.image);

          if (fs.existsSync(imagePath)) {
            deleteImage(imagePath);
          }

          _context13.next = 11;
          return regeneratorRuntime.awrap(Issue.deleteMany({
            "user_id.id": user_id
          }));

        case 11:
          _context13.next = 13;
          return regeneratorRuntime.awrap(Comment.deleteMany({
            "author.id": user_id
          }));

        case 13:
          _context13.next = 15;
          return regeneratorRuntime.awrap(Activity.deleteMany({
            "user_id.id": user_id
          }));

        case 15:
          res.redirect("/");
          _context13.next = 22;
          break;

        case 18:
          _context13.prev = 18;
          _context13.t0 = _context13["catch"](0);
          console.log(_context13.t0);
          res.redirect('back');

        case 22:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 18]]);
};