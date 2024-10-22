'use client'

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Currency, Coin, Context } from "../types";

const CryptoContext = createContext<Context | null>(null)

export default function CryptoListProvider({ children, } : {children : React.ReactNode }) 

{
    const [coinList, setCoinList] = useState<Coin[]>([])
    const [coinTable, setCoinTable] = useState<Coin[]>([])
    const [currency, setCurrency] = useState<Currency>({name:'usd', symbol:'$'})
    
    async function getCoinsList(currency: Currency) {
      // const response = await axios.get(`https://api.coingecko.com/api/v3/coins/list`)
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`)
      
      setCoinList(response.data)
      setCoinTable(response.data)
      }
    
    useEffect(() => {
        getCoinsList(currency)
      },[currency])

return (
    <CryptoContext.Provider 
    value={{
      coinList, 
      currency,
      setCurrency,
      coinTable, 
      setCoinTable
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
