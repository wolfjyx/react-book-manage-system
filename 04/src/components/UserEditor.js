import React from 'react'
import formProvider from '../utils/formProvider'
import FormItem from './FormItem'
import request, {get} from '../utils/request'


class UserEditor extends React.Component {
    componentWillMount () {
        const {editTarget, setFormValues} = this.props
        if  (editTarget) {
           setFormValues(editTarget)
        }
    }
    handleSubmit (e) {
        e.preventDefault()
        console.log(this.props)
        const {form: {name, age, gender}, formValid, editTarget} = this.props;
        if (!formValid) {
            alert('请填写正确的信息后重试');
            return;
        }

        let editType = '添加'
        let apiUrl = 'http://localhost:3000/user'
        let method = 'POST'
        if  (editTarget) {
            editType = '编辑'
            apiUrl += '/' + editTarget.id
            method = 'PUT'
        }
        request(this.context, apiUrl,{
            method,
            body: JSON.stringify({
                name:name.value,
                age: age.value,
                gender: gender.value
            }),
        }).then((res) => res.json())
            .then((res) => {
                if(res.id) {
                    // alert('add success')
                    console.log(editType + '用户成功')
                    this.context.router.history.push('/user/list');
                } else {
                    alert('add user fail');
                }
            })
            .catch((err) => console.error(err))
    }
    render() {
        const {form: {name, age, gender},onFormChange} = this.props;
        return (
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormItem label="用户名：" valid={name.valid} error={name.error}>
                        <input type="text" value={name.value} onChange={(e) => onFormChange('name', e.target.value)}
                        />
                    </FormItem>
                    <FormItem label="年龄：" valid={age.valid} error={age.error}>
                        <input type="number" value={age.value || ''} onChange={(e) => onFormChange('age', +e.target.value)}
                        />
                    </FormItem>
                    <FormItem label="性别：" valid={gender.valid} error={gender.error}>
                        <select value={gender.value} onChange={(e) => onFormChange('gender', e.target.value)}>
                            <option value="">请选择</option>
                            <option value="male">男</option>
                            <option value="female">女</option>
                        </select>
                    </FormItem>
                    <br/>
                    <input type="submit" value="提交"/>
                </form>
        )
    }
}

UserEditor.contextTypes = {
    router: React.PropTypes.object.isRequired
};

UserEditor = formProvider({
    name: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value.length > 0;
                },
                error: '请输入用户名'
            },
            {
                pattern: /^.{1,4}$/,
                error: '用户名最多4个字符'
            }
        ]
    },
    age: {
        defaultValue: 0,
        rules: [
            {
                pattern: function (value) {
                    return value >= 1 && value <= 100;
                },
                error: '请输入1~100的年龄'
            }
        ]
    },
    gender: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return !!value;
                },
                error: '请选择性别'
            }
        ]
    }
})(UserEditor)

export default UserEditor