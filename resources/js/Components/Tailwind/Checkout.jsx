import React from "react"


const CheckoutCulqi = React.lazy(() => import('./Checkouts/CheckoutCulqi'))
const CheckoutSteps = React.lazy(() => import('./Checkouts/CheckoutSteps'))
const CheckoutStepsSF = React.lazy(() => import('./Checkouts/CheckoutStepsSF'))

const Checkout = ({ which, data, cart, setCart, isUser }) => {
  const getCheckout = () => {
    switch (which) {
      case 'CheckoutCulqi':
        return <CheckoutCulqi data={data} cart={cart} setCart={setCart} />
      case 'CheckoutSteps':
        return <CheckoutSteps data={data} cart={cart} setCart={setCart} user={isUser} />
      case 'CheckoutStepsSF':
        return <CheckoutStepsSF data={data} cart={cart} setCart={setCart} user={isUser} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getCheckout()
}

export default Checkout