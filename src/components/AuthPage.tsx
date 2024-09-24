import { useState } from 'react'

function AuthPage() {
	const [token, setToken] = useState()

	const onSubmit = (e: any) => {
		e.preventDefault()
		if (token) {
			localStorage.setItem('token', token)
			location.reload()
		}
	}
	return (
		<div className='py-[1em] text-[rgb(214,214,214)] max-w-[500px] mx-auto'>
			<div className='bg-[rgb(39,39,39)]/85 inline-block mx-auto py-[15px] px-[20px] rounded-[10px]'>
				<form
					onSubmit={onSubmit}
					className='flex items-center justify-center gap-10'
				>
					<div className='bg-[#272727] rounded-[6px]'>
						<input
							value={token}
							onChange={(e: any) => setToken(e.target.value)}
							className='outline-none bg-transparent pl-[10px] py-1.5 text-[#d6d6d6]'
							type='text'
							placeholder='Токен'
						/>
					</div>
					<button className='bg-[#228e5d] rounded-[6px] text-[#d6d6d6] font-semibold py-1.5 px-6'>
						Применить
					</button>
				</form>
			</div>
		</div>
	)
}

export default AuthPage
