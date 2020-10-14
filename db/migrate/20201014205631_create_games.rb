class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.belongs_to :player, null: false, foreign_key: true
      t.jsonb :snake
      t.integer :pauses
      t.integer :score
      t.datetime :began
      t.datetime :ended

      t.timestamps
    end
  end
end
