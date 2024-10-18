'use client'

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
// import CryptoForm from "../Components/CryptoForm";
import { CoinInfo, Currency } from "../types";
import { useCryptoContext } from "../Context/context";
// import Image from "next/image";

export default function Portfolio() {

  const [coinInfo, setCoinInfo] = useState<CoinInfo>()
  const [coinDate, setCoinDate] = useState('')
  const [formDate, setFormDate] = useState('')
  const [coinName, setCoinName] = useState('')
  const [maxDate, setMaxDate] = useState('')
  const [minDate, setMinDate] = useState('')
  const [coinPrice, setCoinPrice] = useState<string | null>('0')
  const [coinSelected, setCoinSelected] = useState('')
  const [coinCurrency, setCoinCurrency] = useState<Currency['symbol']>('$')
  const { coinList } = useCryptoContext()
  const usdPrice = coinInfo?.market_data.current_price.usd
  const gbpPrice = coinInfo?.market_data.current_price.gbp
  const eurPrice = coinInfo?.market_data.current_price.eur



  const getCurrentDate = () => {  // get current date to limit choosing future date for progress entry.
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    const minYear = today.getFullYear() - 1;
  
    setMaxDate(`${year}-${month}-${day}`)
    setMinDate(`${minYear}-${month}-${day}`)
  };

  useEffect(() => {
    getCurrentDate()
  });


  function convDate(date: string) {
    const dateSplit = date.split("-")
    const formattedDate = `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`
    setCoinDate(formattedDate)
  }

  async function getCoinInfo(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinName}/history?date=${coinDate}}`)
    setCoinInfo(response.data)
    selectPrice()
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if(e.target.name === "name"){
        setCoinSelected(e.target.value)

        // Find the coin object by its name 
        const selectedCoin = coinList.find(coin => coin.name === e.target.value);
        
        if (selectedCoin) {
            setCoinName(selectedCoin.id)
        } else {
            console.log('Coin not found');
        }
    } else if (e.target.name === "date"){
        const selectedDate = e.target.value
        convDate(selectedDate)
        setFormDate(selectedDate)
    }
 }

 const selectPrice = useCallback(() => {
  let price: string | undefined;

  switch (coinCurrency) {
    case '$':
      price = usdPrice?.toFixed(2)
      break;
    case '£':
      price = gbpPrice?.toFixed(2)
      break;
    case '€':
      price = eurPrice?.toFixed(2)
      break;
    default:
  }
  setCoinPrice(price || 'N/A');
  }, [coinCurrency, usdPrice, gbpPrice, eurPrice])

    useEffect(() => {
      selectPrice();
    }, [coinCurrency, selectPrice]);

  return ( 
    <main className="flex flex-col w-full min-h-screen items-center justify-center">
      <div>WELCOME TO YOUR PORTFOLIO</div>
      {/* <CryptoForm /> */}

      <form onSubmit={getCoinInfo}>
        <input
          type="text"
          name='name'
          placeholder="Enter your Crypto"
          list="coinlist"
          value={coinSelected}
          onChange={handleChange}
          required
          />
        <input
          type="date"
          name='date'
          placeholder=""
          max={maxDate}
          min={minDate}
          value={formDate}
          onChange={handleChange}
          className="text-red-800 text-center bg-green-100 border border-red-900 rounded-lg"
          required
        /> 
      <datalist id='coinlist'>
      {coinList.map((coin, index)=>(<option key={index} value={coin.name}/>))}
      </datalist>
      <select onChange={(e)=> setCoinCurrency(e.target.value)} required>
          <option value="">Currency</option>
          <option value='$'>$ USD</option>
          <option value='£'>£ GBP</option>
          <option value='€'>€ EUR</option>
      </select>
      <button 
          className="border border-slate-700 bg-blue-500 rounded-lg px-2 m-4 hover:bg-blue-300" 
          type='submit'>
          Get Coin Price
      </button>
      </form>
      <p>Coin:{coinInfo?.name} ({coinInfo?.symbol})</p>
      <p>Price: {`${coinCurrency} ${coinPrice}`}</p>
      <p>DCA(amount): {`${coinCurrency} ${Number(coinPrice)*2}`}</p>
      <p>DCA($): {`${100/Number(coinPrice)} ${coinInfo?.name}`}</p>
    </main>
  )
}
