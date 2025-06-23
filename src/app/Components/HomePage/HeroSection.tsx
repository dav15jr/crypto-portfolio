import Image from 'next/image';
import React from 'react';
import heroImage from '../../../../public/assets/cryptoHero-01.png'; // Adjust the path as necessary

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row justify-center items-center mx-auto max-w-[1200px] min-w-[350px] py-5 px-2" aria-label="Hero section">
      <div className="flex flex-col gap-4 max-w-[550px] px-4">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
          🏆 SuperX Futures Championship
        </h2>
        <p className="text-xl md:text-2xl lg:text-3xl text-zinc-500 font-medium">
          Register for the event and grab rewards. Join to share a $600,000
          prize pool {'>>'}
        </p>
        <div className="my-5">
          <p className="mb-7 font-medium md:text-lg lg:text-xl">
            🎁 Sign up now to claim a 6000+ USDT welcome gift
          </p>
          <input
            type="text"
            placeholder="Enter Phone Number/Email"
            className="border border-zinc-400 dark:text-black rounded-3xl sm:rounded-md p-2 sm:p-3 my-3 sm:mr-3 sm:text-xl sm:w-[65%] w-full hover:border-purple-500 hover:border-2 transition duration-700 ease-in-out"
          />
          <button className="text-white md:text-xl bg-purple-500 hover:bg-purple-800 border py-2 sm:p-3 rounded-3xl w-full sm:w-[7rem] transition active:scale-90 active:text-green-300">
            Sign Up
          </button>
        </div>
      </div>
      <div className="flex max-w-[550px] justify-center">
        <Image
          src={heroImage}
          alt="Picture of crypto futures championship promotion"
          className='max-w-[400px] w-[90%] md:w-[550px] md:max-w-full h-auto'
          placeholder='blur'
        ></Image>
      </div>
    </section>
  );
}
