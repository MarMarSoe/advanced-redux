import { uiAction } from "./ui-slice";
import { cartAction } from "./cart-slice";

export const fetchCartData = () => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await fetch( "https://react-https-f7525-default-rtdb.firebaseio.com/cart.json");

            if(!response.ok){
                throw new Error("Could not fetch cart data!")
            }

            const data = response.json();

            return data;
        }

        try{
            const cartData = await fetchData();
            dispatch(cartAction.replaceCart({
                items: cartData.items || [],
                totalQuantity: cartData.totalQuantity
            }));
        }catch(error){
            dispatch(
                uiAction.showNotification({
                  status: "error",
                  title: "Error..",
                  message: "Sending cart data failed!",
                })
              )
        }

       
    }
}
export const sendCartData = (cart) => {
    return async (dispatch) => {
        dispatch(
            uiAction.showNotification({
              status: "pending",
              title: "Sending..",
              message: "Sending cart data!",
            })
          );
          const sendRequest = async () => {
            const response = await fetch(
                "https://react-https-f7525-default-rtdb.firebaseio.com/cart.json",
                {
                  method: "PUT",
                  body: JSON.stringify({items: cart.items, totalQuantity: cart.totalQuantity}),
                }
              );
        
              if (!response.ok) {
                throw new Error("Sending Cart data failed!!");
              }
          }
          
          try{
            await sendRequest();
            dispatch(
                uiAction.showNotification({
                  status: "success",
                  title: "Success..",
                  message: "Sending cart data successfully!",
                })
              );
          }catch(error){
            sendCartData().catch((error) =>
            dispatch(
              uiAction.showNotification({
                status: "error",
                title: "Error..",
                message: "Sending cart data failed!",
              })
            )
          );
          }
    }
}