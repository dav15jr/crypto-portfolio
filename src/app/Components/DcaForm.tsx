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
  const { setPortfolio } = useCryptoContext()

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
      <h2>Select Your Investment Type</h2>
      <form onSubmit={getDca} title="Investment type">
        <select
          name="investmenttype"
          onChange={(e) => setDcaType(e.target.value)}
          required
        >
          <option value="">Select Type</option>
          <option value="amount">Cash Amount ($,€,£)</option>
          <option value="qty">Coin Quantity</option>
        </select>
        <>
          {dcaType === 'amount' ? (
            <input
              type="number"
              name="amount"
              placeholder="Investment amount"
              value={invAmount}
              onChange={handleDca}
              required
            />
          ) : (
            <input
              type="number"
              name="qty"
              placeholder="Coin quantity"
              value={coinQty}
              onChange={handleDca}
              required
            />
          )}
        </>
        <button
          className="border border-slate-700 bg-blue-500 rounded-lg px-2 m-4 hover:bg-blue-300"
          type="submit"
        >
          Add Coin DCA
        </button>
      </form>
    </>
  );
}
