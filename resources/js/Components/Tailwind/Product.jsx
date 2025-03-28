import React from "react"


const ProductCarousel = React.lazy(() => import('./Products/ProductCarousel'))
const ProductList = React.lazy(() => import('./Products/ProductList'))
const ProductInfinite = React.lazy(() => import('./Products/ProductInfinite'))
const ProductNavigation = React.lazy(() => import('./Products/ProductNavigation'))
const ScrapingSimple = React.lazy(() => import('./Scraping/ScrapingSimple'))
const Product = ({ which, data, items, cart, setCart, pages, filteredData }) => {
  const getProduct = () => {

    switch (which) {
      case 'Carousel':
        return <ProductCarousel data={data} items={items} cart={cart} setCart={setCart} />
      case 'List':
        return <ProductList data={data} items={items} cart={cart} setCart={setCart} />
      case 'ProductInfinite':
        return <ProductInfinite data={data} items={items} cart={cart} setCart={setCart} />
      case 'ProductNavigation':
        return <ProductNavigation data={data} items={items} cart={cart} setCart={setCart} />
      case 'Scraping':
        return <ScrapingSimple data={data} items={items} cart={cart} setCart={setCart} pages={pages} filteredData={filteredData} />
      
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getProduct()
}

export default Product