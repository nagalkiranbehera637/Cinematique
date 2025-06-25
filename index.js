import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import dotenv from "dotenv"
dotenv.config()
const PORT=process.env.PORT|| 3000;
var config={
    headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTRmMjQxOWZmNjgxMzIzN2JkY2YxYWE1MjBmNWRhNCIsIm5iZiI6MTczNTYxNDIwNS41MDQsInN1YiI6IjY3NzM1ZWZkYmYxMGZmMTk4NDYyMDQ1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.joh8uzcQ1uVAiT1_JsWVxGklOusdvSqFqaR4_a0FF5g'
    }
}
const Api_url="https://api.themoviedb.org/3"
const app=express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", async (req, res) => {
    try {
        const request = await axios.get(Api_url+"/trending/all/day?language=en-US", config);
        console.log(request.data.results.length);
        var length=request.data.results.length;
        var result=request.data ;
        res.render('index.ejs', { content: result,length}); // Send only once
    } catch (e) {
        console.error("Error in client side", e);
        res.sendStatus(404);
    }
});
var searchbar="";
app.post("/search",(req,res)=>{
searchbar=req.body.search;
console.log(searchbar)
res.redirect("/searchbar")
})
// 
app.get("/searchbar",async(req,res)=>{
    try {
        const request =await axios.get(Api_url+`/search/multi?query=${searchbar}`,config)
    //    console.log(request.data.results );
        var length1=request.data.results.length;
        var result=request.data.results ;
        
        let final_result = [];

for(var i=0;i<length1;i++){
if(result[i].poster_path!=null ){
    final_result.push(result[i])
}
}
res.render('search.ejs', { content: final_result, length2:final_result.length, searchbar });


    } catch (e) {
        console.error("Error in client side", e);
        res.sendStatus(404);
    }

})
// 
app.get("/card/:id",async(req,res)=>{
    const {id}=req.params;
    const {type}=req.query;
    
    // console.log(id,type);
    try{
    const request=await axios.get(Api_url+`/${type}/${id}?language=en-US`,config)
      const release_date=request.data.release_date;
    //   console.log(request.data)
      const rating=Math.round((request.data.vote_average)*10)/10;
      
        res.render('card.ejs',{card:request.data,rating,release_date})   
    }catch(e){
        res.sendStatus(404);
        console.log(`Client side error`,e.message)
    }
})
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
