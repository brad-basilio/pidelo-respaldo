import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';

function CategoryPidelo({data, items }) {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    // Create chunks of 8 items for each slide
    const chunkArray = (arr, size) => {
        const chunkedArr = [];
        for (let i = 0; i < arr.length; i += size) {
            chunkedArr.push(arr.slice(i, i + size));
        }
        return chunkedArr;
    };

    const itemChunks = chunkArray(items, 8);

    return (
        <div className="px-primary 2xl:max-w-7xl 2xl:px-0  mx-auto py-6 font-dont-general">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[32px] font-bold"
                >
                    {data?.title}
                </motion.h2>
                <div className="flex gap-2">
                    <motion.button 
                        ref={navigationPrevRef}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="py-1 px-2 rounded-lg hover:bg-primary transition-colors"
                    >
                        <ChevronLeft width="1rem" />
                    </motion.button>
                    <motion.button 
                        ref={navigationNextRef}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="py-1 px-2 rounded-lg hover:bg-primary transition-colors"
                    >
                        <ChevronRight width="1rem" />
                    </motion.button>
                </div>
            </div>

            <Swiper
                modules={[Navigation]}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                    swiper.params.navigation.nextEl = navigationNextRef.current;
                }}
                className="w-full"
            >
                {itemChunks.map((chunk, chunkIndex) => (
                    <SwiperSlide key={chunkIndex}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {chunk.map((category, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="cursor-pointer px-4 bg-white flex gap-4 items-center rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:bg-secondary transition-all duration-300"
                                >
                                    <motion.div 
                                        className="aspect-square relative"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <img
                                            src={`/storage/images/category/${category.image}`}
                                            alt={category.name}
                                            className="w-[120px] h-[120px] object-contain"
                                        />
                                    </motion.div>
                                    <div className="p-4">
                                        <motion.h3 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="font-bold mb-1"
                                        >
                                            {category.name}
                                        </motion.h3>
                                        <motion.a
                                            href="#"
                                            whileHover={{ scale: 1.1 }}
                                            className="customtext-neutral-light hover:customtext-primary text-xs font-medium transition-colors duration-300"
                                        >
                                            Ver más
                                        </motion.a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default CategoryPidelo;