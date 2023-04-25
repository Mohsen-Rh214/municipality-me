import React, { createContext, useState } from "react";


const DrawerContext = createContext();

const DrawerProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <DrawerContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </DrawerContext.Provider>
    );
};

export { DrawerProvider, DrawerContext }