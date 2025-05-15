import { useEffect, useRef, useState } from "react";
import React, { CSSProperties } from 'react';
import Select from 'react-select';
import Global from "../../../Utils/Global";
import {
    CircleUser,
    DoorClosed,
    Search,
    ShoppingCart,
    XIcon,
} from "lucide-react";
import CartModal from "../Components/CartModal";
import Logout from "../../../Actions/Logout";
import MobileMenu from "./Components/MobileMenu";

const HeaderSearchPideloPe = ({
    items,
    data,
    cart,
    setCart,
    isUser,
    pages,
    generals = [],
}) => {
    const phoneWhatsappObj = generals.find(
        (item) => item.correlative === "phone_whatsapp"
    );
    const messageWhatsappObj = generals.find(
        (item) => item.correlative === "message_whatsapp"
    );

    const phoneWhatsapp = phoneWhatsappObj
        ? phoneWhatsappObj.description
        : null;
    const messageWhatsapp = messageWhatsappObj
        ? messageWhatsappObj.description
        : null;

    const [modalOpen, setModalOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [searchMobile, setSearchMobile] = useState(false);
    const [selectedShop, setSelectedShop] = useState(items[0]?.slug || ''); // Default to first item
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

    const options = items.map(item => ({
        value: item.slug,
        label: item.name
    }));

    const handleSearch = () => {
        if (!search.trim()) return "#";
        const searchParams = new URLSearchParams();
        if (selectedShop) searchParams.append('shop', selectedShop);
        if (search.trim()) searchParams.append('search', search.trim());
        return `/catalogo?${searchParams.toString()}`;
    };

    return (
        <header
            className={`w-full ${openMenu ? "fixed w-screen h-screen bg-white z-50" : "relative"}`}
        >
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-4 font-font-secondary text-base font-semibold">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                            alt={Global.APP_NAME}
                            className="h-14 object-contain object-center"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/img/logo-bk.svg";
                            }}
                        />
                    </a>
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="flex md:hidden items-center justify-center bg-primary rounded-lg w-auto h-auto p-2 text-white fill-white transition-all duration-300"
                    >
                        {!openMenu ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M10 5H20"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M4 12H20"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M4 19H14"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <XIcon />
                        )}
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:flex mx-auto px-4 relative w-full max-w-xl gap-6 items-center border rounded-full">
                        <Select
                            options={options}
                            defaultValue={options[0]}
                            onChange={(option) => setSelectedShop(option.value)}
                            className="w-[200px]"
                            classNamePrefix="react-select"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    boxShadow: 'none',
                                    minHeight: '40px',
                                    cursor: 'pointer'
                                }),
                                menu: (base) => ({
                                    ...base,
                                    zIndex: 9999
                                }),
                                option: (base) => ({
                                    ...base,
                                    cursor: 'pointer'
                                })
                            }}
                        />
                      
                        <input
                            type="search"
                            placeholder="Buscar productos"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full py-4 focus:ring-0 focus:outline-none bg-transparent"
                        />
                        <a
                            href={handleSearch()}
                            className="absolute flex gap-4 right-3 top-1/2 transform -translate-y-1/2 p-2 bg-accent customtext-primary rounded-xl px-4"
                            aria-label="Buscar"
                        >
                            Buscar
                            <Search />
                        </a>
                    </div>

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
             
            </div>
        </header>
    );
};

export default HeaderSearchPideloPe;
