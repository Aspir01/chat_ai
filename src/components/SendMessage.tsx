import { useState, KeyboardEvent, useEffect, useCallback } from "react";
import style from "./SendMessage.module.css"

interface SendMessageProps {
    onSend: (message: string) => void;
    onReceive: (message: string) => void;
}

const SendMessage: React.FC<SendMessageProps> = ({ onSend, onReceive }) => {

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = useCallback((event: Event) => {
        if (event.target instanceof HTMLInputElement && event.target.files && event.target.files.length) {
            setSelectedFile(event.target.files[0]);
        }
    }, []);

    const handleFileUploadIconClick = () => {
        const hiddenFileInput = document.createElement('input');
        hiddenFileInput.type = 'file';
        hiddenFileInput.click();
        hiddenFileInput.addEventListener('change', handleFileChange);
    };


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && message.trim()) {
            sendMessage(message);
        }
    };

    const handleButtonClick = () => {
        if (message.trim()) {
            sendMessage(message);
        }
    };

    const sendMessage = async (message: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch("https://opossum-accurate-chipmunk.ngrok-free.app/api/llm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`,
                },
                body: JSON.stringify({ question: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            onSend(message);
            const data = await response.json();
            console.log(data)
            onReceive(data.answer);
            setMessage("")
        } catch (error) {
            setError("Ошибка при отправке сообщения")
            console.error("Ошибка при отправке сообщения:", error);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="container">
            <div className={style.main}>

                <svg onClick={handleFileUploadIconClick} width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.7077 9.72178C20.4282 9.01985 21.2852 8.46224 22.2295 8.08097C23.1739 7.69969 24.1869 7.50226 25.2105 7.50002C26.2341 7.49778 27.248 7.69076 28.1941 8.06789C29.1403 8.44503 29.9999 8.99888 30.7237 9.69764C31.4475 10.3964 32.0211 11.2263 32.4118 12.1397C32.8024 13.0531 33.0023 14.032 33 15.0202C32.9977 16.0084 32.7932 16.9865 32.3982 17.8982C32.0033 18.8098 31.4257 19.6372 30.6987 20.3328L18.3827 32.2231C17.4946 33.0516 16.305 33.5101 15.0701 33.4998C13.8352 33.4896 12.6539 33.0114 11.7807 32.1683C10.9075 31.3252 10.4124 30.1846 10.402 28.9924C10.3915 27.8002 10.8666 26.6518 11.7249 25.7945L22.6639 15.2337C22.8455 15.0643 23.0888 14.9706 23.3412 14.9728C23.5937 14.9749 23.8352 15.0726 24.0138 15.245C24.1923 15.4174 24.2936 15.6505 24.2958 15.8943C24.298 16.138 24.2009 16.3729 24.0255 16.5482L13.0865 27.109C12.5844 27.6166 12.3079 28.2937 12.3163 28.9955C12.3246 29.6974 12.6171 30.3682 13.1312 30.8645C13.6453 31.3608 14.3401 31.6432 15.067 31.6512C15.794 31.6593 16.4954 31.3924 17.0211 30.9076L29.3371 19.0174C29.8858 18.4945 30.322 17.8721 30.6206 17.1858C30.9192 16.4995 31.0742 15.763 31.0767 15.0187C31.0792 14.2744 30.9292 13.5369 30.6353 12.8488C30.3414 12.1607 29.9094 11.5355 29.3642 11.0092C28.819 10.4829 28.1714 10.0659 27.4586 9.78224C26.7458 9.49858 25.9819 9.35385 25.2109 9.35637C24.4399 9.35889 23.6771 9.50862 22.9663 9.79694C22.2555 10.0853 21.6108 10.5065 21.0693 11.0363L7.65557 23.9863C7.56674 24.0751 7.46048 24.146 7.343 24.1947C7.22552 24.2434 7.09916 24.2691 6.97131 24.2701C6.84345 24.2712 6.71665 24.2477 6.59831 24.2009C6.47996 24.1542 6.37245 24.0852 6.28204 23.9979C6.19163 23.9106 6.12012 23.8068 6.07171 23.6925C6.02329 23.5783 5.99893 23.4559 6.00004 23.3324C6.00115 23.209 6.02771 23.087 6.07818 22.9736C6.12864 22.8602 6.202 22.7576 6.29397 22.6718L19.7077 9.72178Z" fill="#C1C1C1" />
                </svg>

                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Напишите ваш запрос" />
                {isLoading && <div className={style.error}>Загрузка...</div>}

                {error && <div className={style.error}>{error}</div>}

                <svg className={style.send} onClick={handleButtonClick} width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 20.4999C6 20.2062 6.11494 19.9244 6.31952 19.7167C6.52411 19.509 6.80159 19.3923 7.09092 19.3923L30.2438 19.3923L21.235 10.3982C21.1328 10.2962 21.0514 10.1747 20.9955 10.0407C20.9395 9.90679 20.9101 9.76295 20.9088 9.61744C20.9076 9.47194 20.9347 9.32761 20.9884 9.19271C21.0421 9.05781 21.1215 8.93497 21.2219 8.83121C21.3224 8.72745 21.442 8.6448 21.574 8.58798C21.7059 8.53116 21.8476 8.50127 21.9909 8.50004C22.2803 8.49755 22.5588 8.61189 22.7652 8.81792L33.6722 19.7083L33.6867 19.7231C33.7887 19.8283 33.8689 19.9532 33.9227 20.0903C33.9764 20.2274 34.0026 20.3741 33.9998 20.5216C33.9969 20.6692 33.9651 20.8147 33.9061 20.9495C33.8471 21.0844 33.7621 21.206 33.6562 21.3071L22.7652 32.182C22.6631 32.284 22.5421 32.3646 22.4093 32.4191C22.2765 32.4737 22.1344 32.5012 21.9911 32.5C21.8478 32.4988 21.7062 32.4689 21.5743 32.4121C21.4424 32.3554 21.3228 32.2728 21.2223 32.1691C21.1218 32.0653 21.0424 31.9425 20.9887 31.8077C20.935 31.6728 20.9079 31.5286 20.9091 31.3831C20.9103 31.2376 20.9397 31.0938 20.9956 30.9599C21.0515 30.8259 21.1329 30.7045 21.235 30.6025L30.2438 21.6076L7.09092 21.6076C6.80159 21.6076 6.52411 21.4909 6.31952 21.2832C6.11494 21.0754 6 20.7937 6 20.4999Z" fill="#C5C5C5" />
                </svg>
            </div>
            {selectedFile && (
                <p className={style.file}>Выбранный файл: <span>{selectedFile.name}</span></p>
            )}
        </div>
    )
}

export default SendMessage