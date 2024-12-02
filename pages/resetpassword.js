import Head from "next/head";
import Header, { Header2 } from "../src/components/Header/Header";
import OTP from "../src/components/OTP";
import Resetpassword from "../src/components/resetpassword"

const ResetPassword = () => {
    return <div>
        <Head>
            <title>Chop Chow Reset Password Form</title>
            <meta key="title" name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <div>
            <Header/>
            
        <Resetpassword/>
        
        </div>
        </div>

}

export default ResetPassword