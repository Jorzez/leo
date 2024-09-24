import { createContext } from 'react'

export const TokenContext = createContext({})

const TokenContextProvider = (props: any) => {
	const contextValue = {
		token: localStorage.getItem('token'),
	}

	return (
		<TokenContext.Provider value={contextValue}>
			{props.children}
		</TokenContext.Provider>
	)
}

export default TokenContextProvider
