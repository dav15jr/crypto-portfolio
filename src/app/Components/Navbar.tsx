'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowDownToLine, Globe, Moon, Sun } from 'lucide-react';
import { useCryptoContext } from '../Context/context';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { setCurrency } = useCryptoContext()


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  function selectCurrency (e: React.ChangeEvent<HTMLSelectElement>) {
    if(e.target.value === "usd") {
      setCurrency({name:'usd' , symbol:'$'})
    }
    else if(e.target.value === "gbp") {
      setCurrency({name:'gbp', symbol:'£'})
    }
    else if(e.target.value === "eur") {
      setCurrency({name:'eur', symbol:'€'})
    }
   }

  return (
    <nav className="bg-purple-700 text-white lg:text-lg p-3 sm:p-6 md:flex md:justify-between md:items-center">
      <div className="w-full flex justify-between items-center">
        <div className="flex">
          <Link className="px-3" href="/">
            <Image
              className="flex"
              src="/icon.png"
              alt="Logo"
              width={40}
              height={40}
            />
          </Link>
          <div className="container hidden lg:flex justify-between items-center gap-6">
            <Link href="">Buy Crypto</Link>
            <Link href="">Markets</Link>
            <Link href="">Spot</Link>
            <Link href="">Derivatives 🔥</Link>
            <Link href="">Copy Trading</Link>
            <Link href="">Wealth</Link>
            <Link href="">Rewards Hub</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="">More</Link>
          </div>
          <ul className={`${menuOpen ? "flex" : "hidden"} flex-col lg:hidden gap-3 mt-5`}>
            <Link href="">Buy Crypto</Link>
            <Link href="">Markets</Link>
            <Link href="">Spot</Link>
            <Link href="">Derivatives 🔥</Link>
            <Link href="">Copy Trading</Link>
            <Link href="">Wealth</Link>
            <Link href="">Rewards Hub</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="">More</Link>
          </ul>
          <button
          className="lg:hidden flex items-start my-3"
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        <div className={`${menuOpen ? "flex items-center top-8 right-5 absolute" : "flex-row"} flex gap-3 lg:static`}>
          <button className="px-3 rounded-2xl mx-2">Login</button>
          <button className="bg-green-600 px-3 rounded-2xl">
            Sign Up
          </button>
            <select onChange={selectCurrency} className="bg-purple-800 px-3 rounded-2xl">
                <option value="usd">$ USD</option>
                <option value="gbp">£ GBP</option>
                <option value="eur">€ EUR</option>
            </select>
          <ArrowDownToLine />
          <Globe />
          <button
            onClick={toggleDarkMode}
          >
            {darkMode ? <Moon /> : <Sun />}
          </button>
        </div>
      </div>
    </nav>
  );
}