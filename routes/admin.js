const express = require('express')
const router = express.Router()
const User =  require('../models/users');
const Driver = require('../models/drivers');
const DriverRoutes = require('../models/driversRoute');

router.put('/saveEmployee',async(req,res) => {
    console.log(req.body);
    const users = await User.find({"emailId":req.body.emailId})
    if(users.length != 0)
    {
        id = users[0]._id;
        User.findByIdAndUpdate(id,{
            username : req.body.username,
            emailId : req.body.emailId,
            mobile : req.body.mobile,
            password : req.body.password
        },
        function(err,docs)
        {
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated User : ", docs);
            }
        }
        );
        res.send({"updated":true})
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
            const data = await user.save()
            res.json({"saved":true})
        }
        catch(err)
        {
            console.log(err);
            res.send({"user":false})
        }
    }
})

router.put('/saveDriver',async(req,res) => {    
    const drivers = await Driver.find({"phoneNo":req.body.phoneNo})
    if(drivers.length != 0)
    {
        id = drivers[0]._id;
        Driver.findByIdAndUpdate(id,{
            username : req.body.username,
            phoneNo : req.body.phoneNo,
            role : req.body.role,
            password : req.body.password
            },
            function(err,docs)
            {
                if (err){
                    console.log(err)
                }
                else{
                    console.log("Updated User : ", docs);
                }
            }
            );
            res.send({"updated":true})
        }
        else
        {
            const driver = new Driver({
                username : req.body.username,
                phoneNo : req.body.phoneNo,
                role : req.body.role,
                password : req.body.password
            })

            try{
                const data = await driver.save()
                res.json({"saved":true})
            }
            catch(err)
            {
                res.send({"user":false})
            }
        }
})


router.put('/addRouteToDriver',async(req,res) => { 
    let no = parseInt(req.body.phoneNo)
    try{
        const driverPresent = await Driver.find({"phoneNo":no})
        if(driverPresent.length !=0)
        {
            console.log(driverPresent)
            const drivers = await DriverRoutes.find({"phoneNo":req.body.phoneNo})
            if(drivers.length != 0)
            {
                let id = drivers[0]._id;
                DriverRoutes.findByIdAndUpdate(id,{
                    username : driverPresent[0].username,
                    startPoint : req.body.startPoint,
                    endPoint : req.body.endPoint,
                    date : req.body.date,
                    time : req.body.time,
                    seats : req.body.seats,
                    remainingSeats : req.body.seats,
                    distance : req.body.distance,
                    phoneNo : req.body.phoneNo,
                    vehicleModel : req.body.vehicleModel,
                    vehicleNumber : req.body.vehicleNumber
                    },
                    function(err,docs)
                    {
                        if (err){
                            console.log(err)
                        }
                        else{
                            console.log("Updated User : ", docs);
                        }
                    }
                    );
                    res.send({"updated":true})
                }
                else
                {
                    const driver = new DriverRoutes({
                        username : driverPresent[0].username,
                        startPoint : req.body.startPoint,
                        endPoint : req.body.endPoint,
                        date : req.body.date,
                        time : req.body.time,
                        seats : req.body.seats,
                        remainingSeats : req.body.seats,
                        distance : req.body.distance,
                        phoneNo : req.body.phoneNo,
                        vehicleModel : req.body.vehicleModel,
                        vehicleNumber : req.body.vehicleNumber
                    })

                    try{
                        const data = await driver.save()
                        res.json({"saved":true})
                    }
                    catch(err)
                    {
                        console.log(err)
                        res.send({"user":false})
                    }
                }
            }
        else
        {
            res.send({"Nodriver":"Driver not yet registered"});
        }
    }
    catch(err)
    {
        res.send({"error":err})
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

router.get('/getDriverRoutes/:id',async(req,res) =>{
 
    try{
        const place = (req.params.id)
        const users = await DriverRoutes.find({$or : [{startPoint:place},{endPoint:place}]})
        console.log(users)
        res.send(users);
    }
    catch(err)
    {
        res.send({"error":err})
    }
})


router.get('/getEmployee',async(req,res) =>{
 
    try{
        const users = await User.find()
        const drivers = await Driver.find()
        let both = [users,drivers]
        res.send(both);
    }
    catch(err)
    {
        res.send({"Error":err})
    }
})


router.delete('/deleteEmployee/:id',async(req,res) =>{
 
    const id = req.params.id;
    console.log(id);
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

router.delete('/deleteDriver/:id',async(req,res) =>{
 
    const id = req.params.id;
    console.log(id);
    try{
        const user = await Driver.findByIdAndRemove(id)
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


router.get('/searchEmployee/:id',async(req,res)=>{
    username = req.params.id;
    try{
        const users = await User.find({"username":username})
        const drivers = await Driver.find({"username":username})
        let both = [users,drivers]
        res.send(both);
    }
    catch(err)
    {
        res.send({"Error":err})
    }
})

router.delete('/deleteDriverRoutes/:id',async(req,res)=>{
    console.log(req.params.id)
})



module.exports = router