'use client'
import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { useCryptoContext } from '../Context/context';
import { CoinInfo, Currency } from '../types';
import { fetchCurrentData, fetchHistoricData } from '../utils/api';

type CryptoFormProps = {
  coinInfo: CoinInfo;
  coinName: string;
  setCoinName: Dispatch<SetStateAction<string>>;
  coinDate: string;
  setCoinDate: Dispatch<SetStateAction<string>>;
  coinSelected: string;
  setCoinSelected: Dispatch<SetStateAction<string>>;
  formDate: string;
  setFormDate: Dispatch<SetStateAction<string>>;
  setCoinInfo: Dispatch<SetStateAction<CoinInfo>>;
  setPriceNow: Dispatch<SetStateAction<number>>;
  coinCurrency: Currency;
  setCoinCurrency: Dispatch<SetStateAction<Currency>>;
  setCoinPrice: Dispatch<SetStateAction<string>>;
  setShowDcaForm: Dispatch<SetStateAction<boolean>>;
};

export default function CryptoForm({
  coinInfo,
  coinName,
  setCoinName,
  coinDate,
  setCoinDate,
  coinSelected,
  setCoinSelected,
  formDate,
  setFormDate,
  setCoinInfo,
  setPriceNow,
  coinCurrency,
  setCoinCurrency,
  setCoinPrice,
  setShowDcaForm,
}: CryptoFormProps) {
  const [maxDate, setMaxDate] = useState('');
  const [minDate, setMinDate] = useState('');
  const { coinList } = useCryptoContext();

  const usdPrice = coinInfo.market_data.current_price.usd;
  const gbpPrice = coinInfo.market_data.current_price.gbp;
  const eurPrice = coinInfo.market_data.current_price.eur;

  const getCurrentDate = () => {
    // get current date to limit choosing future date for progress entry.
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    const minYear = today.getFullYear() - 1;

    setMaxDate(`${year}-${month}-${day}`);
    setMinDate(`${minYear}-${month}-${day}`);
  };

  useEffect(() => {
    getCurrentDate();
  });

  function convDate(date: string) {
    const dateSplit = date.split('-');
    const formattedDate = `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
    setCoinDate(formattedDate);
  }

  async function getCoinInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (coinName !== 'Coin not found') {
      const historicData = await fetchHistoricData(coinName, coinDate); // fetch historical data from api endpoint
      const currentData = await fetchCurrentData(coinName, coinCurrency.name); // fetch current data from api endpoint

      setCoinInfo(historicData.data);
      setPriceNow(currentData.data[coinName][coinCurrency.name]);
      selectPrice();
      setShowDcaForm(true);
    } else {
      alert('Coin not found');
      setCoinSelected('');
    }
    resetForm();
  }
  function resetForm() {
    // reset form inputs
    const formDCA = document.getElementById('cryptoform') as HTMLFormElement;
    if (formDCA) {
      formDCA.reset();
    }
  }
  function selectCoin(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === 'coin') {
      setCoinSelected(e.target.value);
      //Find the coin object by its name
      const selectedCoin = coinList.find(
        (coin) => coin.name === e.target.value
      );
      if (selectedCoin) {
        setCoinName(selectedCoin.id);
      } else {
        setCoinName('Coin not found');
      }
    } else if (e.target.name === 'date') {
      const selectedDate = e.target.value;
      convDate(selectedDate);
      setFormDate(selectedDate);
    }
  }

  function selectCurrency(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === 'usd') {
      setCoinCurrency({ name: 'usd', symbol: '$' });
    } else if (e.target.value === 'gbp') {
      setCoinCurrency({ name: 'gbp', symbol: '£' });
    } else if (e.target.value === 'eur') {
      setCoinCurrency({ name: 'eur', symbol: '€' });
    }
  }

  const selectPrice = useCallback(() => {
    let price = '0';

    switch (coinCurrency.name) {
      case 'usd':
        price = usdPrice.toFixed(2);
        break;
      case 'gbp':
        price = gbpPrice.toFixed(2);
        break;
      case 'eur':
        price = eurPrice.toFixed(2);
        break;
      default:
        price = '0';
    }
    setCoinPrice(price);
  }, [coinCurrency.name, setCoinPrice, usdPrice, gbpPrice, eurPrice]);

  useEffect(() => {
    selectPrice();
  }, [selectPrice]);

  return (
    <div>
      <h2 className="flex justify-center text-2xl p-2">Select Your Coin</h2>
      <form
        id="cryptoform"
        onSubmit={getCoinInfo}
        className="dark:text-black flex flex-col sm:flex-row p-2 max-w-[400px] sm:max-w-[900px] mx-auto"
        aria-label="coin price search form"
      >
        <div className="mb-2">
          <label
            htmlFor="coin"
            className="block pl-3 text-sm text-gray-700 font-semibold  dark:text-gray-300"
          >
            Coin:
          </label>
          <input
            type="text"
            name="coin"
            id="coin"
            placeholder="Select Coin"
            list="coinlist"
            value={coinSelected}
            onChange={selectCoin}
            className="border border-purple-900 rounded-xl p-2 m-1 w-full sm:w-auto"
            autoFocus
            required
          />
          <datalist id="coinlist">
            {coinList.map((coin, index) => (
              <option key={index} value={coin.name} />
            ))}
          </datalist>
        </div>
        <div className="mb-2">
          <label
            htmlFor="date"
            className="block pl-3 text-sm text-gray-700 font-semibold dark:text-gray-300"
          >
            Date:
          </label>
          <input
            type="date"
            name="date"
            id="date"
            placeholder="Select Date"
            max={maxDate}
            min={minDate}
            value={formDate}
            onChange={selectCoin}
            className="border border-purple-900 rounded-xl p-2 sm:p-[5px] m-1 w-full sm:w-auto"
            required
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="coincurrency"
            className="block pl-3 text-sm text-gray-700 font-semibold dark:text-gray-300"
          >
            Currency:
          </label>
          <select
            name="coincurrency"
            id="coincurrency"
            onChange={selectCurrency}
            className="border border-purple-900 rounded-xl p-2 m-1 w-full sm:w-auto"
            aria-label="Select Currency"
            required
          >
            <option value="">Currency</option>
            <option value="usd">$ USD</option>
            <option value="gbp">£ GBP</option>
            <option value="eur">€ EUR</option>
          </select>
        </div>
        <button
          className="h-10 border border-purple-900 text-white bg-purple-600 rounded-xl hover:bg-purple-400 mx-2 p-2 sm:mt-6"
          type="submit"
          aria-label="Get coin price"
        >
          Get Coin Price
        </button>
      </form>
    </div>
  );
}
