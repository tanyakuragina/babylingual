const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../db/user");
const Room = require("../db/room");

const saltRounds = 10;
const router = express.Router();

//подключаем ручку
router.get("/", (req, res) => {
  let user = null;
  if (req.session.user) {
    user = req.session.user;
  }
  res.render("index", { user });
});

router.get("/profile", (req, res) => {
  res.render("profile");
});

router.post("/signup", async (req, res, next) => {
  try {
    const {
      name,
      surname,
      childName,
      nativeLanguage,
      email,
      password,
    } = req.body;
    const user = new User({
      name,
      surname,
      childName,
      nativeLanguage,
      email,
      password: await bcrypt.hash(password, saltRounds),
    });
    await user.save();
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      if (req.session.url) {
        return res.redirect(req.session.url);
      }
      return res.redirect("/");
    } else {
      res.send("error");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.send("error");
  }
});

router.get("/logout", async (req, res, next) => {
  if (req.session.user) {
    try {
      await req.session.destroy();
      res.clearCookie("user_sid");
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
});

router.get("/all-bilinguals", async (req, res) => {
  const users = await User.find({});
  console.log(users);
  res.render("all-bilinguals", { users });
});

router.get("/profile/:id", (req, res) => {
  res.render("profile");
});

router.get("/video-chat/:id", (req, res) => {
  res.render("videoChat");
});

router.get("/rooms", async (req, res) => {
  let user = null;
  if (req.session.user) {
    user = req.session.user;
  }
  const openRooms = await Room.find({});
  res.render("rooms", { openRooms, user });
});

router.post("/rooms", async (req, res, next) => {
  try {
    const { roomName, link } = req.body;
    const room = new Room({
      roomName,
      link,
    });
    await room.save();
    res.redirect("/rooms");
  } catch (error) {
    next(error);
  }
});

router.get("/room", (req, res) => {
  res.render("videoChat");
});

// router.get("/room/:id", (req, res) => {
//   const { id } = req.params;
//   console.log(id);
//   const url = req.protocol + "://" + req.get("host") + req.baseUrl + id;
//   req.session.url = url;
//   console.log(url);
//   if (req.session.user) {
//     res.redirect(url);
//   } else {
//     res.redirect("/");
//   }
// });

module.exports = router;
