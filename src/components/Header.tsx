import style from "./Header.module.css"

interface Props {
    dark: boolean,
    setDark: (value: boolean) => void
}

const Header: React.FC<Props> = ({ dark, setDark }) => {
    return (
        <div className="container">
            <div className={style.main}>
                <div className={style.logo}>
                    <img src="logo.png" alt="лого" />
                    <h4>RuStore <br />Helper</h4>
                    <p>Чем я могу помочь? <br />Опишите вашу проблему</p>
                </div>
                <div className={style.mode}>
                    <p>Тема сайта</p>
                    <div className="checkbox-wrapper-59">
                        <label className="switch"><input type="checkbox" onClick={() => setDark(!dark)} /><span className="slider" ></span></label></div>
                </div>
            </div>
        </div>
    )
}

export default Header