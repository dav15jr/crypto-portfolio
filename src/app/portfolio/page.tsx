'use client';

import { useState } from 'react';
import CryptoForm from '../Components/CryptoForm';
import { CoinInfo, Currency } from '../types';
import DcaForm from '../Components/PortfolioPage/DcaForm';
import PortfolioTable from '../Components/PortfolioTable';
import DcaTable from '../Components/PortfolioPage/DcaTable';

export default function Portfolio() {
  const defaultCoinInfo: CoinInfo = {
    symbol: '',
    name: '',
    image: {
      small: '',
    },
    market_data: {
      current_price: {
        usd: 0,
        gbp: 0,
        eur: 0,
      },
    },
  };

  const [coinInfo, setCoinInfo] = useState<CoinInfo>(defaultCoinInfo);
  const [coinDate, setCoinDate] = useState<string>('');
  const [formDate, setFormDate] = useState<string>('');
  const [coinSelected, setCoinSelected] = useState('');
  const [coinName, setCoinName] = useState<string>('');
  const [invAmount, setInvAmount] = useState<string>('');
  const [coinQty, setCoinQty] = useState<string>('');
  const [priceNow, setPriceNow] = useState(0);
  const [coinPrice, setCoinPrice] = useState<string>('0');
  const [coinCurrency, setCoinCurrency] = useState<Currency>({
    name: '',
    symbol: '',
  });
  const [showDcaForm, setShowDcaForm] = useState<boolean>(false);

  return (
    <main className="flex flex-col items-center min-w-screen justify-center text-black dark:bg-gray-900 dark:text-white px-3">
      <h1
        className="text-3xl md:text-5xl p-4 font-bold"
        data-testid="portfolio-title"
      >
        MY PORTFOLIO
      </h1>
      <section
        className=" border-purple-600 p-3 shadow-purple-300 shadow-md rounded-xl bg-slate-100 dark:bg-gray-800"
        aria-label="portfolio input forms"
      >
        <CryptoForm
          coinInfo={coinInfo}
          coinName={coinName}
          setCoinName={setCoinName}
          coinDate={coinDate}
          setCoinDate={setCoinDate}
          formDate={formDate}
          setFormDate={setFormDate}
          coinSelected={coinSelected}
          setCoinSelected={setCoinSelected}
          setCoinInfo={setCoinInfo}
          setPriceNow={setPriceNow}
          coinCurrency={coinCurrency}
          setCoinCurrency={setCoinCurrency}
          setCoinPrice={setCoinPrice}
          setShowDcaForm={setShowDcaForm}
        />
        {showDcaForm && (
          <DcaForm
            coinInfo={coinInfo}
            coinPrice={coinPrice}
            setCoinName={setCoinName}
            coinQty={coinQty}
            setCoinQty={setCoinQty}
            setCoinDate={setCoinDate}
            invAmount={invAmount}
            setInvAmount={setInvAmount}
            setFormDate={setFormDate}
            setCoinSelected={setCoinSelected}
            priceNow={priceNow}
            coinCurrency={coinCurrency}
            setCoinCurrency={setCoinCurrency}
            setShowDcaForm={setShowDcaForm}
          />
        )}
        <div className="border border-neutral-500 rounded-lg my-5 min-w-[300px] overflow-x-auto">
          <table
            className="table-auto text-left w-full text-sm md:text-base"
            aria-label="coin search table"
          >
            <thead className="bg-purple-500 text-zinc-100">
              <tr className="text-center sm:text-left">
                <th className="border border-neutral-400 p-1">Coin</th>
                <th className="border border-neutral-400 p-1">Date</th>
                <th className="border border-neutral-400 p-1">Price</th>
                <th className="border border-neutral-400 p-1">Quantity</th>
                <th className="border border-neutral-400 p-1">
                  Amount ({coinCurrency.symbol}){' '}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-neutral-400 p-1">
                  {coinInfo.name} ({coinInfo.symbol})
                </td>
                <td className="border border-neutral-400 p-1">{`${coinDate}`}</td>
                <td className="border border-neutral-400 p-1">{`${coinCurrency.symbol} ${coinPrice}`}</td>
                <td className="border border-neutral-400 p-1">{`${coinQty} ${coinInfo.symbol}`}</td>
                <td className="border border-neutral-400 p-1">{`${coinCurrency.symbol} ${invAmount}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <PortfolioTable />
      <DcaTable />
    </main>
  );
}
