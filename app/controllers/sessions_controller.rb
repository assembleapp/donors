require "square"

class SessionsController < ApplicationController
    def create
        player_params = params.require(:player).permit(:email, :handle)
        player = Player.find_by(player_params)

        player ||= begin
            if player_params[:email] &&\
                player_params[:handle] &&\
                !Player.find_by(email: player_params[:email]) &&\
                !Player.find_by(handle: player_params[:handle])
                
                number = make_player_record_on_square(player_params[:email])
                raise "no square record has been made" unless number
                player = Player.create(player_params.merge(square_number: number))
            end
        rescue
            render json: { success: "no" }
            return nil
        end

        unless player
            render json: { success: "no" }
            return nil
        end

        session = Session.create(
            player: player,
            expires: 30.days.from_now,
            code: SecureRandom.uuid,
        )
        SessionMailer.with(session: session).claim.deliver_later

        render json: { success: 'yes' }
    end

    def index
        render json: { code: session_hash.code, player: session_hash.player }
    end

    def claim
        session = Session.find_by(code: params[:code])

        if session
            if session.claimed
                @error = "Your session has already been claimed."
            else
                Session.update(claimed: Time.current)
                @code = session.code
            end
        else
            @error = "Your session link is unrecognized."
        end
    end

    private

    def make_player_record_on_square(email)
        client = Square::Client.new(
            access_token: ENV.fetch("SQUARE_ACCESS"),
            environment: Rails.env.development? ? 'sandbox' : 'production',
        )
        response = client.customers.create_customer(body: { email_address: email })
        # response.success?
        # response.error?

        # response.data.customer=
        # {:id=>"0HK489VNJ0S5Z0K6BZE0848T2G",
        #  :created_at=>"2020-10-14T02:36:49.671Z",
        #  :updated_at=>"2020-10-14T02:36:50Z",
        #  :email_address=>"a@b.com",
        #  :preferences=>{:email_unsubscribed=>false},
        #  :creation_source=>"THIRD_PARTY"}>

        if response.success?
            response.data[:customer][:id]
        else
            nil
        end
    end
end
