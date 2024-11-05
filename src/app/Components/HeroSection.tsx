import Image from 'next/image';
import React from 'react';

export default function HeroSection() {
  return (
    <section className="flex justify-center items-center mx-auto max-w-[1200px]">
      <div className="flex flex-col gap-4 max-w-[550px] px-4">
        <h2 className="text-6xl font-semibold leading-tight">
          🏆 SuperX Futures Championship
        </h2>
        <p className="text-3xl text-zinc-600 font-medium">
          Register for the event and grab rewards. Join to share a $600,000
          prize pool {'>>'}
        </p>
        <div className="my-5">
          <p className="mb-7 font-medium text-xl">
            🎁 Sign up now to claim a 6000+ USDT welcome gift
          </p>
          <input
            type="text"
            placeholder="Enter Phone Number/Email"
            className="border border-zinc-400 p-3 text-xl w-[65%]"
          />
          <button className="text-white text-xl bg-blue-500 border py-3 px-4 ml-4 rounded-3xl">
            Sign Up
          </button>
        </div>
      </div>
      <Image
        src="/assets/cryptoHero-01.png"
        className=""
        alt=""
        width={600}
        height={600}
      ></Image>
    </section>
  );
}
