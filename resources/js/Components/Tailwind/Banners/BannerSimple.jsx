import React from "react"

const BannerSimple = ({ data }) => {
  return <section className="bg-gray-50">
    <div className="max-w-6xl w-full mx-auto px-4 py-[5%] md:py-[2.5%]">
      <div className="w-full aspect-[5/2] rounded-2xl flex flex-col items-center justify-center bg-white shadow-lg" style={{
        backgroundImage: `url('/api/banners/media/${data?.background}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <h1 className="text-2xl text-white font-bold mb-2">{data?.name}</h1>
        <p className="text-white mb-2">{data?.description}</p>
        {
          (data?.button_link && data?.button_text) &&
          <button href={data?.button_link} className="px-3 py-2 rounded-full bg-white text-textPrimary shadow-md">
            {data?.button_text}
          </button>
        }
      </div>
    </div>
  </section>
}

export default BannerSimple