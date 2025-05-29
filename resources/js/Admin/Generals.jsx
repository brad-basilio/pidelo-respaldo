import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Asume que tienes un servicio para guardar los datos
import BaseAdminto from "../Components/Adminto/Base";
import GeneralsRest from "../Actions/Admin/GeneralsRest";
import CreateReactScript from "../Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import Global from "../Utils/Global";
import GalleryRest from "../Actions/Admin/GalleryRest";
import Tippy from "@tippyjs/react";

const generalsRest = new GeneralsRest();
const galleryRest = new GalleryRest();

const Generals = ({ generals }) => {
  const location =
    generals.find((x) => x.correlative == "location")?.description ?? "0,0";

  // First add these to your formData state
  const [formData, setFormData] = useState({
    phones: generals
      .find((x) => x.correlative == "phone_contact")
      ?.description?.split(",")
      ?.map((x) => x.trim()) ?? [""],
    emails: generals
      .find((x) => x.correlative == "email_contact")
      ?.description?.split(",")
      ?.map((x) => x.trim()) ?? [""],
    cintillo:
      generals.find((x) => x.correlative == "cintillo")?.description ??
      "",
    copyright:
      generals.find((x) => x.correlative == "copyright")?.description ??
      "",
    address:
      generals.find((x) => x.correlative == "address")?.description ?? "",
    openingHours:
      generals.find((x) => x.correlative == "opening_hours")
        ?.description ?? "",
    supportPhone:
      generals.find((x) => x.correlative == "support_phone")
        ?.description ?? "",
    supportEmail:
      generals.find((x) => x.correlative == "support_email")
        ?.description ?? "",
    privacyPolicy:
      generals.find((x) => x.correlative == "privacy_policy")
        ?.description ?? "",
    termsConditions:
      generals.find((x) => x.correlative == "terms_conditions")
        ?.description ?? "",
    deliveryPolicy:
      generals.find((x) => x.correlative == "delivery_policy")
        ?.description ?? "",
    salebackPolicy:
      generals.find((x) => x.correlative == "saleback_policy")
        ?.description ?? "",
    phoneWhatsapp:
      generals.find((x) => x.correlative == "phone_whatsapp")
        ?.description ?? "",
    messageWhatsapp:
      generals.find((x) => x.correlative == "message_whatsapp")
        ?.description ?? "",
    igvCheckout:
      generals.find((x) => x.correlative == "igv_checkout")
        ?.description ?? "",
    location: {
      lat: Number(location.split(",").map((x) => x.trim())[0]),
      lng: Number(location.split(",").map((x) => x.trim())[1]),
    },
    checkout_culqi: generals.find(x => x.correlative == 'checkout_culqi')?.description ?? "",
    checkout_culqi_name: generals.find(x => x.correlative == 'checkout_culqi_name')?.description ?? "",
    checkout_culqi_public_key: generals.find(x => x.correlative == 'checkout_culqi_public_key')?.description ?? "",
    checkout_culqi_private_key: generals.find(x => x.correlative == 'checkout_culqi_private_key')?.description ?? "",
    checkout_dwallet: generals.find(x => x.correlative == 'checkout_dwallet')?.description ?? "",
    checkout_dwallet_qr: generals.find(x => x.correlative == 'checkout_dwallet_qr')?.description ?? "",
    checkout_dwallet_name: generals.find(x => x.correlative == 'checkout_dwallet_name')?.description ?? "",
    checkout_dwallet_description: generals.find(x => x.correlative == 'checkout_dwallet_description')?.description ?? "",
    checkout_transfer: generals.find(x => x.correlative == 'checkout_transfer')?.description ?? "",
    checkout_transfer_cci: generals.find(x => x.correlative == 'checkout_transfer_cci')?.description ?? "",
    checkout_transfer_name: generals.find(x => x.correlative == 'checkout_transfer_name')?.description ?? "",
    checkout_transfer_description: generals.find(x => x.correlative == 'checkout_transfer_description')?.description ?? "",

    // Importation calculations
    importation_flete: generals.find(x => x.correlative == 'importation_flete')?.description ?? "",
    importation_seguro: generals.find(x => x.correlative == 'importation_seguro')?.description ?? "",
    importation_derecho_arancelario: generals.find(x => x.correlative == 'importation_derecho_arancelario')?.description ?? "",
    importation_derecho_arancelario_descripcion: generals.find(x => x.correlative == 'importation_derecho_arancelario_descripcion')?.description ?? "",
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    const list = [...formData[field]];
    list[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      [field]: list,
    }));
  };

  const handleAddField = (field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: [...prevState[field], ""],
    }));
  };

  const handleRemoveField = (index, field) => {
    const list = [...formData[field]];
    list.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      [field]: list,
    }));
  };

  const handleMapClick = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      location: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await generalsRest.save([
        {
          correlative: "phone_contact",
          name: "Teléfono de contacto",
          description: formData.phones.join(","),
        },
        {
          correlative: "email_contact",
          name: "Correo de contacto",
          description: formData.emails.join(","),
        },
        {
          correlative: "address",
          name: "Dirección",
          description: formData.address,
        },
        {
          correlative: "cintillo",
          name: "Cintillo",
          description: formData.cintillo,
        },
        {
          correlative: "copyright",
          name: "Copyright",
          description: formData.copyright,
        },
        {
          correlative: "opening_hours",
          name: "Horarios de atención",
          description: formData.openingHours,
        },
        {
          correlative: "support_phone",
          name: "Número de soporte",
          description: formData.supportPhone,
        },
        {
          correlative: "support_email",
          name: "Correo de soporte",
          description: formData.supportEmail,
        },
        {
          correlative: "privacy_policy",
          name: "Política de privacidad",
          description: formData.privacyPolicy,
        },
        {
          correlative: "terms_conditions",
          name: "Términos y condiciones",
          description: formData.termsConditions,
        },
        {
          correlative: "delivery_policy",
          name: "Políticas de envío",
          description: formData.deliveryPolicy,
        },
        {
          correlative: "saleback_policy",
          name: "Políticas de devolucion y cambio",
          description: formData.salebackPolicy,
        },
        {
          correlative: "phone_whatsapp",
          name: "Número de Whatsapp",
          description: formData.phoneWhatsapp,
        },
        {
          correlative: "message_whatsapp",
          name: "Mensaje de Whatsapp",
          description: formData.messageWhatsapp,
        },
        {
          correlative: "igv_checkout",
          name: "IGV en el checkout",
          description: formData.igvCheckout,
        },
        {
          correlative: "checkout_culqi",
          name: "Habilitar Culqi",
          description: formData.checkout_culqi,
        },
        {
          correlative: 'checkout_culqi_name',
          name: 'Nombre de la cuenta de Culqi',
          description: formData.checkout_culqi_name,
        },
        {
          correlative: 'checkout_culqi_public_key',
          name: 'Llave pública de Culqi',
          description: formData.checkout_culqi_public_key,
        },
        {
          correlative: 'checkout_culqi_private_key',
          name: 'Llave privada de Culqi',
          description: formData.checkout_culqi_private_key,
        },
        {
          correlative: 'checkout_dwallet',
          name: 'Habilitar Yape/Plin',
          description: formData.checkout_dwallet,
        },
        {
          correlative: 'checkout_dwallet_qr',
          name: 'QR Yape/Plin',
          description: formData.checkout_dwallet_qr,
        },
        {
          correlative: 'checkout_dwallet_name',
          name: 'Título Yape/Plin',
          description: formData.checkout_dwallet_name,
        },
        {
          correlative: 'checkout_dwallet_description',
          name: 'Descripción Yape/Plin',
          description: formData.checkout_dwallet_description,
        },
        {
          correlative: 'checkout_transfer',
          name: 'Habilitar Transferencia',
          description: formData.checkout_transfer,
        },
        {
          correlative: 'checkout_transfer_cci',
          name: 'CCI Transferencia',
          description: formData.checkout_transfer_cci,
        },
        {
          correlative: 'checkout_transfer_name',
          name: 'Nombre Transferencia',
          description: formData.checkout_transfer_name,
        },
        {
          correlative: 'checkout_transfer_description',
          name: 'Descripción Transferencia',
          description: formData.checkout_transfer_description,
        },
        {
          correlative: "location",
          name: "Ubicación",
          description: `${formData.location.lat},${formData.location.lng}`,
        },
        {
          correlative: "importation_flete",
          name: "Flete",
          description: formData.importation_flete,
        },
        {
          correlative: "importation_seguro",
          name: "Seguro",
          description: formData.importation_seguro,
        },
        {
          correlative: "importation_derecho_arancelario",
          name: "Derecho arancelario",
          description: formData.importation_derecho_arancelario,
        },
        {
          correlative: "importation_derecho_arancelario_descripcion",
          name: "Descripción derecho arancelario",
          description: formData.importation_derecho_arancelario_descripcion,
        }
      ]);
      // alert('Datos guardados exitosamente');
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      // alert('Error al guardar los datos');
    }
  };

  return (
    <div className="card">
      <form className="card-body" onSubmit={handleSubmit}>
        <ul className="nav nav-tabs" id="contactTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "general" ? "active" : ""
                }`}
              onClick={() => setActiveTab("general")}
              type="button"
              role="tab"
            >
              Configuración general
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "contact" ? "active" : ""
                }`}
              onClick={() => setActiveTab("contact")}
              type="button"
              role="tab"
            >
              Información de Contacto
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "checkout" ? "active" : ""
                }`}
              onClick={() => setActiveTab("checkout")}
              type="button"
              role="tab"
            >
              Métodos de Pago
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "importation" ? "active" : ""
                }`}
              onClick={() => setActiveTab("importation")}
              type="button"
              role="tab"
            >
              Cáculos de importación
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "policies" ? "active" : ""
                }`}
              onClick={() => setActiveTab("policies")}
              type="button"
              role="tab"
            >
              Políticas y Términos
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "location" ? "active" : ""
                }`}
              onClick={() => setActiveTab("location")}
              type="button"
              role="tab"
            >
              Ubicación
            </button>
          </li>
        </ul>

        <div className="tab-content" id="generalTabsContent">
          <div
            className={`tab-pane fade ${activeTab === "general" ? "show active" : ""
              }`}
            role="tabpanel"
          >
            <div className="row">
              <div className="col-md-6 mb-2">
                <label htmlFor="cintillo" className="form-label">
                  Cintillo
                </label>
                <textarea
                  className="form-control"
                  id="cintillo"
                  value={formData.cintillo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cintillo: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="col-md-6 mb-2">
                <label htmlFor="copyright" className="form-label">
                  Copyright
                </label>
                <textarea
                  className="form-control"
                  id="copyright"
                  value={formData.copyright}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      copyright: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </div>
            <div className="mb-2">
              <label htmlFor="address" className="form-label">
                Dirección
              </label>
              <textarea
                className="form-control"
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                required
              ></textarea>
            </div>
            <div className="mb-2">
              <TextareaFormGroup
                label="Horarios de atencion"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    openingHours: e.target.value,
                  })
                }
                value={formData.openingHours}
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="igvCheckout"
                className="form-label"
              >
                IGV
                <small className="d-block text-muted">Dejar en 0 si no se quiere mostrar</small>
              </label>
              <input
                type="number"
                step={0.01}
                className="form-control"
                id="igvCheckout"
                value={formData.igvCheckout}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    igvCheckout: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="tab-content" id="contactTabsContent">
          <div
            className={`tab-pane fade ${activeTab === "contact" ? "show active" : ""
              }`}
            role="tabpanel"
          >
            <div className="row mb-2">
              <div className="col-md-6">
                {formData.phones.map((phone, index) => (
                  <div
                    key={`phone-${index}`}
                    className="mb-3"
                  >
                    <label
                      htmlFor={`phone-${index}`}
                      className="form-label"
                    >
                      Teléfono {index + 1}
                    </label>
                    <div className="input-group">
                      <input
                        type="tel"
                        className="form-control"
                        id={`phone-${index}`}
                        value={phone}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            index,
                            "phones"
                          )
                        }
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          handleRemoveField(
                            index,
                            "phones"
                          )
                        }
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleAddField("phones")}
                >
                  Agregar teléfono
                </button>
              </div>
              <div className="col-md-6">
                {formData.emails.map((email, index) => (
                  <div
                    key={`email-${index}`}
                    className="mb-3"
                  >
                    <label
                      htmlFor={`email-${index}`}
                      className="form-label"
                    >
                      Correo {index + 1}
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id={`email-${index}`}
                        value={email}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            index,
                            "emails"
                          )
                        }
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          handleRemoveField(
                            index,
                            "emails"
                          )
                        }
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleAddField("emails")}
                >
                  Agregar correo
                </button>
              </div>
            </div>
            <div className="mb-2">
              <label
                htmlFor="supportPhone"
                className="form-label"
              >
                Número de soporte
              </label>
              <input
                type="tel"
                className="form-control"
                id="supportPhone"
                value={formData.supportPhone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    supportPhone: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="supportEmail"
                className="form-label"
              >
                Correo de soporte
              </label>
              <input
                type="email"
                className="form-control"
                id="supportEmail"
                value={formData.supportEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    supportEmail: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="phoneWhatsapp"
                className="form-label"
              >
                Número de Whatsapp
              </label>
              <input
                type="tel"
                className="form-control"
                id="phoneWhatsapp"
                value={formData.phoneWhatsapp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phoneWhatsapp: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="messageWhatsapp"
                className="form-label"
              >
                Mensaje de Whatsapp
              </label>
              <input
                type="tel"
                className="form-control"
                id="messageWhatsapp"
                value={formData.messageWhatsapp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    messageWhatsapp: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div
            className={`tab-pane fade ${activeTab === "checkout" ? "show active" : ""
              }`}
            role="tabpanel"
          >
            <div className="row">
              <div className="col-sm-3">
                <div className="nav flex-column nav-pills nav-pills-tab" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <a className="nav-link active show mb-1" id="v-culqi-tab" data-bs-toggle="pill" href="#v-culqi" role="tab" aria-controls="v-culqi" aria-selected="true">
                    Culqi
                  </a>
                  <a className="nav-link mb-1" id="v-digital-wallet-tab" data-bs-toggle="pill" href="#v-digital-wallet" role="tab" aria-controls="v-digital-wallet" aria-selected="false">
                    Yape / Plin
                  </a>
                  <a className="nav-link mb-1" id="v-transfer-tab" data-bs-toggle="pill" href="#v-transfer" role="tab" aria-controls="v-transfer" aria-selected="false">
                    Transferencia
                  </a>
                </div>
              </div>
              <div className="col-sm-9">
                <div className="tab-content pt-0">
                  <div className="tab-pane fade active show" id="v-culqi" role="tabpanel" aria-labelledby="v-culqi-tab">
                    <div className="mb-2">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="checkout-culqi"
                          checked={formData.checkout_culqi == 'true'}
                          onChange={(e) => setFormData({ ...formData, checkout_culqi: String(e.target.checked) })}
                        />
                        <label className="form-check-label form-label" htmlFor="checkout-culqi">
                          Habilitar pago con Culqi
                          <small className="text-muted d-block">Al habilitar esta opción, permite pagos por Culqi </small>
                        </label>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Título del formulario</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.checkout_culqi_name}
                        onChange={(e) => setFormData({
                          ...formData,
                          checkout_culqi_name: e.target.value
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Clave Pública</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.checkout_culqi_public_key}
                        onChange={(e) => setFormData({
                          ...formData,
                          checkout_culqi_public_key: e.target.value
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Clave Privada</label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.checkout_culqi_private_key}
                        onChange={(e) => setFormData({
                          ...formData,
                          checkout_culqi_private_key: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  <div className="tab-pane fade" id="v-digital-wallet" role="tabpanel" aria-labelledby="v-digital-wallet-tab">
                    <div className="mb-2">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="checkout-dwallet"
                          checked={formData.checkout_dwallet == 'true'}
                          onChange={(e) => setFormData({ ...formData, checkout_dwallet: String(e.target.checked) })}
                        />
                        <label className="form-check-label form-label" htmlFor="checkout-dwallet">
                          Habilitar pago con Yape/Plin
                          <small className="text-muted d-block">Al habilitar esta opción, permite pagos por Yape/Plin </small>
                        </label>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">QR</label>
                      {
                        formData.checkout_dwallet_qr
                          ? <div className="position-relative">
                            <Tippy content="Eliminar QR">
                              <button className="position-absolute btn btn-xs btn-danger" style={{
                                top: '5px',
                                left: '5px'
                              }} onClick={() => setFormData({
                                ...formData,
                                checkout_dwallet_qr: null
                              })}>
                                <i className="mdi mdi-delete"></i>
                              </button>
                            </Tippy>
                            <img src={`/assets/resources/${formData.checkout_dwallet_qr}`} className="img-thumbnail" style={{
                              height: '200px',
                              width: 'auto'
                            }} />
                          </div>
                          : <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              e.target.value = null

                              const ext = file.name.split('.').pop()
                              const dwallet_name = `qr-digital-wallet.${ext}`

                              const request = new FormData()
                              request.append('image', file)
                              request.append('name', dwallet_name)

                              const result = await galleryRest.save(request)
                              if (!result) return;

                              setFormData({
                                ...formData,
                                checkout_dwallet_qr: dwallet_name
                              });
                            }}
                          />
                      }
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Título</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.checkout_dwallet_name}
                        onChange={(e) => setFormData({
                          ...formData,
                          checkout_dwallet_name: e.target.value
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        value={formData.checkout_dwallet_description}
                        onChange={(e) => setFormData({
                          ...formData,
                          checkout_dwallet_description: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  <div className="tab-pane fade" id="v-transfer" role="tabpanel" aria-labelledby="v-transfer-tab">
                    <div className="mb-2">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="checkout-transfer"
                          checked={formData.checkout_transfer == 'true'}
                          onChange={(e) => setFormData({ ...formData, checkout_transfer: String(e.target.checked) })}
                        />
                        <label className="form-check-label form-label" htmlFor="checkout-transfer">
                          Habilitar pago por transferencia
                          <small className="text-muted d-block">Al habilitar esta opción, permite pagos por transferencia</small>
                        </label>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Código de Cuenta Interbancario (CCI)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.checkout_transfer_cci}
                        onChange={(e) => setFormData({
                          ...formData,
                          checkout_transfer_cci: e.target.value
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Título</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.checkout_transfer_name}
                        onChange={(e) => setFormData({
                          ...formData,
                          checkout_transfer_name: e.target.value
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        value={formData.checkout_transfer_description}
                        onChange={(e) => setFormData({
                          ...formData,
                          checkout_transfer_description: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`tab-pane fade ${activeTab === "importation" ? "show active" : ""}`}
            role="tabpanel"
          >
            <div className="row mb-2">
              <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
                <div className="mb-3">
                  <label
                    htmlFor="importation_flete"
                    className="form-label"
                  >
                    Precio por peso (flete)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="mdi mdi-circle-multiple"></i>
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="importation_flete"
                      value={formData.importation_flete}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          importation_flete: e.target.value,
                        })
                      }
                      required
                    />
                    <span className="input-group-text">por kg</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="importation_seguro"
                    className="form-label"
                  >
                    Seguro de importación
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="importation_seguro"
                      value={formData.importation_seguro}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          importation_seguro: e.target.value,
                        })
                      }
                      required
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="importation_derecho_arancelario"
                    className="form-label"
                  >
                    Derechos arancelarios
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="importation_derecho_arancelario"
                      value={formData.importation_derecho_arancelario}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          importation_derecho_arancelario: e.target.value,
                        })
                      }
                      required
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="importation_derecho_arancelario_descripcion"
                    className="form-label"
                  >
                    Descripción de derechos arancelarios
                    <small className="text-muted d-block">Que porcentajes se están considerando en cálculo de derechos arancelarios</small>
                  </label>
                  <textarea
                    className="form-control"
                    id="importation_derecho_arancelario_descripcion"
                    value={formData.importation_derecho_arancelario_descripcion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        importation_derecho_arancelario_descripcion: e.target.value,
                      })
                    }
                    rows={3}
                    style={{ minHeight: (3 * 27), fieldSizing: 'content' }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`tab-pane fade ${activeTab === "policies" ? "show active" : ""
              }`}
            role="tabpanel"
          >
            <div className="mb-2">
              <QuillFormGroup
                label="Política de privacidad"
                value={formData.privacyPolicy}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    privacyPolicy: value,
                  })
                }
              />
            </div>
            <div className="mb-2">
              <QuillFormGroup
                label="Términos y condiciones"
                value={formData.termsConditions}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    termsConditions: value,
                  })
                }
              />
            </div>
            <div className="mb-2">
              <QuillFormGroup
                label="Políticas de envío"
                value={formData.deliveryPolicy}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    deliveryPolicy: value,
                  })
                }
              />
            </div>
            <div className="mb-2">
              <QuillFormGroup
                label="Políticas de devolución y cambio"
                value={formData.salebackPolicy}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    salebackPolicy: value,
                  })
                }
              />
            </div>
          </div>

          <div
            className={`tab-pane fade ${activeTab === "location" ? "show active" : ""
              }`}
            role="tabpanel"
          >
            <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "400px",
                }}
                center={formData.location}
                zoom={10}
                onClick={handleMapClick}
              >
                <Marker position={formData.location} />
              </GoogleMap>
            </LoadScript>
            <small className="form-text text-muted">
              Haz clic en el mapa para seleccionar la ubicación.
            </small>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Guardar
        </button>
      </form>
    </div>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title="Datos Generales">
      <Generals {...properties} />
    </BaseAdminto>
  );
});
