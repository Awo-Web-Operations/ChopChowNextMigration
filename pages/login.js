import Login from "../src/components/Login"
import { home_container2 } from '../src/components/HomePage/home.module.css';
import { login_container } from '../src/components/Login/style.module.css'
import Head from "next/head";
import useInactivityLogout from "../src/util/useinactivity";

const App = () => {
    return <div className={home_container2}>
        <Head>
            <title>Log in to Chop Chow</title>
            <meta key="title" name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="description" content="Log in to Chop Chow to view your 
            custom dashboard, grocery list and more." />
        </Head>
        <div className={login_container}>

            <Login />
        </div>
    </div>


}
export default App;
