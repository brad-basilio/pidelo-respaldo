import React from "react";
import Number2Currency from "../../../Utils/Number2Currency";
import CartItemRow from "../Components/CartItemRow";

const CartKuchara = ({ data, cart, setCart }) => {

  const totalPrice = cart.reduce((acc, item) => {
    const finalPrice = item.discount > 0 ? Math.min(item.price, item.discount) : item.price;
    return acc + (finalPrice * item.quantity); // Sumar el precio total por cantidad
  }, 0);

  const subTotal = (totalPrice * 100) / 118

  return <section className="bg-white">
    <div className="px-[5%] replace-max-w-here w-full mx-auto py-[2.5%] grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {cart.length > 0 ? (
          <div className="bg-accent rounded-lg p-6">
            {cart.map((item, index) => (
              <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4 font-medium mb-2">Producto</div>

                  <div className="flex items-center col-span-4 md:col-span-2 gap-4">
                    <div className="!w-20">
                      <img
                        src={`/storage/images/item/${item.image}`}
                        alt={item.name}
                        className="!w-20 h-full object-cover object-center rounded-md aspect-[4/3]"
                      />
                    </div>
                    <div className="w-full">
                      <h3 className="font-medium leading-tight">{item.name || `Producto ${index + 1}`}</h3>
                      <button
                        onClick={() => {
                          const newCart = cart.filter((_, i) => i !== index)
                          setCart(newCart)
                        }}
                        className="text-red-500 flex items-center mt-2"
                      >
                        Eliminar
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="col-span-4 md:col-span-2 grid grid-cols-3 gap-4">
                    <div>
                      <div className="font-medium mb-2">Cantidad</div>
                      <div className="border border-gray-300 rounded flex items-center w-16">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newCart = [...cart]
                            newCart[index].quantity = Number.parseInt(e.target.value) || 1
                            setCart(newCart)
                          }}
                          className="w-full text-center py-1 px-2 bg-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="font-medium mb-2">Precio</div>
                      <div>S/{Number2Currency(item.price)}</div>
                    </div>

                    <div>
                      <div className="font-medium mb-2">Sub Total</div>
                      <div>S/{Number2Currency(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-accent rounded-lg p-8 flex items-center justify-center min-h-80">
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">Ups!</h1>
              <p className="mb-4">No hay productos en el carrito</p>
              <a href={data?.url_catalog} className="bg-green-600 p-2 px-4 rounded-full text-white inline-block">
                <i className="mdi mdi-cart-plus me-1"></i>
                Agregar productos
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-accent rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-4">Resumen de la compra</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p>Subtotal</p>
              <span>S/. {Number2Currency(subTotal)}</span>
            </div>

            <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t border-gray-200">
              <p>Total</p>
              <span>S/. {Number2Currency(totalPrice)}</span>
            </div>

            <a
              href={data?.url_checkout}
              className="text-white bg-green-600 w-full px-4 py-3 rounded-full cursor-pointer inline-block text-center font-medium mt-4"
            >
              Siguiente
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
}

export default CartKuchara