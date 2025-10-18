import Image from 'next/image'

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start shadow-sm p-[40px] rounded-[8px]">
        <div>
          <div>Masuk Ke Portal Hiring</div>
          <div>Belum punya akun? Daftar menggunakan email</div>
        </div>

      <div id='form'>
        <div>
          <span>Alamat email</span>
          <input
            type="email"
            placeholder="Masukan email anda"
          />
        </div>

        <div>
          <span>Kata sandi</span>
          <input
            type="email"
            placeholder="Masukan kata sandi"
          />
        </div>

        <div>Lupa kata sandi?</div>
        </div>


        <button className='flex bg-yellowBg'>Masuk</button>
  

        <span>atau</span>

        <div>Masuk dengan link via email</div>
        <div>Masuk dengan Google</div>

      </main>
      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer> */}
    </div>
  )
}
