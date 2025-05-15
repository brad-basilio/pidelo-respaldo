import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, Heart, ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import ItemsRest from "../../../../Actions/ItemsRest";
import CartModal from "../../Components/CartModal";
import { toast, Toaster } from "sonner";
import CartModalBananaLab from "../../Components/CartModalBananaLab";
import Tippy from "@tippyjs/react";

const CardProductPideloPe = ({
    data,
    product,
    widthClass = "lg:w-full",
    
}) => {
    const itemsRest = new ItemsRest();
    const [modalOpen, setModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [variationsItems, setVariationsItems] = useState([]);
   
  



    const handleVariations = async (item) => {
        try {
            const request = {
                slug: item?.slug,
            };
            const response = await itemsRest.getVariations(request);
            if (!response) {
                return;
            }
            const variations = response;
            setVariationsItems(variations.variants);
        } catch (error) {
            return;
        }
    };

    useEffect(() => {
        if (product?.id) {
            handleVariations(product);
        }
    }, [product]);

    return (
        <>
            <motion.a
                href={`/product/${product.slug}`}
               
                className={`group   w-full ${widthClass} rounded-3xl overflow-hidden flex-shrink-0 font-paragraph cursor-pointer relative `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="bg-white rounded-md h-full flex flex-col ">
                    {/* Imagen del producto y etiqueta de descuento */}
                    <div className="relative">
                        {product.discount != null &&
                            !isNaN(product.discount) && (
                                <span className="absolute top-3 -left-1 lg:-left-2 bg-[#F93232] text-white rounded-xl text-sm font-bold px-2 py-1 shadow-md z-10 tracking-wider">
                                    {Math.round(product.discount_percent)}%
                                </span>
                            )}
                        <motion.div
                            className="aspect-square rounded-t-md overflow-hidden flex items-center justify-center bg-secondary"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                src={`/storage/images/item/${product.image}`}
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                                alt={product.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </motion.div>
                    </div>

                    {/* Información del producto */}
                    <div className="p-3 flex-grow flex flex-col">
                        <div className="flex gap-1">
                            {variationsItems &&
                                variationsItems?.map((variant) => (
                                    <Tippy
                                        content={variant.color}
                                        key={variant.slug}
                                    >
                                        <motion.a
                                            href={`/product/${variant.slug}`}
                                            className="variant-option rounded-full object-fit-cover"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <img
                                                className="color-box rounded-full h-3 w-3 lg:w-4 lg:h-4 object-fit-cover"
                                                src={`/storage/images/item/${variant.texture}`}
                                            />
                                        </motion.a>
                                    </Tippy>
                                ))}
                        </div>
                        <div className="flex justify-between items-start w-full mt-2">
                            <h3 className="w-11/12 lg:w-10/12 customtext-neutral-dark text-xs lg:text-[15px] leading-4 font-semibold mb-2 line-clamp-3">
                                {product.name}
                            </h3>
                          
                        </div>
                        {/* Precio */}
                        <div className="flex flex-col lg:flex-row lg:justify-between items-baseline mt-1">
                            <span className="customtext-neutral-dark text-[20px] md:text-2xl font-bold">
                                S/ {product.final_price}
                            </span>
                            {/*  <p className="text-[10px] lg:text-xs customtext-neutral-dark mt-1">
                                Más vendidos (100)
                            </p> */}
                        </div>

                       
                      
                    </div>
                </div>
            </motion.a>

        
        </>
    );
};

export default CardProductPideloPe;
