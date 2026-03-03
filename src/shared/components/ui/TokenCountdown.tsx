import { useEffect, useState } from "react"

interface TokenCountdownProps {
    expiresAt: number
}

export function TokenCountdown({ expiresAt }: TokenCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<number>(0)

    useEffect(() => {
        const calculateTimeLeft = () => {
            return Math.max(Math.floor((expiresAt - Date.now()) / 1000), 0)
        }

        setTimeLeft(calculateTimeLeft())

        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(interval)
    }, [expiresAt])

    if (timeLeft <= 0) return <span>Expired</span>

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return (
        <span className="font-mono tabular-nums text-sm">
            {minutes}:{seconds.toString().padStart(2, "0")} left
        </span>
    )
}
