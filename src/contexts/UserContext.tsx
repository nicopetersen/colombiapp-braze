import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";

const UserContext = createContext<{
    user: any;
    setUser: any;
}>(null);

const UserContextProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>(
        typeof localStorage != "undefined" &&
            localStorage.getItem("user") &&
            JSON.parse(localStorage.getItem("user") || "")
    );

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else localStorage.removeItem("user");
    }, [user]);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
            } else {
                setUser(null);
            }
        });
        // setUser(null);
        // router.push("/login");
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContextProvider, UserContext };
