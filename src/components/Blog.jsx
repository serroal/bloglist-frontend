import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {

  const navigate = useNavigate()

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

  const handleDelete = () => {
    deleteBlog(blog)
    navigate('/')
  }

  if(!blog) {
    return null
  }

  return (
    <div data-testid='blog-item'>
      <h3>{blog.author}: {blog.title}</h3>
      <div><a href={blog.url} target='_blank'>{blog.url}</a></div>
      <div>likes {blog.likes} {user && <button onClick={handleLike}>like</button>}</div>
      <div>{blog.user ? `Added by ${blog.user.name}` : ''}</div>
      {blog.user && user && user.username === blog.user.username && <div><button onClick={handleDelete}>remove</button></div>}
    </div>
  )
}

export default Blog