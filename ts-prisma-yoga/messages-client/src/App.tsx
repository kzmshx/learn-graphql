import { User } from './types'
import UserDisplay from './components/UserDisplay.tsx'

function App() {
  const users: User[] = [
    {
      name: 'Kazumasa Hirata',
      messages: [{ body: 'Prisma rocks!!' }, { body: 'TypeScript rocks!!' }],
    },
  ]

  return (
    <div className="bg-zinc-800 flex-col h-screen w-full flex items-center justify-center p-4 gap-y-12 overflow-scroll">
      {users.map((user, i) => (
        <UserDisplay user={user} key={i}></UserDisplay>
      ))}
    </div>
  )
}

export default App
