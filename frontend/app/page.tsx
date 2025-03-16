import {cookies} from 'next/headers';
import Login from './login/page';
import Dashboard from './dashboard/page';

export default async function Home() {
  // Acessando os cookies do servidor
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken');

  if (token) {
    // Se o token existir, renderiza a Dashboard
    return <Dashboard />;
  }

  // Caso contrário, renderiza o Login
  return <Login />;
}
