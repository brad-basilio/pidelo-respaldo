import React, { useEffect, useRef, useState } from "react";
import InputFormGroup from '../../Adminto/form/InputFormGroup';
import TextareaFormGroup from '../../Adminto/form/TextareaFormGroup';
import Modal from '../../Adminto/Modal';
import SelectFormGroup from "../../Adminto/form/SelectFormGroup";
import SystemRest from "../../../Actions/Admin/SystemRest";
import EditorFormGroup from "../../Adminto/form/EditorFormGroup";

const systemRest = new SystemRest()

const DataModal = ({ dataLoaded, setDataLoaded, setSystems, modalRef }) => {
  const [data, setData] = useState(dataLoaded?.data || {})
  const [methodValues, setMethodValues] = useState([])

  const usingRef = {}
  usingRef.model = useRef(null)
  usingRef.filters = useRef(null)
  usingRef.filtersMethod = useRef(null)

  const onDataSubmit = async (e) => {
    e.preventDefault()
    const result = await systemRest.save({
      id: dataLoaded.id,
      data,
      filters: $(usingRef.filters.current).val(),
      filters_method: dataLoaded?.component?.using?.['filters:method'],
      filters_method_values: $(usingRef.filtersMethod.current).val()
    })
    if (!result) return
    setDataLoaded(null)
    $(modalRef.current).modal('hide')
    setSystems(old => old.map(system => system.id == dataLoaded.id ? result.data : system))
  }

  useEffect(() => {
    const newData = {}
    dataLoaded?.component?.data.forEach(key => {
      newData[key] = dataLoaded?.data?.[key] ?? ''
    })
    setData(newData)
    usingRef.model.current.value = dataLoaded?.component?.using?.model ?? ''
    $(usingRef.filters.current).val(dataLoaded?.filters ?? []).trigger('change')
    $(usingRef.filtersMethod.current).val(dataLoaded?.filtersMethod ?? []).trigger('change')

    const model = dataLoaded?.component?.using?.model
    const method = dataLoaded?.component?.using?.['filters:method']
    if (!model || !method) return
    systemRest.simpleGet(`/api/admin/system/related/${model}/${method}`).then(result => {
      setMethodValues(result)
    })
  }, [dataLoaded])

  const onBoolChange = (key, value) => {
    setData({ ...data, [key]: value })
  }

  console.log(data)

  return (
    <Modal modalRef={modalRef} title={dataLoaded?.name} onSubmit={onDataSubmit} size={dataLoaded?.component?.data?.some(x => x.startsWith('code:')) ? 'lg' : 'md'}>
      <ul className="nav nav-tabs nav-bordered">
        <li className="nav-item" hidden={!dataLoaded?.component?.data?.length}>
          <a href="#tab-info" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
            Información
          </a>
        </li>
        <li className="nav-item" hidden={!dataLoaded?.component?.using?.filters && !dataLoaded?.component?.using?.['filters:method']}>
          <a href="#tab-db" data-bs-toggle="tab" aria-expanded="true" className="nav-link">
            Base de datos
          </a>
        </li>
      </ul>
      <div className="tab-content" id="data-modal-container">
        <div className="tab-pane active" id="tab-info" hidden={!dataLoaded?.component?.data?.length}>
          {
            dataLoaded?.component?.data?.map((element, index) => (
              element.startsWith('code:')
                ? <EditorFormGroup key={index} label={element.replace('code:', '')} value={data[element] ?? ''} rows={1} onChange={e => setData({ ...data, [element]: e.target.value })} />
                : <>
                  {
                    element.startsWith('bool:')
                      ? <div className="form-group">
                        <label className="form-label">{element.replace('bool:', '')}</label>
                        <div>
                          <div className="form-check form-check-inline">
                            <input
                              type="radio"
                              className="form-check-input"
                              id={`${element}-true`}
                              name={element}
                              value="true"
                              checked={data[element] === true}
                              onChange={e => onBoolChange(element, e.target.value === 'true')}
                            />
                            <label className="form-check-label" htmlFor={`${element}-true`}>Sí</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              type="radio"
                              className="form-check-input"
                              id={`${element}-false`}
                              name={element}
                              value="false"
                              checked={data[element] === false}
                              onChange={e => onBoolChange(element, e.target.value === 'true')}
                            />
                            <label className="form-check-label" htmlFor={`${element}-false`}>No</label>
                          </div>
                        </div>
                      </div>
                      : <TextareaFormGroup key={index} label={element} value={data[element] ?? ''} rows={1} onChange={e => setData({ ...data, [element]: e.target.value })} />
                  }
                </>

            ))
          }
        </div>
        <div className="tab-pane show" id="tab-db">
          <InputFormGroup eRef={usingRef.model} label='Modelo' disabled />
          <SelectFormGroup eRef={usingRef.filters} label='Filtros' multiple dropdownParent='#tab-db' hidden={!dataLoaded?.component?.using?.filters}>
            {
              dataLoaded?.component?.using?.filters?.map((filter, index) => (
                <option key={index} value={filter}>{filter}</option>
              ))
            }
          </SelectFormGroup>
          <div hidden={!dataLoaded?.component?.using?.['filters:method']}>
            <SelectFormGroup eRef={usingRef.filtersMethod} label={dataLoaded?.component?.using?.['filters:method']?.toTitleCase()} multiple dropdownParent='#tab-db' changeWith={[methodValues]}>
              {
                methodValues?.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))
              }
            </SelectFormGroup>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DataModal;
