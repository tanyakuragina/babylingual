const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const indexRouter = require("./routes/index");

const app = express();

// Подключаем mongoose.
mongoose.connect("mongodb://localhost:27017/bilinguals", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on(
  "error",
  console.error.bind(console, "Ошибка соединения с MongoDB:")
);

//подключаем hbs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// подключаем сессии куки.
app.use(
  session({
    store: new FileStore(),
    key: "user_sid",
    secret: "anything here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);
app.use(cookieParser());
//подключение public, где будут наши js для клиента
app.use(express.static("public"));

// Подключение middleware, который парсит JSON от клиента, без него мы не будем получать введенные данные из формы
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger("dev"));

// Подключаем импортированные маршруты с определенным url префиксом.
app.use("/", indexRouter);

app.get("/", function (req, res) {
  console.log("Cookies from server:\n", req.cookies);
});

app.listen(3000, () => console.log("Listening on 3000"));
