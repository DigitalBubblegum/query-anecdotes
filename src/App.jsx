import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery } from '@tanstack/react-query'
import { getAnecdotes } from './requests'

const App = () => {

  const handleVote = (anecdote) => {
    console.log('vote')
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
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
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
    </div>
  )
}

export default App
