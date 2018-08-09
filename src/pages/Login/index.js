import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './index.css';

const FormItem = Form.Item;

class Login extends Component {
    constructor (props) {
			super(props)
      this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(e) {
      e.preventDefault()
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    }
    render () {
			const { getFieldDecorator } = this.props.form;
			return (
				<Form onSubmit={this.handleSubmit} className="login-form">
					<FormItem>
						{getFieldDecorator('userName', {
							rules: [{ required: true, message: '请输入用户名!' }],
						})(
							<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: '请输入密码!' }],
						})(
							<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('remember', {
							valuePropName: 'checked',
							initialValue: true,
						})(
							<Checkbox>Remember me</Checkbox>
						)}
						<a className="login-form-forgot" href="">忘记密码</a>
						<Button type="primary" htmlType="submit" className="login-form-button">
							登录
						</Button>
						Or <a href="">现在注册!</a>
					</FormItem>
				</Form>
			)
    }
}
export default Login