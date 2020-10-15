class GamesController < ApplicationController
    def index
        render json: {
            leaderboard: Game.
                includes(:player).
                order(score: :desc).
                limit(4).
                map {|g| {
                    ended: g.ended,
                    handle:  g.player.handle,
                    score: g.score,
                    snake: g.snake,
                    pauses: g.pauses,
                } }
        }
    end

    def create
        Game.create!(game_params.merge(player: session_hash.player, ended: Time.current))
        render json: { success: "yes" }
    end

    private

    def game_params
        params.require(:game).permit(:score, :pauses, :snake)
    end
end