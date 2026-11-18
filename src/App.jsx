import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'
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

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/">blogs</Button>
          {user && <Button color="inherit" component={Link} to="/create">new blog</Button>}
          {user ?
            <Button color="inherit" onClick={handleLogout}>logout</Button>
            :
            <Button color="inherit" component={Link} to="/login">login</Button>}
        </Toolbar>
      </AppBar>
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
    </Container>
  )
}

export default App