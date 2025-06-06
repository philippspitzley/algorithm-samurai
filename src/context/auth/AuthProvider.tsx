import { APISchemas } from "@/api/types"

import { AuthContext } from "./useAuth"
import useUser from "./useUser"

export type User = APISchemas["UserPublic"]

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useUser()

  return <AuthContext value={user}>{children}</AuthContext>
}
