import { useState } from "react";
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency";

import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import CardItem from "./CardItem";
import General from "../../../../Utils/General";
import Tippy from "@tippyjs/react";




export default function CartStep({ cart, setCart, onContinue, subTotal, envio, igv,fleteTotal,seguroImportacionTotal, derechoArancelarioTotal, totalFinal }) {
    return (
        <div className="grid lg:grid-cols-5 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-3">
                <div className="space-y-6">
                    {cart.map((item, index) => (
                        <CardItem key={index} {...item} setCart={setCart} />
                    ))}
                </div>
            </div>

            {/* Resumen de compra */}
            <div className="bg-[#F7F9FB] rounded-xl shadow-lg p-6 col-span-2 h-max">
                <h3 className="text-2xl font-bold pb-6">Resumen de compra</h3>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="customtext-neutral-dark">Subtotal</span>
                        <span className="font-semibold">{CurrencySymbol()}{Number2Currency(subTotal)}</span>
                    </div>
                    {
                        Number(General.get('igv_checkout')) > 0 &&
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">IGV</span>
                            <span className="font-semibold">{CurrencySymbol()}{Number2Currency(igv)}</span>
                        </div>
                    }
                    {/* {
                        Number(General.get('importation_flete')) > 0 &&
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">Flete ({CurrencySymbol()}7.00/Kg)</span>
                            <span className="font-semibold">{CurrencySymbol()}{Number2Currency(fleteTotal)}</span>
                        </div>
                    } */}
                    {
                        Number(General.get('importation_seguro')) > 0 &&
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">Seguro ({Number(General.get('importation_seguro')).toFixed(2)}%)</span>
                            <span className="font-semibold">{CurrencySymbol()}{Number2Currency(seguroImportacionTotal)}</span>
                        </div>
                    }
                    {
                        Number(General.get('importation_derecho_arancelario')) > 0 &&
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">
                                Derecho arancelario
                                {
                                    General.get('importation_derecho_arancelario_descripcion') &&
                                    <Tippy content={<p className="whitespace-pre-line">{General.get('importation_derecho_arancelario_descripcion')}</p>} allowHTML>
                                        <i className="mdi mdi-information ms-1"></i>
                                    </Tippy>
                                }
                                </span>
                            <span className="font-semibold">{CurrencySymbol()}{Number2Currency(derechoArancelarioTotal)}</span>
                        </div>
                    }
                    <div className="flex justify-between">
                        <span className="customtext-neutral-dark">Envío</span>
                        <span className="font-semibold">{CurrencySymbol()}{Number2Currency(envio)}</span>
                    </div>
                    <div className="py-3 border-y-2 mt-6">
                        <div className="flex justify-between font-bold text-[20px] items-center">
                            <span>Total</span>
                            <span>{CurrencySymbol()}{Number2Currency(totalFinal)}</span>
                        </div>
                    </div>
                    <div className="space-y-2 pt-4">

                        <ButtonPrimary onClick={onContinue}>Continuar Compra</ButtonPrimary>

                        <ButtonSecondary href="/">Cancelar</ButtonSecondary>
                    </div>
                    <div>
                        <p className="text-sm customtext-neutral-dark">
                            Al realizar tu pedido, aceptas los <a className="customtext-primary font-bold">Términos y Condiciones</a>, y que nosotros usaremos sus datos personales de acuerdo con nuestra <a className="customtext-primary font-bold">Política de Privacidad</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}