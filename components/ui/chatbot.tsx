import React from 'react';


interface ChatBotProps {
  bot: any;
}

const ChatBotAI: React.FC<ChatBotProps> = ({ bot }) => {
  const messages = [{text:"Hello Bot", sender:"user"}, {text:"Hello User", sender:"bot"}]



  return (
    <div className="fixed bottom-4 right-4"> {/* Absolute positioning */}
        <div
          className="min-h-[400px] w-[300px] flex flex-col justify-between  rounded-lg shadow-lg relative"
          style={{ backgroundColor: bot.backgroundcolor }}
        >
          <div className="overflow-y-auto flex-1 mb-4 p-4">
            <div className="flex flex-row gap-2 my-2 items-center">
              <img
                className="rounded-full h-[50px] w-[50px]"
                src={bot.logo}
                alt="Bot Logo"
              />
              <div key={99} className="mb-2">
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
                    className="rounded-full h-[50px] w-[50px]"
                    src={bot.logo}
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
          <div className="flex p-4">
            <input
              disabled
              className="flex-1 mr-4 p-1 rounded-lg"
              style={{
                backgroundColor: bot.foregroundcolor,
                color: bot.bottextcolor,
              }}
            />
            <button
            disabled
            className='p-1 rounded-lg'
              style={{
                backgroundColor: bot.foregroundcolor,
                color: bot.bottextcolor,
              }}
            >
              Send
            </button>
          </div>
          <button
            className="absolute top-2 right-2 p-2 bold"
            disabled
              style={{color:bot.foregroundcolor}}
          >
            X
          </button>
        </div>
    </div>
  );
};

export default ChatBotAI;