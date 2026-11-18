import { useNavigate } from 'react-router-dom'
import { Link, Button, Box, Stack, Typography } from '@mui/material'

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
    <Box component="section" sx={{ p: 3, mt: 3, border: '1px solid silver', boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.2)', borderRadius: 1, }}>
      <Typography variant='h4' component='h3' gutterBottom>{blog.title}</Typography>
      <Typography variant='h6' color='textSecondary' gutterBottom>by {blog.author}</Typography>
      <Typography variant='body1' gutterBottom><Link href={blog.url} target='_blank'>{blog.url}</Link></Typography>
      <Typography variant='body2' color='textSecondary' gutterBottom>{blog.user ? `Added by ${blog.user.name}` : ''}</Typography>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
        <Typography variant='body1'><span data-testid="likes">{blog.likes}</span> likes</Typography>
        {user && <Button onClick={handleLike} variant="outlined">like</Button>}
        {blog.user && user && user.username === blog.user.username &&
        <Button onClick={handleDelete} variant="outlined" color="error">remove</Button>}
      </Stack>
    </Box>
  )
}

export default Blog