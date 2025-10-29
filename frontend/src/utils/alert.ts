import Swal from 'sweetalert2'

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'question'

export function showAlert(type: AlertType, message: string, title: string = ''): void {
	Swal.fire({
		toast: true,
		position: 'top-end',
		icon: type,
		// title is not shown in toast mode, only text
		text: message,
		showConfirmButton: false,
		timer: 4000,
		timerProgressBar: true,
		customClass: {
			popup: 'swal2-toast',
		},
	})
}


