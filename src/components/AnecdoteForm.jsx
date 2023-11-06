import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests";
import { useContext } from "react";
import NotificationContext from "../NotificationContext";
const AnecdoteForm = () => {
  const [notification,notificationDispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()
  const newMutation = useMutation({ 
    mutationFn:createAnecdote,
    onError:(error) => {
      console.log('erroring',error.response.data.error)
      notificationDispatch({payload:error.response.data.error,type:'ERRORNOTI'})
      setTimeout(() => {
        notificationDispatch({payload:error.response.data.error, type:'RESETNOTI'})
      }, 1000);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      console.log('onsuccess',data.content)
      notificationDispatch({payload:data.content, type:'SETNOTI'})
      setTimeout(() => {
        notificationDispatch({payload:data.content, type:'RESETNOTI'})
      }, 5000);
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newMutation.mutate({ content,votes:0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
