import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { LolzService } from '../services/lolzService'
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Spinner,
	Snippet,
} from '@nextui-org/react'

function AccountPage() {
	const { id } = useParams()
	const { isPending: isPending2, data: data2 } = useQuery({
		queryKey: ['repodata2'],
		queryFn: () => LolzService.getAccountData(id),
		refetchOnWindowFocus: false,
	})
	const getEmailPassword = useMutation({
		mutationFn: (id: number) => {
			return LolzService.getEmailPassword(id)
		},
	})
	const mutation = useMutation({
		mutationFn: (id: number) => {
			return LolzService.changePassword(id)
		},
	})
	const getCodeMutation = useMutation({
		mutationFn: (data: any) => {
			return LolzService.getEmailCode(data)
		},
	})
	const { mutate, isPending } = useMutation({
		mutationFn: (newTodo: any) => {
			return LolzService.buyAccount(newTodo)
		},
	})

	const getDate = (utc: any) => {
		return new Date(utc * 1000)
			.toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			})
			.replace(/\.$/, '')
			.replace(/г$/, '')
	}

	if (isPending2)
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
	return (
		<div className='max-w-[650px] mx-auto py-[1em] text-[rgb(214,214,214)]'>
			<a
				href='/'
				className='mb-[0.5em] text-[13px] bg-[rgb(39,39,39)]/85 py-[10px] opacity-50 px-[15px] rounded-[10px] inline-block hover:opacity-100 font-semibold duration-200'
			>
				<i className='fa-solid fa-angle-left mr-2 text-[12px]'></i>
				Вернуться назад
			</a>
			<div className='bg-[rgb(39,39,39)]/85 py-[15px] px-[20px] rounded-[10px]'>
				<div className='px-[10px] text-[19px] font-semibold float-right rounded-[6px] text-white'>
					{data2.item.price}
					<span className='font-[Inter] font-normal text-[19px] pl-0.5'>₽</span>
				</div>
				<h1 className='w-[calc(100%-180px)]'>
					<span className='text-[20px] font-semibold'>{data2.item.title}</span>
				</h1>
				<div className='text-[13px] mt-[6px] text-[rgb(148,148,148)] flex items-center'>
					<span>{getDate(data2.item.published_date)}</span>
					<span className='w-[3px] h-[3px] rounded-full bg-[rgb(34,142,93)] mx-[5px]'></span>
					{data2.item.view_count} просмотров
					<span className='w-[3px] h-[3px] rounded-full bg-[rgb(34,142,93)] mx-[5px]'></span>
					{data2.item.canViewLoginData && (
						<div>
							{data2.item.guarantee.active ? (
								<span className='text-[rgb(41,172,113)]'>
									Гарантия ({data2.item.guarantee.remainingTimePhrase})
								</span>
							) : !data2.item.guarantee.cancelled ? (
								<span>
									Гарантия истекла ({getDate(data2.item.guarantee.endDate)})
								</span>
							) : (
								<span className='text-[rgb(136,68,68)]'>
									Гарантия отменена ({getDate(data2.item.guarantee.endDate)})
								</span>
							)}
						</div>
					)}
				</div>
				<div className='mt-[30px] flex flex-wrap gap-[10px] select-none'>
					{!data2.item.canViewLoginData && (
						<button
							onClick={() => {
								mutate({
									id: data2.item.item_id,
									price: data2.item.price,
								})
							}}
							className='bg-[rgb(34,142,93)] px-[15px] text-[13px] font-semibold py-1.5 rounded-[6px]'
						>
							{isPending ? (
								<Spinner size='sm' color='white'></Spinner>
							) : (
								'Купить'
							)}
						</button>
					)}
					<button className='bg-[rgb(54,54,54)] px-[15px] text-[13px] font-semibold py-1.5 rounded-[6px]'>
						<i className='fa-brands fa-steam-symbol scale-[1.5] text-[#8C8C8C]'></i>
					</button>
					{data2.item.canViewLoginData &&
						data2.item.loginData.adviceToChangePassword && (
							<button
								onClick={() => {
									mutation.mutate(data2.item.item_id)
								}}
								className='bg-[rgb(34,142,93)] px-[15px] text-[13px] font-semibold py-1.5 rounded-[6px]'
							>
								{mutation.isPending ? (
									<Spinner size='sm' color='white'></Spinner>
								) : (
									'Обезопасить аккаунт'
								)}
							</button>
						)}
				</div>
				{data2.item.canViewLoginData && (
					<div className='mt-[30px] text-[15px] font-semibold'>
						<p className='mb-[12px]'>
							Аккаунт восстановили? Есть претензии к продавцу?
						</p>
						<a className='bg-[rgb(136,68,68)] px-[15px] text-[13px] font-semibold py-2 rounded-[6px]'>
							Открыть денежный спор
						</a>
						<p className='mt-[30px]'>Данные для входа:</p>
						<div className='font-normal text-[13px] flex flex-col'>
							<span>
								логин
								<Snippet
									size='sm'
									className='bg-transparent text-[13px] text-[rgb(214,214,214)]'
								>
									{data2.item.loginData.login}
								</Snippet>
							</span>
							<span className='mt-[-13px]'>
								пароль
								<Snippet
									size='sm'
									className='bg-transparent text-[13px] text-[rgb(214,214,214)]'
								>
									{data2.item.loginData.password}
								</Snippet>
							</span>
							<span className='mt-[-13px]'>
								логин:пароль
								<Snippet
									size='sm'
									className='bg-transparent text-[13px] text-[rgb(214,214,214)]'
								>
									<span>
										{data2.item.loginData.login}:{data2.item.loginData.password}{' '}
										<span className='hidden'>- данные для входа стим</span>
									</span>
								</Snippet>
							</span>
						</div>
						<div>
							<a
								href='https://steamcommunity.com/login/home/'
								target='_blank'
								className='bg-[rgb(54,54,54)] px-[15px] text-[12.5px] font-medium py-2 rounded-[6px]'
							>
								Страница для входа
								<i className='fa-solid fa-arrow-up-right-from-square ml-2'></i>
							</a>
						</div>
						<div className='bg-[rgb(45,45,45)] py-[10px] px-[15px] inline-block mt-[25px] rounded-[6px]'>
							<div className='text-[15px] text-semibold mb-2'>
								Временная почта от аккаунта
							</div>
							<p className='mt-[-13px] text-[13px] font-normal'>
								логин
								<Snippet
									size='sm'
									className='bg-transparent text-[rgb(214,214,214)]'
								>
									{data2.item.getEmailCodeDisplayLogin}
								</Snippet>
							</p>
							{data2.item.tempEmailData && (
								<div>
									<p className='mt-[-13px] text-[13px] font-normal'>
										пароль
										<Snippet
											size='sm'
											className='bg-transparent text-[rgb(214,214,214)]'
										>
											{data2.item.tempEmailData.password}
										</Snippet>
									</p>
									<p className='mt-[-13px] text-[13px] font-normal'>
										логин:пароль
										<Snippet
											size='sm'
											className='bg-transparent text-[rgb(214,214,214)]'
										>
											<span>
												{data2.item.tempEmailData.login}:
												{data2.item.tempEmailData.password}{' '}
												<span className='hidden'>
													- для входа в почту https://notletters.com/login
												</span>
											</span>
										</Snippet>
									</p>
								</div>
							)}
							<div className='flex flex-col gap-2'>
								<div>
									<button
										onClick={() =>
											getCodeMutation.mutate({
												id: data2.item.item_id,
												email: data2.item.getEmailCodeDisplayLogin,
												login: data2.item.loginData.login,
											})
										}
										className='bg-[rgb(34,142,93)] px-[15px] text-[13px] font-semibold py-1 rounded-[6px]'
									>
										{getCodeMutation.isPending ? (
											<Spinner size='sm' color='success'></Spinner>
										) : (
											'Получить код / ссылку с почты'
										)}
									</button>
								</div>
								{getCodeMutation.isSuccess &&
								getCodeMutation.data?.codeData?.code ? (
									<Snippet
										size='sm'
										className='bg-transparent text-[rgb(214,214,214)] text-[14px]'
									>
										{getCodeMutation.data.codeData.code}
									</Snippet>
								) : (
									<span className='text-[13px] font-medium max-w-[400px]'>
										{getCodeMutation.data?.errors[0]}
									</span>
								)}
							</div>
							{!data2.item.tempEmailData ? (
								<div className='mt-1'>
									<button
										onClick={() => {
											getEmailPassword.mutate(data2.item.item_id)
										}}
										className='bg-[rgb(54,54,54)] px-[15px] text-[13px] font-semibold py-1 rounded-[6px]'
									>
										{getEmailPassword.isPending ? (
											<Spinner size='sm' color='white'></Spinner>
										) : (
											'Получить пароль от почты'
										)}
									</button>
								</div>
							) : (
								''
							)}
						</div>
					</div>
				)}
			</div>
			<div className='bg-[rgb(39,39,39)]/85 py-[15px] px-[20px] rounded-[10px] mt-[15px] text-[15px] text-[rgb(214,214,214)]'>
				<div className='mb-[15px] font-semibold'>Актуальные игры</div>
				<ul className='grid grid-cols-[repeat(auto-fill,187px)] justify-between gap-y-[15px]'>
					{Object.values(data2.item.account_full_games.list)
						.sort((a: any, b: any) => b.playtime_forever - a.playtime_forever)
						.map((game: any) => (
							<li className='w-full' key={game.parentGameId}>
								<a
									href={`https://store.steampowered.com/app/${game.parentGameId}`}
									target='_blank'
								>
									<img
										src={game.img}
										className='w-full h-[85px] rounded-[6px]'
										alt=''
									/>
								</a>
								<div className='mt-[10px] text-[13px]'>
									<span
										className={`font-semibold ${game.vac && 'text-[#b3b309]'}`}
									>
										{game.title}
									</span>
									<div className='mt-[4px] text-[rgb(148,148,148)] flex items-center'>
										<i className='fa-regular fa-clock'></i>
										<span className='ml-1'>
											{Math.round(game.playtime_forever)} ч.
										</span>
									</div>
								</div>
							</li>
						))}
				</ul>
				<div className='my-[15px] font-semibold text-[16px]'>
					Баны и ограничения
				</div>
				<ul className='flex flex-col gap-5'>
					{data2.item.account_bans_array || data2.item.account_community_ban ? (
						<div className='bg-[rgb(54,54,54)] py-[15px] px-[20px] rounded-[6px]'>
							<div className='text-[#FF6A70] text-[14px] font-semibold mb-[4px]'>
								Есть VAC
							</div>
							<div className='text-[13px] text-[rgb(148,148,148)] leading-[1.1rem]'>
								<span>
									{data2.item.account_bans_array &&
										data2.item.account_bans_array.map((e: any) => {
											const game = data2.item.account_full_games.list[e]
											if (game) {
												return `Нельзя играть в ${game.title}.`
											}
											return ''
										})}
								</span>
								{data2.item.account_community_ban ? (
									<span>
										Нельзя играть в игры с VAC серверами (CS2, Rust, Dota2, TF2,
										DayZ, ARK т.д.) - из-за Красной таблички.
									</span>
								) : (
									''
								)}
							</div>
						</div>
					) : (
						''
					)}
					{data2.item.steamLifetimeTradeBan ? (
						<div className='bg-[rgb(54,54,54)] py-[15px] px-[20px] rounded-[6px]'>
							<div className='text-[#FF6A70] text-[14px] font-semibold mb-[4px]'>
								Вечный Trade Ban
							</div>
							<p className='text-[13px] text-[rgb(148,148,148)] leading-[1.1rem]'>
								Нельзя покупать товары на Торговой площадке Сообщества.
								Недоступна отправка и получение подарков друзьям или от друзей.
								Нельзя активировать цифровые ключи. Недоступна опция обмена.
							</p>
						</div>
					) : (
						''
					)}
					{data2.item.account_community_ban ? (
						<div className='bg-[rgb(54,54,54)] py-[15px] px-[20px] rounded-[6px]'>
							<div className='text-[#FF6A70] text-[14px] font-semibold mb-[4px]'>
								Есть красная табличка
							</div>
							<p className='text-[13px] text-[rgb(148,148,148)] leading-[1.1rem]'>
								Этот аккаунт заблокирован владельцем. Совершение покупок,
								отправка и получение подарков, обмен, активация цифровых ключей,
								игра в CS2, игра на серверах с VAC, а также доступ к сообществу
								Steam отключены.
							</p>
						</div>
					) : (
						''
					)}
					{data2.item.steam_is_limited ? (
						<div className='bg-[rgb(54,54,54)] py-[15px] px-[20px] rounded-[6px]'>
							<div className='text-[#FF6A70] text-[14px] font-semibold mb-[4px]'>
								Есть ограничения на друзей и ТП
							</div>
							<p className='text-[13px] text-[rgb(148,148,148)] leading-[1.1rem]'>
								Есть лимит "5 долларов". Нельзя добавлять в друзья, продавать и
								покупать вещи на торговой площадке Steam, отправлять сообщения
								кому-либо.
							</p>
						</div>
					) : (
						''
					)}
				</ul>
				<div>
					<div className='my-[15px] font-semibold text-[16px]'>
						Стоимость инвентаря
					</div>
					<ul className='flex flex-col gap-4'>
						{data2.item.inventoryValue &&
							Object.values(data2.item.inventoryValue).map((e: any) => {
								return (
									<div>
										<a className='text-[rgb(214,214,214)] text-[19px]' href=''>
											{e.value}
											<span className='font-[Inter]'> ₽</span>
											<p className='text-[13px] text-[rgb(148,148,148)]'>
												инвентарь {e.title}
											</p>
										</a>
									</div>
								)
							})}
					</ul>
				</div>
				<div className='mt-[30px]'>
					<div className='my-[15px] font-semibold text-[16px]'>
						Достоверная информация
					</div>
					<ul className='flex'>
						<li className='w-[30%] mr-[25px] mb-[15px]'>
							<a className='text-[rgb(214,214,214)] text-[19px]' href=''>
								{data2.item.steam_converted_balance}
								<span className='font-[Inter]'> ₽</span>
								<p className='text-[13px] text-[rgb(148,148,148)]'>Баланс</p>
							</a>
						</li>
						<li className='w-[30%] mr-[25px] mb-[15px]'>
							<a className='text-[rgb(214,214,214)] text-[19px]' href=''>
								{data2.item.steam_points}
								<p className='text-[13px] text-[rgb(148,148,148)]'>Очков</p>
							</a>
						</li>
					</ul>
					<ul className='flex'>
						<li className='w-[30%] mr-[25px] mb-[15px]'>
							<a className='text-[rgb(214,214,214)] text-[19px]' href=''>
								{getDate(data2.item.steam_last_activity)}
								<p className='text-[13px] text-[rgb(148,148,148)]'>
									Последняя активность
								</p>
							</a>
						</li>
						<li className='w-[30%] mr-[25px] mb-[15px]'>
							<a
								className={` text-[19px] ${
									parseInt(data2.item.steam_hours_played_recently) > 0
										? 'text-[#FF6A70]'
										: 'text-[rgb(214,214,214)]'
								}`}
								href=''
							>
								{data2.item.steam_hours_played_recently} ч.
								<p className='text-[13px] text-[rgb(148,148,148)]'>
									Сыграно за 2 недели
								</p>
							</a>
						</li>
						<li className='w-[30%] mr-[25px] mb-[15px]'>
							<a className='text-[rgb(214,214,214)] text-[19px]' href=''>
								{getDate(data2.item.steam_register_date)}
								<p className='text-[13px] text-[rgb(148,148,148)]'>
									Регистрация аккаунта
								</p>
							</a>
						</li>
					</ul>
					<ul className='flex'>
						<li className='w-[30%] mr-[25px] mb-[15px]'>
							<a className='text-[rgb(214,214,214)] text-[19px]' href=''>
								{data2.item.steam_level}
								<p className='text-[13px] text-[rgb(148,148,148)]'>
									Уровень аккаунта
								</p>
							</a>
						</li>
						<li className='w-[30%] mr-[25px] mb-[15px]'>
							<a className='text-[rgb(214,214,214)] text-[19px]' href=''>
								{data2.item.steam_friend_count}
								<p className='text-[13px] text-[rgb(148,148,148)]'>Друзья</p>
							</a>
						</li>
						<li className='w-[30%] mr-[25px] mb-[15px]'>
							<a className='text-[rgb(214,214,214)] text-[19px]' href=''>
								{data2.item.account_full_games.total}
								<p className='text-[13px] text-[rgb(148,148,148)]'>
									Игр на аккаунте
								</p>
							</a>
						</li>
					</ul>
					<ul className='flex'>
						<li className='w-[30%] mr-[25px] mb-[15px]'>
							<a className='text-[rgb(214,214,214)] text-[19px]' href=''>
								{data2.item.steam_has_activated_keys ? 'Да' : 'Нет'}
								<p className='text-[13px] text-[rgb(148,148,148)]'>
									Есть активированные ключи
								</p>
							</a>
						</li>
						<li className='w-[30%] mr-[25px] mb-[15px]'>
							<a className='text-[rgb(214,214,214)] text-[19px]' href=''>
								{data2.item.account_country}
								<p className='text-[13px] text-[rgb(148,148,148)]'>Страна</p>
							</a>
						</li>
						<li className='w-[30%] mr-[25px] mb-[15px]'>
							<a className='text-[rgb(214,214,214)] text-[19px]' href=''>
								{data2.item.itemOriginPhrase}
								<p className='text-[13px] text-[rgb(148,148,148)]'>
									Происхождение
								</p>
							</a>
						</li>
					</ul>
					<ul className='flex flex-wrap gap-1 gap-y-4'>
						{data2.item.accountLinks.map((e: any) => {
							return (
								<a
									href={e.link}
									target='_blank'
									className='bg-[rgb(54,54,54)] px-[15px] text-[13px] font-semibold py-2 rounded-[6px] group flex items-center'
								>
									<i className='fa-brands scale-150 fa-steam-symbol text-[#cccccc] mr-4'></i>
									{e.text}
									<i className='fa-solid fa-arrow-up-right-from-square ml-3 text-[#585858] group-hover:text-[#b6b6b6] duration-200'></i>
								</a>
							)
						})}
					</ul>
				</div>
			</div>
			<div className='bg-[rgb(39,39,39)]/85 py-[15px] px-[20px] rounded-[10px] mt-[1em]'>
				<Table removeWrapper aria-label='Example static collection table'>
					<TableHeader>
						<TableColumn>Product</TableColumn>
						<TableColumn>Type</TableColumn>
						<TableColumn>Amount</TableColumn>
					</TableHeader>
					<TableBody emptyContent={'No data'}>
						{data2.item.steamTransactions
							? Object.values(data2.item.steamTransactions).map((item: any) => {
									console.log(item)
									return (
										<TableRow>
											<TableCell>{item.product}</TableCell>
											<TableCell>{item.type}</TableCell>
											<TableCell>{item.amount}</TableCell>
										</TableRow>
									)
							  })
							: []}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default AccountPage
