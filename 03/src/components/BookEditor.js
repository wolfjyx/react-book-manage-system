import React from 'react'
import formProvider from '../utils/formProvider'
import FormItem from '../utils/FormItem'
import AutoComplete from './AutoComplete'

class BookEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            recommendUsers: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount () {
        const {editTarget, setFormValues} = this.props
        if  (editTarget) {
            setFormValues(editTarget)
        }
    }

    handleSubmit (e) {
        e.preventDefault()
        console.log(this.props)
        const {form: {name, price, owner_id}, formValid, editTarget} = this.props;
        if (!formValid) {
            alert('请填写正确的信息后重试');
            return;
        }

        let editType = '添加'
        let apiUrl = 'http://localhost:3000/book'
        let method = 'POST'
        if  (editTarget) {
            editType = '编辑'
            apiUrl += '/' + editTarget.id
            method = 'PUT'
        }
        fetch(apiUrl,{
            method,
            body: JSON.stringify({
                name: name.value,
                price: price.value,
                owner_id: owner_id.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
            .then((res) => {
                if(res.id) {
                    // alert('add success')
                    console.log(editType + '图书成功')
                    this.context.router.history.push('/book/list');
                } else {
                    alert('add book fail');
                }
            })
            .catch((err) => console.error(err))
    }
    getRecommendUsers (partialUserId) {
        fetch('/api/user?id_like=' + partialUserId)
            .then((res) => res.json())
            .then((res) => {
                if (res.length === 1 && res[0].id === partialUserId) {
                    return;
                }
                this.setState({
                    recommendUsers: res.map((user) => {
                        return {
                            text: `${user.id}（${user.name}）`,
                            value: user.id
                        };
                    })
                });
            });
    }

    timer = 0;
    handleOwnerIdChange (value) {
        this.props.onFormChange('owner_id', value);
        this.setState({recommendUsers: []});
        if (this.timer) {
            clearTimeout(this.timer);
        }

        if (value) {
            this.timer = setTimeout(() => {
                this.getRecommendUsers(value);
                this.timer = 0;
            }, 200);
        }
    }

    render() {
        const  {recommendUsers} = this.state
        const {form: {name, price, owner_id},onFormChange} = this.props;
        return (
            <form onSubmit={(e) => this.handleSubmit(e)}>
                <FormItem label="书名：" valid={name.valid} error={name.error}>
                    <input type="text" value={name.value} onChange={(e) => onFormChange('name', e.target.value)}
                    />
                </FormItem>
                <FormItem label="价格：" valid={price.valid} error={price.error}>
                    <input type="number" value={price.value || ''} onChange={(e) => onFormChange('price', +e.target.value)}
                    />
                </FormItem>
                <FormItem label="所有者：" valid={owner_id.valid} error={owner_id.error}>
                    {/*<input type="number" value={owner_id.value || ''} onChange={e => onFormChange('owner_id', +e.target.value)}/>*/}
                    <AutoComplete
                        value={owner_id.value ? owner_id.value + '' : ''}
                        options={recommendUsers}
                        onValueChange={value => this.handleOwnerIdChange(value)}
                    />
                </FormItem>
                <br/>
                <input type="submit" value="提交"/>
            </form>
        )
    }
}

BookEditor.contextTypes = {
    router: React.PropTypes.object.isRequired
};

BookEditor = formProvider({
    name: {
        defaultValue: '',
        rules: [
            {
                pattern (value) {
                    return value.length > 0;
                },
                error: '请输入书名'
            }
        ]
    },
    price: {
        defaultValue: 0,
        rules: [
            {
                pattern: /^\d+$/,
                error: '请输入一个整数'
            },
            {
                pattern (value) {
                    return value > 0;
                },
                error: '价格必须大于0'
            }
        ]
    },
    owner_id: {
        defaultValue: 0,
        rules: [
            {
                pattern: /^\d+$/,
                error: '请输入合法的用户ID'
            },
            {
                pattern (value) {
                    return value !== 0;
                },
                error: '请输入用户ID'
            }
        ]
    }
})(BookEditor)

export default BookEditor
