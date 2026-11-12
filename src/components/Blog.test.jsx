import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content visible and hidden', () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'http://www.testurl.com',
    likes: 0,
  }

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