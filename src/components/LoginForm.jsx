import { TextField, Button } from '@mui/material'

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            value={username}
            onChange={handleUsernameChange}
            variant="standard"
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <TextField
            label="password"
            value={password}
            onChange={handlePasswordChange}
            type='password'
            variant="standard"
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>login</Button>
      </form>
    </div>
  )
}

export default LoginForm