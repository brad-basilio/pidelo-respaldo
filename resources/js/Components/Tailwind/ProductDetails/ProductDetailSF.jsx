import { useEffect, useState } from "react";
import {
    ShoppingCart,
    Store,
    Home,
    Phone,
    CircleUserRound,
    ChevronDown,
    CheckSquare,
    Plus,
    ChevronUp,
    CircleCheckIcon,
    DotIcon,
} from "lucide-react";

import ItemsRest from "../../../Actions/ItemsRest";
import Swal from "sweetalert2";
import { Notify } from "sode-extend-react";
import ProductInfinite from "../Products/ProductInfinite";
import CartModal from "../Components/CartModal";

export default function ProductDetailSF({ item, data, setCart, cart }) {
    const itemsRest = new ItemsRest();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState({
        url: item?.image,
        type: "main",
    });

    const [quantity, setQuantity] = useState(1);
    const handleChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        setQuantity(value);
    };
    /*ESPECIFICACIONES */
    const [isExpanded, setIsExpanded] = useState(false);

    const onAddClicked = (product) => {
        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: quantity });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);

        Swal.fire({
            title: "Producto agregado",
            text: `Se agregó ${product.name} al carrito`,
            icon: "success",
            timer: 1500,
        });
    };

    const [associatedItems, setAssociatedItems] = useState([]);
    const [relationsItems, setRelationsItems] = useState([]);
    const inCart = cart?.find((x) => x.id == item?.id);

    useEffect(() => {
        if (item?.id) {
            productosRelacionados(item);
            obtenerCombo(item);
            handleViewUpdate(item);
        }
    }, [item]); // Agregar `item` como dependencia
    const handleViewUpdate = async (item) => {
        try {
            const request = {
                id: item?.id,
            };
            console.log(request);
            const response = await itemsRest.updateViews(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }
        } catch (error) {
            return;
        }
    };

    const obtenerCombo = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                id: item?.id,
            };

            // Llamar al backend para verificar el combo
            const response = await itemsRest.verifyCombo(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }

            // Actualizar el estado con los productos asociados
            const associated = response[0].associated_items;

            setAssociatedItems(Object.values(associated));
        } catch (error) {
            return;
            // Mostrar un mensaje de error al usuario si es necesario
        }
    };
    const productosRelacionados = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                id: item?.id,
            };

            // Llamar al backend para verificar el combo
            const response = await itemsRest.productsRelations(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }

            // Actualizar el estado con los productos asociados
            const relations = response;

            setRelationsItems(Object.values(relations));
            console.log(relations);
        } catch (error) {
            return;
            // Mostrar un mensaje de error al usuario si es necesario
        }
    };
    const total = associatedItems.reduce(
        (sum, product) => sum + parseFloat(product.final_price),
        0
    );
    const [expandedSpecificationMain, setExpanded] = useState(false);

    const addAssociatedItems = () => {
        setCart((prevCart) => {
            const newCart = structuredClone(prevCart); // Clona el estado anterior

            [...associatedItems, item].forEach((product) => {
                const index = newCart.findIndex((x) => x.id === product.id);
                if (index === -1) {
                    newCart.push({ ...product, quantity: quantity });
                } else {
                    newCart[index].quantity++;
                }
            });

            return newCart; // Devuelve el nuevo estado acumulado
        });
        Notify.add({
            icon: "/assets/img/icon.svg",
            title: "Carrito de Compras",
            body: "Se agregaron con éxito los productos",
        });
    };
    return (
        <>
            <div className="px-primary mx-auto py-12 bg-white">
                <div className="bg-white rounded-xl p-4 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Images and Delivery Options */}
                        <div className="space-y-6">
                           
                            <div className="mb-6 font-font-general md:hidden">
                                <p className="customtext-neutral-light text-sm 2xl:text-lg">
                                    Marca:{" "}
                                    <span className="customtext-neutral-dark">
                                        {item?.brand.name}
                                    </span>
                                </p>
                                <h1 className="customtext-neutral-dark text-3xl lg:text-4xl 2xl:text-5xl font-bold mt-2">
                                    {item?.name}
                                </h1>
                            </div>

                            {/* Product Images */}
                            <div className="flex gap-6">
                                {/* Thumbnails */}
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() =>
                                            setSelectedImage({
                                                url: item?.image,
                                                type: "main",
                                            })
                                        }
                                        className={`w-16 h-16  rounded-lg p-2 border-2 ${
                                            selectedImage.url === item?.image
                                                ? "border-primary "
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <img
                                            src={`/storage/images/item/${item?.image}`}
                                            alt="Main Thumbnail"
                                            className="w-full h-full object-contain"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "/api/cover/thumbnail/null")
                                            }
                                        />
                                    </button>
                                    {item?.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage({
                                                    url: image.url,
                                                    type: "gallery",
                                                })
                                            }
                                            className={`w-16 h-16 border-2 rounded-lg p-2 ${
                                                selectedImage.url === image.url
                                                    ? "border-primary"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <img
                                                src={`/storage/images/item/${image.url}`}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-contain"
                                                onError={(e) =>
                                                    (e.target.src =
                                                        "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Main Image */}
                                <div className="flex-1">
                                    <img
                                        src={
                                            selectedImage.type === "main"
                                                ? `/storage/images/item/${selectedImage.url}`
                                                : `/storage/images/item/${selectedImage.url}`
                                        }
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                        alt="Product main"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap lg:hidden customtext-neutral-light items-center gap-2 text-sm mb-6 font-font-general">
                                <span className="customtext-neutral-light text-sm 2xl:text-base">
                                    SKU:{" "}
                                    <span className="customtext-neutral-dark font-bold">
                                        {item?.sku}
                                    </span>
                                </span>
                                <span className="customtext-neutral-light text-sm 2xl:text-base">
                                    Disponibilidad:{" "}
                                    <span className="customtext-neutral-dark font-bold">
                                        {item?.stock > 0
                                            ? "En stock"
                                            : "Agotado"}
                                    </span>
                                </span>
                            </div>
                            <div className="flex lg:hidden gap-8 border-b-2 pb-8">
                                {/* Price Section */}
                                <div className=" w-full ">
                                    <p className="text-sm customtext-neutral-light mb-1">
                                        Precio:{" "}
                                        <span className="line-through line-clamp-1">
                                            S/ {item?.price}
                                        </span>
                                    </p>
                                    <div className="flex items-center gap-4 ">
                                        <span className="text-[40px] font-bold line-clamp-1">
                                            S/ {item?.final_price}
                                        </span>
                                        <span className="bg-[#F93232] text-white font-bold px-3 py-2 rounded-xl">
                                            -
                                            {Number(
                                                item?.discount_percent
                                            ).toFixed(1)}
                                            %
                                        </span>
                                    </div>

                                    {/* Quantity */}
                                    <div className="mt-4">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex items-center space-x-4 customtext-neutral-light text-sm">
                                                <span className="">
                                                    Cantidad
                                                </span>
                                                <div className="relative flex items-center border rounded-md px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={quantity}
                                                        onChange={handleChange}
                                                        min="1"
                                                        max="10"
                                                        className="w-10 py-1 customtext-neutral-dark text-center bg-transparent outline-none appearance-none"
                                                    />
                                                </div>
                                                <span className="">
                                                    Máximo 10 unidades.
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        onClick={() => {
                                            onAddClicked(item);
                                            setModalOpen(!modalOpen);
                                        }}
                                        className="w-full bg-primary text-white py-3 font-bold shadow-lg rounded-xl hover:opacity-90 transition-all duration-300 mt-4"
                                    >
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="w-full flex lg:hidden">
                                    <div className="bg-[#F7F9FB] rounded-xl p-6 w-full">
                                        <h3 className="font-semibold text-lg xl:text-xl 2xl:text-2xl mb-4 customtext-neutral-dark font-font-general">
                                            Especificaciones principales
                                        </h3>
                                        <ul
                                            className={`space-y-1  customtext-neutral-light  mb-4 list-disc transition-all duration-300 ${
                                                expandedSpecificationMain
                                                    ? "max-h-full"
                                                    : "max-h-20 overflow-hidden"
                                            }`}
                                            style={{ listStyleType: "disc" }}
                                        >
                                            {item?.specifications.map(
                                                (spec, index) =>
                                                    spec.type ===
                                                        "principal" && (
                                                        <li
                                                            key={index}
                                                            className="gap-2 customtext-primary opacity-85 flex flex-row items-center"
                                                        >   
                                                            <CircleCheckIcon className="customtext-primary w-4 h-4" />
                                                            {spec.description}
                                                        </li>
                                                    )
                                            )}
                                        </ul>
                                        <button
                                            className="font-semibold flex flex-row gap-2 items-center text-base xl:text-[17px] 2xl:text-xl mb-4 customtext-neutral-dark font-font-general pb-2 border-b border-neutral-dark"
                                            onClick={() =>
                                                setExpanded(
                                                    !expandedSpecificationMain
                                                )
                                            }
                                        >
                                            {expandedSpecificationMain
                                                ? "Ver menos"
                                                : "Ver más especificaciones"}
                                            {expandedSpecificationMain ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                            </div>

                            {/* <div className="block lg:hidden mt-8 ">
                                <div className="flex items-center gap-2 mb-6">
                                    <ShoppingCart className="w-6 h-6 customtext-primary" />
                                    <h2 className="text-base font-semibold">
                                        Completa tu compra con estos productos
                                    </h2>
                                </div>

                                <div className=" flex gap-4">
                                    <div className="w-2/3 flex gap-2">
                                        {associatedItems.map(
                                            (product, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                >
                                                    <img
                                                        src={`/storage/images/item/${product.image}`}
                                                        className=" rounded-lg aspect-square w-24 h-24 object-cover bg-[#F7F9FB]"
                                                        onError={(e) =>
                                                            (e.target.src =
                                                                "/api/cover/thumbnail/null")
                                                        }
                                                    />
                                                    {index <
                                                        associatedItems.length -
                                                            1 && (
                                                        <span className="text-2xl font-bold">
                                                            <Plus />
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {associatedItems.map((product, index) => (
                                    <div
                                        key={index}
                                        className="flex mt-4 gap-4 p-4 border rounded-lg items-center"
                                    >
                                        <CheckSquare className="w-5 h-5 customtext-primary" />
                                        <div className="flex-1 font-semibold">
                                            <span className="text-[10px] customtext-neutral-dark block">
                                                {product.brand.name}
                                            </span>
                                            <p className="text-sm customtext-neutral-light font-medium">
                                                {product.name}
                                            </p>
                                        </div>
                                        <p className="font-bold customtext-neutral-dark">
                                            S/{" "}
                                            {parseFloat(
                                                product.final_price
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                ))}

                                <div className=" w-full flex flex-col justify-start items-start bg-gray-50 p-4 rounded-lg mt-4">
                                    <span className="text-xs font-semibold customtext-neutral-light">
                                        Total
                                    </span>

                                    <p className="font-bold mb-2 customtext-neutral-dark">
                                        S/ {total.toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => addAssociatedItems()}
                                        className="bg-primary text-xs font-semibold text-white w-max py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300 hover:shadow-md"
                                    >
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div> */}
                        </div>

                        {/* Right Column - Product Info */}
                        <div className="hidden lg:flex flex-col">
                            {/* Brand and Title */}
                            <div className="mb-6 font-font-general">
                                <p className="customtext-neutral-light text-sm 2xl:text-lg">
                                    Marca:{" "}
                                    <span className="customtext-neutral-dark">
                                        {item?.brand.name}
                                    </span>
                                </p>
                                <h1 className="customtext-neutral-dark text-3xl lg:text-4xl 2xl:text-5xl font-bold mt-2">
                                    {item?.name}
                                </h1>
                            </div>

                            {/* SKU and Availability */}
                            <div className="flex customtext-neutral-light items-center gap-8 text-sm mb-6 font-font-general">
                                <span className="customtext-neutral-light text-sm 2xl:text-base">
                                    SKU:{" "}
                                    <span className="customtext-neutral-dark font-bold">
                                        {item?.sku}
                                    </span>
                                </span>
                                <span className="customtext-neutral-light text-sm 2xl:text-base">
                                    Disponibilidad:{" "}
                                    <span className="customtext-neutral-dark font-bold">
                                        {item?.stock > 0
                                            ? "En stock"
                                            : "Agotado"}
                                    </span>
                                </span>
                            </div>

                            <div className="flex flex-col gap-3 pb-8">

                                {/* Price Section */}
                                <div className="w-1/2 !font-font-general">
                                    <p className="text-sm 2xl:text-base customtext-neutral-light mb-1">
                                        Precio:{" "}
                                        <span className="line-through">
                                            S/ {item?.price}
                                        </span>
                                    </p>
                                    <div className="flex items-center gap-4 relative">
                                        <span className="text-[40px] font-bold customtext-neutral-dark">
                                            S/ {item?.final_price}
                                        </span>
                                        <span className="absolute -top-0 right-0 bg-[#F93232] text-white font-bold px-3 py-2 rounded-xl text-base">
                                            -
                                            {Number(
                                                item?.discount_percent
                                            ).toFixed(1)}
                                            %
                                        </span>
                                    </div>

                                    {/* Quantity */}
                                    <div className="mt-4">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex items-center space-x-4 customtext-neutral-light text-sm 2xl:text-base">
                                                <span className="opacity-85">
                                                    Cantidad
                                                </span>
                                                <div className="relative flex items-center border rounded-md px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={quantity}
                                                        onChange={handleChange}
                                                        min="1"
                                                        max="10"
                                                        className="w-10 py-1 customtext-neutral-dark text-center bg-transparent outline-none appearance-none"
                                                    />
                                                </div>
                                                <span className="opacity-85">
                                                    Máximo 10 unidades.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Add to Cart */}                
                                <div className="flex flex-col">
                                    <button
                                        onClick={() => {
                                            onAddClicked(item);
                                            setModalOpen(!modalOpen);
                                        }}
                                        className="w-full font-font-general text-base 2xl:text-lg bg-primary text-white py-3 font-semibold rounded-3xl hover:opacity-90 transition-all duration-300 mt-4"
                                    >
                                        Agregar al carrito
                                    </button>
                                    <button
                                        className="w-full font-font-general text-base 2xl:text-lg customtext-neutral-dark border border-neutral-dark py-3 font-semibold rounded-3xl hover:opacity-90 transition-all duration-300 mt-4"
                                    >
                                        Comprar
                                    </button>
                                </div>
                            </div>

                            {/* Specifications */}
                                
                            <div className="flex-1 w-full">
                                    <div className="bg-[#F7F9FB] rounded-xl p-6">
                                        <h3 className="font-semibold text-lg xl:text-xl 2xl:text-2xl mb-4 customtext-neutral-dark font-font-general">
                                            Especificaciones principales
                                        </h3>
                                        <ul
                                            className={`space-y-1  customtext-neutral-light  mb-4 list-disc transition-all duration-300 ${
                                                expandedSpecificationMain
                                                    ? "max-h-full"
                                                    : "max-h-20 overflow-hidden"
                                            }`}
                                            style={{ listStyleType: "disc" }}
                                        >
                                            {item?.specifications.map(
                                                (spec, index) =>
                                                    spec.type ===
                                                        "principal" && (
                                                        <li
                                                            key={index}
                                                            className="gap-2 customtext-primary opacity-85 flex flex-row items-center"
                                                        >   
                                                            <CircleCheckIcon className="customtext-primary w-4 h-4" />
                                                            {spec.description}
                                                        </li>
                                                    )
                                            )}
                                        </ul>
                                        <button
                                            className="font-semibold flex flex-row gap-2 items-center text-base xl:text-[17px] 2xl:text-xl mb-4 customtext-neutral-dark font-font-general pb-2 border-b border-neutral-dark"
                                            onClick={() =>
                                                setExpanded(
                                                    !expandedSpecificationMain
                                                )
                                            }
                                        >
                                            {expandedSpecificationMain
                                                ? "Ver menos"
                                                : "Ver más especificaciones"}
                                            {expandedSpecificationMain ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                            </div>

                            {/* Whatsapp */}
                            <div className="w-full mt-5">
                                <div className="bg-[#F7F9FB] flex flex-row rounded-xl p-5 gap-3">
                                    <img
                                        src="/assets/img/salafabulosa/whatsapp.png"
                                        onError={e => e.target.src = 'assets/img/noimage/no_imagen_circular.png'}
                                        className="w-12 h-12 object-contain"
                                        loading="lazy"
                                    />
                                    <div className="customtext-neutral-dark font-font-general text-base  2xl:text-xl font-semibold">
                                        <p>¿Tienes dudas sobre este producto? Haz  <span className="underline">clic aquí</span> y chatea con nosotros por WhatsApp</p>
                                    </div>
                                </div>           
                            </div>     
                                      
                        </div>
                    </div>
                </div>


                <div className="grid gap-20 md:grid-cols-2 bg-white rounded-xl p-8 font-font-general">
                    {/* Specifications Section */}
                    <div>
                        <h2 className="text-2xl font-bold customtext-neutral-dark mb-4 border-b pb-4">
                            Especificaciones
                        </h2>
                        <div className="space-y-1">
                            {item?.specifications.map(
                                (spec, index) =>
                                    spec.type === "general" && (
                                        <div
                                            key={index}
                                            className={`grid grid-cols-2 gap-4 p-3 ${
                                                index % 2 === 0
                                                    ? "bg-[#F7F9FB]"
                                                    : "bg-white"
                                            }`}
                                        >
                                            <div className="customtext-neutral-light opacity-85">
                                                {spec.title}
                                            </div>
                                            <div className="customtext-neutral-dark">
                                                {spec.description}
                                            </div>
                                        </div>
                                    )
                            )}
                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div>
                        <h2 className="text-2xl font-bold customtext-neutral-dark mb-4 border-b pb-4">
                            Información adicional
                        </h2>
                        <div
                            className={`space-y-2 ${
                                !isExpanded
                                    ? "max-h-[400px] overflow-hidden"
                                    : ""
                            }`}
                        >
                            <h3 className="text-xl font-semibold customtext-neutral-dark mb-4">
                                Acerca de este artículo
                            </h3>
                            <div
                                className="customtext-neutral-dark"
                                dangerouslySetInnerHTML={{
                                    __html: item?.description,
                                }}
                            ></div>
                            <div className={`pl-10`}>
                                <ul className="list-disc pl-5 space-y-2">
                                    {item?.features.map((feature, index) => (
                                        <li
                                            key={index}
                                            className="customtext-neutral-dark"
                                        >
                                            {feature.feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <CartModal
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
}
