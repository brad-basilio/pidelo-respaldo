import BaseAdminto from '@Adminto/Base';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import SubCategoriesRest from '../Actions/Admin/SubCategoriesRest';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import SelectAPIFormGroup from '../Components/Adminto/form/SelectAPIFormGroup';
import Modal from '../Components/Adminto/Modal';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import InputFormGroup from '../Components/form/InputFormGroup';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import SetSelectValue from '../Utils/SetSelectValue';

const subCategoriesRest = new SubCategoriesRest()

const SubCategories = () => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const categoryRef = useRef()
  const nameRef = useRef()
  const descriptionRef = useRef()
  const imageRef = useRef()

  const [isEditing, setIsEditing] = useState(false)

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    SetSelectValue(categoryRef.current, data?.category?.id, data?.category?.name)
    nameRef.current.value = data?.name ?? ''
    descriptionRef.current.value = data?.description ?? ''
    imageRef.image.src = `/api/subcategories/media/${data?.image}`
    imageRef.current.value = null

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      category_id: categoryRef.current.value,
      name: nameRef.current.value,
      description: descriptionRef.current.value,
    }

    const formData = new FormData()
    for (const key in request) {
      formData.append(key, request[key])
    }
    const file = imageRef.current.files[0]
    if (file) {
      formData.append('image', file)
    }

    const result = await subCategoriesRest.save(formData)
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onFeaturedChange = async ({ id, value }) => {
    const result = await subCategoriesRest.boolean({ id, field: 'featured', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await subCategoriesRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar registro',
      text: '¿Estas seguro de eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await subCategoriesRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title='Sub Categorías' rest={subCategoriesRest}
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
            text: 'Nuevo registro',
            hint: 'Nuevo registro',
            onClick: () => onModalOpen()
          }
        });
      }}
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
          dataField: 'category.name',
          caption: 'Categoría',
        },
        {
          dataField: 'name',
          caption: 'Sub Categoría',
        },
        {
          dataField: 'description',
          caption: 'Descripción',
          width: '50%',
        },
        {
          dataField: 'image',
          caption: 'Imagen',
          width: '90px',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <img src={`/api/subcategories/media/${data.image}`} style={{ width: '80px', height: '48px', objectFit: 'cover', objectPosition: 'center', borderRadius: '4px' }} onError={e => e.target.src = '/api/cover/thumbnail/null'} />)
          }
        },
        {
          dataField: 'featured',
          caption: 'Destacado',
          dataType: 'boolean',
          cellTemplate: (container, { data }) => {
            $(container).empty()
            ReactAppend(container, <SwitchFormGroup checked={data.featured == 1} onChange={() => onFeaturedChange({
              id: data.id,
              value: !data.featured
            })} />)
          }
        },
        {
          dataField: 'visible',
          caption: 'Visible',
          dataType: 'boolean',
          cellTemplate: (container, { data }) => {
            $(container).empty()
            ReactAppend(container, <SwitchFormGroup checked={data.visible == 1} onChange={() => onVisibleChange({
              id: data.id,
              value: !data.visible
            })} />)
          }
        },
        {
          caption: 'Acciones',
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
    <Modal modalRef={modalRef} title={isEditing ? 'Editar sub categoría' : 'Agregar sub categoría'} onSubmit={onModalSubmit} size='sm'>
      <input ref={idRef} type='hidden' />
      <ImageFormGroup eRef={imageRef} label='Imagen' col='col-12' aspect={16 / 9} />
      <div className='row' id='modal-container'>
        <SelectAPIFormGroup eRef={categoryRef} label='Categoría' searchAPI='/api/admin/categories/paginate' searchBy='name' required dropdownParent='#modal-container' />
        <InputFormGroup eRef={nameRef} label='Sub Categoría' col='col-12' required />
        <TextareaFormGroup eRef={descriptionRef} label='Descripción' rows={3} />
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Sub Categorías'>
    <SubCategories {...properties} />
  </BaseAdminto>);
})