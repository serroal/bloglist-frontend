import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Test title',
  author: 'Test author',
  url: 'http://www.testurl.com',
  likes: 0,
}

describe('<Blog />', () => {
  test('at start renders content visible and hidden', () => {
    const { container } = render(<Blog blog={blog} />)

    const titleSpan = container.querySelector('.blogTitle')
    expect(titleSpan).toBeVisible()

    const authorSpan = container.querySelector('.blogAuthor')
    expect(authorSpan).toBeVisible()

    const urlElement = screen.getByText('http://www.testurl.com')
    expect(urlElement).not.toBeVisible()

    const likesElement = screen.getByText(
      'likes', { exact: false }
    )
    expect(likesElement).not.toBeVisible()
  })

  test('after clicking the show button, url and likes are displayed', async () => {
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const urlElement = screen.getByText('http://www.testurl.com')
    expect(urlElement).toBeVisible()

    const likesElement = screen.getByText(
      'likes', { exact: false }
    )
    expect(likesElement).toBeVisible()
  })

  test('when clicking the like button twice, event handler is called twice', async () => {
    const user = userEvent.setup()
    const updateBlog = vi.fn()

    render(<Blog blog={blog} updateBlog={updateBlog} />)

    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})