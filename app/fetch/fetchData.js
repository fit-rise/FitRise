import {IP_URL}from "@env"
import { useState } from "react"


const fetchData = async(method,url,data) =>{

    const [getData,setGetData ]= useState()
    
    console.log("1111111111")
    console.log(method,url,data)
    
try{
    fetch(`${IP_URL}/${url}`,{
        method: method,
        headers: {
          'Content-Type': 'application/json',
            Accept: "application / json",
        },
        body: JSON.stringify({
            data
        }),
      }).then((res)=>setGetData(res.json()))
     return getData
}catch(e){
    return e
}


}
export default fetchData 
// name: name,
// height: height,
// weight:weight,
// exerciseLevel:exerciseLevel,
// goal:goal,
// comment:comment,