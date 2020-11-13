import React from 'react';
import styled from "styled-components"
import { observer, Observer } from "mobx-react"

class SquareCardArea extends React.Component {
    paymentForm = null

    render = () => (
        <Observer>{() => (
            this.props.session.player && this.props.session.player.card_summary
            ?
            <Scene player={this.props.session.player}>
                using card:
                <Card>
                    {this.props.session.player.card_summary}<br/>
                    <Link onClick={() => {
                        fetch("/card", {
                            method: "DELETE",
                            headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                              'X-CSRF-Token': document.querySelector("meta[name='csrf-token']").content,
                              'Authorization': localStorage.getItem("code"),
                            },
                        }).then(() => window.location = window.location)
                    }}>change card</Link>
                </Card>
            </Scene>
            :
            <Scene player={this.props.session.player}>
                <div id="sq-card-number"></div>
                <div id="sq-expiration-date"></div>
                <div id="sq-cvv"></div>
                <div id="sq-postal-code"></div>

                <AddCard onClick={(e) => {e.preventDefault(); this.paymentForm.requestCardNonce()}} >
                    Add card
                </AddCard>
            </Scene>
        )}</Observer>
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
            expirationDate: {
                elementId: 'sq-expiration-date',
                placeholder: 'expires - mm/yy'
            },
            cvv: {
                elementId: 'sq-cvv',
                placeholder: 'secure card code - `123`'
            },
            postalCode: {
                elementId: 'sq-postal-code',
                placeholder: 'ZIP code - `12345`'
            },
            // SqPaymentForm callback functions
            callbacks: {
                cardNonceResponseReceived: (errors, nonce, cardData) => {
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
                          'Authorization': localStorage.getItem("code"),
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
                          window.location = window.location // reload page
                      })
                      .catch(err => {
                        console.error(err);
                        alert('Payment failed to complete!\nCheck browser developer console for more details');
                      });
                }
            }
        })
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
visibility: ${({player}) => player ? "visible" : "hidden"};
height: ${({player}) => player ? "auto" : "0px"};
`

const Card = styled.div`
border-radius: 4px;
border: 1px solid grey;
`

const Link = styled.a`
color: rgb(196, 196, 216);
`

export default observer(SquareCardArea)