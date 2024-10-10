import { useState } from "react"

export default function CryptoForm() {
  
  const [coinName, setCoinName] = useState<string>("")
  const [coinPrice, setCoinPrice] = useState<number>(0)
  const [coinValue, setCoinValue] = useState<number>(0)
  const [coinQty, setCoinQty] = useState<number>(0)
  const [coinCurrency, setCoinCurrency] = useState<string>("")


  function handleInput(e : React.ChangeEvent<HTMLInputElement>) {
    setCoinSearch(e.target.value)
    if (e.target.value === "") {
      setCoinTable(coinList)
    }
  }


  return (
    <main>
      <p>fORM</p>
      <form onSubmit={}>
      <input
      type="text"
      placeholder="Enter your Crypto"
      list="coinlist"
      onChange={handleInput}
      value={coinName}
      className="text-red-800 text-center bg-green-100 border border-red-900 rounded-lg"
      required
      /> 
      <input
      type="number"
      placeholder="Value"
      onChange={handleInput}
      value={coinValue}
      className="text-red-800 text-center bg-green-100 border border-red-900 rounded-lg"
      required
      />
      <input
      type="number"
      placeholder="Quantity"
      onChange={handleInput}
      value={coinQty}
      className="text-red-800 text-center bg-green-100 border border-red-900 rounded-lg"
      required
      /> 
      <select onChange={selectCurrency}>
          <option value="usd">$ USD</option>
          <option value="gbp">£ GBP</option>
          <option value="eur">€ EUR</option>
      </select>
      <datalist id='coinlist'>
      {coinList.map((coin, index)=>(<option key={index} value={coin.name}/>))}
      </datalist>
      <button className="border border-green-900 bg-green-500 rounded-lg px-2 m-4 transition active:scale-90 hover:bg-green-300"  type="submit">Search</button>
    </form>
  </main>
  )
}
