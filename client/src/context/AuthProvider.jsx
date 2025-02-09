import React, { createContext, useContext, useState } from 'react'

// Crear el contexto de autenticación
const AuthContext = createContext()

// Proveedor de autenticación
function AuthProvider({children}) {

    const [user, setUser] = useState(null)

    // Función para iniciar sesión
    const login = (userData) => {
        // Lógica para iniciar sesión
        setUser({userData})
        localStorage.setItem('user', JSON.stringify(userData))
    }

    // Función para cerrar sesión
    const logout = () => {
        // Lógica para cerrar sesión
        setUser(null)
        localStorage.removeItem('user')
    }

  return (
    <AuthContext.Provider value={{user, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
    return useContext(AuthContext)
}

export default AuthProvider