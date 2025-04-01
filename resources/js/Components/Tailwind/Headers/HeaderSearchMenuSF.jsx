import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import { CircleUser, DoorClosed, Search, ShoppingCart } from "lucide-react";
import CartModal from "../Components/CartModal";
import AuthRest from '../../../Actions/AuthRest'
import Logout from "../../../Actions/Logout";
import MobileMenuSF from "./Components/MobileMenuSF";
import TopBarCart from "../TopBars/TopBarCart";

const HeaderSearchMenuSF = ({ 
  items,
  data,
  cart,
  setCart,
  isUser,
  pages,
  generals = [], }) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const totalCount = cart.reduce((acc, item) => {
    return Number(acc) + Number(item.quantity);
  }, 0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  
  return (
    <header id="main-header" className="sticky top-0 w-full z-20 bg-white font-font-general">
      
      <TopBarCart
              data={data}
               items={items}
              cart={cart}
              setCart={setCart}
              isUser={isUser}
          />
                
      
      <div className="left-0 right-0">
        <div className="flex justify-between w-full px-[5%]">
          <nav className="flex h-[80px] items-center justify-between gap-10 w-full">
            {/* Checkbox para controlar el menú móvil (oculto) */}
            <input type="checkbox" id="menu" className="peer/menu menu hidden" />

            {/* Botón de hamburguesa para móviles */}
           
              <label 
                onClick={() => setOpenMenu(!openMenu)}
                htmlFor="menu" 
                className="transition-all flex flex-col gap-1 z-40 lg:hidden hamburguesa justify-center items-center order-3 lg:order-none"
              >   
                      <p className="w-7 h-1 bg-primary transition-transform duration-500"></p>
                      <p className="w-7 h-1 bg-primary transition-transform duration-500"></p>
                      <p className="w-7 h-1 bg-primary transition-transform duration-500"></p>
              </label>
            

            {/* Logo */}
            <div className="flex justify-center items-center z-40">
              <a href="/" className="flex items-center gap-2">
                <img src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className="h-14 object-contain object-center" />
              </a>
            </div>
            

            {/* Menú de navegación */}
            <ul className={`bg-white flex font-gilroy_regular font-semibold text-lg`}>
              <div className="hidden lg:flex flex-col lg:flex-row order-2 lg:order-1 lg:w-full lg:justify-center gap-1 lg:gap-4">
                {pages.map((page, index) => (
                  page.menuable && (
                    <li key={index} className="flex flex-col py-1 lg:py-0">
                      <a 
                        href={page.path} 
                        className="hover:customtext-primary cursor-pointer transition-all duration-300 pr-6"
                        onClick={() => setMenuOpen(false)}
                      >
                        {page.name}
                      </a>
                    </li>
                  )
                ))}
              </div>
            </ul>

            {/* Barra de búsqueda (visible solo en desktop) */}
            <div className="hidden lg:flex justify-end">
              <div className="relative w-80">
                <input
                  type="search"
                  placeholder="Buscar productos"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pr-14 py-4 pl-4 border rounded-full focus:ring-0 focus:outline-none placeholder:customtext-primary"
                />
                <a
                  href={search.trim() ? `/catalogo?search=${encodeURIComponent(search)}` : "#"}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-lg"
                  aria-label="Buscar"
                >
                  <Search />
                </a>
              </div>
            </div>
              
            <div
                className={`${
                    openMenu ? "block" : "hidden"
                }  lg:hidden bg-white w-full min-h-screen absolute z-50 top-28 left-0`}
            >
                <MobileMenuSF
                    search={search}
                    setSearch={setSearch}
                    pages={pages}
                    items={items}
                /> 
                
            </div>
          </nav>
        </div>

      </div>
    </header>
  )
}
export default HeaderSearchMenuSF;
