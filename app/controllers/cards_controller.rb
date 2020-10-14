require "square"
require "securerandom"

class CardsController < ApplicationController
    def nonce
        client = Square::Client.new(
            access_token: ENV.fetch("SQUARE_ACCESS"),
            environment: Rails.env.development? ? 'sandbox' : 'production',
        )
        response = client.customers.create_customer(body: { email_address: "a@b.com" })
        # response.success?
        # response.error?

        # response.data.customer=
        # {:id=>"0HK489VNJ0S5Z0K6BZE0848T2G",
        #  :created_at=>"2020-10-14T02:36:49.671Z",
        #  :updated_at=>"2020-10-14T02:36:50Z",
        #  :email_address=>"a@b.com",
        #  :preferences=>{:email_unsubscribed=>false},
        #  :creation_source=>"THIRD_PARTY"}>

         customer_id = response.data[:customer][:id]
        response = client.customers.create_customer_card(customer_id: customer_id, body: {
            card_nonce: params.require(:nonce),
        })

        # response.success?
        # response.error?
        card = response.data[:card]
        # card.id,
        # card.card_brand,
        # card.last_4,
        # card.exp_month,
        # card.exp_year
        payment_idempotency = SecureRandom.uuid
        response = client.payments.create_payment( body: {
            source_id: card[:id],
            idempotency_key: payment_idempotency,
            amount_money: {
                amount: 1,
                currency: 'USD',
            },
            customer_id: customer_id,
            # reference_id: Charge.find(charge_id).square_id
        })
        # response.success?
        # response.error?

        # response.data.payment=
        # {:id=>"7vfVNu8RdX3slM3nPCcpwlupARdZY",
        #  :created_at=>"2020-10-14T02:28:57.846Z",
        #  :updated_at=>"2020-10-14T02:28:58.021Z",
        #  :amount_money=>{:amount=>1, :currency=>"USD"},
        #  :status=>"COMPLETED",
        #  :delay_duration=>"PT168H",
        #  :source_type=>"CARD",
        #  :card_details=>
        #   {:status=>"CAPTURED",
        #    :card=>
        #     {:card_brand=>"VISA",
        #      :last_4=>"1111",
        #      :exp_month=>12,
        #      :exp_year=>2022,
        #      :fingerprint=>"sq-1-cxJMKLspT1nAIpIcfBaXctlPzTkEeNIdsshA6d7Qx4vb33eBND7T-6vsOAGJXPO2gA",
        #      :card_type=>"CREDIT",
        #      :bin=>"411111"},
        #    :entry_method=>"ON_FILE",
        #    :cvv_status=>"CVV_NOT_CHECKED",
        #    :avs_status=>"AVS_ACCEPTED",
        #    :statement_description=>"SQ *DEFAULT TEST ACCOUNT"},
        #  :location_id=>"5EMDVGQ3CN56K",
        #  :order_id=>"aS9DJbCaHqMuNiMRO07TLhJJFGBZY",
        #  :customer_id=>"H2TJV60JWWW03BM268372DCN08",
        #  :total_money=>{:amount=>1, :currency=>"USD"},
        #  :receipt_number=>"7vfV",
        #  :receipt_url=>"https://squareupsandbox.com/receipt/preview/7vfVNu8RdX3slM3nPCcpwlupARdZY",
        #  :delay_action=>"CANCEL",
        #  :delayed_until=>"2020-10-21T02:28:57.846Z"}>
        render json: response.data.payment
    end
end