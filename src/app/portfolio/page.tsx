'use client'

import { useState } from "react";
import axios from "axios";
import CryptoForm from "../Components/CryptoForm";
import { CoinInfo } from "../types";

// import Image from "next/image";

export default function Portfolio() {

  const [coinInfo, setCoinInfo] = useState<CoinInfo>()
  const [coinCurrency, setCoinCurrency] = useState<string>("")

  const usdPrice = coinInfo?.market_data.current_price.usd
  const gbpPrice = coinInfo?.market_data.current_price.gbp
  const eurPrice = coinInfo?.market_data.current_price.eur

  async function getCoinInfo() {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=30-6-2024`)
    console.log("Coin Price Data",response.data)
    setCoinInfo(response.data)
  }


  return ( 
    <main className="flex flex-col w-full min-h-screen items-center justify-center">
      <div>WELCOME TO YOUR PORTFOLIO</div>
      <CryptoForm />

      <form>
        <input
          type="text"
          placeholder="Enter your Crypto"
          list="coinlist"
          onChange={handleInput}
          required
          />
        <input
          type="date"
          placeholder=""
          onChange={handleDate}
          className="text-red-800 text-center bg-green-100 border border-red-900 rounded-lg"
          required
        /> 
      <datalist id='coinlist'>
      {coinList.map((coin, index)=>(<option key={index} value={coin.name}/>))}
      </datalist>
      <select onChange={()=> setCoinCurrency(event.target.value)}>
          <option value="usd">$ USD</option>
          <option value="gbp">£ GBP</option>
          <option value="eur">€ EUR</option>
      </select>

      </form>
      <button 
          className="border border-slate-700 bg-blue-500 rounded-lg px-2 m-4 hover:bg-blue-300" 
          onClick={()=> getCoinInfo()}>
          Get Coin Price
      </button>
      <p>Coin:{coinInfo?.name}({coinInfo?.symbol})</p>
      <p>Price: $ {(usdPrice?.toFixed(2))}</p>
      <p>Price: £ {(gbpPrice?.toFixed(2))}</p>
      <p>Price: € {(eurPrice?.toFixed(2))}</p>
    </main>
  )
}
