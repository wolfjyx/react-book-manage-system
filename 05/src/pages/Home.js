import React from 'react'
// import { Link } from 'react-router-dom'
// import HomeLayout from '../layouts/HomeLayout'
import style from '../styles/home-page.less'

class Home extends React.Component {
    render() {
        return (
            <div className={style.welcome}>
                Welcome
            </div>
        )
    }
}

export default Home;