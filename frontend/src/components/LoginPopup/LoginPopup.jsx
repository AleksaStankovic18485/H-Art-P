import React,{useState, useEffect} from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../../redux/api/usersApiSlice';
import { setCredentials } from '../../redux/features/login/loginSlice';
import { useRegisterMutation } from '../../redux/api/usersApiSlice';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import {useTranslation} from "react-i18next"

const LoginPopup = ({setShowLogin}) => {
    const [t] = useTranslation("global");
    const [currState, setCurrState] = useState("Login");

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isArtist, setIsArtist] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, {isLoading:isLoginLoading }] = useLoginMutation()
    const [error, setError] = useState(null); 
    const {userInfo} = useSelector(state=>state.login)

    const [register, {isLoading:isRegisterLoading}] = useRegisterMutation()


    useEffect(() => {
        
      
        document.body.classList.add('popup-open');
        
        return () => {
          document.body.classList.remove('popup-open');
        };
      }, [document.body.classList.contains('popup-open')]);

    useEffect(()=>{
      if(userInfo){
        setShowLogin(false)
      }
    },[userInfo])

    const handleLoginSubmit = async(e) => {
        e.preventDefault()
        console.log(email,password)
        try{ 
          const res = await login({email, password}).unwrap()
          console.log(res)
          dispatch(setCredentials({...res}))
        }
        catch(err){
          console.log(err);
          toast.error(err?.data?.error);
          setError(err.data.error);
        }
    }

    const handleSignUpSubmit = async(e) => {
      e.preventDefault();
      console.log(firstName,lastName,email,userName,password,isArtist)
      
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        toast.error("Passwords do not match");
      } else {
        try {
          const res = await register({ firstName, lastName, email, userName, password, isArtist}).unwrap();
          console.log(res)
          dispatch(setCredentials({ ...res }));
          toast.success("User successfully registered");
        } catch (err) {
          console.log(err);
          toast.error(err?.data?.error);
          setError(err?.data?.error);
        }
      }
       
  
    }

  return (
    <div className='login-popup'>
        <form className="login-popup-container" onSubmit={currState==="Login"?handleLoginSubmit:handleSignUpSubmit}>
            <div className="login-popup-title">
                <h2>{currState==="Login"?t('login'):t('sign_up')}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
                {currState==="Login"?<></>:<input type="text" 
                                                  onChange={(e) => setFirstName(e.target.value)}
                                                  value={firstName}
                                                  placeholder={t('enter_first_name')} 
                                                  required />}
                {currState==="Login"?<></>:<input type="text" 
                                                  onChange={(e) => setLastName(e.target.value)}
                                                  value={lastName}
                                                  placeholder={t('enter_last_name')} 
                                                  required />}                                 
                <input type="email"  
                       onChange={(e) => setEmail(e.target.value)}
                       value={email}
                       placeholder={t('enter_email')}
                       required/>

                {currState==="Login"?<></>:<input type="text" 
                                                  onChange={(e) => setUserName(e.target.value)}
                                                  value={userName}
                                                  placeholder={t('enter_username')} 
                                                  required />}  
                <input type="password" 
                       onChange={(e) => setPassword(e.target.value)}
                       value={password}
                       placeholder={t('password')}
                       required />
              
                {currState==="Login"?<></>:<>
                            <input type="password" 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            placeholder={t('confirm_password')}
                            required />

                            <div className="login-popup-condition artist">
                              <input type="checkbox" 
                               onChange={()=>{setIsArtist(!isArtist)}}
                               />

                              <p>{t('are_you_an_artist')}</p>
                            </div>
                            </>
                    }

            </div>
            <button disabled={isLoginLoading || isRegisterLoading}>{currState==="Sign Up"?(isRegisterLoading?t('creating_account'):t('create_account')): (isLoginLoading? t('logging_in') : t('login'))}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required />
                <p>{t('privacy_policy')}</p>
            </div>
            {currState==="Login"
            ?<p>{t('create_new_account')} <span onClick={()=>setCurrState("Sign Up")}>{t('click_here')}</span></p>
            :<p>{t('already_have_an_account')} <span onClick={()=>setCurrState("Login")}>{t('login_here')}</span></p>
            }
        </form>
        
    </div>
  )
}

export default LoginPopup