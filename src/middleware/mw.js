



const adminAuthentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {return res.status(400).send({ status: false, message: "Token is mendatory !" }) }

        token = token.split(" ")[1]

        jwt.verify(token, "admin vaccine", (err, decode) => {
            if (err) { return res.status(401).send({ status: false, message: err.message }) }
            else {
                req.decode = decode
                next()
            }
        })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) { return res.status(400).send({ status: false, message: "Token is mendatory !" }) }

        token = token.split(" ")[1]

        jwt.verify(token, "vaccine", (err, decode) => {
            if (err) { return res.status(401).send({ status: false, message: err.message }) }
            else {
                req.decode = decode
                next()
            }
        })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const autherisation = async (req, res, next) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "Enter a valid  userId !" }) }

        let user = await userModel.findOne({ _id: userId }).lean()
        if (!user) { return res.status(404).send({ status: false, message: "No user found !" }) }
        req.user = user

        if (user.vaccineStatus == "second dose") { return res.status(400).send({ status: false, message: `You are done with both dose of vaccine !` }) }
console.log(user)
        if (req.decode.userId != userId) { return res.status(403).send({ status: false, message: "Autherization denied !" }) }
        next()

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { authentication, autherisation, adminAuthentication }
