'use client'

import { useState } from "react";
import axios from "axios";
// import Image from "next/image";

type CoinPrice = {
  symbol: string
  name: string
  image:{
    small:string
    } 
  market_data: {
    current_price: {
      usd: number
      gbp: number
      eur: number
    }}
}



export default function Portfolio() {

  const [coinPrice, setCoinPrice] = useState<CoinPrice>()

  const usdPrice = coinPrice?.market_data.current_price.usd
  const gbpPrice = coinPrice?.market_data.current_price.gbp
  const eurPrice = coinPrice?.market_data.current_price.eur


  async function getCoinPrice() {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=30-6-2024`)
    console.log("Coin Price Data",response.data)
    setCoinPrice(response.data)
  }


  return (
    <main className="flex flex-col w-full min-h-screen items-center justify-center">
      <div>WELCOME TO YOUR PORTFOLIO</div>
      <button 
          className="border border-slate-700 bg-blue-500 rounded-lg px-2 m-4 hover:bg-blue-300" 
          onClick={()=> getCoinPrice()}>
          Get Coin Price
      </button>

      <p>Coin:{coinPrice?.name}({coinPrice?.symbol})</p>
      <p>Price: $ {(usdPrice?.toFixed(2))}</p>
      <p>Price: £ {(gbpPrice?.toFixed(2))}</p>
      <p>Price: € {(eurPrice?.toFixed(2))}</p>
    </main>
  )
}
