import React, {Component} from 'react';
import './Header.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import {withStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import { Link } from 'react-router-dom';
import FastFood from '@material-ui/icons/Fastfood';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Snackbar from '@material-ui/core/Snackbar';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const TabContainer = function(props) {
  return (<Typography component="div" style={{
      padding: 0,
      textAlign: 'center'
    }}>
    {props.children}
  </Typography>)
}

const styles = theme => ({
  tabContainer:{
    display:'flex',
    flexDirection:'column',
  },
  toolbar: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  search: {
    position: 'relative',
    borderRadius: '4px',
    backgroundColor: '#263238',
    marginLeft: 0,
    width:null
  },
  searchIcon: {
    width: theme.spacing.unit * 4,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color:'#ffffff'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 4,
    transition: theme.transitions.create('width'),
    width: '100%',
    color:'#ffffff'
  },
  avatar: {
    height:20,
    width:20,
    marginRight:10
  },
  appHeader:{
    backgroundColor:'#263238'
  },
  hr:{
    height:'1.5px',
    backgroundColor:'#f2f2f2',
    marginLeft:'5px',
    marginRight:'5px'
  },
  button: {
    height:30
  },
})

class Header extends Component{

  constructor(props){
    super(props);
    this.state = {
      anchorEl: null,
      isOpenModel: false,
      value: 0,
      username: "",
      usernameTintVisible: "dispNone",
      password: "",
      passwordTintVisisble: "dispNone",
      firstname: "",
      firstnameRequired: "dispNone",
      lastname: "",
      lastnameRequired: "dispNone",
      email: "",
      emailRequired: "dispNone",
      emailErrorMsg:"",
      registerPassword: "",
      registerPasswordRequired: "dispNone",
      registerPasswordErrorMsg:"",
      contact: "",
      contactRequired: "dispNone",
      contactErrorMsg:"",
      signupFailMsg:"",
      signupFailMsgRequired:"dispNone",
      isSnackVisible:false,
      snackMsg:"",
      loginFailMsgRequired:"dispNone",
      loginFailMsg:"",
      userNameErrorMsg:""
    };
  }

  showModal = () =>{
    this.setState({isOpenModel: true});
  }

  closeModel = () => {
    this.setState({isOpenModel: false, usernameTintVisible: "dispNone", passwordTintVisisble: "dispNone", value: 0});
  }

  handleChange = (event, value) => {
    this.setState({value: value});
  }

  loginClickHandler = () => {
    let validated = true;

    if (this.state.username === "") {
      this.setState({
        userNameErrorMsg:"required",
        usernameTintVisible: "dispBlock"
      })
      validated = false;
    }else {
      if (!this.validateContactNo(this.state.username)) {
        this.setState({
          userNameErrorMsg:"Invalid Contact",
          usernameTintVisible: "dispBlock"
        })
        validated = false;;
      }else {
        this.setState({usernameTintVisible: "dispNone"})
      }
    }

    if (this.state.password === "") {
      this.setState({passwordTintVisisble: "dispBlock"})
      validated = false;;
    }else {
      this.setState({passwordTintVisisble: "dispNone"})
    }
    if (validated) {
      this.doLoginApiCall();
    }
  }

  doLoginApiCall = () =>{
    let that = this;
    let username = this.state.username;
    let password = this.state.password;
    let url = `http://localhost:8080/api/user/login?contactNumber=${username}&password=${password}`;
    return fetch(url,{
      method:'POST',
    }).then((response) =>{
      console.log('response', response);
      if (response.ok) {
        sessionStorage.setItem("accessToken",response.headers.get("access-token"));
        return response.json();
      }else {
        that.loginFail();
      }
      return response.text();
    }).then((msg)=>{
      console.log('message',msg);
      that.loginSuccess(msg)
      that.setState({
        loginFailMsg:msg
      });
    }).catch((error) => {
      console.log('error login data',error);
    });
  }

  loginSuccess = (response) =>{
    this.closeModel();
    this.showSncakBar();
    this.setState({
      snackMsg:"Logged in successfully!",
      loginFailMsgRequired:"dispNone"
    })
    sessionStorage.setItem("loggedIn", true);
    sessionStorage.setItem("username",response.firstName);
  }

  loginFail = () => {
    this.setState({
      loginFailMsgRequired:"dispBlock"
    })
  }

