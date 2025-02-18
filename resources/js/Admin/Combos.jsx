import BaseAdminto from '@Adminto/Base';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import Swal from 'sweetalert2';

import Modal from '../Components/Adminto/Modal';
import Table from '../Components/Adminto/Table';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import QuillFormGroup from '../Components/Adminto/form/QuillFormGroup';
import SelectAPIFormGroup from '../Components/Adminto/form/SelectAPIFormGroup';
import SelectFormGroup from '../Components/Adminto/form/SelectFormGroup';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import Number2Currency from '../Utils/Number2Currency';
import ReactAppend from '../Utils/ReactAppend';
import SetSelectValue from '../Utils/SetSelectValue';
import ItemsGalleryRest from '../Actions/Admin/ItemsGalleryRest';
import DynamicField from '../Components/Adminto/form/DynamicField';
import CombosRest from '../Actions/Admin/CombosRest';

const combosRest = new CombosRest()

const Combos = ({ items }) => {


  const [selectedProducts, setSelectedProducts] = useState([]);
  const [mainProduct, setMainProduct] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const gridRef = useRef();
  const modalRef = useRef();
  const idRef = useRef();
  const nameRef = useRef();
  const priceRef = useRef();
  const discountRef = useRef();
  const itemsRef = useRef();

  const [isEditing, setIsEditing] = useState(false)

  const calculateTotalPrice = (products) => {
    return products.reduce((sum, product) => {
      const price = parseFloat(product.final_price || 0);
      return sum + price;
    }, 0);
  };

  useEffect(() => {
    const newTotalPrice = calculateTotalPrice(selectedProducts);
    console.log(newTotalPrice)
    setTotalPrice(newTotalPrice);
  }, [selectedProducts]);



  useEffect(() => {
    if (priceRef.current) {
      priceRef.current.value = totalPrice.toFixed(2); // Actualiza el campo con el precio acumulado
    }
  }, [totalPrice]);

  useEffect(() => {
    if (itemsRef.current) {
      const selectedIds = selectedProducts.map((product) => product.id.toString());
      $(itemsRef.current)
        .val(selectedIds)
        .trigger("change");
    }
  }, [selectedProducts]);

  // Manejador para cuando se selecciona un producto
  const handleProductChange = (event) => {
    const selectedData = $(event.target).select2("data"); // Obtiene los datos seleccionados
    const newProducts = selectedData.map((item) => item.data); // Extrae los datos completos del producto

    // Agregar los nuevos productos al estado existente sin duplicados
    setSelectedProducts((prevProducts) => {
      const existingIds = prevProducts.map((p) => p.id); // IDs de los productos ya seleccionados
      const uniqueNewProducts = newProducts.filter((product) => !existingIds.includes(product.id)); // Filtra duplicados
      return [...prevProducts, ...uniqueNewProducts]; // Combina los productos antiguos y nuevos
    });
  };

  const removeProduct = (productId) => {
    const updatedProducts = selectedProducts.filter((p) => p.id !== productId);
    setSelectedProducts(updatedProducts);

    const selectedIds = updatedProducts.map((p) => p.id.toString());
    $(itemsRef.current).val(selectedIds).trigger("change");

    if (mainProduct?.id === productId) {
      setMainProduct(null);
    }
  };


  const handleDiscountChange = (e) => {
    const discountValue = parseFloat(e.target.value || 0);
    if (discountValue > totalPrice) {
      Swal.fire("Error", "El precio con descuento no puede ser mayor al precio acumulado.", "error");
      discountRef.current.value = "";
    }
  };


  const onModalOpen = async (data) => {
    if (data?.id) {
      setIsEditing(true);

      // Obtener los datos del combo con sus relaciones
      const comboData = await combosRest.get(data.id, ['items']);
      if (!comboData) return;

      // Cargar los datos en el formulario
      idRef.current.value = comboData.id || '';
      nameRef.current.value = comboData.name || '';
      priceRef.current.value = comboData.price || 0;
      discountRef.current.value = comboData.discount || 0;

      // Cargar los productos asociados
      const products = comboData.items || [];
      setSelectedProducts(products);

      // Seleccionar los productos en el campo SelectAPIFormGroup
      setTimeout(() => {
        const productIds = products.map((product) => product.id.toString());
        itemsRef.current.setValue(productIds); // Asegúrate de que `setValue` sea un método válido en `SelectAPIFormGroup`
      }, 0);

      // Establecer el producto principal si existe
      const mainItemId = comboData.items.find((item) => item.pivot.is_main_item)?.id;
      if (mainItemId) {
        setMainProduct(products.find((product) => product.id === mainItemId));
      }
    } else {
      setIsEditing(false);
      idRef.current.value = '';
      nameRef.current.value = '';
      priceRef.current.value = 0;
      discountRef.current.value = 0;
    }

    // Mostrar el modal
    $(modalRef.current).modal('show');
  };

  const onModalSubmit = async (e) => {
    e.preventDefault()
    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      price: totalPrice,
      discount: discountRef.current.value,
      final_price: discountRef.current.value > 0 && discountRef.current.value < totalPrice ? discountRef.current.value : totalPrice,
      discount_percent: 100 - (discountRef.current.value / priceRef.current.value) * 100,
      items: selectedProducts.map((product) => ({
        item_id: product.id,
        is_main_item: mainProduct?.id === product.id,
      })),

    }
    const result = await combosRest.save(request)
    if (!result) return;
    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
    setSelectedProducts([]);
    setMainProduct(null);
    setTotalPrice(0);
  }


  const onVisibleChange = async ({ id, value }) => {
    const result = await combosRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onBooleanChange = async ({ id, field, value }) => {
    const result = await combosRest.boolean({ id, field, value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar curso',
      text: '¿Estás seguro de eliminar este curso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await combosRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }


  return (<>
    <Table gridRef={gridRef} title='Combos' rest={combosRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
          }
        });
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'plus',
            text: 'Nuevo combo',
            hint: 'Nuevo combo',
            onClick: () => onModalOpen()
          }
        });
      }}
      exportable={true}
      exportableName='Combos'
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
          dataField: 'name',
          caption: 'Nombre',
          //  width: '300px',
          cellTemplate: (container, { data }) => {
            container.html(renderToString(<>
              <b>{data.name}</b><br />
              <span className='truncate'>{data.summary}</span>
            </>))
          }
        },
        {
          dataField: 'final_price',
          caption: 'Precio',
          dataType: 'number',
          width: '75px',
          cellTemplate: (container, { data }) => {

            container.html(renderToString(<>
              {data.discount > 0 && <small className='d-block text-muted' style={{ textDecoration: 'line-through' }}>S/.{Number2Currency(data.price)}</small>}
              <span>S/.{Number2Currency(data.discount > 0 ? data.discount : data.price)}</span>
            </>))
          }
        },
        {
          dataField: 'visible',
          caption: 'Visible',
          dataType: 'boolean',
          width: '80px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <SwitchFormGroup checked={data.visible} onChange={(e) => onVisibleChange({ id: data.id, value: e.target.checked })} />)
          }
        },
        {
          caption: 'Acciones',
          width: '100px',
          cellTemplate: (container, { data }) => {
            container.css('text-overflow', 'unset')
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-primary',
              title: 'Editar',
              icon: 'fa fa-pen',
              onClick: () => onModalOpen(data)
            }))
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-danger',
              title: 'Eliminar',
              icon: 'fa fa-trash',
              onClick: () => onDeleteClicked(data.id)
            }))
          },
          allowFiltering: false,
          allowExporting: false
        }
      ]} />
    <Modal modalRef={modalRef} title={isEditing ? 'Editar curso' : 'Agregar curso'} onSubmit={onModalSubmit} size='lg'>
      <div className='row' id='combo-container'>
        <input ref={idRef} type='hidden' />
        <div className="col-md-6">
          <InputFormGroup eRef={nameRef} label='Nombre' required />
          <SelectAPIFormGroup
            id="items"
            eRef={itemsRef}
            searchAPI="/api/admin/items/paginate"
            searchBy="name"
            label="Productos"
            dropdownParent="#combo-container"
            multiple
            onChange={handleProductChange}
          />

        </div>
        <div className="col-md-6">
          <InputFormGroup label="Precio" eRef={priceRef} type="number" readOnly />
          <InputFormGroup eRef={discountRef} label='Descuento' type='number' step='0.01' onChange={handleDiscountChange} />
        </div >
        {/* Lista de productos seleccionados */}
        <div className="col-md-12 row">
          <h4 className="col-md-12">Productos Seleccionados</h4>
          <ul className="list-unstyled col-md-12 row">
            {selectedProducts.map((product) => (
              <li key={product.id} className="col-md-6" >
                <input
                  type="radio"
                  name="mainProduct"
                  checked={mainProduct?.id === product.id}
                  onChange={() => setMainProduct(product)}
                />
                <div>

                  <div class="card mb-3">
                    <div class="row g-0">
                      <div class="col-md-4">
                        <img src={`/api/items/media/${product?.image ?? 'undefined'}`} class="img-thumbnail rounded-start" alt={product.name} />
                      </div>
                      <div class="col-md-8">
                        <div class="card-body">
                          <h5 class="card-title">{product?.name} </h5>
                          <p class="card-text small line-clamp-2">{product?.summary} </p>
                          <p class="card-text"><strong>Precio: S/.{product?.final_price}</strong></p>

                          <button className='btn btn-sm btn-danger pull-left' type='button' onClick={() => removeProduct(product.id)}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>



              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Combos'>
    <Combos {...properties} />
  </BaseAdminto>);
})