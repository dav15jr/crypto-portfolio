'use client'

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
// import CryptoForm from "../Components/CryptoForm";
import { CoinInfo, Currency, Ledger} from "../types";
import { useCryptoContext } from "../Context/context";
import Image from "next/image";

export default function Portfolio() {

  const [coinInfo, setCoinInfo] = useState<CoinInfo>()
  const [coinDate, setCoinDate] = useState('')
  const [formDate, setFormDate] = useState('')
  const [coinName, setCoinName] = useState('')
  const [invAmount, setInvAmount] = useState('')
  const [coinQty, setCoinQty] = useState('')
  const [priceNow, setPriceNow] = useState(0)
  const [dcaType, setDcaType] = useState('amount')
  const [portfolio, setPortfolio] = useState<Ledger[]>([])
  const [maxDate, setMaxDate] = useState('')
  const [minDate, setMinDate] = useState('')
  const [coinPrice, setCoinPrice] = useState<string | null>('0')
  const [coinSelected, setCoinSelected] = useState('')
  const [coinCurrency, setCoinCurrency] = useState<Currency['symbol']>('$')
  const [showDcaForm, setShowDcaForm] = useState(false)

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
      if (coinName !== 'Coin not found') {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinName}/history?date=${coinDate}}`)
        setCoinInfo(response.data)
        selectPrice()
        setShowDcaForm(true)
      } else {
        alert('Coin not found');
        setCoinSelected('')
      }
  }

  function selectCoin(e: React.ChangeEvent<HTMLInputElement>) {
    if(e.target.name === "name"){
        setCoinSelected(e.target.value)
        //Find the coin object by its name 
        const selectedCoin = coinList.find(coin => coin.name === e.target.value);
        if (selectedCoin) {
            setCoinName(selectedCoin.id)
            setPriceNow(selectedCoin.current_price)
        } else {
            setCoinName('Coin not found');
        }
    } else if (e.target.name === "date"){
        const selectedDate = e.target.value
        convDate(selectedDate)
        setFormDate(selectedDate)
    } 
  }

  function handleDca(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "amount"){
      const amount = e.target.value
      const invQuantity = ((Number(amount)/Number(coinPrice)).toFixed(2)).toString()

      setCoinQty(invQuantity)
      setInvAmount(amount)

    } else if (e.target.name === "qty"){
      const quantity = e.target.value
      const invAmount = ((Number(coinPrice) * Number(quantity)).toFixed(2)).toString()

      setCoinQty(quantity)
      setInvAmount(invAmount)
      console.log('Investment Amount =', invAmount)
    }
}
  function getDca(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setShowDcaForm(false)
    const dcaValue = (Number(priceNow)* Number(coinQty))

    setPortfolio((prev : Ledger[]) => {
      const updatedPortfolio = prev.map((item) => {
        // Check if the symbol & currency already exists in the portfolio
        if (item.symbol === coinInfo?.symbol && item.currency === coinCurrency) {
          const totalInvested = (Number(item.investedAmount) + Number(invAmount)).toFixed(2).toString()
          const totalQty = (Number(item.quantity) + Number(coinQty)).toString()
          const avgPrice = ((Number(invAmount) + Number(item.investedAmount))/Number(totalQty)).toFixed(2).toString()
          const newValue = (Number(priceNow)* Number(totalQty))
          
          // Update the existing entry
          return {
            ...item,
            investedPrice: avgPrice,
            investedAmount: totalInvested,
            quantity: totalQty,
            currentValue: newValue,
          };
        } else {
          // Return unchanged items
          return item;
        }
      });
    
      // If the symbol & currency wasn't found in the previous array, add a new entry
      const isCoinInPortfolio = prev.some((item) => (item.symbol === coinInfo?.symbol && item.currency === coinCurrency));
    
      if (!isCoinInPortfolio) {
        return [
          ...updatedPortfolio,
          {
            symbol: coinInfo?.symbol,
            name: coinInfo?.name,
            image: coinInfo?.image.small,
            currency: coinCurrency,
            investedPrice: coinPrice,
            investedAmount: invAmount,
            quantity: coinQty,
            currentPrice: priceNow,
            currentValue: dcaValue,
          },
        ];
      }
    
      return updatedPortfolio;
    });

    console.log('My portfolio', portfolio)
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
      <h2>Select Your Coin</h2>
      <form onSubmit={getCoinInfo}>
        <input
          type="text"
          name='name'
          placeholder="Enter your Crypto"
          list="coinlist"
          value={coinSelected}
          onChange={selectCoin}
          required
          />
        <input
          type="date"
          name='date'
          placeholder=""
          max={maxDate}
          min={minDate}
          value={formDate}
          onChange={selectCoin}
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
      {showDcaForm &&
      <>
      <h2>Select Your Investment Type</h2>
      <form onSubmit={getDca} title='Investment type'>
        <select onChange={(e)=> setDcaType(e.target.value)} required>
          <option value=''>Select Type</option>
          <option value='amount'>Cash Amount ($,€,£)</option>
          <option value='qty'>Coin Quantity</option>
        </select>
        <>
          { 
          dcaType === 'amount'?      
          <input
          type="number"
          name='amount'
          placeholder="Investment amount"     
          value={invAmount}
          onChange={handleDca}
          required
          />
          :
          <input
          type="number"
          name='qty'
          placeholder="Coin quantity"     
          value={coinQty}
          onChange={handleDca}
          required
          />}
        </>
        <button 
          className="border border-slate-700 bg-blue-500 rounded-lg px-2 m-4 hover:bg-blue-300" 
          type='submit'
          >
          Add Coin DCA
        </button>
      </form>
      </>
      }
      <p>Coin:{coinInfo?.name} ({coinInfo?.symbol})</p>
      <p>Price: {`${coinCurrency} ${coinPrice}`}</p>
      <p>DCA ({coinCurrency}): {`${coinCurrency} ${invAmount}`}</p>
      <p>DCA(amount): {`${coinQty} ${coinInfo?.name}`}</p>
<div className="div">
<div className="portfolio-layout bg-purple-700 text-white p-3 rounded-t-xl">
      <p>Coin</p>
      <p className="px-5">Price</p> 
      <p className="px-5">Invested</p>
      <p className="px-5">Quantity</p>
      <p className="px-5">Current Price</p> 
      <p className="flex justify-end">Current Value</p>
</div>

{portfolio.map((coin) => (
          <div key={`${coin.symbol}${coin.currency}`} className="portfolio-layout items-center p-2">
            <div className="flex items-center gap-2">
              <Image alt={`${coin.symbol}logo`} width={40} height={40} src={coin.image}/>
              <p>{coin.name} ({coin.currency})</p>
            </div>
            <p className="px-5">{coin.currency}{coin.investedPrice}</p>
            <p className="px-5">{coin.currency}{coin.investedAmount}</p>
            <p className="px-5">{coin.quantity}{coin.symbol}</p>
            <p className="px-5">{coin.currency}{coin.currentPrice}</p>
            <p className="flex justify-end">{coin.currency}{(coin.currentValue.toFixed(2))}</p>
          </div>
        ))}
{/* {coinList.slice(0,10).map((coin) => (
          <div key={coin.id} className="grid-layout items-center p-2">
            <p>{coin.market_cap_rank}</p>
            <div className="flex items-center gap-2">
              <Image alt={`${coin.id}logo`} width={40} height={40} src={coin.image}/>
              <p>{coin.name} ({coin.symbol})</p>
            </div>
            <p className="px-5">{coinCurrency}{coin.current_price}</p>
            <p className="flex justify-end">{(coin.price_change_percentage_24h.toFixed(2))}%</p>
            <p className="flex justify-end">{coinCurrency}{(coin.ath.toFixed(2))}</p>
          </div>
        ))} */}
</div>

    </main>
  )
}
