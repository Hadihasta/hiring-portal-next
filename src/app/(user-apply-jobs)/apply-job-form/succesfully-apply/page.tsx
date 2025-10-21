import React from 'react'
import Image from 'next/image'
const page = () => {
  return (
    <div>
          <div className="flex flex-col flex-grow justify-center items-center text-center gap-3 h-[100vh]">
                <div className="relative w-[320px] h-[320px]">
                  <Image
                    src="/asset/vektor/succes-vektor.svg"
                    alt="success apply Job"
                    fill
                    className="object-contain"
                  />
                </div>
        
                <p className="text-xl font-bold">🎉 Your application was sent!</p>
                <div className="text-greyNeutral text-base">{`Congratulations! You've taken the first step towards a rewarding career at Rakamin.`} </div>
                <div className="text-greyNeutral text-base">{`We look forward to learning more about you during the application process`} </div>
              </div>
    </div>
  )
}

export default page