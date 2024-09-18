
const express = require("express");
const session = require("express-session");
const path = require("path");   //path module import
const nocache = require("nocache")
const app = express();

//nocache
app.use(nocache())

//setting view engine
app.set("view engine","ejs");

//Middleware to parse from data
app.use(express.urlencoded({extended:true}));

//to add css files
app.use(express.static(path.join(__dirname, 'public')));


//session setup
app.use(
  session({
    secret: "mysecret",
    resave:false,
    saveUninitialized: true,
    cookie:{maxAge:90000}
  })
);


//to prevent back button
function noCache(req,res,next){
  res.set(
    "cache-Contorl",
    "no-store,no-cache,must-revalidate,proxy-revalidate" );
  res.set("Pragma", "no-cache");
  res.set("Express","0");
  res.set("Surrogate-Control","no-store");
  next();
}

//login Credentials

let validUsername = "Akhil";
let validPassword ="123";



//Route for Login-page
app.get("/", noCache,(req,res)=>{
  if(req.session.isLoggedIn) {
    res.redirect("/home");
  }else {
  res.render("login",{message: "" });
  }
});

//login POST req handling
app.post("/login",(req,res)=>{
  const {username,password} = req.body;
  if (username === validUsername && password === validPassword) {
    req.session.user = 'AKHIL'; 
    req.session.isLoggedIn = true;
    res.redirect("/home");
  }else {
    res.render("login",{message: "Incorrect username or password!"});
  }
});


//home route
app.get("/home",noCache,(req,res)=> {
  if (req.session.isLoggedIn) {
    res.render("home");
  }else {
    res.redirect("/");
  }
});


//Logout route
app.post("/logout", noCache,(req,res) =>{
  req.session.destroy((err) =>{
    if (err) throw err;
    res.redirect("/");
  });
});
 

app.get("/change-password",noCache,(req,res) =>{
  if (req.session.isLoggedIn) {
    res.render("change-password",{message: "" });
  } else {
    res.redirect("/");
  }
  
});

app.post("/update-password", (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword === validPassword) {
    validPassword = newPassword;
    // res.render("change-password", { message: "Password updated successfully!" });
    res.redirect("/");
  } else {
    res.render("change-password", { message: "Incorrect current password!" });
  }
});


//server starting
app.listen(3000,()=>{
  console.log("server is running on http://localhost:3000");
  
});