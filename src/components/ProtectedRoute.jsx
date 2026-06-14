import { Navigate } from "react-router-dom"

function ProtectedRoute({ user, children }) {
    if (user) { // Verifie si l'utilisateur est connecté (retourne un objet sinon null)
        return children // Afficher les children
    } else {
        return <Navigate to='/login'/> 
    }
}

export default ProtectedRoute