  usernameChangeHandler = (e) => {
    this.setState({
      username: e.target.value,
      usernameTintVisible: "dispNone"
    });
  }

  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
      passwordTintVisisble:"dispNone"
    });
  }

  firstnameChangeHandler = (e) => {
    this.setState({
      firstname: e.target.value,
      firstnameRequired:"dispNone"
    });
  }

  lastnameChangeHandler = (e) => {
    this.setState({
      lastname: e.target.value,
      lastnameRequired:"dispNone"
    });
  }

  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
      emailRequired:"dispNone"
    });
  }

  registerPasswordChangeHandler = (e) => {
    this.setState({
      registerPassword: e.target.value,
      registerPasswordRequired:"dispNone"
    });
  }

  contactChangeHandler = (e) => {
    this.setState({
      contact: e.target.value,
      contactRequired:"dispNone"
    });
  }

  registerClickHandler = () => {
    let validated = true;
    if (this.state.firstname === "") {
      this.setState({firstnameRequired: "dispBlock"});
      validated = false;
    }else {
      this.setState({firstnameRequired: "dispNone"})
    }

    if (this.state.email === "") {
      this.setState({
        emailRequired: "dispBlock",
        emailErrorMsg:"required"
      })
      validated = false;
    }else {
      if (!this.validateEmail(this.state.email)) {
        this.setState({
          emailRequired:"dispBlock",
          emailErrorMsg:"Invalid Email"
        })
        validated = false;
      }else {
        this.setState({emailRequired: "dispNone"})
      }
    }

    if (this.state.registerPassword === "") {
      this.setState({
        registerPasswordRequired: "dispBlock",
        registerPasswordErrorMsg:"required"
      })
      validated = false;
    }else {
      if (!this.validatePassword(this.state.registerPassword)) {
        this.setState({
          registerPasswordRequired: "dispBlock",
          registerPasswordErrorMsg:"Password must contain at least one capital letter, one small letter, one number, and one special character"
        })
        validated = false;
      }else {
        this.setState({registerPasswordRequired: "dispNone"})
      }
    }

    if (this.state.contact === "") {
      this.setState({
        contactRequired: "dispBlock",
        contactErrorMsg:"required"
      })
      validated = false;
    }else {
      if (!this.validateContactNo(this.state.contact)) {
        this.setState({
          contactRequired: "dispBlock",
          contactErrorMsg:"Contact No. must contain only numbers and must be 10 digits long"
        })
        validated = false;
      }else {
        this.setState({
          contactRequired: "dispNone"
        })
      }
    }
    if (validated) {
      this.doRegisterApiCall();
    }
  }

  doRegisterApiCall = () => {
    let that = this;
    let firstName = this.state.firstname;
    let lastname = this.state.lastname;
    let email = this.state.email;
    let contactNumber = this.state.contact;
    let password = this.state.registerPassword;
    let url = `http://localhost:8080/api/user/signup?firstName=${firstName}&lastName=${lastname}&email=${email}&contactNumber=${contactNumber}&password=${password}`;
    return fetch(url,{
      method:'POST',
    }).then((response) =>{
      console.log('response', response);
      // return response.text();
      if (response.ok) {
        that.signUpSuccess();
      }else {
        that.signUpFail();
      }
      return response.text();
    }).then((msg)=>{
      that.setState({
        signupFailMsg:msg
      });
    }).catch((error) => {
      console.log('error register data',error);
    });
  }

  signUpSuccess = () => {
    this.setState({
      value:0,
      signupFailMsgRequired:"dispNone",
      snackMsg:"Registered successfully! Please login now!"
    });
    this.showSncakBar();
  }

  signUpFail = () => {
    this.setState({
      signupFailMsgRequired:"dispBlock"
    });
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validatePassword = (password) => {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  }

  validateContactNo = (number) => {
    var re = /^\d{10}$/;
    return re.test(number);
  }

  render(){
    const {classes,screen} = this.props;
    let isUserLoggedIn = sessionStorage.getItem("loggedIn");
    return (<div>
        <AppBar className={classes.appHeader}>
          <Toolbar className={classes.toolbar}>
            <FastFood/>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase onChange={(e)=>{this.props.searchHandler(e.target.value)}} placeholder="Search by Restaurant Name..." classes={{input: classes.inputInput}}/>
              </div>
              {!isUserLoggedIn &&
                <Button variant="contained" className={classes.button} color="default" onClick={this.showModal}>
                  <Avatar className={classes.avatar}> <AccountCircle/></Avatar>
                  Login
                </Button>
              }
              {isUserLoggedIn &&
                <div>
                  <IconButton onClick={this.handleClick}>
                    <Avatar className={classes.avatar}>
                      <AccountCircle/>
                    </Avatar>
                    <span style={{color:"white",fontSize:12}}>{sessionStorage.getItem("username")}</span>
                  </IconButton>
                  <Popover
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}>
                      <div style={{padding:'5px'}}>
                        <MenuItem onClick={this.handleAccount}>My Account</MenuItem>
                        <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                      </div>
                  </Popover>
                </div>
              }
              <Modal isOpen={this.state.isOpenModel} onRequestClose={this.closeModel} ariaHideApp={false} contentLabel="login" shouldCloseOnOverlayClick={false} style={customStyles}>
                <Tabs className="tabs" value={this.state.value} onChange={this.handleChange}>
                  <Tab label="Login"/>
                  <Tab label="Signup"/>
                </Tabs>
                {
                  this.state.value === 0 &&
                  <TabContainer>
                    <div className={classes.tabContainer}>
                      <FormControl>
                        <InputLabel htmlFor="username">Contact No. *</InputLabel>
                        <Input id="username" type="text" username={this.state.username} onChange={this.usernameChangeHandler}/>
                        <FormHelperText className={this.state.usernameTintVisible}>
                          <span className="red">{this.state.userNameErrorMsg}</span>
                        </FormHelperText>
                      </FormControl><br/><br/>
                      <FormControl>
                        <InputLabel htmlFor="password">Password *</InputLabel>
                        <Input id="password" type="password" password={this.state.password} onChange={this.passwordChangeHandler}/>
                        <FormHelperText className={this.state.passwordTintVisisble}>
                          <span className="red">required</span>
                        </FormHelperText>
                      </FormControl><br/><br/>
                      <Button onClick={this.loginClickHandler} variant="contained" color="primary">Login</Button>
                      <div className={this.state.loginFailMsgRequired}><span className="red">{this.state.loginFailMsg}</span></div>
                      </div>
                    </TabContainer>
                }
                {
                  this.state.value === 1 &&
                  <TabContainer className={classes.tabContainer}>
                    <div className={classes.tabContainer}>
                      <FormControl>
                        <InputLabel htmlFor="firstname">First Name*</InputLabel>
                        <Input id="firstname" type="text" username={this.state.firstname} onChange={this.firstnameChangeHandler}/>
                        <FormHelperText className={this.state.firstnameRequired}>
                          <span className="red">required</span>
                        </FormHelperText>
                      </FormControl><br/><br/>
                      <FormControl>
                        <InputLabel htmlFor="Lastname">Last Name</InputLabel>
                        <Input id="lastname" type="text" username={this.state.lastname} onChange={this.lastnameChangeHandler}/>
                        <FormHelperText className={this.state.lastnameRequired}>
                          <span className="red">required</span>
                        </FormHelperText>
                      </FormControl><br/><br/>
                      <FormControl>
                        <InputLabel htmlFor="email">Email*</InputLabel>
                        <Input id="email" type="email" username={this.state.email} onChange={this.emailChangeHandler}/>
                        <FormHelperText className={this.state.emailRequired}>
                          <span className="red">{this.state.emailErrorMsg}</span>
                        </FormHelperText>
                      </FormControl><br/><br/>
                      <FormControl>
                        <InputLabel htmlFor="register_password">Password*</InputLabel>
                        <Input id="register_password" type="password" username={this.state.registerPassword} onChange={this.registerPasswordChangeHandler}/>
                        <FormHelperText className={this.state.registerPasswordRequired}>
                          <span className="red">{this.state.registerPasswordErrorMsg}</span>
                        </FormHelperText>
                      </FormControl><br/><br/>
                      <FormControl>
                        <InputLabel htmlFor="contact">Contact*</InputLabel>
                        <Input id="contact" type="tel" username={this.state.contact} onChange={this.contactChangeHandler}/>
                        <FormHelperText className={this.state.contactRequired}>
                          <span className="red">{this.state.contactErrorMsg}</span>
                        </FormHelperText>
                      </FormControl><br/><br/>
                      <Button onClick={this.registerClickHandler} variant="contained" color="primary">Signup</Button>
                      <div className={this.state.signupFailMsgRequired}><span className="red">{this.state.signupFailMsg}</span></div>
                    </div>
                    </TabContainer>
                }
              </Modal>
          </Toolbar>
        </AppBar>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.isSnackVisible}
          onClose={this.hideSnackBar}
          autoHideDuration={5000}
          message={<span>{this.state.snackMsg}</span>}/>
    </div>)
  }

  showSncakBar = () => {
    this.setState({
      isSnackVisible:true,
    });
  }

  hideSnackBar = () =>{
    this.setState({
      isSnackVisible:false
    });
  }

  handleClick = (event) =>{
    this.setState({
      anchorEl: event.currentTarget
    })
  }

  handleAccount = ()=>{
    this.props.handleAccount();
    this.handleClose();
  }

  handleLogout = ()=>{
    // this.doLogoutApiCall();
    sessionStorage.clear();
    this.handleClose();
  }

  doLogoutApiCall = () => {
    let that = this;
    let username = this.state.username;
    let password = this.state.password;
    let url = `http://localhost:8080/api/user/login?contactNumber=${username}&password=${password}`;
    return fetch(url,{
      method:'POST',
    }).then((response) =>{
      console.log('response', response);
      if (response.ok) {
        sessionStorage.setItem("accessToken",response.headers.get("access-token"));
        return response.json();
      }else {
        that.loginFail();
      }
      return response.text();
    }).then((msg)=>{
      console.log('message',msg);
      that.loginSuccess(msg)
      that.setState({
        loginFailMsg:msg
      });
    }).catch((error) => {
      console.log('error login data',error);
    });
  }

  handleClose = () =>{
    this.setState({ anchorEl: null });
  }
}

export default withStyles(styles)(Header)
