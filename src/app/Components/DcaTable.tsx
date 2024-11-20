// 'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCryptoContext } from '../Context/context';


export default function DcaTable() {
  const { portfolio, setPortfolio } = useCryptoContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {   // to stop hydration errors when new dca cion is added causing different server and client HTML
    setMounted(true);
  }, []);

  const deleteCoin = (name: string, currency: string) => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.filter(
        (item) => !(item.name === name && item.currency.name === currency)
      )
    );
  };


  return (
    <div className="mb-5 max-w-[800px] w-full overflow-x-auto sm:overflow-hidden rounded-xl" aria-label="DCA Table">
      <div className="whitespace-nowrap min-w-[600px] max-w-[800px]">
        <div className="portfolio-layout bg-purple-700 text-white text-sm sm:text-base p-2 sm:p-1">
          <p className="px-1 sm:px-5">Coin</p>
          <p className="px-1 sm:px-5">Price</p>
          <p className="px-1 sm:px-5">Invested</p>
          <p className="px-1 sm:px-5">Quantity</p>
          <p className="px-1 sm:px-5">Current Price</p>
          <p className="px-1 sm:px-5">Current Value</p>
          <p className="flex justify-end"></p>
        </div>
       {mounted && 
        portfolio.map((coin) => (
          <div
            key={`${coin.symbol}-${coin.currency.name}`}
            className="portfolio-layout items-center bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-black text-sm sm:text-base p-2"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Image
                alt={`${coin.symbol}logo`}
                width={40}
                height={40}
                src={coin.image}
              />
              <p>
                {coin.name} ({coin.currency.symbol})
              </p>
            </div>
            <p className="px-2 sm:px-5">
              {coin.currency.symbol}
              {coin.investedPrice}
            </p>
            <p className="px-2 sm:px-5">
              {coin.currency.symbol}
              {coin.investedAmount}
            </p>
            <p className="px-2 sm:px-5">
              {coin.quantity} {coin.symbol}
            </p>
            <p className="px-2 sm:px-5">
              {coin.currency.symbol}
              {coin.currentPrice}
            </p>
            <p className="px-2 sm:px-5">
              {coin.currency.symbol}
              {coin.currentValue.toFixed(2)}
            </p>
            <button
              className="justify-end button font-bold border bg-white border-red-300 dark:text-black dark:border-red-600 hover:bg-red-500  dark:hover:bg-red-500 rounded-xl py-1 text-xs sm:text-base"
              onClick={() => deleteCoin(coin.name, coin.currency.name)}
              aria-label="Remove Coin"
            >
              Remove
            </button>
          </div>
        ))
        }
      </div>
    </div>
  );
}
