import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({userObj}) => {
    
    const [nweets, setNweets] = useState([]);
   
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
    
    return(
        <div className="container">
           <NweetFactory userObj={userObj} />
           <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
};
export default Home;