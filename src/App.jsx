import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const compareLikes = (a, b) => b.likes - a.likes

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort(compareLikes)
      setBlogs( sortedBlogs )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setErrorMessage({
        text: 'wrong username or password',
        type: 'error'
      })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.clear()
    navigate('/')
  }

  const addBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      setErrorMessage({
        text: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: 'success'
      })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setBlogs([...blogs, createdBlog])
    } catch (error) {
      setErrorMessage({
        text: error.response.data.error,
        type: 'error'
      })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (id, blog) => {
    try {
      const updatedBlog = await blogService.update(id, blog)
      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog).sort(compareLikes))
    } catch (error) {
      setErrorMessage({
        text: error.response.data.error,
        type: 'error'
      })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (error) {
        setErrorMessage({
          text: error.response.data.error,
          type: 'error'
        })
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const padding = {
    padding: 5
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {user && <Link style={padding} to="/create">new blog</Link>}
        {user ?
          <button type='button' onClick={handleLogout}>logout</button>
          :
          <Link style={padding} to="/login">login</Link>}
      </div>
      <Notification message={errorMessage} />
      <Routes>
        <Route path="/login" element={
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
        } />
        <Route path="/create" element={
          <BlogForm createBlog={addBlog} />
        } />
        <Route path="/blogs/:id" element={
          <Blog blog={blog} deleteBlog={deleteBlog} updateBlog={updateBlog} user={user} />
        } />
        <Route path="/" element={
          <BlogList blogs={blogs} />
        } />
      </Routes>
    </div>
  )
}

export default App