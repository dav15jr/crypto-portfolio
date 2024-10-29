import { useState, useEffect } from 'react';
import { useCryptoContext } from '../Context/context';




export default function PortfolioTable() {
    const [totalUSDInvested, setTotalUSDInvested] = useState<number>(0);
    const [totalUSDValue, setTotalUSDValue] = useState<number>(0);
    const [totalUSDPnl, setTotalUSDPnl] = useState<number>(0);
    const [totalUSDPnlPct, setTotalUSDPnlPct] = useState<number>(0);
    const [totalGBPInvested, setTotalGBPInvested] = useState<number>(0);
    const [totalGBPValue, setTotalGBPValue] = useState<number>(0);
    const [totalGBPPnl, setTotalGBPPnl] = useState<number>(0);
    const [totalGBPPnlPct, setTotalGBPPnlPct] = useState<number>(0);
    const [totalEURInvested, setTotalEURInvested] = useState<number>(0);
    const [totalEURValue, setTotalEURValue] = useState<number>(0);
    const [totalEURPnl, setTotalEURPnl] = useState<number>(0);
    const [totalEURPnlPct, setTotalEURPnlPct] = useState<number>(0);
    const { portfolio } = useCryptoContext()
    
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));

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
    const usdPnlPct =
      totalUSDInvested !== 0 ? (usdPnl / totalUSDInvested) * 100 : 0; // Profit and Loss % of total USD Invested
    setTotalUSDValue(totalUSDValue);
    setTotalUSDInvested(totalUSDInvested);
    setTotalUSDPnl(usdPnl);
    setTotalUSDPnlPct(usdPnlPct);

    const gbpPnl = totalGBPValue - totalGBPInvested;
    const gbpPnlPct =
      totalGBPInvested !== 0 ? (gbpPnl / totalGBPInvested) * 100 : 0; // Profit and Loss % of total GBP Invested
    setTotalGBPValue(totalGBPValue);
    setTotalGBPInvested(totalGBPInvested);
    setTotalGBPPnl(gbpPnl);
    setTotalGBPPnlPct(gbpPnlPct);

    const eurPnl = totalEURValue - totalEURInvested;
    const eurPnlPct =
      totalEURInvested !== 0 ? (eurPnl / totalEURInvested) * 100 : 0; // Profit and Loss % of total EUR Invested
    setTotalEURValue(totalEURValue);
    setTotalEURInvested(totalEURInvested);
    setTotalEURPnl(eurPnl);
    setTotalEURPnlPct(eurPnlPct);
  }, [portfolio]); // recalculate when the portfolio changes

  return (
    <div className="overflow-x-auto m-3 bg-zinc-100 dark:bg-neutral-700 rounded-xl">
      <table className="table-auto min-w-full text-left text-sm whitespace-nowrap">
        <thead className="tracking-wider border-b-2 text-white dark:border-neutral-600 border-t">
          <tr className="bg-purple-500 border border-purple-500">
            <th
              scope="col"
              className="px-6 py-2 border-x dark:border-neutral-600"
            ></th>
            <th
              scope="col"
              className="px-6 py-2 border-x dark:border-neutral-600"
            >
              Invested
            </th>
            <th
              scope="col"
              className="px-6 py-2 border-x dark:border-neutral-600"
            >
              Value
            </th>
            <th
              scope="col"
              className="px-6 py-2 border-x dark:border-neutral-600"
            >
              PnL
            </th>
            <th
              scope="col"
              className="px-6 py-2 border-x dark:border-neutral-600"
            >
              PnL(%)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b dark:border-neutral-600 hover:bg-purple-100 dark:hover:bg-neutral-600">
            <th
              scope="row"
              className="px-6 py-2 border-x dark:border-neutral-600"
            >
              USD ($)
            </th>
            <td className="px-6 py-2 border-x dark:border-neutral-600">
              ${totalUSDInvested.toFixed(2)}
            </td>
            <td className="px-6 py-2 border-x dark:border-neutral-600">
              ${totalUSDValue.toFixed(2)}
            </td>
            <td
              className={`px-6 py-2 border-x dark:border-neutral-600 ${
                totalUSDPnl === 0
                  ? ''
                  : totalUSDPnl > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {' '}
              ${totalUSDPnl.toFixed(2)}
            </td>
            <td
              className={`px-6 py-2 border-x dark:border-neutral-600 ${
                totalUSDPnlPct === 0
                  ? ''
                  : totalUSDPnlPct > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {' '}
              {totalUSDPnlPct.toFixed(2)}%
            </td>
          </tr>
          <tr className="border-b dark:border-neutral-600 hover:bg-purple-100 dark:hover:bg-neutral-600">
            <th
              scope="row"
              className="px-6 py-2 border-x dark:border-neutral-600"
            >
              GBP (£)
            </th>
            <td className="px-6 py-2 border-x dark:border-neutral-600">
              £{totalGBPInvested.toFixed(2)}
            </td>
            <td className="px-6 py-2 border-x dark:border-neutral-600">
              £{totalGBPValue.toFixed(2)}
            </td>
            <td
              className={`px-6 py-2 border-x dark:border-neutral-600 ${
                totalGBPPnl === 0
                  ? ''
                  : totalGBPPnl > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              £{totalGBPPnl.toFixed(2)}
            </td>
            <td
              className={`px-6 py-2 border-x dark:border-neutral-600 ${
                totalGBPPnlPct === 0
                  ? ''
                  : totalGBPPnlPct > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {totalGBPPnlPct.toFixed(2)}%
            </td>
          </tr>

          <tr className="border-b dark:border-neutral-600 hover:bg-purple-100 dark:hover:bg-neutral-600">
            <th
              scope="row"
              className="px-6 py-2 border-x dark:border-neutral-600"
            >
              EUR (€)
            </th>
            <td className="px-6 py-2 border-x dark:border-neutral-600">
              €{totalEURInvested.toFixed(2)}
            </td>
            <td className="px-6 py-2 border-x dark:border-neutral-600">
              €{totalEURValue.toFixed(2)}
            </td>
            <td
              className={`px-6 py-2 border-x dark:border-neutral-600 ${
                totalEURPnl === 0
                  ? ''
                  : totalEURPnl > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              €{totalEURPnl.toFixed(2)}
            </td>
            <td
              className={`px-6 py-2 border-x dark:border-neutral-600 ${
                totalEURPnlPct === 0
                  ? ''
                  : totalEURPnlPct > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {totalEURPnlPct.toFixed(2)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
