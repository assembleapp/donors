class SessionsController < ApplicationController
    def create
        player_params = params.require(:player).permit(:email, :handle)
        puts "=" * 80
        puts player_params.inspect
        player = Player.find_by(player_params)
        player ||= Player.create(player_params)
        # todo make sure unique handle and email.
        puts player.inspect
        puts "=" * 80
        return {} unless player

        session = Session.create(
            player: player,
            expires: 30.days.from_now,
            code: SecureRandom.uuid,
        )
        SessionMailer.with(session: session).claim.deliver_later

        render json: { success: 'yes' }
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
end
