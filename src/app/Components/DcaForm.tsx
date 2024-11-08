import { useState, Dispatch, SetStateAction } from 'react';
import { CoinInfo, Currency, Ledger } from '../types';
import { useCryptoContext } from '../Context/context';

type DcaFormProps = {
  coinInfo: CoinInfo;
  coinPrice: string;
  setCoinName: Dispatch<SetStateAction<string>>;
  coinQty: string;
  setCoinDate: Dispatch<SetStateAction<string>>;
  invAmount: string;
  setFormDate: Dispatch<SetStateAction<string>>;
  priceNow: number; // assuming price now is a number
  coinCurrency: Currency;
  setInvAmount: Dispatch<SetStateAction<string>>; // if this is a number
  setCoinQty: Dispatch<SetStateAction<string>>;
  setShowDcaForm: Dispatch<SetStateAction<boolean>>;
};

export default function DcaForm({
  coinInfo,
  coinPrice,
  setCoinName,
  coinQty,
  setCoinDate,
  invAmount,
  setFormDate,
  priceNow,
  coinCurrency,
  setInvAmount,
  setCoinQty,
  setShowDcaForm,
}: DcaFormProps) {
  const [dcaType, setDcaType] = useState<string>('amount');
  const { setPortfolio } = useCryptoContext();

  function handleDca(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === 'amount') {
      const amount = e.target.value;
      const invQuantity = (Number(amount) / Number(coinPrice))
        .toFixed(2)
        .toString();

      setCoinQty(invQuantity);
      setInvAmount(amount);
    } else if (e.target.name === 'qty') {
      const quantity = e.target.value;
      const invAmount = (Number(coinPrice) * Number(quantity))
        .toFixed(2)
        .toString();

      setCoinQty(quantity);
      setInvAmount(invAmount);
      console.log('Investment Amount =', invAmount);
    }
  }
  function getDca(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowDcaForm(false);
    setCoinDate('');
    setCoinName('');
    setInvAmount('');
    setCoinQty('');
    setFormDate('');

    const dcaValue = Number(priceNow) * Number(coinQty);

    setPortfolio((prev: Ledger[]) => {
      const updatedPortfolio = prev.map((item) => {
        // Check if the symbol & currency already exists in the portfolio
        if (item.symbol === coinInfo.symbol && item.currency === coinCurrency) {
          const totalInvested = (
            Number(item.investedAmount) + Number(invAmount)
          )
            .toFixed(2)
            .toString();
          const totalQty = (Number(item.quantity) + Number(coinQty)).toString();
          const avgPrice = (
            (Number(invAmount) + Number(item.investedAmount)) /
            Number(totalQty)
          )
            .toFixed(2)
            .toString();
          const newValue = Number(priceNow) * Number(totalQty);

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
      const isCoinInPortfolio = prev.some(
        (item) =>
          item.symbol === coinInfo.symbol && item.currency === coinCurrency
      );

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

  return (
    <>
      <h2 className="flex justify-center text-2xl p-2 mt-4">
        Select Your Investment Type
      </h2>
      <form
        onSubmit={getDca}
        title="Investment type"
        className="dark:text-black flex flex-col sm:flex-row p-2 max-w-[400px] sm:max-w-[900px] mx-auto"
      >
        <div className="mb-2">
          <label
            htmlFor="investmenttype"
            className="block pl-3 text-sm text-gray-700 font-semibold"
          >
            Investment Type:
          </label>
          <select
            name="investmenttype"
            id="investmenttype"
            onChange={(e) => setDcaType(e.target.value)}
            className="border border-purple-900 rounded-xl p-[8px] m-1 w-full sm:w-auto"
            required
          >
            <option value="">Select Type</option>
            <option value="amount">Fiat Amount ($,€,£)</option>
            <option value="qty">Coin Quantity</option>
          </select>
        </div>
        <>
          {dcaType === 'amount' ? (
            <div className="mb-2">
              <label
                htmlFor="amount"
                className="block pl-3 text-sm text-gray-700 font-semibold"
              >
                Amount ($,€,£):
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                placeholder="Investment amount"
                value={invAmount}
                onChange={handleDca}
                className="border border-purple-900 rounded-xl p-2 m-1 w-full sm:w-auto"
                required
              />
            </div>
          ) : (
            <div className="mb-2">
              <label
                htmlFor="qty"
                className="block pl-3 text-sm text-gray-700 font-semibold"
              >
                Quantity:
              </label>
              <input
                type="number"
                name="qty"
                id="qty"
                placeholder="Coin quantity"
                value={coinQty}
                onChange={handleDca}
                className="border border-purple-900 rounded-xl p-2 m-1"
                required
              />
            </div>
          )}
        </>
        <button
          className="h-11 border border-purple-900 text-white bg-purple-600 rounded-xl hover:bg-purple-400 mx-2 p-2 sm:mt-6"
          type="submit"
        >
          Add Coin DCA
        </button>
      </form>
    </>
  );
}
