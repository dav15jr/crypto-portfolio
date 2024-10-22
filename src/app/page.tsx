'use client'

import Image from "next/image";
import { useState } from "react";
import { useCryptoContext } from "./Context/context";

export default function Home() {
  
const [coinSearch, setCoinSearch] = useState<string>('')
const { coinList, currency, setCurrency, coinTable, setCoinTable  } = useCryptoContext()

function handleInput(e : React.ChangeEvent<HTMLInputElement>) {
    setCoinSearch(e.target.value)
    if (e.target.value === "") {
      setCoinTable(coinList)
    }
  }
async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const coins = await coinList.filter((coin)=> { 
      return coin.name.toLowerCase().includes(coinSearch.toLowerCase())
      })
      setCoinTable(coins)
  }

function selectCurrency (e: React.ChangeEvent<HTMLSelectElement>) {

    if(e.target.value === "usd") {
      setCurrency({name:'usd' , symbol:'$'})
    }
    else if(e.target.value === "gbp") {
      setCurrency({name:'gbp', symbol:'£'})
    }
    else if(e.target.value === "eur") {
      setCurrency({name:'eur', symbol:'€'})
    }
   }
  
  return (
 
  <div className="font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col w-full min-h-screen items-center justify-center">
      <h1 className="h1">Welcome to CRYPTONIQ</h1>
      <p> Check the latest prices and update your portfolio</p>
      <form onSubmit={handleSearch}>
        <input
        type="text"
        placeholder="Enter your Crypto"
        list="coinlist"
        onChange={handleInput}
        value={coinSearch}
        className="text-red-800 text-center bg-green-100 border border-red-900 rounded-lg"
        required
        /> 
        <datalist id='coinlist'>
          {coinList.map((coin, index)=>(<option key={index} value={coin.name}/>))}
        </datalist>
        <button className="border border-green-900 bg-green-500 rounded-lg px-2 m-4 transition active:scale-90 hover:bg-green-300"  type="submit">Search</button>
      </form>

      <select onChange={selectCurrency}>
          <option value="usd">$ USD</option>
          <option value="gbp">£ GBP</option>
          <option value="eur">€ EUR</option>
      </select>


      <div className="bg-purple-200 rounded-xl mx-auto">
        <div className="crypto-list bg-purple-700 text-white p-3 rounded-t-xl">
          <p>Rank</p> 
          <p>Coin</p>
          <p className="px-5">Price</p> 
          <p className="flex justify-end">24h change </p>
          <p className="flex justify-end">ATH </p>
        </div>
        {coinTable.slice(0,10).map((coin) => (
          <div key={coin.id} className="crypto-list items-center p-2">
            <p>{coin.market_cap_rank}</p>
            <div className="flex items-center gap-2">
              <Image alt={`${coin.id}logo`} width={40} height={40} src={coin.image}/>
              <p>{coin.name} ({coin.symbol})</p>
            </div>
            <p className="px-5">{currency.symbol}{coin.current_price}</p>
            <p className="flex justify-end">{(coin.price_change_percentage_24h.toFixed(2))}%</p>
            <p className="flex justify-end">{currency.symbol}{(coin.ath.toFixed(2))}</p>
          </div>
        ))}
      </div>
    </main>
  </div>
  );
}
