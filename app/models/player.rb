class Player < ApplicationRecord
    validates :handle, presence: true
    validates :email, presence: true
    has_many :charges

    def as_json(*args)
        super(*args).merge(balance: charges.pluck(:price).reduce(:+)) || 0
    end
end
