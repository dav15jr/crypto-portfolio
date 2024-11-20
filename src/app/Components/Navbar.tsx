'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { X, ArrowDownToLine, Globe, Moon, Sun, Grip } from 'lucide-react';
import { useCryptoContext } from '../Context/context';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { setCurrency } = useCryptoContext();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  function selectCurrency(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === 'usd') {
      setCurrency({ name: 'usd', symbol: '$' });
    } else if (e.target.value === 'gbp') {
      setCurrency({ name: 'gbp', symbol: '£' });
    } else if (e.target.value === 'eur') {
      setCurrency({ name: 'eur', symbol: '€' });
    }
  }

  useEffect(() => {
    // Handler to close dropdown when width increases
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setMenuOpen(false);
      }
    };
    // Attach event listener
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="sticky top-0 left-0 bg-purple-700 w-screen text-white text-sm sm:text-base lg:text-lg p-3 sm:p-6 md:flex md:justify-between md:items-center min-w-[300px]">
      <div className="w-full flex justify-between items-center">
        <div className="flex">
          <Link className="px-2" href="/" aria-label='home page'>
            <Image
              className=""
              src="/icon.png"
              alt="Logo"
              width={40}
              height={40}
            />
          </Link>
          <div className="container hidden lg:flex justify-between items-center gap-4">
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Buy Crypto"
            >
              Buy Crypto
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Markets"
            >
              Markets
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Spot"
            >
              Spot
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Derivatives"
            >
              Derivatives🔥
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Copy Trading"
            >
              Copy Trading
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Rewards Hub"
            >
              Rewards Hub
            </Link>
            <Link
              className="no-underline hover:underline hover:text-yellow-400"
              href="/portfolio"
              aria-label="Portfolio"
            >
              Portfolio
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="More"
            >
              More
            </Link>
          </div>
          <button
            className="lg:hidden flex items-start m-3 hover:text-green-500"
            aria-label="toggle dropdown menu"
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
          >
            {menuOpen ? <X /> : <Grip />}
          </button>
          <ul
            className={`${
              menuOpen ? 'flex' : 'hidden'
            } flex-col lg:hidden gap-3 mt-5 mx-6`}
          >
                        <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Buy Crypto"
            >
              Buy Crypto
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Markets"
            >
              Markets
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Spot"
            >
              Spot
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Derivatives"
            >
              Derivatives🔥
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Copy Trading"
            >
              Copy Trading
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="Rewards Hub"
            >
              Rewards Hub
            </Link>
            <Link
              className="no-underline hover:underline hover:text-yellow-400"
              href="/portfolio"
              aria-label="Portfolio"
            >
              Portfolio
            </Link>
            <Link
              className="no-underline hover:underline hover:text-green-400"
              href="/"
              aria-label="More"
            >
              More
            </Link>
          </ul>
        </div>
        <div
          className={`${
            menuOpen
              ? 'flex-col items-center top-8 right-5 absolute'
              : 'flex-row'
          } flex gap-3 lg:static`}
        >
          <button
            className={`${
              menuOpen ? 'flex' : 'hidden'
            } px-2 sm:px-3 items-center rounded-2xl sm:flex`}
             aria-label='Login'
          >
            Login
          </button>
          <button
            className={`${
              menuOpen ? 'flex' : 'hidden'
            } bg-green-600 px-2 sm:px-3 items-center rounded-2xl sm:flex hover:text-gray-200 hover:bg-green-700`}
             aria-label='Sign Up'
          >
            Sign Up
          </button>
          <select
            onChange={selectCurrency}
            className="bg-purple-800 rounded-2xl"
            aria-label='Select Currency'
          >
            <option value="usd">$ USD</option>
            <option value="gbp">£ GBP</option>
            <option value="eur">€ EUR</option>
          </select>
          <ArrowDownToLine aria-label='download icon'/>
          <Globe aria-label='globe icon'/>
          <button 
          onClick={toggleDarkMode}
          aria-label='darkmode toggle'
          >
            {darkMode ? <Moon /> : <Sun />}
          </button>
        </div>
      </div>
    </nav>
  );
}
