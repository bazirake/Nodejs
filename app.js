
require("dotenv").config();
const express=require("express");
const app=express();

const port=process.env.port || 422;
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
   res.send("Welcome to Extech server configuration");
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

app.listen(port,()=>{
  console.log(`Extech server app listens on : http://localhost:${port}`);
})