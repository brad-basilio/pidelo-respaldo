import React, { lazy } from "react"



const BannerSimple = lazy(() => import('./Banners/BannerSimple'))
const BannerFullWidth = lazy(() => import('./Banners/BannerFullWidth'))
const BannerFlex = lazy(() => import('./Banners/BannerFlex'))
const BannerPublicitario = lazy(() => import('./Banners/BannerPublicitario'))
const BannerStatic = lazy(() => import('./Banners/BannerStatic'))
const BannerSimpleSF = lazy(() => import('./Banners/BannerSimpleSF'))

const Banner = ({ which, data }) => {
  const getBanner = () => {
    switch (which) {
      case 'BannerSimple':
        return <BannerSimple data={data} />
      case 'BannerPublicitario':
        return <BannerPublicitario data={data} />
      case 'BannerFullWidth':
        return <BannerFullWidth data={data} />
      case 'BannerFlex':
        return <BannerFlex data={data} />
      case 'BannerStatic':
        return <BannerStatic data={data} />
      case 'BannerSimpleSF':
        return <BannerSimpleSF data={data} />


      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getBanner()
}

export default Banner