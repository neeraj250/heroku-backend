const express = require('express')
const router = express.Router()

const DriverRoutes = require('../models/driversRoute');

const User =  require('../models/users');

const Booking = require('../models/Booking');


router.get('/getRoutes/:id',async(req,res) =>{
 
    try{
        const place = (req.params.id)
        // const users = await DriverRoutes.find({$or : [{startPoint:place},{endPoint:place}]})
        // console.log(users)
        // res.send(users);
        // Edited because tried searching using regex
        var regex = new RegExp(place,'i');
        DriverRoutes.find({$or : [{startPoint:regex},{endPoint:regex}]}).then( (result) => {
            const users = res.status(200).json(result);
            console.log("doing");
        } )
    }
    catch(err)
    {
        res.send({"error":err})
    }
})


router.post('/login',async(req,res) =>{
    try{
        // console.log(req.body);
        console.log({'username':req.body.emailId,'password':req.body.password})
        const users = await User.find({"emailId":req.body.emailId,"password":req.body.password})
        // console.log(users);
        if(users.length != 0)
            res.json({"user":users[0]});
        else
            res.json({"user":false})
    }
    catch(err)
    {
        res.send('error'+err)
    }
})

router.get('/getDriverRoutes',async(req,res) =>{
 
    try{
        const users = await DriverRoutes.find()
        res.send(users);
    }
    catch(err)
    {
        res.send({"error":err})
    }
})

router.get('/:id',async(req,res) =>{
 
    const id = req.params.id;
    try{
        const user = await User.findById(id)
        res.json(user)
    }
    catch(err)
    {
        res.send('null')
    }
})

router.post('/signup',async(req,res) => {

    const users = await User.find({"emailId":req.body.emailId})
    console.log("users")
    console.log(users)
    if(users.length != 0)
    {
        res.send({"User":"Email Already present"})
    }
    else
    {
    const user = new User({
        username : req.body.username,
        emailId : req.body.emailId,
        phoneNo : req.body.phoneNo,
        password : req.body.password,
    })

    try{
        const data = await user.save();
        res.json({"user":true})
    }
    catch(err)
    {
        res.send({"user":false})
    }
    }
})

router.put('/editUser/:id',async(req,res) =>{
 console.log(req.body)

    const id = req.params.id;
    try{
        await User.findByIdAndUpdate(id,{
            username : req.body.username,
            password : req.body.password,
            emailId : req.body.emailId,
            phoneNo : req.body.phoneNo
        });
        res.send({
            'updated':true
        })
    }
    catch(err)
    {
        res.send({
            'updated': false
        })
    }
})


router.post('/saveBooking',async(req,res) => {
    console.log("SAVING")
    driverDetails = req.body.user
    id = req.body.id;
    driverId = req.body.user._id;
    const booking = await Booking.find({"userId":id,"driverId":driverId})
    console.log(booking)
    if(booking.length != 0)
    {
        res.send({"booking":"Ticket has already been booked"})
    }
    else
    {
        const book = new Booking({
            userId : id,
            driverId : driverId
        })

        try{
            const data = await book.save();
            let decreaseSeats = parseInt(driverDetails.remainingSeats) - 1;
            const driver = await DriverRoutes.findById(driverId);
            driver.remainingSeats = decreaseSeats
            const usersaved = await driver.save();
            res.send({"booking":"booking made successfully"})
        }
        catch(err)
        {
            console.log(err)
            res.send({"Error":err})
        }
    }
})

router.post('/cancelBooking',async(req,res) => {

    console.log("CANCELLING")
    driverDetails = req.body.user
    id = req.body.id;
    driverId = req.body.user._id;
    const booking = await Booking.find({"userId":id,"driverId":driverId})
    if(booking.length != 0)
    {
        try{
            //61222d34f382350acc794670
            console.log("ID :",booking[0]._id)
            const user = await Booking.deleteOne({_id:booking[0]._id})

                let decreaseSeats = parseInt(driverDetails.remainingSeats) + 1;
                const driver = await DriverRoutes.findById(driverId);
                console.log(driverDetails)
                driver.remainingSeats = decreaseSeats;
                const usersaved = await driver.save();
            res.send({"booking":"Ticket has been cancelled"})

        }
        catch(err)
        {
            console.log(err)
            res.send({"Error":err})
        }
    }
    else
    {
        res.send({"booking":"You may not have been booked the ticket"})
    }
})

router.delete('/:id',async(req,res) =>{
 
    const id = req.params.id;
    try{
        const user = await User.findByIdAndRemove(id)
        res.send({
            'deleted' : true
        })
    }
    catch(err)
    {
        console.log(err)
        res.send({
            'deleted' : false
        })
    }
})

module.exports = router