const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../db/user");
const Room = require("../db/room");
const fetch = require("node-fetch");
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
  const openRooms = await Room.find({}).populate('userID');
  res.render("rooms", { openRooms, user });
});

//create room
router.post("/rooms", async (req, res, next) => {
  let user = null;
  if (req.session.user) {
    user = req.session.user;
    try {
      const { roomName, link } = req.body;
      const room = new Room({
        roomName,
        link,
        userID: user._id,
      });
      await room.save();
      res.redirect("/room");
    } catch (error) {
      next(error);
    }
  }
});

router.get("/room", (req, res) => {
  res.render("videoChat");
});

//отрисововываем edit
router.get("/:id", async (req, res) => {
  let room = await Room.findById(req.params.id);
  res.render("edit", { id: req.params.id, room });
});

//update
router.put("/:id", async function (req, res, next) {
  console.log(req.body);
  let user = null;
  if (req.session.user) {
    user = req.session.user;
    let room = await Room.findById(req.params.id);
    room.roomName = req.body.roomName;
    room.link = req.body.link;
    await room.save();
    res.json({ message: true });
  } else {
    res.redirect("/");
  }
});

//удаляем форму
router.delete("/:id", async (req, res, next) => {
  let user = null;
  try {
    if (req.session.user) {
      user = req.session.user;
      await Room.deleteOne({ _id: req.params.id });
      res.redirect("/rooms");
    }
  } catch (err) {
    return res.render("rooms", { errors: [err] });
  }
});

router.put("/get/smth", async (req, res) => {
  const word = req.body.word;
  console.log(req.body);
  try {
    const resp = await (
      await fetch(`https://owlbot.info/api/v4/dictionary/${word}`, {
        headers: {
          Authorization: "Token 3b7de2fe49777101ba7d0d2e4c0a3cd3adf5e375",
        },
        method: "GET",
      })
    ).json();
    console.log(resp);
    res.json(resp);
  } catch (error) {
    res.status(500).json(null);
  }
});

module.exports = router;
