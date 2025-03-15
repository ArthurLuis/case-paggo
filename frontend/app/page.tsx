import Login from './login/page';
import Dashboard from './Dashboard/page'; // Importando a página da Dashboard
import {auth} from '@/auth';

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    return <Dashboard />;
  }

  return <Login />;
}
