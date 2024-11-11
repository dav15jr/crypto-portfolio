import axios from 'axios';

// Base URL for API requests
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Set up axios instance with headers
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': process.env.NEXT_PUBLIC_CG_API_KEY,
  },
});

// Fetch full data for specified currency from CoinGecko API
export const fetchCoinList = (currency) =>
  apiClient.get(`/coins/markets?vs_currency=${currency}`);

// Fetch historic data from CoinGecko API
export const fetchHistoricData = (coinName, coinDate) =>
  apiClient.get(`/coins/${coinName}/history?date=${coinDate}`);

// Fetch current selected coin price data from CoinGecko API
export const fetchCurrentData = (coinName, coinCurrency) =>
  apiClient.get(`/simple/price?ids=${coinName}&vs_currencies=${coinCurrency}`);