import React, { useState } from "react";
import { createContext } from "react";
export const searchContext = createContext();

function SearchContext({ children }) {
  const [searchKey, setSearchKey] = useState("");
  return (
    <>
      <searchContext.Provider value={{searchKey,setSearchKey}}>{children}</searchContext.Provider>
    </>
  );
}

export default SearchContext;
