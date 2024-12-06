import React, { useEffect, useRef } from "react"
import { Cookies, JSON } from "sode-extend-react"

const SelectAPIFormGroup = ({ col, label, eRef, required = false, dropdownParent, searchAPI, searchBy, multiple = false, filter = null, onChange = () => { },
  templateResult,
  templateSelection
}) => {
  if (!eRef) eRef = useRef()

  useEffect(() => {
    $(eRef.current).select2({
      dropdownParent,
      minimumInputLength: 0,
      ajax: {
        url: searchAPI,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
        },
        type: "POST",
        quietMillis: 50,
        data: function ({ term, page }) {
          return JSON.stringify({
            sort: [
              {
                selector: searchBy,
                desc: false
              }
            ],
            skip: ((page ?? 1) - 1) * 10,
            take: 10,
            filter: filter ? [
              [
                searchBy,
                "contains",
                term || ''
              ], 'and', filter
            ] : [
              searchBy,
              "contains",
              term || ''
            ]
          })
        },
        processResults: function (data, { page }) {
          return {
            results: (data?.data ?? []).map((x) => {
              const flatten = JSON.flatten(x)
              return {
                id: x.id,
                text: flatten[searchBy],
                data: x
              }
            }),
            pagination: {
              more: ((page ?? 1) * 10) < data.totalCount,
            },
          };
        },
      },
      templateResult,
      templateSelection
    })
  }, [dropdownParent, filter])
  
  useEffect(() => {
    $(eRef.current).on('change', onChange)
  }, [filter])

  return <div className={`form-group ${col} mb-2`}>
    <label htmlFor=''>
      {label} {required && <b className="text-danger">*</b>}
    </label>
    <select ref={eRef} required={required} className='form-control' style={{ width: '100%' }} multiple={multiple}></select>
  </div>
}

export default SelectAPIFormGroup