// 📁 src/context/NavbarVisibilityContext.jsx
import React, { createContext, useContext, useState } from "react";

const NavbarVisibilityContext = createContext();

export const NavbarVisibilityProvider = ({ children }) => {
  const [showNavbar, setShowNavbar] = useState(true);
  return (
    <NavbarVisibilityContext.Provider value={{ showNavbar, setShowNavbar }}>
      {children}
    </NavbarVisibilityContext.Provider>
  );
};

export const useNavbarVisibility = () => useContext(NavbarVisibilityContext);
