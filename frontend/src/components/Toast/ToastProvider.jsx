import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import Swal from 'sweetalert2'

const ToastContext = createContext(null)

export function ToastProvider({ children, defaultDuration = 4000 }) {

	const show = useCallback((message, options = {}) => {
		const type = options.type || 'info'
		const duration = options.duration ?? defaultDuration
		Swal.fire({
			toast: true,
			position: 'top-end',
			icon: type,
			text: message,
			showConfirmButton: false,
			timer: duration,
			timerProgressBar: true,
			customClass: { popup: 'swal2-toast' }
		})
		return Date.now()
	}, [defaultDuration])

	// Read message from session storage (e.g., after logout redirect)
	useEffect(() => {
		try {
			const raw = sessionStorage.getItem('toast')
			if (raw) {
				const data = JSON.parse(raw)
				show(data.message, { type: data.type || 'info', duration: data.duration })
				sessionStorage.removeItem('toast')
			}
		} catch {}
	}, [show])

	const contextValue = useMemo(() => ({
		show,
		success: (msg, opts) => show(msg, { ...opts, type: 'success' }),
		error: (msg, opts) => show(msg, { ...opts, type: 'error' }),
		info: (msg, opts) => show(msg, { ...opts, type: 'info' }),
		warning: (msg, opts) => show(msg, { ...opts, type: 'warning' })
	}), [show])

	return (
		<ToastContext.Provider value={contextValue}>
			{children}
		</ToastContext.Provider>
	)
}

export function useToast() {
	const ctx = useContext(ToastContext)
	if (!ctx) throw new Error('useToast must be used within a ToastProvider')
	return ctx
}


