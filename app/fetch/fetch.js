import {IP_URL}from "@env"
import { useState } from "react"

const [getData,setGetData ]= useState()
const fetch = async(method,url,data) =>{
    
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
export default fetch 
// name: name,
// height: height,
// weight:weight,
// exerciseLevel:exerciseLevel,
// goal:goal,
// comment:comment,