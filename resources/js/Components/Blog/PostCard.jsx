import React from "react"
import HtmlContent from "../../Utils/HtmlContent"

const PostCard = ({id, name, summary, category, image, post_date, firstImage = false }) => {
  return <div className="flex flex-col self-stretch my-auto w-full mt-6">
    <div className={`flex flex-col gap-4 ${firstImage && 'flex-col-reverse'}`}>
      <div className="flex flex-col w-full">
        <h3 className="text-lg font-semibold  text-[#2B384F] line-clamp-2  h-14">
          <HtmlContent html={(name || 'Sin titulo').replace(/\*(.*?)\*/g, '<span class="font-bold text-pink-500">$1</span>')} />
        </h3>
        <p className="mt-3 sm:mt-4 md:mt-5 text-sm text-[#2E405E] line-clamp-3  h-[64px]">
          {summary || 'Sin descripción'}
        </p>
      </div>
      <div className="flex flex-col w-full">
        <img src={`/api/posts/media/${image}`} alt={name} className="w-full object-cover h-40 sm:h-44 md:h-48 rounded-md" />
      </div>
    </div>
    <div className="grid grid-cols-2 justify-between items-center mt-4 sm:mt-5 md:mt-6 w-full gap-4">
      <a href={`/blog/${id}`} className="flex gap-2 items-center text-sm sm:text-base font-semibold text-[#2B384F] text-ellipsis overflow-hidden">
        <span>{category?.name || 'Sin categoría'}</span>
        <i className="mdi mdi-arrow-top-right"></i>
      </a>
      <span className="text-xs sm:text-sm text-end font-medium text-[#FF27B9]">
        {moment(post_date).format('ll')}
      </span>
    </div>
  </div>
}

export default PostCard