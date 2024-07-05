import { useEffect, useState } from 'react';
import Header from './components/Header';
import Chat from './components/Chat';
import SendMessage from './components/SendMessage';

function App() {

  interface Chats {
    isUser: boolean,
    text: string
  }

  const [chats, setChats] = useState<Chats[]>([])
  const [dark, setDark] = useState<boolean>(false)

  useEffect(() => {
    const storedChats = localStorage.getItem("chats");
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const addMessage = (message: string) => {
    setChats(prevChats => {
      const newChats = [...prevChats, { isUser: true, text: message }];
      localStorage.setItem("chats", JSON.stringify(newChats));
      return newChats;
    });
  };

  const onReceive = (message: string) => {
    setChats(prevChats => [...prevChats, { isUser: false, text: message }]);
  };
  return (
    <div style={{ background: dark ? "#393939" : "white" }} className="App">
      <Header dark={dark} setDark={setDark} />
      <Chat chats={chats} />
      <SendMessage onSend={addMessage} onReceive={onReceive} />
    </div>
  );
}

export default App;
