import React from "react"

const TextareaFormGroup = ({ col, label, eRef, placeholder, required = false, rows = 3, value, onChange }) => {
  return <div className={`form-group ${col} mb-2`}>
    <label htmlFor=''>
      {label} {required && <b className="text-danger">*</b>}
    </label>
    <textarea ref={eRef} className='form-control' placeholder={placeholder} required={required} rows={rows} defaultValue={value} style={{ minHeight: (rows * 27),fieldSizing: 'content' }} onChange={onChange} />
  </div>
}

export default TextareaFormGroup