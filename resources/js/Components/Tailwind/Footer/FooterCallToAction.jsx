import React, { useRef, useState } from "react";
import ReactModal from "react-modal";

import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import Global from "../../../Utils/Global";
import HtmlContent from "../../../Utils/HtmlContent";

const subscriptionsRest = new SubscriptionsRest();

const FooterCallToAction = ({ socials = [], summary = '', generals = [], pages = [] }) => {

  const emailRef = useRef()

  const [modalOpen, setModalOpen] = useState(null);
  const [saving, setSaving] = useState()

  const policyItems = [
    {
      title: 'Términos y condiciones',
      modalContent: generals.find(x => x.correlative == 'terms_conditions')?.description,
    },
    {
      title: 'Políticas de privacidad',
      modalContent: generals.find(x => x.correlative == 'privacy_policy')?.description,
    },
  ];

  const openModal = (index) => setModalOpen(index);
  const closeModal = () => setModalOpen(null);


  const onEmailSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const request = {
      email: emailRef.current.value
    }
    const result = await subscriptionsRest.save(request);
    setSaving(false)

    if (!result) return

    Swal.fire({
      title: '¡Éxito!',
      text: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
      icon: 'success',
      confirmButtonText: 'Ok'
    })

    emailRef.current.value = null
  }

  return (
    <>
      <img src="/assets/resources/subscription.png" alt="" className="aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1] object-cover object-center w-full" onError={e => e.target.src = '/assets/resources/cover-404.svg'} />
      <footer className=" p-[5%] pt-[calc(5%+64px)] bg-[#747D84] text-white relative">
        <form className="absolute left-1/4 right-[5%] bottom-[calc(100%-64px)] p-[5%] bg-primary text-[color:var(--Woodsmoke-900,#2B384F)]"
          onSubmit={onEmailSubmit}>
          <div className="grid md:grid-cols-2 items-end gap-4">
            <h1 className="text-xl md:text-2xl">
              Mantente siempre <b>Informado</b> con nuestra newsletter
            </h1>
            <div>
              <input ref={emailRef} type="email" className="bg-transparent border-b border-b-[color:var(--Woodsmoke-900,#2B384F)] outline-none px-3 py-2 w-full placeholder-[color:var(--Woodsmoke-900,#2B384F)]" placeholder="Correo electrónico" disabled={saving} required />
              <button className="mt-4 px-3 py-2 " disabled={saving}>
                Enviar
                <i className="mdi mdi-arrow-top-right ms-1"></i>
              </button>
            </div>
          </div>
        </form>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4 items-start justify-start">
            <img src="/assets/img/logo-default.png" alt="" className="h-8" />
            <p className="text-sm max-w-md">
              {summary}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              {
                pages.filter(x => x.menuable).map((page, index) => {
                  return <button href={page.pseudo_path || page.path}>{page.name}</button>
                })
              }
            </div>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-2">
                <p>{generals.find(x => x.correlative == 'support_phone')?.description}</p>
                <p>{generals.find(x => x.correlative == 'support_email')?.description}</p>
                <p>{generals.find(x => x.correlative == 'opening_hours')?.description}</p>
                <div>
                  {generals.find(x => x.correlative == 'address')?.description}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  socials.map((item, index) => {
                    return <Tippy key={index} content={`Ver ${item.name} en ${item.description}`}>
                      <a href={item.link} className="text-2xl">
                        <i className={`fab ${item.icon}`}></i>
                      </a>
                    </Tippy>
                  })
                }
              </div>
            </div>
          </div>
        </section>
        <hr className="my-[5%]" />
        <section className="flex flex-col lg:flex-row gap-4 justify-between text-center lg:text-start">
          <p>
            Copyright © {new Date().getFullYear()} Trasciende. Reservados todos los derechos.
          </p>
          <div className="flex flex-col justify-center lg:justify-between md:flex-row gap-4">
            <button onClick={() => openModal(0)}>Terminos de servicios</button>
            <button onClick={() => openModal(1)}>Políticas de privacidad</button>
          </div>
        </section>
      </footer>

      {policyItems.map((item, index) => (
        <ReactModal
          key={index}
          isOpen={modalOpen === index}
          onRequestClose={closeModal}
          contentLabel={item.title}
          className="absolute left-1/2 -translate-x-1/2 bg-white p-6 rounded shadow-lg w-[95%] max-w-lg my-8"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
        >
          <button onClick={closeModal} className="float-right text-gray-500 hover:text-gray-900">
            Cerrar
          </button>
          <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
          <HtmlContent className='prose' html={item.modalContent} />
        </ReactModal>
      ))}
    </>
  );
};

export default FooterCallToAction