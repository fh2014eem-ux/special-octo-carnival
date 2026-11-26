"use client"

import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"

// The server enforces username immutability; the client plugin only exposes username sign-in.
export const authClient = createAuthClient({ plugins: [usernameClient()] })

export const { signIn, signUp, signOut, useSession } = authClient
