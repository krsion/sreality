import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Listings } from '@/components/listings'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between pt-20 ${inter.className}`}
    >
      <div className="z-10 w-full items-center justify-between font-mono text-sm ">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit ">
          Apartment Listings
        </p>
      </div>

      <Listings />

    </main>
  )
}
