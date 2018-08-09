import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

const Login = () => import('./../pages/Login')
const Home = () => import('./../pages/Home')
const Mine = () => import('./../pages/Mine')
const About = () => import('./../pages/About')

export default () => {
  return (
    <Switch>
			<Route exact path="/" component={Home}/>
			<Route path="/login" component={Login}/>
			<Route path="/mine" component={Mine}/>
			<Route path="/about" component={About}/>
			<Redirect path="*" to="/" />
		</Switch>
  )
}

