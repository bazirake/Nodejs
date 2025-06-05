
require("dotenv").config();
const express=require("express");
const app=express();

const port=process.env.PORT;
//Middleware to parse JSON bodies
app.use(express.json());
const {Sequelize,DataTypes}=require("sequelize");
const sequelize=new Sequelize(process.env.DB_URL,{
  dialect:'postgres', // Or 'mysql','sqlite','mssql'
  dialectOptions:{
  ssl:{
       require: true,
       rejectUnauthorized:false //Use with caution in production
     }
    },
  logging:false               
});

sequelize.authenticate().then(()=>console.log("Database connected successfully")).catch((err)=>console.log("database connection error:"+err));
//modal schema
const post=sequelize.define("post",{
  title:{
       type:DataTypes.STRING,
       allowNull:false
  },
  content:{
    type:DataTypes.STRING,
    allowNull:false
  }

});



app.get("/",(req,res)=>{
   res.send("Welcome to Extech Api Server Configuration");
})

app.post("/send-data", async (req,res)=>{

const {title,content}=req.body;
try {
  const newPost= await post.create({title,content});
  res.json(newPost);
  
} catch (error) {
   console.log(error);
}

});

  app.get("/getalldata", async(req,res)=>{
    
      try{
         const alldata=await post.findAll();
         res.json(alldata);
      } 
       catch (error) {
       console.log(error);
   }

});

 app.delete("/user/:id", async (req,res)=>{
    const id=req.params.id;
    const ress= await post.findByPk(id);
    try {
        if(ress){
           await ress.destroy();
           res.send("record has been deleted successfully");
        }
        else{
          res.status(404).send("Record not found")
        }
    } catch(error) {
      res.send("error:"+error);
    }
      if (ress) {
      }
}
);

app.put("/updates/:id",async(req,res)=>{
    const idup=  req.params.id;
    const {title,content}=req.body;
    const [ddd]=await post.update({title:title,content:content},{where:{id:idup}});

   if(ddd>0) {
      res.send(`updated rows:${ddd}`);
   }
   else{
    res.status(404).send("no data has been found to update");
   }
})

app.listen(port,()=>{
  console.log(`Extech server app listens on : http://localhost:${port}`);
})