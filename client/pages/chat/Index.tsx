import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../src/contexts/AuthContext";
import { chatService, Message, Character, StartConversationResponse, ChatResponse } from "../../src/services/chatService";

export default function Index() {
  const [message, setMessage] = useState("");
  const { user, token, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock character data - in a real app, this would come from your character selection
  const mockCharacter: Character = {
    id: "mock-character-id",
    name: "Mina Seo",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/99cb9226ac87604e4ec84a80f6e923abb0665d10?width=100",
    personality: "Korean American student in New York City studying psychology. Mina is shy and introverted but harbors a kinky side that adds complexity to her personality. Mina loves painting, reading fantasy novels, and dreams of becoming a therapist.",
    description: "Korean American student in New York City studying psychology. Mina is shy and introverted but harbors a kinky side that adds complexity to her personality. Mina loves painting, reading fantasy novels, and dreams of becoming a therapist."
  };

  useEffect(() => {
    // Initialize chat with mock character when user is loaded
    if (user && !loading && !conversationId) {
      initializeChat();
    }
  }, [user, loading]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      const response: StartConversationResponse = await chatService.startConversation(mockCharacter.id);
      setConversationId(response.conversationId);
      setCurrentCharacter(response.character);
      setMessages([response.greeting]);
      
      // Load suggestions
      const suggestionsResponse = await chatService.getSuggestions(mockCharacter.id);
      setSuggestions(suggestionsResponse.suggestions);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      // Fallback to mock data
      setCurrentCharacter(mockCharacter);
      setMessages([{
        _id: 'mock-message',
        userId: 'mock-user',
        characterId: mockCharacter.id,
        content: "Oh! Sorry, I was lost in another world. I'm Mina... This corner of the library is my secret hideway.",
        role: 'assistant',
        timestamp: new Date(),
        conversationId: 'mock-conversation'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId || !currentCharacter || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      _id: `temp-${Date.now()}`,
      userId: 'current-user',
      characterId: currentCharacter.id,
      content: userMessage,
      role: 'user',
      timestamp: new Date(),
      conversationId
    };

    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response: ChatResponse = await chatService.sendMessage(
        currentCharacter.id,
        userMessage,
        conversationId
      );

      // Replace temp message with real one and add AI response
      setMessages(prev => [
        ...prev.filter(msg => msg._id !== tempUserMessage._id),
        response.userMessage,
        response.assistantMessage
      ]);

      // Update suggestions
      const suggestionsResponse = await chatService.getSuggestions(currentCharacter.id);
      setSuggestions(suggestionsResponse.suggestions);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove temp message and show error
      setMessages(prev => prev.filter(msg => msg._id !== tempUserMessage._id));
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-[1280px] h-[728px] bg-culosai-bg relative">
      {/* Navbar */}
      <Navbar user={user} tokens={user?.tokens || 0} onLogout={() => {}} />

      {/* Chat Title */}
      <div className="text-culosai-cream font-norwester text-xl font-normal leading-normal absolute left-3 top-[107px] w-[39px] h-6">
        Chat
      </div>

      {/* Main Chat Area Background */}
      <div className="w-[776px] h-[637px] bg-culosai-chat absolute left-[252px] top-[91px]"></div>

      {/* Left Sidebar Search */}
      <div className="flex w-[228px] px-3 py-2 items-center gap-2 rounded-lg bg-culosai-header absolute left-3 top-[141px] h-10">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path
            d="M21 21L15.8033 15.8033M15.8033 15.8033C17.1605 14.4461 18 12.5711 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.5711 18 14.4461 17.1605 15.8033 15.8033Z"
            stroke="#F5EDD0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="text-culosai-cream font-norwester text-xs font-normal leading-normal">
          Search for profile...
        </div>
      </div>

      {/* Left Sidebar Chat Item */}
      <div className="inline-flex px-3 py-2 justify-center items-center gap-2 rounded-[10px] border border-culosai-gray-border bg-culosai-profile absolute left-3 top-[197px] w-[228px] h-11">
        <img
          src={currentCharacter?.image || "https://cdn.builder.io/api/v1/image/assets/TEMP/9284121a98e4869ceebec58e0bb53e17a5d0c272?width=48"}
          alt=""
          className="w-6 h-6 rounded-full"
        />
        <div className="flex flex-col justify-center items-start gap-[2px]">
          <div className="text-culosai-cream font-norwester text-xs font-normal leading-normal">
            {currentCharacter?.name || "Mina Seo"}
          </div>
          <div className="text-culosai-cream-secondary font-norwester text-[10px] font-normal leading-normal">
            {messages.length > 0 ? messages[messages.length - 1].content.substring(0, 30) + "..." : "Oh! Sorry, I was lost in another world..."}
          </div>
        </div>
      </div>

      {/* Right Profile Panel */}
      <div className="flex w-[196px] flex-col items-start gap-4 absolute left-[1084px] top-[91px] h-[440px]">
        <img
          src={currentCharacter?.image || "https://cdn.builder.io/api/v1/image/assets/TEMP/3978615625ce7670de3148a1c30277945b4512b5?width=404"}
          alt=""
          className="w-[202px] h-[270px]"
        />
        <div className="flex px-4 flex-col items-start gap-6 self-stretch">
          <div className="flex flex-col items-start self-stretch">
            <div className="text-culosai-cream font-norwester text-xl font-normal leading-normal">
              {currentCharacter?.name || "Mina Seo"}
            </div>
            <div className="self-stretch text-culosai-cream font-norwester text-[10px] font-normal leading-normal">
              {currentCharacter?.description || "Korean American student in New York City studying psychology. Mina is shy and introverted but harbors a kinky side that adds complexity to her personality. Mina loves painting, reading fantasy novels, and dreams of becoming a therapist."}
            </div>
          </div>
          <div className="flex px-4 py-1 justify-center items-center gap-2 self-stretch rounded-[11px] bg-culosai-golden">
            <div className="text-culosai-brown font-norwester text-xs font-normal leading-normal">
              Generate Image
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-[831px] h-[637px] absolute left-[252px] top-[91px]">
        <div className="w-[831px] h-[637px] bg-culosai-chat absolute left-0 top-0"></div>

        {/* Chat Header */}
        <div className="flex w-[831px] flex-col items-center gap-4 absolute left-0 top-4 h-[66px]">
          <div className="flex w-[799px] justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src={currentCharacter?.image || "https://cdn.builder.io/api/v1/image/assets/TEMP/99cb9226ac87604e4ec84a80f6e923abb0665d10?width=100"}
                alt=""
                className="w-[50px] h-[50px] rounded-full"
              />
              <div className="text-culosai-cream font-norwester text-xl font-normal leading-normal">
                {currentCharacter?.name || "Mina Seo"}
              </div>
            </div>
            <svg
              width="32"
              height="24"
              viewBox="0 0 32 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[30px] h-5"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.30563 6.2636C2.71313 5.91213 3.37383 5.91213 3.78133 6.2636L9.69437 11.3636C10.1019 11.7151 10.1019 12.2849 9.69437 12.6364L3.78133 17.7364C3.37383 18.0879 2.71313 18.0879 2.30563 17.7364C1.89812 17.3849 1.89812 16.8151 2.30563 16.4636L7.48082 12L2.30563 7.5364C1.89812 7.18492 1.89812 6.61508 2.30563 6.2636Z"
                fill="#F5EDD0"
              />
              <path
                d="M30 2H7.75281M30 12H18.8764M30 22H7.75281"
                stroke="#F5EDD0"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="w-[831px] h-px bg-culosai-gray-border"></div>
        </div>

        {/* Messages Area */}
        <div className="absolute left-4 top-[105px] right-4 bottom-[200px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={msg._id} className={`flex w-full flex-col items-start gap-1 mb-4 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`w-full max-w-[615px] relative ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`inline-flex px-3 py-2 justify-center items-center gap-2 rounded-[10px] ${
                  msg.role === 'user' ? 'bg-culosai-golden' : 'bg-culosai-header'
                } max-w-[612px]`}>
                  <div className="flex flex-col justify-center items-start gap-[2px]">
                    <div className="text-culosai-cream font-norwester text-sm font-normal leading-normal">
                      {msg.content}
                    </div>
                  </div>
                </div>
                {msg.role === 'assistant' && (
                  <svg
                    width="14"
                    height="13"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-[10px] absolute left-0 top-6"
                  >
                    <path
                      d="M4.62721 2C4.7608 5.60868 0.0692672 10.4287 1.16643 11.7801C2.2636 13.1315 13.032 10.3829 13.032 10.3829L4.62721 2Z"
                      fill="#2A2A2A"
                      stroke="#2A2A2A"
                    />
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-[6px]">
                {msg.role === 'assistant' && (
                  <div className="flex w-5 h-5 px-[2px] py-1 flex-col justify-center items-center rounded-[10px] bg-culosai-voice">
                    <svg
                      width="14"
                      height="11"
                      viewBox="0 0 14 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-[10.305px]"
                    >
                      <path
                        d="M4.58496 0.00146485C4.6379 0.00150251 4.69035 0.0120621 4.73926 0.0327148C4.78829 0.0534262 4.83259 0.0842816 4.87012 0.122559C4.90761 0.160822 4.93771 0.206363 4.95801 0.256348C4.9782 0.306225 4.98828 0.35961 4.98828 0.413574V9.89404C4.98827 10.0033 4.94584 10.1078 4.87012 10.1851C4.79441 10.2623 4.69201 10.3061 4.58496 10.3062C4.47779 10.3062 4.37461 10.2624 4.29883 10.1851C4.22319 10.1078 4.18067 10.0032 4.18066 9.89404V0.413574C4.18067 0.359646 4.19077 0.306196 4.21094 0.256348C4.23121 0.206425 4.2614 0.160792 4.29883 0.122559C4.33631 0.0843314 4.38073 0.0534244 4.42969 0.0327148C4.47872 0.0120034 4.53189 0.0014563 4.58496 0.00146485Z"
                        fill="#F5EDD0"
                      />
                    </svg>
                  </div>
                )}
                <div className="text-culosai-cream font-norwester text-[10px] font-normal leading-normal">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full flex-col items-start gap-1 mb-4">
              <div className="w-full max-w-[615px] relative">
                <div className="inline-flex px-3 py-2 justify-center items-center gap-2 rounded-[10px] bg-culosai-header max-w-[612px]">
                  <div className="flex flex-col justify-center items-start gap-[2px]">
                    <div className="text-culosai-cream font-norwester text-sm font-normal leading-normal">
                      {currentCharacter?.name || "Mina"} is typing...
                    </div>
                  </div>
                </div>
                <svg
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-[10px] absolute left-0 top-6"
                >
                  <path
                    d="M4.62721 2C4.7608 5.60868 0.0692672 10.4287 1.16643 11.7801C2.2636 13.1315 13.032 10.3829 13.032 10.3829L4.62721 2Z"
                    fill="#2A2A2A"
                    stroke="#2A2A2A"
                  />
                </svg>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex w-[804px] flex-col items-start gap-2 absolute left-4 top-[554px] h-[66px]">
          <div className="flex items-center gap-2">
            <div className="text-culosai-cream font-norwester text-xs font-normal leading-normal">
              Suggestion:
            </div>
            {suggestions.length > 0 && (
              <div 
                className="flex px-3 py-1 items-center rounded-[13px] bg-culosai-suggestion cursor-pointer hover:bg-opacity-80"
                onClick={() => handleSuggestionClick(suggestions[0])}
              >
                <div className="text-culosai-golden font-norwester text-xs font-normal leading-normal">
                  {suggestions[0]}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-1 self-stretch">
            <div className="flex w-[767px] px-3 py-2 justify-between items-center rounded-[10px] bg-culosai-header">
              <div className="flex flex-col justify-center items-start gap-[2px] flex-1">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write a message..."
                  disabled={isLoading}
                  className="bg-transparent text-culosai-cream placeholder-gray-500 font-norwester text-sm font-normal leading-normal outline-none border-none w-full"
                />
              </div>
              <div className="flex px-2 py-[2px] items-center gap-[2px] rounded bg-culosai-gray-border">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[14px] h-[14px]"
                >
                  <path
                    d="M6.8532 4.22917C6.8532 4.47417 6.98737 4.69583 7.20612 4.80667L8.08404 5.25292C8.36987 5.39875 8.60029 5.62917 8.74612 5.915L9.19237 6.79292C9.3032 7.01167 9.52487 7.14583 9.76987 7.14583C10.0149 7.14583 10.2365 7.01167 10.3474 6.79292L10.7936 5.915C10.9395 5.62917 11.1699 5.39875 11.4557 5.25292L12.3336 4.80667C12.5524 4.69583 12.6865 4.47417 12.6865 4.22917C12.6865 3.98417 12.5524 3.7625 12.3336 3.65167L11.4557 3.20542C11.1699 3.05958 10.9395 2.82917 10.7936 2.54333L10.3474 1.66542C10.2365 1.44667 10.0149 1.3125 9.76987 1.3125C9.52487 1.3125 9.3032 1.44667 9.19237 1.66542L8.74612 2.54333C8.60029 2.82917 8.36987 3.05958 8.08404 3.20542L7.20612 3.65167C6.98737 3.7625 6.8532 3.98417 6.8532 4.22917Z"
                    fill="#F5EDD0"
                  />
                </svg>
                <div className="text-culosai-cream font-norwester text-[10px] font-normal leading-normal">
                  Ask
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.21967 6.21967C4.51256 5.92678 4.98744 5.92678 5.28033 6.21967L8 8.93934L10.7197 6.21967C11.0126 5.92678 11.4874 5.92678 11.7803 6.21967C12.0732 6.51256 12.0732 6.98744 11.7803 7.28033L8.53033 10.5303C8.23744 10.8232 7.76256 10.8232 7.46967 10.5303L4.21967 7.28033C3.92678 6.98744 3.92678 6.51256 4.21967 6.21967Z"
                    fill="#F5EDD0"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              className="flex w-[33px] h-[33px] px-[2px] py-1 flex-col justify-center items-center rounded-[23px] bg-culosai-send disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-80"
            >
              <svg
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 transform -rotate-30"
              >
                <g clipPath="url(#clip0_66_7276)">
                  <path
                    d="M2.41109 6.97524C2.27723 7.00812 2.1722 7.11179 2.13758 7.24522C2.10295 7.37864 2.14432 7.5203 2.2453 7.61413L5.27473 10.429L8.96215 8.30005C9.14151 8.19649 9.37086 8.25795 9.47441 8.43731C9.57797 8.61667 9.51651 8.84601 9.33715 8.94957L5.64973 11.0785L6.57272 15.1094C6.60349 15.2437 6.70549 15.3504 6.83835 15.3871C6.97121 15.4238 7.11351 15.3847 7.20892 15.2852C9.623 12.7679 11.5496 9.88426 12.9492 6.78257C12.9989 6.67255 12.9925 6.54536 12.9322 6.44083C12.8718 6.3363 12.7648 6.26721 12.6447 6.2552C9.2588 5.91647 5.79815 6.14319 2.41109 6.97524Z"
                    fill="#F0C884"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_66_7276">
                    <rect
                      width="12"
                      height="12"
                      fill="white"
                      transform="translate(0.304688 6.80371) rotate(-30)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
