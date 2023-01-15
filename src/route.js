const express= require("express")
const router= express.Router()
const studentModel=require("./studentModel")


router.post("/student",async function(req,res){

    try{
   let data =req.body
 
   if(Object.keys(data).length==0)return res.status(400).send({status:false,msg:"can't create user with empty body"})
  
   let newArr=["name","subject","marks"]
   for(i of newArr){
    if(!data[i])return res.status(400).send({status:false,msg:`${i} is mandatory please input ${i}`})
 
   }

   for(i in data){
    if(i=="marks")continue
    if(!data[i].trim())return res.status(400).send({status:false,msg:`${i} is mandatory please input valid data in  ${i}`})
   }

const oldstudent=await studentModel.findOne({name:data.name,subject:data.subject,isDeleted:false})
if(oldstudent){
  let  marks=oldstudent.marks+data.marks
  const update=await studentModel.findOneAndUpdate({name:data.name,subject:data.subject},{marks:marks},{new:true})
 return res.status(200).send({status:true,msg:"student marks updated successfully",data:update})
}


   const student=await studentModel.create(data)
   res.status(201).send({status:true,msg:"student created successfully",data:student})
    }
    catch(err){
        res.status(500).send({status:false ,msg:err.message})
    }
})


router.get("/student",async function(req,res){

    try{
        let data=req.query
        data.isDeleted=false
        const student=await studentModel.find(data)
        if(!student)return res.status(404).send({status:false ,msg:"NO student found with this query"})
        res.status(200).send({status:true,data:student})

    }
    catch(err){
        res.status(500).send({status:false ,msg:err.message})
    }
})

router.delete("/student/:name/:subject",async function(req,res){

    try{
        let data=req.params
        
        data.isDeleted=false
        const student=await studentModel.find(data)
        if(!student)return res.status(404).send({status:false ,msg:"NO student found with this name"})
        const deletestudent= await studentModel.updateOne(data,{isDeleted:true})

        res.status(201).send({status:true,msg:"student data deleted successfully"})

    }
    catch(err){
        res.status(500).send({status:false ,msg:err.message})
    }
})



router.all("/*" ,function(req,res){
return res.status(404).send({msg:"wrong path"})
})


module.exports= router