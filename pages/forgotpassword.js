import Head from "next/head";

import Forgotpassword from "../src/components/forgotpassword";
const ForgotPassword = () => {
    return <div >
        <Head>
            <title>Chop Chow Forgot Password Form</title>
            <meta key="title" name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="description" content="Chop Chow Forgot Password Page" />
        </Head>
        <div >
            <Forgotpassword/>
        </div>
        </div>

}

export default ForgotPassword