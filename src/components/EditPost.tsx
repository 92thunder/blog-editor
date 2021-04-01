import React, { ChangeEvent, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import { useAsync } from 'react-use'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'
import { createPostRepository } from '../repositories/PostRepository'

export const EditPost: React.VFC = () => {
  const { postId } =  useParams<{postId: string}>()

  const postRepository = createPostRepository()
  const [text, setText] = useState('')
  const state = useAsync(async () => {
    const post = await postRepository.find(postId)
    setText(post.content)
    return post
  }, [])

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }
  useEffect(() => {
    if (state.value) {
      postRepository.save({
        id: state.value.id,
        title: state.value.title,
        content: text
      })
    }
  }, [text])
  return (
    state.value ? (
      <Container>
        <StyledTextarea value={text} onChange={onChange} />
        <div>
          <StyledReactMarkdown plugins={[remarkGfm]} skipHtml={true}>
            {text}
          </StyledReactMarkdown>
        </div>
      </Container>
    )
      : null
  )
}

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
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
`
const StyledReactMarkdown = styled(ReactMarkdown)`
  padding: 0 8px;
`