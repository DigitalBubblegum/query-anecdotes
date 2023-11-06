import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes,updateAnecdote } from './requests'
import { useReducer } from 'react'
import NotificationContext from './NotificationContext'
const notificationReducer = (state,action) => {
  console.log('hitting up the reducer',action)
  switch(action.type) {
    case "SETNOTI":
      console.log('completed exercise 6.23')
      console.log('setting notification')
      return (`anecdote "${action.payload}" added`)
    case "RESETNOTI":
      console.log('resetting notification')
      return ''
    case "VOTINOTI":
      return(`voted for ${action.payload}`)
    case "ERRORNOTI":
      console.log('completed exercise 6.24')
      return action.payload
  }
}

const App = () => {
  const [notification,notificationDispatch] = useReducer(notificationReducer,'')
  const queryClient = useQueryClient()
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess:(data) => {
      queryClient.invalidateQueries({queryKey:['anecdotes']})
      console.log('voting',data)
      notificationDispatch({payload:data.content,type:'VOTINOTI'})
      setTimeout(() => {
        notificationDispatch({payload:data.content, type:'RESETNOTI'})
      }, 1000);
    }
  })
  const handleVote = (anecdote) => {
    console.log('completed exercise 6.22')
    console.log('vote')
    updateAnecdoteMutation.mutate({ ...anecdote,votes:anecdote.votes+1 })
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 3
  })
  console.log('completed exercise 6.20')
  console.log(JSON.parse(JSON.stringify(result)))
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  if( result.isError ) {
    return <div>anecdote service is unavailable due to problems in the server</div>
  }
  const anecdotes = result.data||null

  return (
    <NotificationContext.Provider value={[notification,notificationDispatch]}>
      <h3>Anecdote app</h3>
    
      <Notification notification={notification}></Notification>
      <AnecdoteForm />
    
      {
      anecdotes===null?
      console.log('anecdote unavailable'):
      anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )
    }
    </NotificationContext.Provider>
  )
}

export default App
