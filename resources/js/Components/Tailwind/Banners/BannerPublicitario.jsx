import { Tag } from "lucide-react";
import Global from "../../../Utils/Global";
import { useState, useEffect } from "react";

const BannerPublicitario = ({ data }) => {
    const [stylePidelo, setStylePidelo] = useState(false);

    useEffect(() => {
        const app_style = Global.APP_STYLE;
        if (app_style === 'pidelope') {
            setStylePidelo(true);
        }
    }, []);

    return (
        <div className=" px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-4 md:py-12">
            <div
                className="relative rounded-3xl md:rounded-2xl h-[600px] md:h-[500px] "
                style={{
                    backgroundImage: `url(/storage/images/system/${data?.background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="flex flex-col md:flex-row items-center justify-between h-full gap-8 ">
                    {/* Left side - Image */}
                    <div className={`order-1 md:order-none w-full relative z-10 ${stylePidelo ? 'md:w-6/12 ':'md:w-7/12 '}`}>
                        <img
                            src={`/storage/images/system/${data?.image}`}
                            className="w-full h-auto object-cover md:absolute scale-110 md:-translate-y-1/2"
                        />
                    </div>

                    {/* Right side - Content */}
                    <div className={`md:order-1  text-white z-10 font-paragraph ${stylePidelo ?'md:w-6/12' :'md:w-5/12'} `}>
                        <div className={`${stylePidelo ?'max-w-lg' : 'max-w-sm'}`}>
                            <h1 className={`text-[40px] leading-tight md:text-6xl font-bold mb-4 ${stylePidelo && "customtext-neutral-dark"}`}>
                                {data?.name?.split(' ').map((word, index) => (
                                    word.includes('*') ? (
                                        <span key={index} className="customtext-primary font-extrabold">
                                            {word.replace(/\*/g, ' ')}
                                        </span>
                                    ) : (
                                        <span key={index}>{word} </span>
                                    )
                                ))}
                            </h1>
                            <p className={`text-[16.88px] mb-8 ${stylePidelo && 'customtext-neutral-light'} `}>
                                {data?.description}
                            </p>
                            {data?.button_link && <a
                                href={data?.button_link}
                                className="bg-white cursor-pointer text-sm w-max font-bold customtext-neutral-dark px-10 py-4 rounded-xl  hover:opacity-90 transition-all duration-300 flex items-center gap-2"
                            >
                                {data?.button_text}
                                <Tag width={"1rem"} className="rotate-90" />
                            </a>}
                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BannerPublicitario;
