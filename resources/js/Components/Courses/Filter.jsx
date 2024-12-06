import React from "react"
import em from "../../Utils/em"

const Filter = ({ filter, setFilter, details }) => {
  return <section className="p-[5%] mt-16">
    <div class="flex flex-col justify-center w-full">
      <div
        $name="Todos nuestros Cursos & Talleres"
        class="text-2xl md:text-4xl not-italic text-slate-700 max-md:text-4xl max-md:leading-[52px] font-bold"
      >
        {em(details['courses.title'])}
      </div>
      <div
        $name="Fusce a magna nec diam blandit hendrerit. In lobortis, est eget ultrices pharetra, est tortor pellentesque odio, ut auctor tortor ipsum ac orci."
        class="mt-6 text-base not-italic leading-6 text-[color:var(--Woodsmoke-900,#2B384F)]"
      >
        {em(details['courses.description'])}
      </div>
    </div>
    <div class="flex flex-wrap gap-10 justify-between items-center mt-[5%] w-full text-base font-medium">
      <label htmlFor="txt-search" class="flex gap-2 items-center self-stretch px-6 py-4 my-auto rounded-3xl bg-slate-100 min-w-[240px] text-slate-900 w-[431px] max-md:px-5 max-md:max-w-full">
        <i className="mdi mdi-magnify"></i>
        <input
          id="txt-search"
          placeholder="Buscar curso"
          class="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none"
          onChange={(e) => setFilter(old => ({
            ...old,
            search: e.target.value
          }))}
        />
      </label>
      <button className="col-span-1 md:col-span-1 lg:col-span-2 px-6 py-4 text-base uppercase rounded-3xl bg-slate-100 text-slate-900 flex items-center justify-center transition-all" onClick={() => setFilter(old => ({
        ...old,
        sortOrder: old.sortOrder == 'desc' ? 'asc' : 'desc'
      }))}>
        Ordenar por precio
        <i className={`ml-2 mdi ${filter.sortOrder == 'asc' ? 'mdi-arrow-down' : 'mdi-arrow-up'}`}></i>
      </button>
    </div>
  </section>
}

export default Filter