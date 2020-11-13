class GamesController < ApplicationController
    def index
        render json: {
            leaderboard: Game.
                includes(:player).
                order(score: :desc).
                limit(6).
                map {|g| {
                    ended: g.ended,
                    handle:  g.player.handle,
                    score: g.score,
                    snake: g.snake,
                    pauses: g.pauses || 0,
                    speed_drops: g.speed_drops || 0,
                } }
        }
    end

    def create
        if(session_hash)
            Game.create!(game_params.merge(player: session_hash.player, ended: Time.current))
            render json: { success: "yes" }
        else
            render json: { success: "no" }
        end
    end

    private

    def game_params
        params.require(:game).permit(:score, :pauses, :snake, :speed_drops)
    end
end