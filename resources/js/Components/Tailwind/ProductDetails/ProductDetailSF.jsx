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
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import ProductNavigation from "../Products/ProductNavigation";

export default function ProductDetailSF({ item, data, setCart, cart }) {
    console.log("VENIMOS DESDE ITEM DE PRODUCTDETAIL SF:", item);
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
    const [variationsItems, setVariationsItems] = useState([]);
    const inCart = cart?.find((x) => x.id == item?.id);

    useEffect(() => {
        if (item?.id) {
            productosRelacionados(item);
            obtenerCombo(item);
            handleViewUpdate(item);
            handleVariations(item);
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
    const handleVariations = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                slug: item?.slug,
            };

            // Llamar al backend para verificar el combo
            const response = await itemsRest.getVariations(request);

            // Verificar si la respuesta es válida
            if (!response) {
                return;
            }

            // Actualizar el estado con los productos asociados
            const variations = response;

            setVariationsItems(variations.variants);
            console.log(variations);
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
            <div className="px-primary mx-auto py-4 md:py-6 xl:py-8 bg-white">
                <div className="bg-white rounded-xl p-4 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-20 2xl:gap-32">
                        {/* Left Column - Images and Delivery Options */}
                        <div className="space-y-6">
                            {/* Product Images */}
                            <div className="flex flex-col gap-6">

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

                                {/* Thumbnails */}
                                <div className="flex flex-row gap-2">
                                    <button
                                        onClick={() =>
                                            setSelectedImage({
                                                url: item?.image,
                                                type: "main",
                                            })
                                        }
                                        className={`w-16 h-16  rounded-lg p-1 border-2 ${
                                            selectedImage.url === item?.image
                                                ? "border-primary "
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <img
                                            src={`/storage/images/item/${item?.image}`}
                                            alt="Main Thumbnail"
                                            className="w-full h-full object-cover"
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
                                            className={`w-16 h-16 border-2 rounded-lg p-1 ${
                                                selectedImage.url === image.url
                                                    ? "border-primary"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <img
                                                src={`/storage/images/item/${image.url}`}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) =>
                                                    (e.target.src =
                                                        "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Product Info */}
                        <div className="flex flex-col gap-2">
                            {/* Brand and Title */}
                            <div className="font-font-general">
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
                            <div className="flex flex-wrap customtext-neutral-light items-center gap-y-2  gap-x-8 text-sm font-font-general">
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

                            {/* Price Section */}
                            <div className="flex flex-col w-full xl:w-1/2 !font-font-general max-w-xl mt-5">
                                <p className="text-sm 2xl:text-base customtext-neutral-light">
                                    Precio:{" "}
                                    <span className="line-through">
                                        S/ {item?.price}
                                    </span>
                                </p>
                                <div className="flex flex-row items-center gap-4 relative">
                                    <span className="text-[40px] font-bold customtext-neutral-dark">
                                        S/ {item?.final_price}
                                    </span>
                                    <span className="bg-[#F93232] text-white font-bold px-3 py-2 rounded-xl text-base">
                                        -
                                        {Number(item?.discount_percent).toFixed(
                                            1
                                        )}
                                        %
                                    </span>
                                </div>
                            </div>

                            {/* Selector de variantes */}
                            <div className="variants-selector flex flex-col gap-3">
                                <h3 className="w-full block opacity-85 customtext-neutral-dark text-sm 2xl:text-base">
                                    Colores
                                </h3>

                                <div className="flex gap-3 items-center justify-start w-full flex-wrap">
                                    {/* Variante actual (principal) */}
                                    <Tippy content={item.color}>
                                        <a
                                            className={`variant-option rounded-full object-fit-cover  ${
                                                !variationsItems.some(
                                                    (v) => v.slug === item.slug
                                                )
                                                    ? "active p-[2px] border-[1.5px] border-neutral-dark"
                                                    : ""
                                            }`}
                                        >
                                            <img
                                                className="color-box rounded-full h-9 w-9 object-fit-cover "
                                                src={`/storage/images/item/${item.texture}`}
                                            />
                                        </a>
                                    </Tippy>    
                                    {/* Otras variantes */}

                                    {variationsItems.map((variant) => (
                                        <Tippy content={variant.color}>
                                        <a
                                            key={variant.slug}
                                            href={`/product/${variant.slug}`}
                                            className="variant-option  rounded-full object-fit-cover "
                                        >
                                            <img
                                                className="color-box rounded-full h-9 w-9 object-fit-cover "
                                                src={`/storage/images/item/${variant.texture}`}
                                            />
                                        </a>
                                        </Tippy>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="flex flex-col mt-8">
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

                            {/* Add to Cart */}
                            <div className="flex flex-col">
                                <button
                                    onClick={() => {
                                        onAddClicked(item);
                                        setModalOpen(!modalOpen);
                                    }}
                                    className="w-full font-font-general text-base 2xl:text-lg bg-primary text-white py-3 font-semibold rounded-3xl hover:opacity-90 transition-all duration-300 mt-3"
                                >
                                    Agregar al carrito
                                </button>
                                {/* <button className="w-full font-font-general text-base 2xl:text-lg customtext-neutral-dark border border-neutral-dark py-3 font-semibold rounded-3xl hover:opacity-90 transition-all duration-300 mt-4">
                                    Comprar
                                </button> */}
                            </div>

                            {/* Specifications */}
                            {item?.specifications?.length > 0 && (
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
                                                    spec.type === "principal" && (
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
                            )}

                            {/* Whatsapp */}
                            <div className="w-full mt-5">
                                <div className="bg-[#F7F9FB] flex flex-row rounded-xl p-5 gap-3">
                                    <img
                                        src="/assets/img/salafabulosa/whatsapp.png"
                                        onError={(e) =>
                                            (e.target.src =
                                                "assets/img/noimage/no_imagen_circular.png")
                                        }
                                        className="w-12 h-12 object-contain"
                                        loading="lazy"
                                    />
                                    <div className="customtext-neutral-dark font-font-general text-base  2xl:text-xl font-semibold">
                                        <p>
                                            ¿Tienes dudas sobre este producto?
                                            Haz{" "}
                                            <span className="underline">
                                                clic aquí
                                            </span>{" "}
                                            y chatea con nosotros por WhatsApp
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-10 lg:gap-20 md:grid-cols-2 bg-white rounded-xl p-4 sm:p-8 font-font-general">
                    {/* Specifications Section */}
                    {item?.specifications?.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold customtext-neutral-dark mb-4 border-b pb-3">
                                Especificaciones
                            </h2>
                            <div className="space-y-1">
                                {item.specifications.map(
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
                    )}

                    {/* Additional Information Section */}
                        <div className="font-font-general">
                            {item?.description?.replace(/<[^>]+>/g, '') && (
                                <h2 className="text-2xl font-bold customtext-neutral-dark mb-4 border-b pb-3">
                                    Información adicional
                                </h2>
                            )}

                            <div
                                className={`space-y-2 ${
                                    !isExpanded
                                        ? "max-h-[400px] overflow-hidden"
                                        : ""
                                }`}
                            >
                                {item?.description?.replace(/<[^>]+>/g, '') && (
                                    <>
                                    <h3 className="text-xl font-semibold customtext-neutral-dark mb-4">
                                        Acerca de este artículo
                                    </h3>
                                    <div
                                        className="customtext-neutral-dark"
                                        dangerouslySetInnerHTML={{
                                            __html: item?.description,
                                        }}
                                    ></div>
                                    </>
                                )}
                                
                                {item?.features?.length > 0 && (
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
                                )}
                                
                            </div>
                        </div>
                    
                </div>
            </div>

            {/* Productos relacionados */}
            {relationsItems.length > 0 && (
                <div className="-mt-20 mb-10">
                    <ProductNavigation
                        data={{ title: "Te Puede Interesar", link_catalog: "/catalogo" }}
                        items={relationsItems}
                        cart={cart}
                        setCart={setCart}
                    />      
                </div>
            )}             
            
            <CartModal
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
}
