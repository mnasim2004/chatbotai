import React, { useState, useEffect } from 'react';
import axios from 'axios';


interface ChatBotProps {
  botId: string;
  position?: boolean;
  className?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ botId, position=true, className="" }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isStart, setStart] = useState(true);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bot, setBot] = useState<any | null>(null);
  const [isListening, setIsListening] = useState(false);
  const SpeechRecognition = typeof window !== 'undefined' && (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const startListening = (e: any) => {
    e.preventDefault()
    if (recognition) {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event: any) => {
        const speechToText = event.results[0][0].transcript;
        setInput(speechToText);
      };

      recognition.onerror = (event: any) => {
        console.error(event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };


  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/chatbot/${botId}`);
      setBot(response.data.data);
      console.log(response.data.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setStart(false)
  };

  const handleSendMessage = async () => {
    setLoading(true);
    if (input.trim() && bot) {
      setMessages([...messages, { sender: 'user', text: input }]);
      setInput('');
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/get-response/${botId}`,
          {
            Question: input
          }
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: response.data.data },
        ]);
      } catch (e) {
        console.error('Error sending message', e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (<>
    {bot && <div className={position ? `fixed bottom-4 right-4 ${className}`: `${className}`}> 
      {!isChatOpen ? (
        <div className="flex items-center cursor-pointer" onClick={toggleChat}>
          <div className="relative flex flex-col items-end gap-2">
          {isStart && <div
              style={{
                backgroundColor: bot.backgroundcolor,
                color: bot.bottextcolor,
                animation: 'fadeOut 5s forwards',
              }}
              className="top-[-50px] right-0 p-2 rounded-lg shadow-lg"
            >
              {bot.iconlabel}
          </div>}
            <img
              src={bot.iconurl}
              alt="Bot Logo"
              className={`rounded-full h-[${bot.iconsize}px] w-[${bot.iconsize}px]`}
            />
            
          </div>
        </div>
      ) : (
        <div
          className="min-h-[400px] w-[300px] flex flex-col justify-between  rounded-lg shadow-lg relative max-h-[300px]"
          style={{ backgroundColor: bot.backgroundcolor }}
        >
          <div className={`h-[${bot.headersize}px] w-full flex flex-row justify-end p-2 rounded-tr-lg rounded-tl-lg`}
          style={{ backgroundColor: bot.headercolor }}
          >
          <button
            className="bold mr-1"
            onClick={toggleChat}
              style={{color:bot.backgroundcolor}}
          >
            X 
          </button>
          </div>
          <div className="overflow-y-auto flex-1 mb-4 p-4">
            
            <div className="flex flex-row gap-2 my-2 items-center">
              <img
                className="rounded-full h-[30px] w-[30px]"
                src={bot.avatarurl}
                alt="Bot Logo"
              />
              <div key={99}>
                <div
                  style={{
                    backgroundColor: bot.botchatcolor,
                    color: bot.bottextcolor,
                  }}
                  className="inline-block p-2 rounded-lg"
                >
                  {bot.welcome}
                </div>
              </div>
            </div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-row gap-2 my-2 items-center ${
                  message.sender === 'user' ? 'justify-end' : ''
                } `}
              >
                {message.sender === 'bot' && (
                  <img
                    className="rounded-full h-[30px] w-[30px]"
                    src={bot.iconurl}
                    alt="Bot Logo"
                  />
                )}
                <div
                  className={`content-center ${
                    message.sender === 'user' ? 'text-right' : ''
                  }`}
                >
                  <div
                    style={{
                      backgroundColor:
                        message.sender === 'user'
                          ? bot.userchatcolor
                          : bot.botchatcolor,
                      color:
                        message.sender === 'user'
                          ? bot.usertextcolor
                          : bot.bottextcolor,
                    }}
                    className="inline-block p-2 rounded-lg"
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {bot.audioinput ? <div className="flex p-2 align-center">
            <input
              disabled={loading}
              value={input}
              placeholder={bot.placeholder}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-[35px] p-1 rounded-tl-lg rounded-bl-lg"
              style={{
                backgroundColor: bot.foregroundcolor,
                color: bot.bottextcolor,
              }}
            />
            <button
              onClick={startListening}
              className={`p-0 m-0 w-[30px] rounded-tr-lg rounded-br-lg`}
              style={{
                backgroundColor: bot.foregroundcolor,
              }}
            >
              {isListening ? '🗣️' : '🎤'}
            </button>
            <button
            className='p-1 rounded-lg w-[30px]'
              disabled={loading}
              onClick={handleSendMessage}
              
            >
              <img className='rounded-lg' width={30} height={30} src={bot.send}></img>
            </button>
          </div>
          :
          <div className="flex p-4 align-center">
            <input
              disabled={loading}
              value={input}
              placeholder={bot.placeholder}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 mr-4 h-[35px] p-1 rounded-lg"
              style={{
                backgroundColor: bot.foregroundcolor,
                color: bot.bottextcolor,
              }}
            />
            <button
            className='p-1 rounded-lg'
              disabled={loading}
              onClick={handleSendMessage}
            >
              <img className='rounded-lg' width={30} height={30} src={bot.send}></img>
            </button>
          </div>}
        </div>
      )}
    </div>}
    </>
  );
};

export default ChatBot;
