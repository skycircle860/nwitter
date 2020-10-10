import React,{ useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import App from "./App";


const AppRouter = () =>{ 
    const[ isLoggedIn, setIsLoggedIn ] = useState(true);
    return (
        <Router>
            <Switch>
                {isLoggedIn ? (
                <>
                <Router exact path="/">
                    <Home />
                </Router>
                </> 
                ):( 
                <Router exact path="/">
                  <Auth />
                </Router>
                )}
            </Switch>
        </Router>
    );
};

export default AppRouter;