'use client'

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
// import CryptoForm from "../Components/CryptoForm";
import { CoinInfo, Currency, Ledger} from "../types";
import { useCryptoContext } from "../Context/context";
import Image from "next/image";

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
  const [coinDate, setCoinDate] = useState('')
  const [formDate, setFormDate] = useState('')
  const [coinName, setCoinName] = useState('')
  const [invAmount, setInvAmount] = useState('')
  const [coinQty, setCoinQty] = useState('')
  const [priceNow, setPriceNow] = useState(0)
  const [dcaType, setDcaType] = useState('amount')
  const [maxDate, setMaxDate] = useState('')
  const [minDate, setMinDate] = useState('')
  const [coinPrice, setCoinPrice] = useState<string>('0')
  const [coinSelected, setCoinSelected] = useState('')
  const [coinCurrency, setCoinCurrency] = useState<Currency>({name:'usd', symbol:'$'})
  const [showDcaForm, setShowDcaForm] = useState(false)

  const storedPortfolio = localStorage.getItem("portfolio");
  const [portfolio, setPortfolio] = useState<Ledger[]>(() => storedPortfolio ? JSON.parse(storedPortfolio) : [])

  const [totalUSDInvested, setTotalUSDInvested] = useState(0)
  const [totalUSDValue, setTotalUSDValue] = useState(0)
  const [totalUSDPnl, setTotalUSDPnl] = useState(0)
  const [totalUSDPnlPct, setTotalUSDPnlPct] = useState(0)
  const [totalGBPInvested, setTotalGBPInvested] = useState(0)
  const [totalGBPValue, setTotalGBPValue] = useState(0)
  const [totalGBPPnl, setTotalGBPPnl] = useState(0)
  const [totalGBPPnlPct, setTotalGBPPnlPct] = useState(0)
  const [totalEURInvested, setTotalEURInvested] = useState(0)
  const [totalEURValue, setTotalEURValue] = useState(0)
  const [totalEURPnl, setTotalEURPnl] = useState(0)
  const [totalEURPnlPct, setTotalEURPnlPct] = useState(0)

  const { coinList } = useCryptoContext()
  const usdPrice = coinInfo.market_data.current_price.usd
  const gbpPrice = coinInfo.market_data.current_price.gbp
  const eurPrice = coinInfo.market_data.current_price.eur


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
  // Load portfolio from local storage if it exists
  useEffect(() => {
    const storedPortfolio = localStorage.getItem("portfolio");
    if (storedPortfolio) {
      setPortfolio(JSON.parse(storedPortfolio));
      console.log("Loaded Portfolio,", storedPortfolio)
    }
  }, []);

  async function getCoinInfo(e : React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      if (coinName !== 'Coin not found') {
        const historicData = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinName}/history?date=${coinDate}}`)
        const currentData = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=${coinCurrency.name}`)
        setCoinInfo(historicData.data)
        setPriceNow(currentData.data[coinName][coinCurrency.name])
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
    setCoinDate('')
    setCoinName('')
    setInvAmount('')
    setCoinQty('')
    setFormDate('')

    const dcaValue = (Number(priceNow)* Number(coinQty))

    setPortfolio((prev : Ledger[]) => {
      const updatedPortfolio = prev.map((item) => {
        // Check if the symbol & currency already exists in the portfolio
        if (item.symbol === coinInfo.symbol && item.currency === coinCurrency) {
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
      const isCoinInPortfolio = prev.some((item) => (item.symbol === coinInfo.symbol && item.currency === coinCurrency));
    
      if (!isCoinInPortfolio) {
        return [
          ...updatedPortfolio,
          {
            symbol: coinInfo.symbol,
            name: coinInfo.name,
            image: coinInfo.image.small,
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
  }

  function selectCurrency (e: React.ChangeEvent<HTMLSelectElement>) {
    if(e.target.value === "usd") {
      setCoinCurrency({name:'usd' , symbol:'$'})
    }
    else if(e.target.value === "gbp") {
      setCoinCurrency({name:'gbp', symbol:'£'})
    }
    else if(e.target.value === "eur") {
      setCoinCurrency({name:'eur', symbol:'€'})
    }
   }

    const selectPrice = useCallback(() => {
      let price = '0';

      switch (coinCurrency.name) {
        case 'usd':
          price = usdPrice.toFixed(2)
          break;
        case 'gbp':
          price = gbpPrice.toFixed(2)
          break;
        case 'eur':
          price = eurPrice.toFixed(2)
          break;
        default:
      }
      setCoinPrice(price);
      }, [coinCurrency, usdPrice, gbpPrice, eurPrice])

    useEffect(() => {
      selectPrice();
    }, [coinCurrency, selectPrice]);

    useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));

    let totalUSDValue = 0;
    let totalUSDInvested = 0;
    let totalGBPValue = 0;
    let totalGBPInvested = 0;
    let totalEURValue = 0;
    let totalEURInvested = 0;

    portfolio.forEach((coin) => {
      if (coin.currency.name === 'usd') {
        totalUSDValue += coin.currentValue;
        totalUSDInvested += Number(coin.investedAmount);
      } else if (coin.currency.name === 'gbp') {
        totalGBPValue += coin.currentValue;
        totalGBPInvested += Number(coin.investedAmount);
      } else if (coin.currency.name === 'eur') {
        totalEURValue += coin.currentValue;
        totalEURInvested += Number(coin.investedAmount);
      }
    });
    // After the loop, update the state
    const usdPnl = totalUSDValue - totalUSDInvested;
    const usdPnlPct = totalUSDInvested !==0 ? (usdPnl / totalUSDInvested) * 100 : 0;  // Profit and Loss % of total USD Invested
    setTotalUSDValue(totalUSDValue);
    setTotalUSDInvested(totalUSDInvested);
    setTotalUSDPnl(usdPnl)
    setTotalUSDPnlPct(usdPnlPct);
    
    const gbpPnl = totalGBPValue - totalGBPInvested;
    const gbpPnlPct = totalGBPInvested !==0 ? (gbpPnl / totalGBPInvested) * 100 : 0;  // Profit and Loss % of total GBP Invested
    setTotalGBPValue(totalGBPValue);
    setTotalGBPInvested(totalGBPInvested);
    setTotalGBPPnl(gbpPnl)
    setTotalGBPPnlPct(gbpPnlPct);
    
    const eurPnl = totalEURValue - totalEURInvested;
    const eurPnlPct = totalEURInvested !== 0 ? (eurPnl / totalEURInvested) * 100 : 0;  // Profit and Loss % of total EUR Invested
    setTotalEURValue(totalEURValue);
    setTotalEURInvested(totalEURInvested);
    setTotalEURPnl(eurPnl);
    setTotalEURPnlPct(eurPnlPct);

    }, [portfolio]); // recalculate when the portfolio changes

    const deleteCoin = (name:string, currency:string) => {
      setPortfolio((prevPortfolio) =>
        prevPortfolio.filter(
          (item) => !(item.name === name && item.currency.name === currency)
        )
      );
    };

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
      <select name="coincurrency" onChange={selectCurrency} required>
          <option value="">Currency</option>
          <option value='usd'>$ USD</option>
          <option value='gbp'>£ GBP</option> 
          <option value='eur'>€ EUR</option> 
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
        <select name="investmenttype" onChange={(e)=> setDcaType(e.target.value)} required>
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
      <p>Coin:{coinInfo.name} ({coinInfo.symbol})</p>
      <p>Price: {`${coinCurrency.symbol} ${coinPrice}`}</p>
      <p>DCA ({coinCurrency.symbol}): {`${coinCurrency.symbol} ${invAmount}`}</p>
      <p>DCA(amount): {`${coinQty} ${coinInfo.name}`}</p>

    <div className="overflow-x-auto m-3 bg-zinc-100 dark:bg-neutral-700 rounded-xl">
      <table className="table-auto min-w-full text-left text-sm whitespace-nowrap">
        <thead className="tracking-wider border-b-2 text-white dark:border-neutral-600 border-t">
          <tr className="bg-purple-500 border border-purple-500">
            <th scope="col" className="px-6 py-2 border-x dark:border-neutral-600">
            </th>
            <th scope="col" className="px-6 py-2 border-x dark:border-neutral-600">
              Invested
            </th>
            <th scope="col" className="px-6 py-2 border-x dark:border-neutral-600">
              Value
            </th>
            <th scope="col" className="px-6 py-2 border-x dark:border-neutral-600">
              PnL
            </th>
            <th scope="col" className="px-6 py-2 border-x dark:border-neutral-600">
              PnL(%)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b dark:border-neutral-600 hover:bg-purple-100 dark:hover:bg-neutral-600">
            <th scope="row" className="px-6 py-2 border-x dark:border-neutral-600">
              USD ($)
            </th>
            <td className="px-6 py-2 border-x dark:border-neutral-600">${totalUSDInvested.toFixed(2)}</td>
            <td className="px-6 py-2 border-x dark:border-neutral-600">${totalUSDValue.toFixed(2)}</td>
          <td className={`px-6 py-2 border-x dark:border-neutral-600 ${totalUSDPnl === 0 ? '' : totalUSDPnl > 0 ? 'text-green-600' : 'text-red-600'}`}> ${totalUSDPnl.toFixed(2)}</td>
          <td className={`px-6 py-2 border-x dark:border-neutral-600 ${totalUSDPnlPct === 0 ? '' : totalUSDPnlPct > 0 ? 'text-green-600' : 'text-red-600'}`}> {totalUSDPnlPct.toFixed(2)}%</td> 
          </tr>
          <tr className="border-b dark:border-neutral-600 hover:bg-purple-100 dark:hover:bg-neutral-600">
            <th scope="row" className="px-6 py-2 border-x dark:border-neutral-600">
              GBP (£)
            </th>
            <td className="px-6 py-2 border-x dark:border-neutral-600">£{totalGBPInvested.toFixed(2)}</td>
            <td className="px-6 py-2 border-x dark:border-neutral-600">£{totalGBPValue.toFixed(2)}</td>
            <td className={`px-6 py-2 border-x dark:border-neutral-600 ${totalGBPPnl === 0 ? 'text-red-200' : totalGBPPnl > 0 ? 'text-green-600' : 'text-red-600'}`}>£{totalGBPPnl.toFixed(2)}</td>
            <td className={`px-6 py-2 border-x dark:border-neutral-600 ${totalGBPPnlPct === 0 ? '' : totalGBPPnlPct > 0 ? 'text-green-600' : 'text-red-600'}`}>{totalGBPPnlPct.toFixed(2)}%</td>
          </tr>

          <tr className="border-b dark:border-neutral-600 hover:bg-purple-100 dark:hover:bg-neutral-600">
            <th scope="row" className="px-6 py-2 border-x dark:border-neutral-600">
              EUR (€)
            </th>
            <td className="px-6 py-2 border-x dark:border-neutral-600">€{totalEURInvested.toFixed(2)}</td>
            <td className="px-6 py-2 border-x dark:border-neutral-600">€{totalEURValue.toFixed(2)}</td>
            <td className={`px-6 py-2 border-x dark:border-neutral-600 ${totalEURPnl === 0 ? '' : totalEURPnl > 0 ? 'text-green-600' : 'text-red-600'}`}>€{totalEURPnl.toFixed(2)}</td>
            <td className={`px-6 py-2 border-x dark:border-neutral-600 ${totalEURPnlPct === 0 ? '' : totalEURPnlPct > 0 ? 'text-green-600' : 'text-red-600'}`}>{totalEURPnlPct.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="div">
      <div className="portfolio-layout bg-purple-700 text-white p-3 rounded-t-xl">
            <p className="px-5">Coin</p>
            <p className="px-5">Price</p> 
            <p className="px-5">Invested</p>
            <p className="px-5">Quantity</p>
            <p className="px-5">Current Price</p> 
            <p className="px-5">Current Value</p>
            <p className="flex justify-end"></p>
      </div>
      {portfolio.map((coin) => (
          <div key={`${coin.symbol}${coin.currency.name}`}className="portfolio-layout items-center p-2">
            <div className="flex items-center gap-2">
              <Image alt={`${coin.symbol}logo`} width={40} height={40} src={coin.image}/>
              <p>{coin.name} ({coin.currency.symbol})</p>
            </div>
            <p className="px-5">{coin.currency.symbol}{coin.investedPrice}</p>
            <p className="px-5">{coin.currency.symbol}{coin.investedAmount}</p>
            <p className="px-5">{coin.quantity}{coin.symbol}</p>
            <p className="px-5">{coin.currency.symbol}{coin.currentPrice}</p>
            <p className="px-5">{coin.currency.symbol}{(coin.currentValue.toFixed(2))}</p>
            <button className="justify-end button font-bold border border-red-300  hover:bg-red-500 rounded-xl mx-3" onClick={() => deleteCoin(coin.name, coin.currency.name)} >Remove</button>
          </div>
        ))}
    </div>

    </main>
  )
}
