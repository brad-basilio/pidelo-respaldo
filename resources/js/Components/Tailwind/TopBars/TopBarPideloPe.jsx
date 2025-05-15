import { useEffect, useRef, useState } from "react";
import General from "../../../Utils/General";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import { CircleUser, DoorClosed, ShoppingCart } from "lucide-react";
import Logout from "../../../Actions/Logout";
import CartModal from "../Components/CartModal";

const TopBarPideloPe = ({ data, cart, setCart, isUser, items }) => {
    const sectionRef = useRef(null);
    console.log(data);
    useEffect(() => {
        if (sectionRef.current) {
            adjustTextColor(sectionRef.current); // Llama a la función
        }
    }, []);
    const [modalOpen, setModalOpen] = useState(false);

    const totalCount = cart.reduce((acc, item) => {
        return Number(acc) + Number(item.quantity);
    }, 0);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const [search, setSearch] = useState("");

    return (
        <section
            ref={sectionRef}
            className="font-semibold text-base bg-primary text-white font-paragraph"
        >
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto  py-3 flex flex-wrap justify-end md:justify-between items-center gap-2">
                <p className="hidden md:block ">{General.get("cintillo")}</p>
                <p className="hidden md:block text-xs">{data?.title}</p>

                {/* Account and Cart */}
                <div className="flex items-center gap-4 relative ">
                    {isUser ? (
                        <button
                            className="flex items-center gap-2 transition-colors duration-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="hidden md:inline">
                                Hola, {isUser.name}
                            </span>
                          
                        </button>
                    ) : (
                       <>
                        <a
                            href="/iniciar-sesion"
                            className="flex items-center gap-2 "
                        >
                            <span className="hidden md:inline">
                                Iniciar Sesión
                            </span>
                          
                        </a>
                        |
                        <a
                            href="/crear-cuenta"
                            className="flex items-center gap-2 "
                        >
                            <span className="hidden md:inline">
                               Registrarse
                            </span>
                          
                        </a>
                       
                       </>
                    )}
                    {isMenuOpen && (
                        <div className="absolute customtext-primary  z-50 top-full left-0 bg-white shadow-xl border-t rounded-xl transition-all duration-300 ease-in-out w-40 mt-2">
                            <div className="p-4">
                                <ul className="space-y-2">
                                    {/* <li>
                                        <a
                                            href="#"
                                            className="flex items-center gap-2  text-xs transition-colors duration-300 cursor-pointer"
                                        >
                                            <CircleUser height="1rem" />
                                            <span>Mi cuenta</span>
                                        </a>
                                    </li> */}
                                    <li>
                                        <a
                                            href="#"
                                            onClick={Logout}
                                            className="flex items-center gap-2  text-sm transition-colors duration-300 cursor-pointer"
                                        >
                                            <DoorClosed
                                                className="customtext-primary"
                                                height="1rem"
                                            />
                                            <span>Cerrar sesión</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                   
                </div>
            </div>
         
        </section>
    );
};

export default TopBarPideloPe;
