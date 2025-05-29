import { useEffect, useState } from "react";
import CartStep from "./Components/CartStep";
import ShippingStep from "./Components/ShippingStep";
import ConfirmationStep from "./Components/ConfirmationStep";
import Global from "../../../Utils/Global";
import General from "../../../Utils/General";

export default function CheckoutSteps({
    cart,
    setCart,
    user,
    ubigeos = [],
    items,
}) {
    const [currentStep, setCurrentStep] = useState(1);
    // Calcular el precio total incluyendo IGV
    const totalPrice = cart.reduce((acc, item) => {
        const finalPrice = item.final_price;
        return acc + finalPrice * item.quantity; // Sumar el precio total por cantidad
    }, 0);

    const igvAmount = (Number(General.get('igv_checkout')) || 0) / 100;

    // Calcular el subtotal sin IGV (precio base)
    const subTotal = (totalPrice / (1 + igvAmount)).toFixed(2);

    // Calcular el IGV (18% del subtotal)
    const igv = (subTotal * igvAmount).toFixed(2);

    // Estado para el costo de envío
    const [envio, setEnvio] = useState(0);

    // Flete
    const pesoTotal = cart.reduce((acc, item) => {
        const weight = Number(item.weight) || 0;
        return acc + weight; // Sumar el precio total por cantidad
    }, 0);
    let fleteTotal = 0;
    const costoxpeso = Number(General.get('importation_flete')) || 0 
    if (costoxpeso > 0) fleteTotal = pesoTotal * costoxpeso

    // Seguro de importación
    const seguroImportacion = (Number(General.get('importation_seguro')) || 0) / 100;
    const seguroImportacionTotal = subTotal * seguroImportacion;

    const CIF = parseFloat(subTotal) + parseFloat(fleteTotal) + parseFloat(seguroImportacionTotal)
    console.log(CIF)

    // Derecho arancelario
    const derechoArancelario = (Number(General.get('importation_derecho_arancelario')) || 0) / 100;
    const derechoArancelarioTotal = CIF * derechoArancelario;
    
    console.log(derechoArancelario, derechoArancelarioTotal)

    // Calcular el total final (subtotal sin IGV + IGV + envío)
    const totalFinal = parseFloat(subTotal) + parseFloat(igv) + parseFloat(derechoArancelarioTotal) + parseFloat(envio);


    const [sale, setSale] = useState([]);
    const [code, setCode] = useState([]);
    const [delivery, setDelivery] = useState([]);
    useEffect(() => {
        const script = document.createElement("script");
        script.src = Global.CULQI_API;
        script.async = true;
        script.onload = () => {
            // console.log("✅ Culqi cargado correctamente.");

            // 🔹 Definir culqi() en window para capturar el token
            window.culqi = function () {
                if (window.Culqi.token) {
                    console.log("✅ Token recibido:", window.Culqi.token.id);
                    // Aquí puedes enviar el token a tu backend
                } else if (window.Culqi.order) {
                    console.log("✅ Orden recibida:", window.Culqi.order);
                } else {
                    console.error("❌ Error en Culqi:", window.Culqi.error);
                }
            };
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };

        return null; // No renderiza nada, solo carga Culqi en el contexto de la app
    }, []);
    return (
        <div className="min-h-screen bg-[#F7F9FB] py-12 px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
            <div className="bg-white   p-8 rounded-xl">
                {/* Steps indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        <div
                            className={`text-sm ${
                                currentStep === 1
                                    ? "customtext-primary font-medium"
                                    : "customtext-neutral-dark"
                            }`}
                        >
                            1. Carrito de compra
                        </div>
                        <div
                            className={`text-sm ${
                                currentStep === 2
                                    ? "customtext-primary font-medium"
                                    : "customtext-neutral-dark"
                            }`}
                        >
                            2. Detalles de envío
                        </div>
                        <div
                            className={`text-sm ${
                                currentStep === 3
                                    ? "customtext-primary font-medium"
                                    : "customtext-neutral-dark"
                            }`}
                        >
                            3. Orden confirmada
                        </div>
                    </div>
                    <div className="mt-4 h-1 max-w-3xl mx-auto bg-gray-200">
                        <div
                            className="h-1 bg-primary transition-all duration-500"
                            style={{
                                width: `${((currentStep - 1) / 2) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Steps content */}
                {currentStep === 1 && (
                    <CartStep
                        cart={cart}
                        setCart={setCart}
                        onContinue={() => setCurrentStep(2)}
                        subTotal={subTotal}
                        envio={envio}
                        igv={igv}
                        fleteTotal={fleteTotal}
                        seguroImportacionTotal={seguroImportacionTotal}
                        derechoArancelarioTotal={derechoArancelarioTotal}
                        totalFinal={totalFinal}
                    />
                )}

                {currentStep === 2 && (
                    <ShippingStep
                        items={items}
                        setCode={setCode}
                        setDelivery={setDelivery}
                        cart={cart}
                        setSale={setSale}
                        setCart={setCart}
                        onContinue={() => setCurrentStep(3)}
                        noContinue={() => setCurrentStep(1)}
                        subTotal={subTotal}
                        envio={envio}
                        setEnvio={setEnvio}
                        igv={igv}
                        totalFinal={totalFinal}
                        user={user}
                        ubigeos={ubigeos}
                    />
                )}

                {currentStep === 3 && (
                    <ConfirmationStep
                        code={code}
                        delivery={delivery}
                        cart={sale}
                        subTotal={subTotal}
                        envio={envio}
                        igv={igv}
                        totalFinal={totalFinal}
                    />
                )}
            </div>
        </div>
    );
}
