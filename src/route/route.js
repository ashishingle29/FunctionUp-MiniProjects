const express = require('express')

const router = express.Router()

const {bookSlot} = require('../controller/slotctrl')
const {getUserDetailsByFilter,getUserDetails,createUser,login} = require('../controller/userctrl')


router.post ("/register",createUser)

router.post ("/login", login)

router.get  ("/userdetails", getUserDetails)

router.get  ('/findtimeslots',        )

router.post ('/booktimeslot', bookSlot)

router.put  ('/updatetimeslot',       )

router.get  ("/admin/userdetails", getUserDetailsByFilter)

router.post ('/admin/createslots',    )

router.get  ("/admin/timeslot",       )


module.exports = router