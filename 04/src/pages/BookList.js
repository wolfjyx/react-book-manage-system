import React from 'react';
import HomeLayout from '../layouts/HomeLayout';
import {get, del} from '../utils/request'

class BookList extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            bookList: []
        }
    }
    componentWillMount () {
        get(this.context, '/api/book')
            .then(res => res.json())
            .then(res => {
                this.setState({
                    bookList: res
                })
            })
            .catch(err => console.log(err))
    }
    handleEdit (book) {
        this.context.router.history.push('/book/edit/' + book.id)
    }
    handleDel (book) {
        const confirmed = confirm(`确定要删除图书 ${book.name} 吗？`)
        if (confirmed) {
            del(this.context, '/api/book' + book.id)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        bookList: this.state.bookList.filter(item => item.id !== book.id)
                    })
                })
                .catch(err => {
                    console.error(err);
                    alert('删除图书失败');
                })
        }
    }
    render () {
        const {bookList} = this.state
        return (
            <HomeLayout title="图书列表">
                <table>
                    <thead>
                        <tr>
                            <th>图书ID</th>
                            <th>书名</th>
                            <th>价格</th>
                            <th>所有者</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        bookList.map((book) => {
                            return (
                                <tr key={book.id}>
                                    <td>{book.id}</td>
                                    <td>{book.name}</td>
                                    <td>{book.price}</td>
                                    <td>{book.owner_id}</td>
                                    <td>
                                        <a href="javascript:;" onClick={() => this.handleEdit(book)}>编辑</a>
                                        &nbsp;
                                        <a href="javascript:;" onClick={() => this.handleDel(book)}>删除</a>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </HomeLayout>
        )
    }
}


BookList.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default BookList;