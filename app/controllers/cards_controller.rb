require "square"
require "securerandom"

class CardsController < ApplicationController
    def nonce
        unless session_hash
            render json: { success: "no" }
            return
        end

        player = session_hash.player
        
        client = Square::Client.new(
            access_token: ENV.fetch("SQUARE_ACCESS"),
            environment: Rails.env.development? ? 'sandbox' : 'production',
        )
        response = client.customers.create_customer_card(
            customer_id: player.square_number,
            body: {
                card_nonce: params.require(:nonce),
            },
        )

        if response.success?
            card = response.data[:card]
            player.update!(
                card_square_number: card[:id],
                card_summary: "#{card[:card_brand]} ...#{card[:last_4]} expiring #{card[:exp_month]}/#{card[:exp_year]}",
            )
            render json: { success: "yes" }
        else
            require "pry"; binding.pry
            render json: { success: "no" }
        end
    end

    def charge
        unless session_hash && session_hash.player.card_square_number
            render json: { success: "no" }
            return
        end

        payment_idempotency = SecureRandom.uuid
        price = (params.require(:charge).permit(:price)[:price].to_f * 100).to_i

        client = Square::Client.new(
            access_token: ENV.fetch("SQUARE_ACCESS"),
            environment: Rails.env.development? ? 'sandbox' : 'production',
        )
        response = client.payments.create_payment( body: {
            source_id: session_hash.player.card_square_number,
            idempotency_key: payment_idempotency,
            amount_money: {
                amount: price,
                currency: 'USD',
            },
            customer_id: session_hash.player.square_number,
            # reference_id: Charge.find(charge_id).square_id
        })
        if response.success?
            Charge.create!(
                player: session_hash.player,
                card_summary: session_hash.player.card_summary,
                price: price,
                square_number: response.data.payment[:id],
                square_link: response.data.payment[:receipt_url],
            )
            render json: { success: "yes" }
        else
            render json: { success: "no" }
        end
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

    def destroy
        unless session_hash
            render json: { success: "no" }
            return
        end

        session_hash.player.update(card_square_number: nil, card_summary: nil)
    end
end