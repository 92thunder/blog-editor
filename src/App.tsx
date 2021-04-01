import { Box, CircularProgress, Container, createMuiTheme, ThemeProvider } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import React, { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Posts } from './components/Posts'
import { Title } from './components/Title'
import firebase from 'firebase/app'
import { SignIn } from './components/SignIn'
import 'firebase/auth'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import { EditPost } from './components/EditPost'

export const App: React.VFC = () => {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: grey[800]
      }
    }
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<firebase.User | null>(null)

  useEffect(() =>  {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <Box 
      display="flex" 
      width="100vw" height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress/>
    </Box>
  )

  return ( 
    <div className="App">
      { user ? (
        <ThemeProvider theme={theme}>
          <Router>
            <Switch >
              <Route path='/posts/:postId'>
                <EditPost/>
              </Route>
              <Route path="/">
                <Header/>
                <Container>
                  <Title/>
                  <Posts/>
                </Container>
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      )
        : (<SignIn/>)
      }
    </div>
  )
}
