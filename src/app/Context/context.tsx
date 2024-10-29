'use client'

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Currency, Coin, Context, Ledger } from "../types";

const CryptoContext = createContext<Context | null>(null)

export default function CryptoListProvider({ children, } : {children : React.ReactNode }) 

{
    const [coinList, setCoinList] = useState<Coin[]>([])
    const [coinTable, setCoinTable] = useState<Coin[]>([])
    const [currency, setCurrency] = useState<Currency>({name:'usd', symbol:'$'})
    
    const storedPortfolio = localStorage.getItem("portfolio");
    const [portfolio, setPortfolio] = useState<Ledger[]>(() => storedPortfolio ? JSON.parse(storedPortfolio) : [])


    async function getCoinsList(currency: Currency) {
      // const response = await axios.get(`https://api.coingecko.com/api/v3/coins/list`)
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`)
      
      setCoinList(response.data)
      setCoinTable(response.data)
      }
    
    useEffect(() => {
        getCoinsList(currency)
      },[currency])

  // Load portfolio from local storage if it exists
  useEffect(() => {
    const storedPortfolio = localStorage.getItem("portfolio");
    if (storedPortfolio) {
      setPortfolio(JSON.parse(storedPortfolio));
      console.log("Loaded Portfolio,", storedPortfolio)
    }
  }, []);



return (
    <CryptoContext.Provider 
    value={{
      coinList, 
      currency,
      setCurrency,
      coinTable, 
      setCoinTable,
      portfolio,
      setPortfolio, 
      }}>
        {children}
    </CryptoContext.Provider>
    )
}

export function useCryptoContext() {

  const context = useContext(CryptoContext);
  
  if (!context) {
    throw new Error("useCryptoContext must be used within a CryptoProvider");
  }

  return context; // At this point, context is guaranteed to not be null
}
