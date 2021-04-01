import firebase from 'firebase/app'
import 'firebase/firestore'
import { Post } from '../types'

type PostRepository = {
  findAll: () => Promise<Post[]>
  find: (id: string) => Promise<Post | undefined>
  save: (post: Post) => Promise<void>
}

type PostObject = {
  title: string
  body: string
  date: firebase.firestore.Timestamp
  timestamp: firebase.firestore.Timestamp
}

export const createPostRepository: () => PostRepository = () => {
  const db = firebase.firestore()
  return {
    async findAll() {
      const posts: Post[] = []
      const querySnapshot = await db.collection('posts').get()
      querySnapshot.forEach((doc) => {
        const data = doc.data() as PostObject
        posts.push({
          id: doc.id,
          title: data.title,
          body: data.body,
          date: data.date.toDate()
        })
      })
      return posts
    },
    async find(id: string) {
      const docRef = db.collection('posts').doc(id)
      const doc = await docRef.get()
      const data = doc.data() as PostObject | undefined
      if (!data) return undefined
      return {
        id: doc.id,
        title: data.title,
        body: data.body,
        date: data.date.toDate()
      }
    },
    async save(post: Post) {
      const docRef = db.collection('posts').doc(post.id)
      const data = {
        title: post.title,
        body: post.body,
        date: firebase.firestore.Timestamp.fromDate(post.date),
      }
      return docRef.update({
        ...data,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(() => {
        db.collection('posts').doc(post.id).set({
          ...data,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
      })
    }
  }
}