import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Login() {

    const [googleUrl, setGoogleUrl] = useState(0);
    const [ifAuth, setIfAuth] = useState(0);

    useEffect(() => {
        axios.get('/api/login/google').then((res) => {
            console.log(res.data.url);
            setGoogleUrl(res.data.url);
        }).catch((err) => {
            console.log(err);
        });
    }, [googleUrl]);

    useEffect(() => {
        axios.get('/api/test').then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    });



    return (
        <div>
            <a href={googleUrl}>
                google login
            </a>
        </div>
    );
}



export default Login;