import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('after clicking the show button, url and likes are displayed', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'test title')
    await user.type(authorInput, 'test author')
    await user.type(urlInput, 'http://testurl')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('test title')
    expect(createBlog.mock.calls[0][0].author).toBe('test author')
    expect(createBlog.mock.calls[0][0].url).toBe('http://testurl')
  })
})