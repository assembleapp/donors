class Player < ApplicationRecord
    validates :handle, presence: true
    validates :email, presence: true
end
