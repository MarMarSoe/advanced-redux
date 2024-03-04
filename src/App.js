import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";
import { useSelector, useDispatch } from "react-redux";
import { Fragment, useEffect} from "react";
import { uiAction } from "./store/ui-slice";

let isInitital = true;
function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiAction.showNotification({
          status: "pending",
          title: "Sending..",
          message: "Sending cart data!",
        })
      );
      const response = await fetch(
        "https://react-https-f7525-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("Sending Cart data failed!!");
      }

      // const responseData = response.json();

      dispatch(
        uiAction.showNotification({
          status: "success",
          title: "Success..",
          message: "Sending cart data successfully!",
        })
      );
    };

    if(isInitital){
      isInitital = false;
      return;
    }

    sendCartData().catch((error) =>
      dispatch(
        uiAction.showNotification({
          status: "error",
          title: "Error..",
          message: "Sending cart data failed!",
        })
      )
    );
  }, [cart, dispatch]);
  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
