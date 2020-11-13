class Player < ApplicationRecord
    validates :handle, presence: true
    validates :email, presence: true
    has_many :charges
    has_many :games

    def as_json(*args)
        super(*args).merge(balance:
            (charges.pluck(:price).reduce(:+) || 0) -
            games.pluck(:pauses, :speed_drops).map {|p, s| (p||0) * 10 + (s||0) * 25 }.reduce(:+)
        )
    end
end
