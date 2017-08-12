import  React from 'react'
import HomeLayout from '../layouts/HomeLayout'
import UserEditor from '../components/UserEditor'
import {get} from '../utils/request'

class UserEdit extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            user: null
        }
    }
    componentWillMount () {
        console.log(this.context.router)
        const userId = this.context.router.route.match.params.id
        get(this.context, '/api/user/' + userId)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    user: res
                })
            })
            .catch(err => console.log(err))
    }

    render () {
        const {user} = this.state
        return (
            <HomeLayout title="编辑用户">
                {
                    user ? <UserEditor editTarget = {user}/> : '加载中'
                }
            </HomeLayout>
        )
    }
}

UserEdit.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default UserEdit