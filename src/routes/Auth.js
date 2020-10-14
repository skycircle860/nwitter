import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

const Auth = () =>{ 
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
                    //밑의 event 는 무슨일이 일어났는가 이다. event 로부터 다양한 정보를 얻을 수 있다. 
    
    const onChange = (event) => {
        const {
            target: {name,value},
        } = event;
        if(name === "email"){
            setEmail(value)

        } else if (name === "password"){
            setPassword(value)
        }
    };
   
    const onSubmit = async(event) =>{
        event.preventDefault();//이 함수는 submit 함수가 실행되었을 시 값을 내가 컨트롤 할 수 있도록 하기 위한 함수이다. 해당 함수를 사용하지 않으면
                                //submit 액션이 일어났을 시 새로고침 되어 입력한 값이 input 태그에서 사라지고 state 도 초기화된다.
                                //기본값으로 설정된 작업을 진행하지 말라는 함수(새로고침)
        try { 
            let data;
            if(newAccount){
                //create 
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data);
        } catch (error){
            setError(error.message);
        }
        
    };
    const toggleAccount = () => setNewAccount(prev => !prev); 
    const onSocialClick = async(event) => {
        const {
            target : {name},
        } = event;
        let provider;
        if(name === "google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if(name ==="github"){
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        const data = await authService.signInWithPopup(provider);

    };
    // input 태그 안의 onchange 속성은 값이 바뀔때마다 onChange 함수를 호출한다는 것을 의미한다.
    //또한 value는 state 에 저장이 된다. input의 값이 바뀔때마다 state의 값도 변화하는것.
    return(
    <div>    
        <form onSubmit={onSubmit}>   
            <input name = "email" type="email" placeholder="Email" required value={email} onChange={onChange}/>
            <input name = "password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
            <input type="submit" value={newAccount ? "Create Account" : "Sign In" }/>

        </form>
        <span onClick={toggleAccount}>
            {newAccount ? "Sign in" : "Create Account"}
        </span>
        <div>
            <button name="google" onClick={onSocialClick} >Continue with Google</button>
            <button name="github" onClick={onSocialClick} >Continue with Github</button>
        </div>
    </div>
    );
};
export default Auth;