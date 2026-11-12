import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  const handleLike = () => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : undefined
    }
    updateBlog(blog.id, newBlog)
  }

  const handleDelete = () => deleteBlog(blog)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        <span className='blogTitle'>{blog.title}</span> <span className='blogAuthor'>{blog.author}</span> {' '}
        <button onClick={() => setBlogVisible(!blogVisible)}>{blogVisible ? 'hide' : 'show'}</button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.user ? blog.user.name : ''}</div>
        {blog.user && user.username === blog.user.username && <div><button onClick={handleDelete}>remove</button></div>}
      </div>
    </div>
  )
}

export default Blog