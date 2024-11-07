import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import axios from 'axios';
import { useCryptoContext } from '../Context/context';
import { CoinInfo, Currency } from '../types';

type CryptoFormProps = {
  coinInfo: CoinInfo;
  coinName: string;
  setCoinName: Dispatch<SetStateAction<string>>;
  coinDate: string;
  setCoinDate: Dispatch<SetStateAction<string>>;
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
  const [coinSelected, setCoinSelected] = useState('');
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
      const historicData = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinName}/history?date=${coinDate}}`
      );
      const currentData = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=${coinCurrency.name}`
      );
      setCoinInfo(historicData.data);
      setPriceNow(currentData.data[coinName][coinCurrency.name]);
      selectPrice();
      setShowDcaForm(true);
    } else {
      alert('Coin not found');
      setCoinSelected('');
    }
  }

  function selectCoin(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === 'name') {
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
    <main>
      <h2 className="flex justify-center text-2xl p-2">Select Your Coin</h2>
      <form onSubmit={getCoinInfo} className="dark:text-black flex flex-col sm:flex-row p-2 max-w-[400px] sm:max-w-[900px] mx-auto" >
      <div className="mb-2">
      <label htmlFor="coin" className='block pl-3 text-sm text-gray-700 font-semibold'>Coin:</label>
        <input
          type="text"
          name="coin"
          id="coin"
          placeholder="Select your Coin"
          list="coinlist"
          value={coinSelected}
          onChange={selectCoin}
          className="border border-purple-900 rounded-xl p-2 m-1 w-full sm:w-auto"
          required
        />
        </div>
        <datalist id="coinlist">
          {coinList.map((coin, index) => (
            <option key={index} value={coin.name} />
          ))}
        </datalist>
        <div className="mb-2">
        <label htmlFor="date" className='block pl-3 text-sm text-gray-700 font-semibold'>Date:</label>
        <input
          type="date"
          name="date"
          id="date"
          placeholder="Date"
          max={maxDate}
          min={minDate}
          value={formDate}
          onChange={selectCoin}
          className="border border-purple-900 rounded-xl p-2 sm:p-[5px] m-1 w-full sm:w-auto"
          required
          />
        </div>
        <div className="mb-2">
        <label htmlFor="coincurrency" className='block pl-3 text-sm text-gray-700 font-semibold'>Currency:</label>
        <select
          name="coincurrency"
          id="coincurrency"
          onChange={selectCurrency}
          className="border border-purple-900 rounded-xl p-2 m-1 w-full sm:w-auto"
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
          >
          Get Coin Price
        </button>
      </form>
    </main>
  );
}
