import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Login() {

    const [googleUrl, setGoogleUrl] = useState(0);


    useEffect(() => {
        axios.get('/api/login/google').then((res) => {
            console.log(res.data.url);
            setGoogleUrl(res.data.url);
        }).catch((err) => {
            console.log(err);
        });
    }, [googleUrl]);




    return (
        <div>
            <a href={googleUrl}>
                google login
            </a>
        </div>
    );
}



export default Login;