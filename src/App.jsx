import Login from './pages/login'
import Signup from './pages/signup'
import Home from './pages/Home'
import Updateprofile from './pages/Updateprofile'
import ChatRoom from './pages/ChatRoom'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom'

function Layout() {
  return (
    <>
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path:"", 
        element: <Login />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <Signup />
      },
      {
        path:'home',
        element:<Home/>
      },
      {
        path:'update',
        element:<Updateprofile/>
      },{
        path:'chat/:id/:name_user',
        element:<ChatRoom/>

      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App