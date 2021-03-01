import * as React from 'react';

const ToggleButton = () => {
    const [theme, setTheme] = React.useState('light')
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    React.useEffect(() => {
        document.body.dataset.theme = theme
    }, [theme])

    return (
        <div className="theme-switch-wrapper">
            <em className="theme-switch-text">Switch to <b>{nextTheme}</b></em>
            <label className="theme-switch" htmlFor="checkbox">
                <input type="checkbox" id="checkbox" onChange={() => setTheme(nextTheme)} />
                <div className="slider round"/>
            </label>
        </div>
    );
}

export default ToggleButton;
