
export type CoinInfo = {
    symbol: string
    name: string
    image:{
      small:string
      } 
    market_data: {
      current_price: {
        usd: number
        gbp: number
        eur: number
      }}
    }

export type Currency= {
        name: string
        symbol: string
      }
    
export type Coin = {
        id: string
        market_cap_rank: number
        symbol: string
        name: string
        image: string
        current_price: number
        price_change_percentage_24h: number
        ath: number
      }
    
export type Context = {
        coinList: Coin[]
        currency: Currency
        setCurrency: React.Dispatch<React.SetStateAction<Currency>>
        coinTable: Coin[]
        setCoinTable: React.Dispatch<React.SetStateAction<Coin[]>>
        portfolio : Ledger[]
        setPortfolio : React.Dispatch<React.SetStateAction<Ledger[]>>
      }

export type Ledger = {
      symbol: string
      name: string
      image: string
      currency: Currency          
      investedPrice: string
      investedAmount: string
      quantity: string
      currentPrice: number
      currentValue: number
      }
