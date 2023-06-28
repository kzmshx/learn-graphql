import UserDisplay from './components/UserDisplay.tsx'
import { useQuery } from 'urql'
import { GetUsersDocument } from './generated/generated.ts'

function App() {
  const [results] = useQuery({
    query: GetUsersDocument,
  })

  return (
    <div className="bg-zinc-800 flex-col h-screen w-full flex items-center justify-center p-4 gap-y-12 overflow-scroll">
      {results.data?.users.map((user, i) => (
        <UserDisplay user={user} key={i}></UserDisplay>
      ))}
    </div>
  )
}

export default App
