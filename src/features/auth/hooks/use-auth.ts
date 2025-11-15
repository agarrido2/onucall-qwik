import { useContext } from "@builder.io/qwik";
import { AuthContext } from "~/lib/contexts/auth-context";

/**
 * Hook para acceder al contexto de autenticación
 *
 * @example
 * export default component$(() => {
 *   const auth = useAuth()
 *
 *   return (
 *     <div>
 *       {auth.isAuthenticated ? (
 *         <p>Hola {auth.user?.email}</p>
 *       ) : (
 *         <p>No autenticado</p>
 *       )}
 *     </div>
 *   )
 * })
 *
 * [CITE: GUIDE_AUTH_SUPA_QWIK.md - useAuth Hook]
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
