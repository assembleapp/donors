class AddSpeedDropsToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :speed_drops, :int
  end
end
