import React, { useState } from "react";
import ReactModal from "react-modal";

import Tippy from "@tippyjs/react";
import HtmlContent from "../../../Utils/HtmlContent";

ReactModal.setAppElement('#app')

const FooterSimple = ({ socials = [], terms = {}, footerLinks = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const links = {}
  footerLinks.forEach(fl => {
    links[fl.correlative] = fl.description
  })

  return (
    <>
      <footer className="px-[5%] py-[10%] md:px-[10%] md:py-[7.5%] lg:py-[5%] text-white relative grid grid-cols-3 md:grid-cols-2 gap-x-4 gap-y-6 text-sm bg-primary">
        <div className="col-span-2 flex flex-col gap-4 md:flex-row-reverse items-start justify-evenly md:col-span-1">
          <ul className="flex flex-col gap-2">
            {links.whatsapp && <li><a href={`//wa.me/${links.whatsapp}`}>Conversemos</a></li>}
            <li><a href="/faqs">Preguntas frecuentes</a></li>
            <li>
              <span className="cursor-pointer" onClick={openModal}>
                Términos y condiciones
              </span>
            </li>
            {links['customer-complaints'] && <li><a href={links['customer-complaints']}>Libro de reclamaciones</a></li>}
          </ul>
          <img src="/assets/img/logo.svg" alt="Trasciende Logo" className="h-8 w-max" />
        </div>
        <div className="col-span-1 flex flex-col gap-4 md:flex-row items-start justify-evenly md:col-span-1">
          <ul className="flex flex-col gap-2">
            {links.phone && <li><a href={`tel:${links.phone}`}>Teléfono</a></li>}
            {links.email && <li><a href={`mailto:${links.email}`}>Mail</a></li>}
            {links.whatsapp && <li><a href={`//wa.me/${links.whatsapp}`}>WhatsApp</a></li>}
          </ul>
          <div className="flex flex-wrap items-end justify-start gap-2">
            {socials.map((social, index) => (
              <Tippy key={index} content={`Ver ${social.name} en ${social.description}`}>
                <a
                  href={social.link}
                  className={`text-xl bg-transparent border border-white text-white ${social.icon} w-8 h-8 pt-0.5 text-center rounded-full`}
                />
              </Tippy>
            ))}
          </div>
        </div>
      </footer>

      {/* Modal para Términos y Condiciones */}
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Términos y condiciones"
        className="absolute left-1/2 -translate-x-1/2 bg-white p-6 rounded shadow-lg w-[95%] max-w-2xl my-8 outline-none h-[90vh]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <button onClick={closeModal} className="float-right text-gray-500 hover:text-gray-900">
          Cerrar
        </button>
        <h2 className="text-xl font-bold mb-4">Políticas de privacidad y condiciones de uso</h2>
        <HtmlContent className="prose h-[calc(90vh-120px)] lg:h-[calc(90vh-90px)] overflow-auto" html={terms.description} />
      </ReactModal>
    </>
  );
};

export default FooterSimple;
