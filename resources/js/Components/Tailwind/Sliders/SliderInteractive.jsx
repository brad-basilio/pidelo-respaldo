import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const SliderInteractive = ({ items, data }) => {
    //TODO: Validación y conversión de infiniteLoop
    const parseInfiniteLoop = (value) => {
        const validTrueValues = ["true", "si"];
        const validFalseValues = ["false", "no"];
        if (validTrueValues.includes(value?.toLowerCase())) {
            return true;
        } else if (validFalseValues.includes(value?.toLowerCase())) {
            return false;
        }
        return false; // Valor predeterminado si no se especifica o es inválido
    };

    const infiniteLoop = parseInfiniteLoop(data?.infiniteLoop);

    const [currentIndex, setCurrentIndex] = useState(1); // Empezamos en 1 para evitar el salto brusco
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentTranslate = useRef(0);

    //TODO: Duplicamos los slides al principio y al final para crear el efecto de loop infinito
    const duplicatedItems = [items[items.length - 1], ...items, items[0]];
    const validAlignments = ["center", "left", "right"];
    const validPosition = ["yes", "true", "si"];
    const showPagination = validAlignments.includes(data?.paginationAlignment);
    const alignmentClassPagination = showPagination
        ? data?.paginationAlignment
        : "center";

    const showNavigation = validPosition.includes(data?.showNavigation);
    const alignmentClassNavigation = showNavigation
        ? data?.navigationAlignment
        : "true";

    //TODO: Funciones del Slider

    const nextSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex + 1) % duplicatedItems.length
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? duplicatedItems.length - 1 : prevIndex - 1
        );
    };

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX;
        sliderRef.current.style.transition = "none";
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;

        const deltaX = e.pageX - startX.current;
        currentTranslate.current =
            -currentIndex * 100 + (deltaX / window.innerWidth) * 100;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;

        isDragging.current = false;
        sliderRef.current.style.transition = "transform 0.5s ease-in-out";

        const threshold = 20;
        const deltaX = Math.abs(
            (currentTranslate.current + currentIndex * 100) *
                (window.innerWidth / 100)
        );

        if (deltaX > threshold) {
            if (currentTranslate.current > -currentIndex * 100) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            setCurrentIndex(currentIndex);
        }

        sliderRef.current.style.transform = `translateX(-${
            currentIndex * 100
        }%)`;
    };

    const handleMouseLeave = () => {
        if (isDragging.current) {
            handleMouseUp();
        }
    };

    //TODO: Problema Loop - Validacion y Efectuar
    if (infiniteLoop) {
        useEffect(() => {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000);

            return () => clearInterval(interval);
        }, [currentIndex]);
    }
    //TODO: Efecto para manejar el loop infinito sin saltos bruscos
    useEffect(() => {
        if (currentIndex === 0) {
            setTimeout(() => {
                sliderRef.current.style.transition = "none"; // Desactivar transición
                setCurrentIndex(duplicatedItems.length - 2); // Ir al penúltimo elemento
                requestAnimationFrame(() => {
                    sliderRef.current.style.transform = `translateX(-${
                        (duplicatedItems.length - 2) * 100
                    }%)`;
                    setTimeout(() => {
                        sliderRef.current.style.transition =
                            "transform 0.5s ease-in-out"; // Reactivar transición
                    }, 50); // Pequeño retraso para evitar saltos visibles
                });
            }, 500);
        } else if (currentIndex === duplicatedItems.length - 1) {
            setTimeout(() => {
                sliderRef.current.style.transition = "none"; // Desactivar transición
                setCurrentIndex(1); // Ir al segundo elemento
                requestAnimationFrame(() => {
                    sliderRef.current.style.transform = `translateX(-${
                        1 * 100
                    }%)`;
                    setTimeout(() => {
                        sliderRef.current.style.transition =
                            "transform 0.5s ease-in-out"; // Reactivar transición
                    }, 50); // Pequeño retraso para evitar saltos visibles
                });
            }, 500);
        }
    }, [currentIndex]);

    const buttonsRef = useRef([]);

    useEffect(() => {
        buttonsRef.current.forEach((button) => {
            if (button) adjustTextColor(button); // Aplicar a cada botón en el slider
        });
    }, [items]); // Se ejecuta cada vez que cambian los elementos del slider

    return (
        <div className="relative w-full mx-auto">
            <div
                className="overflow-hidden relative cursor-grab ease"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={sliderRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {duplicatedItems.map((item, index) => (
                        <div
                            key={`slide-${index}`}
                            className="w-full h-[589px] lg:h-auto  flex-shrink-0 relative"
                        >
                            <img
                                src={`/storage/images/slider/${
                                    item.bg_image || "undefined"
                                }`}
                                alt={item.name}
                                loading="lazy"
                                className="absolute top-0  left-0 h-full md:h-full  w-screen md:w-full object-cover object-right-25  md:object-center  z-0  md:mr-20 lg:mr-0"
                            />

                            <div className="md:hidden absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>

                            <div className=" relative w-full px-primary 2xl:px-0 2xl:max-w-7xl  mx-auto  h-[530px] md:h-[600px] flex flex-col items-start justify-end md:justify-center">
                                <div className="flex flex-col gap-5 lg:gap-10 items-start">
                                    <h2
                                        className="w-9/12 md:w-full md:max-w-md font-font-primary customtext-neutral-dark text-[40px] leading-tight sm:text-5xl md:text-6xl tracking-normal font-bold "
                                        style={{
                                            textShadow:
                                                "0 0 20px rgba(0, 0, 0, .25)",
                                        }}
                                    >
                                        {item.name}
                                    </h2>
                                    <p
                                        className="w-8/12 md:w-full md:max-w-md customtext-neutral-dark text-lg leading-tight font-font-secondary
                                         font-normal"
                                        style={{
                                            textShadow:
                                                "0 0 20px rgba(0, 0, 0, .25)",
                                        }}
                                    >
                                        {item.description}
                                    </p>
                                    <div className="flex flex-row gap-5 md:gap-10 justify-center items-start">
                                        <a
                                            href={item.button_link}
                                            ref={(el) =>
                                                (buttonsRef.current[index] = el)
                                            }
                                            className="bg-primary   border-none flex flex-row items-center gap-3 px-10  py-4 text-base rounded-xl tracking-wide font-bold hover:opacity-90 transition-all duration-300"
                                        >
                                            {item.button_text}

                                            <Tag
                                                width={"1.25rem"}
                                                className="transform rotate-90"
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showNavigation && (
                <>
                    <div
                        className={`absolute top-1/2 left-4 transform -translate-y-1/2 `}
                    >
                        <button
                            onClick={prevSlide}
                            className="bg-accent  rounded-lg customtext-neutral-light w-8 h-8 flex items-center justify-center  transition-colors duration-300"
                        >
                            <ChevronLeft width={"1rem"} />
                        </button>
                    </div>
                    <div
                        className={`absolute top-1/2 right-4 transform -translate-y-1/2 `}
                    >
                        <button
                            onClick={nextSlide}
                            className="bg-accent rounded-lg customtext-neutral-light w-8 h-8 flex items-center justify-center  transition-colors duration-300"
                        >
                            <ChevronRight width={"1rem"} />
                        </button>
                    </div>
                </>
            )}

            {showPagination && (
                <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto ">
                    <div className="relative">
                        <div
                            className={`absolute bottom-4 ${
                                alignmentClassPagination === "left"
                                    ? "inset-x-0 left-0"
                                    : alignmentClassPagination === "right"
                                    ? "right-0"
                                    : "left-1/2 transform -translate-x-1/2"
                            }`}
                        >
                            {items.map((_, index) => (
                                <div
                                    key={`dot-${index}`}
                                    className={`inline-flex mx-1 w-3 h-3 rounded-full ${
                                        currentIndex === index + 1
                                            ? "bg-white h-5 w-5 lg:w-6 lg:h-6 items-center justify-center border-2 border-primary"
                                            : "bg-secondary"
                                    }`}
                                    onClick={() => setCurrentIndex(index + 1)}
                                >
                                    {currentIndex === index + 1 && (
                                        <div className="w-3 h-3 bg-primary rounded-full items-center justify-center"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SliderInteractive;
