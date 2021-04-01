import React, { ChangeEvent, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useHistory, useParams } from 'react-router-dom'
import { useAsync } from 'react-use'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'
import { createPostRepository } from '../repositories/PostRepository'
import { createPost } from '../domain/reducers/createPost'
import { Grid, IconButton, TextField } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { Delete } from '@material-ui/icons'

export const EditPost: React.VFC = () => {
  const { postId } =  useParams<{postId: string}>()

  const postRepository = createPostRepository()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [date, setDate] = useState<Date | null>(new Date())
  const state = useAsync(async () => {
    const post = await postRepository.find(postId)
    if (!post) {
      const post = createPost()
      setTitle(post.title)
      setBody(post.body)
      setDate(post.date)
      history.push(`/posts/${post.id}`)
      return post
    } else {
      setTitle(post.title)
      setBody(post.body)
      setDate(post.date)
      return post
    }
  }, [])

  const onChangeTitle = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(event.target.value)
  }
  const onChangeBody = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value)
  }
  useEffect(() => {
    if (state.value && (state.value.body !== body || state.value.title !== title || state.value.date !== date)) {
      postRepository.save({
        ...state.value,
        id: state.value.id,
        title: title,
        body: body,
        date: date || state.value.date
      })
    }
  }, [body, title, date])

  const handleDateChange = (date: Date | null) => {
    setDate(date)
  }

  const history = useHistory()
  const handleDelete = () => {
    if (state.value) {
      const result = window.confirm('delete?')
      if (result) {
        postRepository.delete(state.value)
        history.push('/')
      }
    }
  }
  console.log(date)
  return (
    state.value ? (
      <Container>
        <Grid container direction="column">
          <Grid container item alignItems="center">
            <Grid item xs={9}>
              <TextField value={title} onChange={onChangeTitle} fullWidth />
            </Grid >
            <Grid item xs={2}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="yyyy/MM/dd"
                  value={date} 
                  onChange={handleDateChange}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={1}>
              <IconButton size="small" onClick={handleDelete}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
          <EditBody>
            <StyledTextarea value={body} onChange={onChangeBody} />
            <div>
              <StyledReactMarkdown plugins={[remarkGfm]} skipHtml={true}>
                {body}
              </StyledReactMarkdown>
            </div>
          </EditBody>
        </Grid>
      </Container>
    )
      : null
  )
}

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`

const EditBody = styled.div`
  display: flex;
  flex: 1;
  color: white;
  border-top: 1px solid white;
  > * {
    width: 50%;
    height: 100%;
    overflow-y: auto;
  }
`

const StyledTextarea = styled.textarea`
  resize: none;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.5;
  background: #666;
  color: white;
  border-right: 1px solid white;
  word-break: break-all;
`
const StyledReactMarkdown = styled(ReactMarkdown)`
  padding: 0 8px;
`