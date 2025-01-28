import { createContext, useContext, useEffect, useState } from "react";
import appUrl from "../appUrl";
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export const AuthContext = createContext();

const appurl = appUrl();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [loggedUser, setLoggedUser] = useState({
        username: "",
        email:"",
        mobile_number:"",
        profile_image: null,
    });
    const [isLandlord,setIsLandlord] = useState(() => {
        const storedIsLandlord = localStorage.getItem("role");
        return storedIsLandlord === "tenant" ? false : true;
    });

    // const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
        return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
    });
    const authorizationToken = `Bearer ${token}`

    const storeTokenInLS = async (serverToken) => {
        localStorage.setItem('token', serverToken);
        setToken(serverToken);
        console.log("Token stored", serverToken);
        setIsLoggedIn(true);
    };
    localStorage.setItem("isLoggedIn", isLoggedIn)

    console.log(loggedUser, "Logged user data");

    const userAuthentication = async () => {
        try {
            console.log(token, "nooo")
            const response = await fetch(`${appurl}/user/auth/profile`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const responseData = await response.json();
            if (response.ok && responseData.code === 200) {
                setLoggedUser(responseData.data);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };

    useEffect(() => {
        userAuthentication();
    }, [token]);

    return (
        <>
            <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, loggedUser, setLoggedUser, authorizationToken,isLandlord,setIsLandlord}}>
                {children}
            </AuthContext.Provider>
            <NotificationContainer />
        </>
    );
};

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return authContext;
};
