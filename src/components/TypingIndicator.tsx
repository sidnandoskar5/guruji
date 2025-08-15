import { useEffect, useState } from 'react'

interface Props {
  personaName?: string
}

export default function TypingIndicator({ personaName = 'AI' }: Props) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex justify-start">
      <div className="max-w-[70%] rounded-lg bg-gray-800 px-3 py-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-gray-400 text-xs">
            {personaName} is typing{dots}
          </span>
        </div>
      </div>
    </div>
  )
}
