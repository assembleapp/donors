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
end