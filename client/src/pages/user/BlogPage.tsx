import BlogItem from '@/components/user/BlogItem'

const BlogPage = () => {
  return (
    <div className='flex flex-col lg:gap-8 items-center text-[1.3vh] lg:text-[1.3vw]'>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 flex-1 justify-items-center w-full p-6">
            <BlogItem/>
            <BlogItem/>
            <BlogItem/>
            <BlogItem/>
        </div>
        <button className='btn'>Xem thêm...</button>
    </div>
  )
}

export default BlogPage