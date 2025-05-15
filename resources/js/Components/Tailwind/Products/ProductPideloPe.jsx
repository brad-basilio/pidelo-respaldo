import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import CardHoverBtn from "./Components/CardHoverBtn";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import CardProductBananaLab from "./Components/CardProductBananaLab";
import CardProductPideloPe from "./Components/CardProductPideloPe";

const ProductPideloPe = ({
    items,
    data,

  
   
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(6); // Default en desktop

    // Detectar el tamaño de la pantalla para ajustar slidesPerView
    useEffect(() => {
        const updateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width < 640) setSlidesPerView(6); // Móvil
            else if (width < 1024) setSlidesPerView(3); // Tablet
            else setSlidesPerView(5); // Desktop
        };
        updateSlidesPerView();
        window.addEventListener("resize", updateSlidesPerView);
        return () => window.removeEventListener("resize", updateSlidesPerView);
    }, []);

    // Calcular el máximo número de desplazamientos permitidos
    const maxSlide = useMemo(() => {
        return Math.max(0, Math.ceil(items.length / slidesPerView) - 1);
    }, [items.length, slidesPerView]);

    // Función para avanzar al siguiente slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev < maxSlide ? prev + 1 : prev));
    };

    // Función para retroceder al slide anterior
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
    };

    return (
        <section className=" pt-6 pb-0 font-paragraph lg:py-4 2xl:py-8">
            <div className=" mx-auto px-primary 2xl:px-0 2xl:max-w-7xl ">
                {/* Header */}
                <div className="md:flex justify-between items-center    customborder-neutral-dark ">
                    <h2 className="text-[32px] leading-9 font-semibold   mb-2 md:mb-0">
                        {data?.title}
                    </h2>
                    <a
                        href={data?.link_catalog}
                        className="lg:hidden customtext-neutral-dark customtext-primary border border-primary transition-all duration-300   flex justify-center flex-row items-center gap-3   px-6  py-3 text-base rounded-xl  tracking-wide font-bold cursor-pointer hover:opacity-90 lg:bg-primary  "
                    >
                        {data?.text_button || "Ver más recomendaciones"}
                    </a>

                    <a
                        href={data?.link_catalog}
                        className="hidden lg:flex bg-primary customtext-neutral-dark border border-primary transition-all duration-300    justify-center flex-row items-center gap-3   px-6  py-3 text-base rounded-xl  tracking-wide font-bold cursor-pointer hover:opacity-90 lg:bg-primary  "
                    >
                        {data?.text_button || "Ver más recomendaciones"}
                    </a>
                </div>

                {/* Carousel */}
                <div className="relative">
                    {/* Previous button */}

                    {/* Products container */}
                    <div className="hidden md:block overflow-hidden py-0">
                        <div
                            className="grid grid-cols-2 lg:grid-cols-4   items-center transition-all duration-300   ease-in-out  lg:mt-4 lg:mb-10 lg:gap-6"
                            style={{
                                transform: `translateX(-${
                                    currentSlide * (100 / slidesPerView)
                                }%)`,
                            }}
                        >
                            {items.map((product, index) => (
                                <CardProductPideloPe
                                    key={index}
                                    product={product}
                                
                                    data={data}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="overflow-hidden py-4 md:hidden">
                        <div
                            className="flex items-center  gap-y-2 transition-all duration-300 ease-in-out flex-wrap flex-shrink "
                            style={{
                                transform: `translateX(-${
                                    currentSlide * (100 / slidesPerView)
                                }%)`,
                            }}
                        >
                            {items.map((product, index) => (
                                <CardProductPideloPe
                                    key={index}
                                    product={product}
                                  
                                  
                                 
                                    data={data}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductPideloPe;
