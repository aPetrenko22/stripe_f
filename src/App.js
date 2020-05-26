import React, { useState } from 'react';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

import logo from './logo.svg';
import './App.css';

function App() {

  const [product] = useState({
    name: 'item',
    price: 1000,
  });
  const [productPay, saveProductPay] = useState(null);

  const paymentHandler = (token) => {
    return axios('http://localhost:4000/api/payment/pay', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      data:  {
        product,
        token
      }
    }).then(response=>{
      console.log(response);
      saveProductPay({
        amount: response.data.amount,
        id: response.data.id,
        customerId: response.data.customer
      });
    }).catch(error=>console.log(error))
  };

  const refundHandler = () => {
    axios('http://localhost:4000/api/payment/refund', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      data: productPay
    }).then(()=>{
      saveProductPay(null);
    }).catch(error=>console.log(error))
  };

  const subsHandler = () => {
    axios(`http://localhost:4000/api/payment/subscription/${productPay.customerId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      data: productPay
    }).then((response)=>{
      console.log("%c response ======>"," color: #bada55", response.data.status);
    }).catch(error=>console.log(error))
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {
          !productPay && (
            <StripeCheckout
              stripeKey={process.env.REACT_APP_PUBLIC_KEY}
              token={paymentHandler}
              name="Test pay"
              amount={product.price}
            />
          )
        }
          {
            productPay &&
              <>
                <button
                  className="payment"
                  onClick={refundHandler}
                >
                  Refund payment {productPay.amount}
                </button>
                <button
                  className="payment"
                  onClick={subsHandler}
                >
                  Create subscription
                </button>
              </>
          }
      </header>
    </div>
  );
}

export default App;
