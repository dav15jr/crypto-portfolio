import { Fingerprint, Handshake, SearchCheck } from 'lucide-react'
import React from 'react'

export default function InfoSection() {


  return (
    <section className='flex flex-col justify-center items-center mb-10'>
        <h2 className='text-5xl p-20'>Secure Your Assets</h2>
        <div className='sm:flex justify-center items-center gap-4 m-5 max-w-[400px] sm:max-w-[1000px]'>
            <div className='flex flex-col justify-center items-center px-8 md:px-5'>
                <Handshake className='text-green-700 m-5' height={40} width={40}/>
                <h3 className='text-2xl p-5'>Compliance Matrix</h3>
                <p className='text-center'>A global digital services financial institution with branch offices in Canada, the EU, and Australia
                Regulated business and services in countries where it operates</p>
            </div>
            <div className='flex flex-col justify-center items-center px-8 md:px-5'>
                <Fingerprint className='text-green-700 m-5' height={40} width={40}/>
                <h3 className='text-2xl p-5'>2FA Authentication</h3>
                <p className='text-center'>Robust identity verification, compliance and Know Your Customer (KYC) with Sumsub as a partner
                Auto-detection of cybercrime-related risks with advanced AI technology</p>
            </div>
            <div className='flex flex-col justify-center items-center px-8 md:px-5'>
                <SearchCheck className='text-green-700 m-5' height={40} width={40}/>
                <h3 className='text-2xl p-5'>Transparency</h3>
                <p className='text-center'>100% Proof-of-Reserves with top cybersecurity organizations as partners
                Security audit approved by the leading security-focused ranking platform CertiK</p>
            </div>
        </div>
    </section>
  )
}
