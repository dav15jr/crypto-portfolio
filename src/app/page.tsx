'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCryptoContext } from './Context/context';
import InfoSection from './Components/InfoSection';
import HeroSection from './Components/HeroSection';
import Link from 'next/link';

export default function Home() {
  const [coinSearch, setCoinSearch] = useState<string>('');
  const { coinList, currency, coinTable, setCoinTable } = useCryptoContext();

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setCoinSearch(e.target.value);
    if (e.target.value === '') {
      setCoinTable(coinList);
    }
  }
  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const coins = await coinList.filter((coin) => {
      return coin.name.toLowerCase().includes(coinSearch.toLowerCase());
    });
    setCoinTable(coins);
  }

  return (
    <main className="font-[family-name:var(--font-geist-sans)]  dark:bg-black dark:text-white px-2">
      <div className="flex flex-col w-full min-h-screen items-center justify-center">
        <HeroSection />
        <h1 className="text-2xl sm:text-4xl">Welcome to CRYPTO KNIGHT</h1>
        <p className="text-lg sm:text-xl text-center pt-5">
          {' '}
          Find your coin&#39;s the latest price
        </p>
        <form onSubmit={handleSearch} className="sm:text-lg " aria-label="crypto coin search form">
          <input
            type="text"
            placeholder="Enter your Crypto"
            list="coinlist"
            onChange={handleInput}
            value={coinSearch}
            className="bg-purple-100 border dark:text-black border-purple-700 rounded-lg p-2 hover:border-purple-500 hover:border-2 transition duration-700 ease-in-out"
            autoFocus
            required
          />
          <datalist id="coinlist">
            {coinList.map((coin, index) => (
              <option key={index} value={coin.name} />
            ))}
          </datalist>
          <button
            className="border border-purple-900 bg-purple-600 rounded-3xl p-2 m-4 text-white transition active:scale-90 hover:bg-green-800"
            type="submit"
            aria-label="coin search button"
          >
            Search
          </button>
        </form>

        <div className="bg-purple-200 rounded-xl dark:bg-purple-900 min-w-[300px] m-2" aria-label="crypto coin table">
          <div className="crypto-list bg-purple-700 text-white rounded-t-xl text-xs sm:text-sm md:text-base p-2 sm:p-3">
            <p>Rank</p>
            <p className="px-2">Coin</p>
            <p className="px-2 sm:px-5">Price</p>
            <p className="flex justify-end">24h Change</p>
            <p className="flex justify-end px-2">ATH </p>
          </div>
          {coinTable.slice(0, 10).map((coin) => (
            <div
              key={coin.id}
              className="crypto-list items-center text-xs sm:text-sm md:text-base p-2 sm:p-3"
            >
              <p>{coin.market_cap_rank}</p>
              <div className="flex items-center gap-1 sm:gap-2">
                <Image
                  alt={`${coin.id}logo`}
                  width={30}
                  height={30}
                  src={coin.image}
                />
                <p>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </p>
              </div>
              <p className="px-2 sm:px-5">
                {currency.symbol}
                {coin.current_price}
              </p>
              <p
                className={`flex justify-center ${
                  coin.price_change_percentage_24h === 0
                    ? ''
                    : coin.price_change_percentage_24h > 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </p>
              <p className="flex justify-end">
                {currency.symbol}
                {coin.ath.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <Link
              className="border bg-purple-500 rounded-full text-white hover:bg-purple-700 hover:border-green-500 text-sm sm:text-lg mt-6 p-1 px-3 transition active:scale-90"
              href="/portfolio"
              aria-label="Go to portfolio page"
            >
             Update your Portfolio
        </Link>
        <InfoSection />
      </div>
    </main>
  );
}
