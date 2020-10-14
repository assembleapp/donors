class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.string :handle
      t.string :email
      t.string :card_square_number
      t.string :card_summary

      t.timestamps
    end
  end
end
