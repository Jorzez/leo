import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AccountListPage from './components/AccountListPage'
import { NextUIProvider } from '@nextui-org/react'
import AccountPage from './components/AccountPage'
import AuthPage from './components/AuthPage'
import TokenContextProvider from './context/TokenContext'

function App() {
	const queryClient = new QueryClient()

	const router = createBrowserRouter([
		{
			path: '/',
			element: <AccountListPage />,
		},
		{
			path: 'account/:id',
			element: <AccountPage />,
		},
	])

	const authRouter = createBrowserRouter([
		{
			path: '/',
			element: <AuthPage />,
		},
	])

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<NextUIProvider>
				<main className='dark px-5'>
					<div className="bg-[linear-gradient(rgba(54,54,54,0.85),rgba(54,54,54,0.85)),url('../public/1c0fd62e79209c2013c32bc403387688.gif')] bg-cover fixed top-0 left-0 w-full h-screen -z-20"></div>
					<TokenContextProvider>
						<RouterProvider
							router={localStorage.getItem('token') ? router : authRouter}
						/>
					</TokenContextProvider>
				</main>
			</NextUIProvider>
		</QueryClientProvider>
	)
}

export default App
