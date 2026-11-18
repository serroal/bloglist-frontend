import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import Blog from './Blog'

const blog = {
  title: 'Test title',
  author: 'Test author',
  url: 'http://www.testurl.com',
  likes: 0,
  user: {
    username: 'usercreator'
  }
}

describe('<Blog />', () => {
  test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', () => {
    render(<Router><Blog blog={blog} user={null} /></Router>)

    const titleElement = screen.getByText(blog.title)
    expect(titleElement).toBeDefined()

    const authorElement = screen.getByText(`by ${blog.author}`)
    expect(authorElement).toBeDefined()

    const urlElement = screen.getByText(blog.url)
    expect(urlElement).toBeDefined()

    const likesElement = screen.getByText(
      'likes', { exact: false }
    )
    expect(likesElement).toBeDefined()

    const likeButton = screen.queryByText('like')
    expect(likeButton).toBeNull()

    const removeButton = screen.queryByText('remove')
    expect(removeButton).toBeNull()
  })

  test('Authenticated users who are not the blog\'s creator are shown only the like button', () => {
    render(<Router><Blog blog={blog} user={{ username: 'testuser' }} /></Router>)

    const titleElement = screen.getByText(blog.title)
    expect(titleElement).toBeDefined()

    const authorElement = screen.getByText(`by ${blog.author}`)
    expect(authorElement).toBeDefined()

    const urlElement = screen.getByText(blog.url)
    expect(urlElement).toBeDefined()

    const likesElement = screen.getByText(
      'likes', { exact: false }
    )
    expect(likesElement).toBeDefined()

    const likeButton = screen.getByText('like')
    expect(likeButton).toBeDefined()

    const removeButton = screen.queryByText('remove')
    expect(removeButton).toBeNull()
  })

  test('The blog\'s creator is also shown the delete button', () => {
    render(<Router><Blog blog={blog} user={{ username: 'usercreator' }} /></Router>)

    const titleElement = screen.getByText(blog.title)
    expect(titleElement).toBeDefined()

    const authorElement = screen.getByText(`by ${blog.author}`)
    expect(authorElement).toBeDefined()

    const urlElement = screen.getByText(blog.url)
    expect(urlElement).toBeDefined()

    const likesElement = screen.getByText(
      'likes', { exact: false }
    )
    expect(likesElement).toBeDefined()

    const likeButton = screen.getByText('like')
    expect(likeButton).toBeDefined()

    const removeButton = screen.getByText('remove')
    expect(removeButton).toBeDefined()
  })

  test('when clicking the like button twice, event handler is called twice', async () => {
    const user = userEvent.setup()
    const updateBlog = vi.fn()

    render(<Router><Blog blog={blog} updateBlog={updateBlog} user={{ username: 'testuser' }} /></Router>)

    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})