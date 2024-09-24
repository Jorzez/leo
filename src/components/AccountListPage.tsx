import { useEffect, useState } from 'react'
import { Pagination, Spinner, Tooltip } from '@nextui-org/react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LolzService } from '../services/lolzService'

function AccountListPage() {
	const location = useLocation()
	const [allAccounts, setAllAccounts] = useState([])
	const [displayAccounts, setDisplayAccounts] = useState([])
	const [searchGame, setSearchGame] = useState('')
	const [autoSearch, setAuthSearch] = useState(false)
	const [page, setPage] = useState(1)
	const [totalItems, setTotalItems] = useState('1')
	const getAllAccount = useQuery({
		queryKey: ['getAccounts'],
		queryFn: async () => {
			const response = await LolzService.getAllAccounts(
				page,
				getQueryParams('daybreak'),
				getQueryParams('pmin')
			)
			setAllAccounts(response?.data.items)
			setTotalItems(response?.data.totalItems)
			return response
		},
		refetchInterval: 0,
		refetchOnWindowFocus: false,
	})

	useEffect(() => {
		getAllAccount.refetch()
	}, [page])

	const autoSearchGame = async () => {
		const filteredAccounts = allAccounts.filter((account: any) => {
			return Object.values(account.account_full_games.list).some(
				(game: any) => {
					return game.title.toLowerCase().includes(searchGame.toLowerCase())
				}
			)
		})
		setDisplayAccounts(filteredAccounts)

		if (autoSearch) {
			if (displayAccounts.length >= 1) {
				alert('Игра найдена')
				setAuthSearch(false)
			} else {
				doSomethingUntilTrue()
			}
		}
	}

	useEffect(() => {
		autoSearchGame()
	}, [searchGame, allAccounts])

	const doSomethingUntilTrue = async () => {
		if (searchGame === '') {
			alert('Поле пустое')
			return
		}
		setAuthSearch(true)
		if (displayAccounts.length >= 1) {
			setAuthSearch(false)
			alert('Игра найдена')
			return
		}
		setPage(page + 1)
	}

	const getDate = (utc: any) => {
		const millisecondsInDay = 1000 * 60 * 60 * 24
		const daysPassed = Math.floor((Date.now() - utc * 1000) / millisecondsInDay)
		const color = daysPassed < 5 ? 'status-red' : 'status-green'

		if (daysPassed >= 30) {
			const months = Math.floor(daysPassed / 30)
			const text = `${months} месяц`
			return { text, color }
		} else {
			const text = `${daysPassed} дней`
			return { text, color }
		}
	}

	const getQueryParams = (paramName: string) => {
		const queryParams = new URLSearchParams(location.search)
		const paramData = queryParams.get(paramName)
		return paramData ? paramData : 0
	}

	if (getAllAccount.isFetching && allAccounts.length <= 0) {
		return (
			<div className=' text-[#e5e7eb] text-[13px] flex justify-center mt-[1em]'>
				<div className='bg-[rgb(39,39,39)] py-3 px-6 rounded-[6px] gap-3 inline-block'>
					<span className='flex items-center gap-4'>
						<Spinner color='success' size='sm' />
						Подгрузка контента
					</span>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-[650px] mx-auto py-[1em]'>
			<form id='search-form' role='search'>
				<div className='mb-[1em] text-[13px] font-normal flex flex-wrap gap-2'>
					<div className='bg-[#272727] rounded-[6px]'>
						<input
							id='pmin'
							defaultValue={getQueryParams('pmin')}
							className='outline-none bg-transparent pl-[10px] h-[34px] text-[#d6d6d6]'
							type='text'
							placeholder='Цена от'
							name='pmin'
						/>
					</div>
					<div className='bg-[#272727] rounded-[6px]'>
						<input
							id='daybreak'
							defaultValue={getQueryParams('daybreak')}
							className='outline-none bg-transparent pl-[10px] h-[34px] text-[#d6d6d6]'
							type='text'
							placeholder='Отлежка от, дней'
							name='daybreak'
						/>
					</div>
					<div className='bg-[#272727] rounded-[6px]'>
						<input
							value={searchGame}
							onChange={e => setSearchGame(e.target.value)}
							className='outline-none bg-transparent pl-[10px] h-[34px] text-[#d6d6d6]'
							type='text'
							placeholder='Игра'
						/>
					</div>
					<button className='bg-[#228e5d] rounded-[6px] text-[#d6d6d6] font-semibold py-2 px-9'>
						Применить
					</button>
					<button
						onClick={() => doSomethingUntilTrue()}
						type='button'
						className='bg-[#228e5d] px-9 rounded-[6px] text-[#d6d6d6] font-semibold'
					>
						Авто
					</button>
					<button
						onClick={() => setPage(page + 1)}
						className='bg-[#228e5d] px-9 rounded-[6px] text-[#d6d6d6] font-semibold'
					>
						Отмена
					</button>
				</div>
			</form>

			<div className='mb-[1em] text-[13px] font-normal flex justify-between gap-3'></div>
			<div className='mb-[1em] text-[13px] font-normal flex gap-3'>
				<Pagination
					total={Math.floor(parseInt(totalItems) / 40) + 1}
					page={page}
					color='success'
					isDisabled={getAllAccount.isFetching}
					onChange={e => {
						setPage(e)
					}}
				/>
			</div>
			<div className='grid grid-rows-[repeat(5fr);] gap-[10px]'>
				{displayAccounts.map((account: any) => {
					return (
						<article
							key={account.item_id}
							className='bg-[#272727]/85 text-[#d6d6d6] rounded-[10px] py-[15px] px-[20px] font-semibold'
						>
							<div className='price-button px-[10px] text-[15px] font-semibold float-right rounded-[6px] text-white'>
								{account.price}
								<span className='font-[Inter] font-normal text-[16px] pl-0.5'>
									₽
								</span>
							</div>
							<a href={`account/${account.item_id}`} target='_blank'>
								<h1 className='text-[14px]'>{account.title}</h1>
							</a>
							<div className='mt-[12px] mb-[4px] flex flex-wrap gap-2 font-medium'>
								<span
									className={`text-[13px] px-[12px] py-[6.5px] rounded-full flex items-center ${
										getDate(account.steam_last_activity).color
									}`}
								>
									{getDate(account.steam_last_activity).color ===
									'status-red' ? (
										<i className='fa-solid fa-thumbs-down pr-2'></i>
									) : (
										<i className='fa-solid fa-thumbs-up pr-2'></i>
									)}
									Последний актив {getDate(account.steam_last_activity).text}
								</span>
								<span
									className={`text-[13px] px-[12px] py-[6.5px] rounded-full flex items-center ${
										parseFloat(account.steam_hours_played_recently) > 0
											? 'status-red'
											: 'status-green'
									}`}
								>
									{parseFloat(account.steam_hours_played_recently) > 0 ? (
										<i className='fa-solid fa-thumbs-down pr-2'></i>
									) : (
										<i className='fa-solid fa-thumbs-up pr-2'></i>
									)}
									{account.steam_hours_played_recently}ч за 2 недели
								</span>
								{account.steam_is_limited ? (
									<span
										className={`text-[13px] px-[12px] py-[6.5px] rounded-full status-red flex items-center`}
									>
										<i className='fa-solid fa-thumbs-down pr-2'></i>С лимитом
									</span>
								) : (
									''
								)}
								{account.account_community_ban ? (
									<span
										className={`text-[13px] px-[12px] py-[6.5px] rounded-full status-red flex items-center`}
									>
										<i className='fa-solid fa-thumbs-down pr-2'></i>Красная
										табличка
									</span>
								) : (
									''
								)}
								<span
									className={`text-[13px] px-[12px] py-[6.5px] rounded-full flex items-center specials-button`}
								>
									{account.guarantee.durationPhrase} гарантии
								</span>
								<span
									className={`text-[13px] px-[12px] py-[6.5px] rounded-full flex items-center specials-button`}
								>
									{account.itemOriginPhrase}
								</span>
								<span
									className={`text-[13px] px-[12px] py-[6.5px] rounded-full flex items-center specials-button`}
								>
									{account.account_country}
								</span>
								<span
									className={`text-[13px] px-[12px] py-[6.5px] rounded-full flex items-center specials-button`}
								>
									{account.account_balance}
								</span>
								{account.account_bans_string && (
									<Tooltip
										showArrow={true}
										color='warning'
										content={account.account_bans_string}
									>
										<span
											className={`text-[13px] px-[12px] text-[#b3b309] py-[6.5px] rounded-full flex items-center bg-[#383823] group`}
										>
											<i className='fa-solid fa-triangle-exclamation pr-1.5'></i>
											VAC
										</span>
									</Tooltip>
								)}
							</div>
							<div className='mt-[12px] mb-[4px] flex flex-wrap gap-2 font-medium'>
								{Object.values(account.account_full_games.list).map(
									(game: any) => (
										<div
											key={game.appid}
											className='rounded-full flex items-center text-[13px]'
										>
											<img
												src={`https://nztcdn.com/steam/game_assets/${game.parentGameId}_icon.webp?1`}
												alt={game.title}
												className='w-[30px] h-[30px] rounded-[6px] mr-2 object'
											/>
											<div className='px-[10px] h-[95%] flex items-center rounded-[6px] bg-[#363636]'>
												{game.title}
											</div>
										</div>
									)
								)}
							</div>
							<div className='mt-[12px] flex flex-wrap gap-2 font-medium text-[14px] items-center'>
								<a
									href={account.accountLinks[0]}
									target='_blank'
									className='items-center pl-1'
								>
									<i className='fa-brands fa-steam-symbol text-[16px]'></i>
								</a>
								<a
									href={`https://lzt.market/user/${account.seller.user_id}`}
									target='_blank'
								>
									<p className='pl-2 user-uniq'>{account.seller.username}</p>
								</a>
							</div>
						</article>
					)
				})}
			</div>
			<div className='text-[13px] font-normal flex mt-3'>
				<Pagination
					page={page}
					total={Math.floor(parseInt(totalItems) / 40) + 1}
					color='success'
					isDisabled={getAllAccount.isFetching}
					onChange={e => {
						setPage(e)
					}}
				/>
			</div>
		</div>
	)
}

export default AccountListPage
