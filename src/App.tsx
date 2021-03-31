import { Container, createMuiTheme, ThemeProvider } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import React, { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Posts } from './components/Posts'
import { Title } from './components/Title'
import firebase from 'firebase/app'
import { SignIn } from './components/SignIn'
import 'firebase/auth'

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

  if (loading) return (<div>loading</div>)

  return ( 
    <div className="App">
      { user ? (
        <ThemeProvider theme={theme}>
          <Header/>
          <Container>
            <Title/>
            <Posts/>
          </Container>
        </ThemeProvider>
      )
        : (<SignIn/>)
      }
    </div>
  )
}
