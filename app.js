if(process.env.NODE_ENV != "production"){
require('dotenv').config()

}

// console.log("App.js file is executing");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const engine = require('ejs-mate');
const ExpreesErr = require("./utils/ExpreesErr.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const session = require("express-session");
const MongoStore = require('connect-mongo').default;
console.log(MongoStore);


const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const mongo_Url = "mongodb://127.0.0.1:27017/wanderfast";
const dburl = process.env.ATLASDB_URL;
main().then(() =>{
    console.log("connected to db");
}) .catch((err) =>{
    console.log(err);
});
async function main() {
    
    await mongoose.connect(dburl);
   
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));

const store =  MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: "mysupersecretstring",
    },
    touchAfter: 24 * 3600,

});

store.on("error", (err) =>{
    console.log("Error in Mongo Session Store", err);
});

const sessionOptions = {
    store: store,
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly: true,
    },
};
// app.get("/", (req, res) =>{
//     res.send("hii, i'm root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use((new LocalStrategy(User.authenticate())));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new User({
//     email:  "miku8844.com",
//     username: "delta",
// });
// let registerUser = await User.register(fakeUser, "helloworld");
// res.send(registerUser);
//     });



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.use((req, res, next) =>{
    next(new ExpreesErr(404, "page not found"));
//   res.status(404).send({message: "page not found"});
});
app.use((err, req, res, next) =>{
    let{statusCode=500, message="something went wrong"}  = err;
    res.status(statusCode).render("error.ejs", {err});
// res.status(statusCode).send(message);
    
});
app.listen(8080, () =>{
    console.log("server listening to port 8080");
});