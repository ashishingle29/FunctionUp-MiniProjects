//------------Name validation---------------//

function checkName(str) {
    var re =/^[a-zA-Z]+(([ ][a-zA-Z ])?[a-zA-Z]*)*$/g
    return  re.test(str);
}

//------------Mobile number validation---------------//

function isValidMobile(phone){
    let regex = /^[6-9][0-9]{9}$/
    return regex.test(phone)
}

//------------age validation---------------//

function isValidAge(age){
    let regex = /^[0-9]{2,3}$/
    return regex.test(age)
}

//------------Pincode validation---------------//

function isValidPincode(n){
    let regex = /^[0-9]{6}$/
    return regex.test(n)
}


//------------Aadhar number validation---------------//

function isValidAadhar(n){
    let regex = /^[0-9]{12}$/
    return regex.test(n)
}

//------------password validation---------------//

function validPassword(password) {
    let regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return regex.test(password);
}



module.exports = {checkName, isValidMobile, validPassword, isValidAge, isValidPincode, isValidAadhar}