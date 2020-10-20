import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import { storage } from "firebase";
import { v4 as uuidv4} from "uuid";

const Home = ({userObj}) => {
    const [nweet,setNweet]=useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    //옛날 방식이라 다른 방식으로 기능 구현. 이런 방식으로도 할 수 있다는것을 확인하기 위한 코드...
    // const getNweets = async() => {
    //     const dbNweets = await dbService.collection("nweets").get();
    //     dbNweets.forEach((document) =>{
    //         const nweetObject = {
    //             ...document.data(),
    //             id: document.id,
    
    //         };
    //         setNweets((prev) =>[nweetObject, ...prev]);
    //     });
    // };
    useEffect(() => {
    //    getNweets();
    // 아래방식은 위의 foreach 방식에 비해 re-render 하지 않는 차이가 있다.
        dbService.collection("nweets").onSnapshot((snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id : doc.id, 
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
        
    }, []);
    const onSubmit = async(event) =>{
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== ""){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment,"data_url"); //이것이 요구하는 것은 data 와 data의 형식이다.data는 attachment의 string(이미지 전체가 문자열로 변환된) 이다.
            attachmentUrl = await response.ref.getDownloadURL();
            
        }
        const nweetObj = {
            text: nweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");
    };//submit 을 하고나면 칸을 비워주기 위해서 set에 빈값을 넣어준다.    
    
    const onChange = (event) =>{
        const { 
            target : {value},
        } = event;
        setNweet(value);
    };
    const onFileChange = (event) =>{
        const {
            target: {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader(); //file 을 이용해서 reader를 만들고 readAsDataURL을 사용하여 파일을 읽는다.
        reader.onloadend =  (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
      
    }; 
    const onClearAttachment = () => setAttachment(null);   
    return(
        <div>
            <form onSubmit = {onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="file" accept="image/*" onChange = {onFileChange}/>
                <input type="submit" value="Nweet"/>
                {attachment && (
                    <div>
                        <img src ={attachment} width="50px" height="50px" /> 
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>)}
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
};
export default Home;