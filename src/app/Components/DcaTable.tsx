import React from 'react'
import Image from "next/image";
import { useCryptoContext } from '../Context/context';

export default function DcaTable() {

    const { portfolio, setPortfolio } = useCryptoContext()

    const deleteCoin = (name:string, currency:string) => {
        setPortfolio((prevPortfolio) =>
          prevPortfolio.filter(
            (item) => !(item.name === name && item.currency.name === currency)
          )
        );
      };
  

  return (
    <div>
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
            <div key={`${coin.symbol}${coin.currency.name}`}className="portfolio-layout items-center p-2  hover:bg-purple-100">
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
  )
}
