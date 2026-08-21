//post user data to the server
const express = require('express');
const app = express();

app.post("api/attendees",(req,res)=>{
    const { firstName, lastName, countryCode, birthDate } = req.body;
    //process the registreation logic
    res.status(201).json({ message: "User registered successfully" });
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
