require("dotenv").config();
const express = require("express");
const mongoose =  require("mongoose");

const nodemailer = require("nodemailer");

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))
mongoose.connect("mongodb+srv://Task:"+ process.env.PASSWORD + "@cluster0.4wegn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

const TaskSchema = new mongoose.Schema({
    email : String,
    name : String,
    password: String
});



const Details = mongoose.model("Details", TaskSchema);

app.get("/getDetails", function(req,res){
    Details.find({}, (err,result)=>{
        if(err){
            res.json(err)
        }else if(result){
            (res.json(result))
        }  
    });
})
app.get("/getpage", function(req,res){
    res.sendFile(__dirname + "/index.html")
})
app.get("/success", function(req,res){
    res.send("Success")
})

app.post("/getpage", (req,res) => {
    const users = new Details({
        email : req.body.Email,
        name: req.body.Name,
        password : req.body.Password
    })
    users.save(function(err){
        if(!err){
            res.redirect("/success")
        }


    })
    
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user : process.env.MAILID,
            password: process.env.MAILPASSWORD
        }
    });
    const mailDetails = {
        from : process.env.MAILID,
        to: req.body.Email,
        subject: "Verification Email",
        text: "Your email has been verified"
    };
    mailTransporter.sendMail(mailDetails, function(err,data){
        if(err){
            console.log("Error")
        }else{
            console.log("Email Sent")
        }
    })

});

app.listen(3000, function(){
    console.log("Server is up and running on port 3000.");
})