import{j as e}from"./AboutSimple-Cf8x2fCZ.js";import{r as c}from"./index-BH53Isel.js";import{c as r}from"./createLucideIcon-Cy5Ya80P.js";import"./index-yBjzXJbu.js";/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=r("SquareMinus",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}]]);/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=r("SquarePlus",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]),p=({faqs:i})=>{const[a,l]=c.useState(new Set([4])),n=s=>{const t=new Set(a);t.has(s)?t.delete(s):t.add(s),l(t)};return e.jsx("section",{className:"bg-[#F7F9FB] pb-12 px-primary",children:e.jsxs("div",{className:"mx-auto    2xl:max-w-7xl gap-12 bg-white rounded-xl p-4 md:p-8",children:[e.jsx("h1",{className:"text-[40px] font-bold text-center mb-4 cusomtext-neutral-dark",children:"Preguntas frecuentes"}),e.jsx("p",{className:"text-center  cusomtext-neutral-light mb-12 max-w-3xl mx-auto",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu fermentum justo, ac fermentum nulla. Sed sed scelerisque urna, vitae ultricies libero. Pellentesque vehicula et urna in venenatis."}),e.jsx("div",{className:"flex flex-wrap justify-between",children:i.map(s=>e.jsx("div",{className:"  p-2 cursor-pointer w-full md:w-1/2",onClick:()=>n(s.id),children:e.jsxs("div",{className:"p-4 rounded-lg shadow-sm bg-[#F7F9FB]",children:[e.jsxs("div",{className:"flex justify-between items-start p-4",children:[e.jsx("h3",{className:"text-xl font-semibold pr-8",children:s.question}),e.jsx("button",{className:"customtext-primary flex-shrink-0",children:a.has(s.id)?e.jsx(m,{className:"w-6 h-6"}):e.jsx(d,{className:"w-6 h-6"})})]}),a.has(s.id)&&s.answer&&e.jsx("p",{className:"mt-4 p-4 customtext-neutral-light text-lg",children:s.answer})]})},s.id))})]})})};export{p as default};
