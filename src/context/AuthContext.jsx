import { createContext, useContext, useEffect, useState } from "react";
import { replace, useLocation, useNavigate } from "react-router-dom";
import ToastContext from "./ToastContext";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) =>{

  const {toast} = useContext(ToastContext);  
    const navigate = useNavigate();
    const location = useLocation();
    const [user,setUser] = useState(null);
    const [error,setError] = useState(null);

   
    useEffect(() => {
        checkUserLoggedIn();
    },[]);
    //check if the user is logged in.
    const checkUserLoggedIn = async () => {
     
        try {
            const res = await fetch(`http://localhost:4000/api/me`,{
                method:"get",
                headers:{
                    "Authorization":`Bearer ${localStorage.getItem("token")}`,
                },
            });
            const result = await res.json();
            if(!result.error){
                if(location.pathname === "/login" || 
                location.pathname === "/register"){
                    setTimeout(()=> {
                        navigate("/",{replace:true});

                    },500);
                }else{
                    navigate(location.pathname ? location.pathname:"/");

                }
                setUser(result);
                
            }
        } catch (err) {
            console.log(err);
        }

    }
    //login request

    const loginUser = async(credentails)=>{
        try {
            const res = await fetch ('http://localhost:4000/api/login',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",  
                },
                body:JSON.stringify({ ...credentails }),
            })
            const result = await res.json();
          if(!result.error){
           // console.log(result);
            localStorage.setItem("token", result.token);
            
            setUser(result.user);
            toast.success(`Logged in ${result.user.name}`);
            navigate("/project-management", { replace: true }); // Navigate to homepage
          }else{
            toast.error(result.error);
          }
        } catch (err) {
            console.log(err);
        }
    }
    //register request
    const registerUser = async(credentails) => {
        try {
            console.log("Sending data:", credentails); // Debug log
            const res = await fetch('http://localhost:4000/api/register',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",  
                },
                body:JSON.stringify({ ...credentails }),
            })
            const result = await res.json();
            console.log("Server response:", result); // Debug log
            if(!result.error){
               toast.success("User registered successfully!");
               navigate("/login",{replace:true})
    
              }else{
                toast.error(result.error);
              }
        } catch (err) {
            console.log(err);
        }
    }
     

    return (<AuthContext.Provider value={{ loginUser,registerUser,user,setUser}}>
        
        {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
