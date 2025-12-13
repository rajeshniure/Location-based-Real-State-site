import { Typography } from "@mui/material";
import { useEffect, useState } from "react";


function Testing() {
    const[count, setCount] = useState(1)

    useEffect(()=>{
         console.log(`The current count:${count}`)
    },[count])

    function increaseCount(){
        setCount(current => current+1);
        
    };
    function decreaseCount(){
        setCount(current => current-1);

    };

  return (
    <>
    <Typography variant="h2">The current count:{count}</Typography>
    <button onClick = {increaseCount}>Increase</button>
    <br />
    <button onClick = {decreaseCount}>Decrease</button>
    </>

  )
}

export default Testing;