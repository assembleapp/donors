import React from 'react';
import styled from "styled-components"
import { observable, autorun, toJS, runInAction } from "mobx"
import { observer } from "mobx-react"

class SquareCardArea extends React.Component {
    paymentForm = null

    render = () => (
        <Scene>
            <div id="form-container">
                <div id="sq-card-number"></div>
                <div id="sq-expiration-date"></div>
                <div id="sq-cvv"></div>
                <div id="sq-postal-code"></div>
                <button id="sq-creditcard" 
                    onClick={(e) => {e.preventDefault(); this.paymentForm.requestCardNonce()}} >Pay $1.00</button>
            </div> 
        </Scene>
    )

    componentDidMount = () => {
        this.paymentForm = new SqPaymentForm({
            applicationId: document.querySelector("meta[name='square-key']").content,
            inputClass: 'sq-input',
            autoBuild: true,
            inputStyles: [{
                fontSize: '16px',
                lineHeight: '24px',
                padding: '16px',
                placeholderColor: '#a0a0a0',
                backgroundColor: 'transparent',
            }],
            cardNumber: {
                elementId: 'sq-card-number',
                placeholder: 'Card Number'
            },
            cvv: {
                elementId: 'sq-cvv',
                placeholder: 'CVV'
            },
            expirationDate: {
                elementId: 'sq-expiration-date',
                placeholder: 'MM/YY'
            },
            postalCode: {
                elementId: 'sq-postal-code',
                placeholder: 'Postal'
            },
            // SqPaymentForm callback functions
            callbacks: {
                cardNonceResponseReceived: function (errors, nonce, cardData) {
                    if (errors) {
                        // Log errors from nonce generation to the browser developer console.
                        console.error('Encountered errors:');
                        errors.forEach(function (error) {
                            console.error('  ' + error.message);
                        });
                        alert('Encountered errors, check browser developer console for more details');
                        return;
                    }

                    fetch('/card-nonce', {
                        method: 'POST',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          'X-CSRF-Token': document.querySelector("meta[name='csrf-token']").content,
                        },
                        body: JSON.stringify({ nonce })
                      })
                      .catch(err => alert('error: please reload page;\n' + err) )
                      .then(response => {
                        if (!response.ok) {
                          return response.json().then(errorInfo => Promise.reject(errorInfo)); //UPDATE HERE
                        }
                        return response.json(); //UPDATE HERE
                      })
                      .then(data => {
                        console.log(data); //UPDATE HERE
                        alert('Payment complete successfully!\nCheck browser developer console for more details');
                      })
                      .catch(err => {
                        console.error(err);
                        alert('Payment failed to complete!\nCheck browser developer console for more details');
                      });
                }
            }
          });
    }
}

const Column = styled.div`
display: flex;
flex-direction: column;
`

const Scene = styled.div`
background-color: #282c34;
min-height: 100vh;
display: grid;
grid-template-columns: auto 1fr auto;
grid-gap: none;
color: #ededed;
`

export default observer(SquareCardArea)