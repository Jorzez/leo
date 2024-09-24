import { axiosInstance } from './instance'

class lolzService {
	async getAllAccounts(page: any, daybreak: any, pmin: any) {
		try {
			const response = await axiosInstance.get(
				`user/items?user_id=3624293&category_id=1&page=${page}&pmin=${pmin}&not_origin[]=dummy&order_by=price_to_up&daybreak=${daybreak}`
			)

			return response
		} catch (err) {
			console.log(err)
			alert('Не удалось получить аккаунты')
		}
	}

	async buyAccount(data: any) {
		try {
			const response = await axiosInstance.post(
				`${data.id}/fast-buy?price=${data.price}`
			)

			location.reload()
			return response
		} catch (err) {
			console.log(err)
			alert('Не удалось купить аккаунт')
		}
	}

	async changePassword(id: number) {
		try {
			const response = await axiosInstance.post(`${id}/change-password`)

			location.reload()
			return response
		} catch (err) {
			console.log(err)
			alert('Не удалось обезопасить аккаунт')
		}
	}

	async getEmailPassword(id: number) {
		try {
			const response = await axiosInstance.get(`${id}/temp-email-password`)

			location.reload()
			return response
		} catch (err) {
			console.log(err)
			alert('Не удалось получить пароль от аккаунта')
		}
	}

	async getAccountData(id: any) {
		try {
			const response = await axiosInstance.get(`${id}`)
			return response.data
		} catch (err) {
			alert('Не удалось получить данные аккаунта')
			console.log(err)
		}
	}

	async getEmailCode(data: any) {
		try {
			const response = await axiosInstance.get(
				`email-code?item_id=${data.id}&email=${data.email}&login=${data.login}`
			)
			return response.data
		} catch (err) {
			alert('Не удалось получить данные аккаунта')
			console.log(err)
		}
	}
}

export const LolzService = new lolzService()
