import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign-up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login, authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => { 
    event.preventDefault();
    
    
    if (currentState === "Sign-up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      console.log("Data submitted, showing bio field:", { currentState, isDataSubmitted });
     
      return;
    }

    
    console.log("Submitting login with data:", { fullName, email, password, bio });
    
 
    const endpoint = currentState === 'Sign-up' ? "signup" : "login";
    
    const loginData = currentState === 'Sign-up' 
      ? { fullName, email, password, bio }
      : { email, password };
    
   
    try {
      const success = await login(endpoint, loginData);

  

    } catch (error) {
      console.error("Login failed:", error);
    
    }
  };

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center  
    justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* -----left ------*/}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]'/>
      {/* -----right ------*/}
      
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col  
      gap-6 rounded-lg shadow-lg '>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState}

          {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} 
          src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>}
        </h2>

        {currentState === "Sign-up" && !isDataSubmitted && (
          <input 
            type="text" 
            className='p-2 border border-gray-500 rounded-md focus:outline-none' 
            placeholder="Full Name" 
            required 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)} 
          />
        )}

        {!isDataSubmitted && (
          <>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              type="email" 
              placeholder='Email Address' 
              required 
              className='p-2 border border-gray-500 rounded-md focus:outline-none 
              focus:ring-2 focus:ring-indigo-500 ' 
            />

            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
              type="password" 
              placeholder='Password..' 
              required 
              className='p-2 border border-gray-500 rounded-md focus:outline-none 
              focus :ring-2 focus:ring-2 focus:ring-indigo-500 ' 
            />
          </>
        )}

        {currentState === "Sign-up" && isDataSubmitted && (
          <textarea 
            onChange={(e) => setBio(e.target.value)} 
            value={bio}
            rows={4} 
            className="p-2 border border-gray-500 rounded-md focus:outline-none 
            focus:ring-2 focus:ring-indigo-500" 
            placeholder='Provide a short bio...' 
            required 
          />
        )}

        <button type='submit' className='py-3 bg-gradient-to-r 
        from-purple-400 to-violet-600 text-white rounded-md cursor-pointer '>
          {currentState === "Sign-up" ? 
            (isDataSubmitted ? "Create Account" : "Continue") : 
            "Login Now"
          }
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currentState === "Sign-up" ? (
            <p className='text-sm text-gray-600'>
              Already have an account ? 
              <span 
                onClick={() => {
                  setCurrentState("Login"); 
                  setIsDataSubmitted(false);
                  // Reset form data when switching
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setBio("");
                }}
                className='font-medium text-violet-500 cursor-pointer'
              >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create an account 
              <span 
                onClick={() => {
                  setCurrentState("Sign-up");
                  setIsDataSubmitted(false);
                  // Reset form data when switching
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setBio("");
                }}
                className='font-medium text-violet-500 cursor-pointer'
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage