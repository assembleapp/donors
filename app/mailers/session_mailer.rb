class SessionMailer < ApplicationMailer
    default from: "broken_pixel@#{ENV["APPLICATION_HOST"]}"

    def claim
        @session = params[:session]
        @url = "http://#{ENV["APPLICATION_HOST"]}/session/#{@session.code}"

        mail(to: @session.player.email, subject: 'Broken Pixel Games: sign in.')
    end
end
