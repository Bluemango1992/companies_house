import React from 'react'
import './Button.css'

function Button({ children , onClick }) {
    return (
        <div className='button'>
                <button onClick={onClick}>{children}</button>
        </div>
    )
}

export default Button