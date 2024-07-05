import axios from "axios"
import style from "./Chat.module.css"

interface Props {
    chats: {
        isUser: boolean,
        text: string
    }[]
}

const Chat: React.FC<Props> = ({ chats }) => {
    return (
        <div className="container">
            <div className={style.main}>
                {chats.map((chat, i: number) => {
                    return <div className={chat.isUser ? style.block2 : style.block} key={i}>
                        <img src={chat.isUser ? 'Icon Human.png' : 'logo.png'} alt="аватарка" />
                        <p>{chat.text}</p>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Chat