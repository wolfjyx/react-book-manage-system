import  React from 'react'
import HomeLayout from '../layouts/HomeLayout'
import BookEditor from '../components/BookEditor'
import {get} from '../utils/request'

class BookEdit extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            user: null
        }
    }
    componentWillMount () {
        console.log(this.context.router)
        const bookId = this.context.router.route.match.params.id
        get(this.context, '/api/book/' + bookId)
            .then(res => {
                this.setState({
                    book: res
                })
            })
            .catch(err => console.log(err))
    }

    render () {
        const {book} = this.state
        return book ? <BookEditor editTarget={book}/> : <span>加载中...</span>
    }
}

BookEdit.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default BookEdit