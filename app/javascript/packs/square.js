import React from 'react';
import styled from "styled-components"
import { observer } from "mobx-react"

class SquareCardArea extends React.Component {
    paymentForm = null

    render = () => (
        <Scene>
            <div id="sq-card-number"></div>
            <div id="sq-expiration-date"></div>
            <div id="sq-cvv"></div>
            <div id="sq-postal-code"></div>

            <AddCard onClick={(e) => {e.preventDefault(); this.paymentForm.requestCardNonce()}} >
                Add card
            </AddCard>
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
                placeholderColor: '#a0a0a0',
                color: '#e0e0e0',
                backgroundColor: 'rgba(212, 196, 196, 0.2)',
            }],
            cardNumber: {
                elementId: 'sq-card-number',
                placeholder: 'bank card number'
            },
            cvv: {
                elementId: 'sq-cvv',
                placeholder: 'secure card code - ###'
            },
            expirationDate: {
                elementId: 'sq-expiration-date',
                placeholder: 'mm/yy'
            },
            postalCode: {
                elementId: 'sq-postal-code',
                placeholder: 'ZIP code'
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

                    fetch('/card/nonce', {
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

const AddCard = styled.button`
width: 100%;
padding: 0.5rem;
background-color: rgba(196, 196, 212, 0.6);
border-radius: 4px;
outline: none;
border: none;
`

const Scene = styled.div`
grid-gap: none;
color: #ededed;
width: 12rem;
padding: 1rem;
`

export default observer(SquareCardArea)