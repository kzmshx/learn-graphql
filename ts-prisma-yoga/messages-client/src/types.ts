import { GetUsersQuery } from './generated/generated.ts'

export type Message = GetUsersQuery['users'][0]['messages'][0]
export type User = GetUsersQuery['users'][0]
