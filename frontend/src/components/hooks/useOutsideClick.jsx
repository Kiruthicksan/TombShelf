import { useEffect } from "react"

const useOutsideClick = (ref, callback) => {
   useEffect(() => {
       const handleClick = (e) => {
        if(ref.current && !ref.current.contains(event.target)){
            callback()
        }
       }

       document.addEventListener("click" , handleClick)
       return () => document.removeEventListener("click", handleClick)
   }, [ref,callback])
}
export default useOutsideClick