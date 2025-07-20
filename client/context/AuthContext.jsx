import axios from 'axios';
import { createContext, useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { io } from "socket.io-client";


// creating Authentication context

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext(null);

export const AuthProvider = ({children})=>{
     
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser,setAuthUser] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [socket,setSocket] = useState(null);

    // Check if user is authenticated and if so , set the user data and connect the socket

    const checkAuth = async ()=>{
        try { 
            const {data} = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user);

            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }
    
    // Login function to handle user authentication and socket connection

    const login = async(state,credentials)=>{
        try {
            console.log("AuthContext login called with:", { state, credentials });
            const {data} = await axios.post(`/api/auth/${state}`,credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

                setToken(data.token);
                localStorage.setItem("token",data.token);
                toast.success(data.message);
                return true;
            }
            else{
                toast.error(data.message);
                return false;

            }
            
        } catch (error) {
            toast.error(error.message);
            return false;
            
        }
    }
    // Logout function to handle user logout and socket disconnection

    const logout = async ()=>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["Authorization"] = null;

        toast.success("Logged out successfully");
        socket?.disconnect();
    }

    // update Profile function to handle user profile Updates

    const updateProfile = async (body)=>{
        try {
            const {data}  = await axios.put("/api/auth/update-profile",body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated Successfully");
            }
            
        } catch (error) {
            toast.error(error.message);
            
        }
    }



    // Connect socket function to handle socket connection and online user updates

    const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl,{
            query :{
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds);
        });
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        checkAuth();

    },[token])

    const value = {
           axios,
           authUser,
           onlineUsers,
           socket,
           login,
           logout,
           updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}




