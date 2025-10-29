import { useParams } from 'react-router-dom'
import ChatBot from '../components/embed/ChatBot'

export default function EmbedPage() {
  const { id } = useParams()
  if (!id) return null
  return (
    <div>
      <ChatBot botId={id} />
    </div>
  )
}
