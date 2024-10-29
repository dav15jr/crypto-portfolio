'use client'

import { useState } from "react";
import CryptoForm from "../Components/CryptoForm";
import { CoinInfo, Currency} from "../types";

import DcaForm from "../Components/DcaForm";
import PortfolioTable from "../Components/PortfolioTable";
import DcaTable from "../Components/DcaTable";

export default function Portfolio() {

  const defaultCoinInfo: CoinInfo = {
    symbol: '',
    name: "",
    image:{
      small:"",
      } ,
    market_data: {
      current_price: {
        usd: 0,
        gbp: 0,
        eur: 0,
      }}
    }

  const [coinInfo, setCoinInfo] = useState<CoinInfo>(defaultCoinInfo)
  const [coinDate, setCoinDate] = useState<string>('')
  const [formDate, setFormDate] = useState<string>('')
  const [coinName, setCoinName] = useState<string>('')
  const [invAmount, setInvAmount] = useState<string>('')
  const [coinQty, setCoinQty] = useState<string>('')
  const [priceNow, setPriceNow] = useState(0)

  const [coinPrice, setCoinPrice] = useState<string>('0')
  const [coinCurrency, setCoinCurrency] = useState<Currency>({name:'usd', symbol:'$'})
  const [showDcaForm, setShowDcaForm] = useState<boolean>(false)


  return ( 
    <main className="flex flex-col w-full min-h-screen items-center justify-center">
      <h1>WELCOME TO YOUR PORTFOLIO</h1>
      <CryptoForm 
        coinInfo = {coinInfo} 
        coinName = {coinName} 
        setCoinName = {setCoinName} 
        coinDate = {coinDate} 
        setCoinDate = {setCoinDate} 
        formDate = {formDate} 
        setFormDate = {setFormDate}
        setCoinInfo = {setCoinInfo}
        setPriceNow = {setPriceNow}
        coinCurrency = {coinCurrency}
        setCoinCurrency = {setCoinCurrency}
        setCoinPrice = {setCoinPrice}
        setShowDcaForm = {setShowDcaForm}

        />
      {showDcaForm &&
        <DcaForm 
          coinInfo = {coinInfo} 
          coinPrice = {coinPrice} 
          setCoinName = {setCoinName} 
          coinQty = {coinQty} 
          setCoinQty = {setCoinQty}
          setCoinDate = {setCoinDate} 
          invAmount = {invAmount} 
          setInvAmount = {setInvAmount}
          setFormDate = {setFormDate}
          priceNow = {priceNow}
          coinCurrency = {coinCurrency}
          setShowDcaForm = {setShowDcaForm}
        
        />
      }
      <p>Coin:{coinInfo.name} ({coinInfo.symbol})</p>
      <p>Price: {`${coinCurrency.symbol} ${coinPrice}`}</p>
      <p>DCA ({coinCurrency.symbol}): {`${coinCurrency.symbol} ${invAmount}`}</p>
      <p>DCA(amount): {`${coinQty} ${coinInfo.name}`}</p>

    <PortfolioTable />

    <DcaTable />
    
    </main>
  )
}
