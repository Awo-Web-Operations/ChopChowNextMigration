import { useRouter } from "next/router";
import Header, { Header2 } from "../../src/components/Header/Header"
import { useState } from "react";
import Sidenav from "../../src/components/Header/sidenav";
import Head from "next/head";
import { AllUtensils } from "../../src/components/public-market/all-utensils";
import Footer from "../../src/components/Footer/Footer";

const AllStoresPage = () => {
    const router = useRouter();
    const [activeSubLink, setActiveSubLink] = useState(0);
    return (
        <div>
            <Head>
                <title>Chop Chow Marketplace</title>
                <meta
                    key="title"
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <meta
                    name="description"
                    content="Search recipes by ingredients and 
        many more categories. Curious to know what to make with an Ingredient 
        you already have? Use Chop Chow to find new recipes and share meals 
        made from home."
                />
            </Head>
            <Header />
            <Header2
                pathname={router.pathname}
                activeSubLink={activeSubLink}
                setActiveSubLink={setActiveSubLink}
            />
            <Sidenav />

            <AllUtensils />
            <Footer />
        </div>
    )
}
export default AllStoresPage