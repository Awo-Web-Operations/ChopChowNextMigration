import Head from "next/head";
import Header, { Header2 } from "../../src/components/Header/Header";

import Cart from "../../src/components/Cart/Index";

const CartPage = () => {
  return (
    <div>
      <Head>
        <title>Chop Chow Grocery List</title>
        <meta
          key="title"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
      </Head>
      <Header />
      <Header2 />
      <Cart />
    </div>
  );
};

export default CartPage;
