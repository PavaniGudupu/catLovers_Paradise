import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";

env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

db.connect();

const saltRounds = 10;
const currentDate = new Date();
const year = currentDate.getFullYear();
const port = 3000;
const app = express();
const API_URL = process.env.API_URL;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    secret: process.env.TOPSECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,                                                                             
    }
}));

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
})



app.get("/home", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const response = await axios.get(`${API_URL}/cat`); // Fetch a random cat image
            const catImageUrl = response.config.url; // The fetched URL is directly accessible here
            console.log(catImageUrl);
            res.render("home.ejs", { catimage: catImageUrl, year: year });
        } catch (err) {
            console.error(err);
            res.render("home.ejs", { catimage: null, year: year });
        }
    } else {
        res.redirect("/login");
    }
});




app.post("/home", async(req, res) => {
    try{
       const response = await axios.get(API_URL);
       const apiData = response.data;
       console.log(apiData);
       
    } catch(err) {
        console.log(err);
        res.render("home.ejs", {catimage: null});
    }
});

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get("/auth/google/home", passport.authenticate("google", {
    successRedirect: "/home",
    failureRedirect: "/",
}));

app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
}));

app.get("/logout", async(req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        } else {
            res.redirect("/");
        }
    });
});

app.post("/register", async(req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    try{
        const checkResult = await db.query("SELECT * FROM cats WHERE email = $1", [email]);
        if(checkResult.rows.length > 0) {
            //already exists
            res.redirect("/login");
        } else {
            bcrypt.hash(password, saltRounds, async(err, hash) => {
                if(err) {
                    res.send(err);
                    // console.log(err);
                } else {
                    const result = await db.query("INSERT INTO cats (email, password) VALUES ($1, $2) RETURNING *",
                        [email, hash]
                    );
                    const user = result.rows[0];
                    req.login(user, (err) => {
                    console.log("Successfull..");
                    res.redirect("/home");
                    });
                }
            });
        }
    } catch(err) {
        res.send(err);
        console.log(err);
    }
});

passport.use(
    "local",
     new Strategy (async function verify(username, password, cb) {
    try{
        const result = await db.query("SELECT * FROM cats WHERE email = $1", [username]);
        if(result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password;
            bcrypt.compare(password, storedPassword, (err, valid) => {
                if(err) {
                    console.log(err);
                    return cb(err);
                } else {
                    if(valid) {
                        return cb(null, user);
                    } else {
                        return cb(null, false);
                    }
                }
            });
        } else {
            return cb("USER NOT FOUND. TRY TO REGISTER.");
        }
    } catch(err) {
        res.send(err);
        console.log(err);
    }
}));


passport.use(
    "google", 
    new GoogleStrategy (
        {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/home",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    }, 
    async function verify(accessToken, refreshToken, profile, cb) {
    try {
        // console.log(profile);
        const result = await db.query("SELECT * FROM cats WHERE email = $1", [profile.email]);
        if(result.rows.length === 0) {
            const newUsers = await db.query("INSERT INTO cats (email, password) VALUES ($1, $2)", [profile.email, "google"]);
            return cb(null, newUsers.rows[0]);
        }   
        else {
            return cb(null, result.rows[0]);
        }
    } catch(err) {
        return cb(err);
    }
}
));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, (req, res) => {
    console.log(`Server running on port http://localhost:3000/`);
}); 