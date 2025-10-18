export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start shadow-form p-[40px] w-[500px] rounded-[8px]">
        <div>
          <div className="font-bold">Masuk Ke Portal Hiring</div>
          <div className="text-sm">
            Belum punya akun?{' '}
            <span className="text-greenPrimary underline underline-offset-1">Daftar menggunakan email</span>
          </div>
        </div>

        <div
          id="form"
          className="w-full gap-3 flex flex-col "
        >
          <div className="flex flex-col gap-3 ">
            <span className="text-xs">Alamat email</span>
            <input
              type="email"
              className="input-field"
              placeholder="Masukan email"
            />
          </div>

          <div className="flex flex-col gap-3 ">
            <span className="text-xs">Kata sandi</span>
            <input
              type="password"
              className="input-field"
              placeholder="Masukan kata sandi"
            />
          </div>

          <div className="text-greenPrimary text-xs cursor-pointer hover:font-bold">Lupa kata sandi?</div>
        </div>

        <button className="flex justify-center w-full  bg-yellowBg rounded-lg p-(--paddingButton) cursor-pointer ">
          <span className="font-bold text-base">Masuk</span>
        </button>

        <div className="flex items-center w-full text-gray-400  text-xs">
          <div className="flex-1 h-px bg-[#E0E0E0]"></div>
          <span className="px-3">atau</span>
          <div className="flex-1 h-px bg-[#E0E0E0]"></div>
        </div>


      
        <button className="button-outline hover:bg-gray-50">Masuk dengan link via email</button>
        <button className="button-outline hover:bg-gray-50">Masuk dengan Google</button>
        
      </main>
      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer> */}
    </div>
  )
}
