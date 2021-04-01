import { Card, CardContent, Typography, Grid } from '@material-ui/core'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { useHistory } from 'react-router-dom'
import { useAsync } from 'react-use'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'
import { createPostRepository } from '../repositories/PostRepository'
import { Post } from '../types'

const PostCard: React.VFC<{ post: Post }> = ({ post }) => {
  const history = useHistory()
  const onClick = () => {
    history.push(`/posts/${post.id}`)
  }

  return (
    <StyledCard onClick={onClick} >
      <CardContent>
        <Typography variant="h5">
          {post.title}
        </Typography>
        <StyledMarkdown plugins={[remarkGfm]}>
          {post.body.replaceAll('  ', '\n')}
        </StyledMarkdown>
      </CardContent>
    </StyledCard> 
  )
}

export const Posts: React.VFC = () => {
  const state = useAsync(async () => {
    const postRepository = createPostRepository()
    return await postRepository.findAll()
  }, [])

  return state.value ?
    <PostsWrapper>
      <Grid container direction="column" spacing={6} >
        {state.value.map((post) => (
          <Grid item key={post.id}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </PostsWrapper>
    : null
}

const StyledCard = styled(Card)`
  :first-child {
    margin-top: 20px;
  }
`

const StyledMarkdown = styled(ReactMarkdown)`
  white-space: pre-wrap;
`

const PostsWrapper = styled.div`
  margin-top: 20px;
`