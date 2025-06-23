import React from 'react';
import Image from 'next/image';
import { useCryptoContext } from '../../Context/context';

function CoinTable() {
  const { currency, coinTable } = useCryptoContext();
  return (
    <div
      className="bg-purple-200 rounded-xl dark:bg-purple-900 min-w-[300px] m-2"
      aria-label="crypto coin table"
    >
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
          data-testid="coin-row"
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
  );
}

export default CoinTable;
