class CreateSessions < ActiveRecord::Migration[6.0]
  def change
    create_table :sessions do |t|
      t.belongs_to :player, null: false, foreign_key: true
      t.datetime :claimed
      t.datetime :expires
      t.uuid :code

      t.timestamps
    end
  end
end
