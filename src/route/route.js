const express = require('express')

const router = express.Router()
const { authentication, autherisation, adminAuthentication } = require('../middleware/mw')
const admin = require('../controller/adminctrl')
const {getUserDetails,createUser,login, bookSlot, updateSlot, getTimeSlot} = require('../controller/userctrl')


router.post ("/register", createUser)

router.post ("/login", login)

router.get  ("/userdetails", authentication, autherisation, getUserDetails)

router.get  ('/findtimeslots', authentication, autherisation, getTimeSlot )

router.post ('/booktimeslot', authentication, autherisation, bookSlot)

router.put  ('/updatetimeslot', authentication, autherisation, updateSlot)



router.post("admin/login", admin.adminlogin)

router.post ('/admin/createslots', adminAuthentication,  admin.createslot  )

router.get  ("/admin/userdetails", adminAuthentication, admin.getUserDetailsByFilter)

router.get  ("/admin/timeslot", adminAuthentication, admin.registeredslot)


module.exports = router