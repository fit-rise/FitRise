// AppContext.js
import React, { createContext, useState, useContext } from 'react';
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const [trigger, setTrigger] = useState(false);

  // Function to trigger the update
  const triggerUpdate = () => {
    setTrigger(prev => !prev); // Toggles the trigger to ensure a change
  };

  return (
    <AppContext.Provider value={{ trigger, triggerUpdate }}>
      {children}
    </AppContext.Provider>
  );
};
