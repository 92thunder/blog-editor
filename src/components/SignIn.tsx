import React from 'react'
import firebase from 'firebase/app'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { Grid, Typography } from '@material-ui/core'
import styled from 'styled-components'

export const SignIn: React.VFC = () => {
  const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  }
  return (
    <Container>
      <Grid container direction="column" alignItems="center" spacing={8} >
        <Grid item>
          <Typography variant="h3">Blog Editor</Typography>
        </Grid>
        <Grid item>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </Grid>
      </Grid>
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`