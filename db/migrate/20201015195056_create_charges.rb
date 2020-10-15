class CreateCharges < ActiveRecord::Migration[6.0]
  def change
    create_table :charges do |t|
      t.belongs_to :player, null: false, foreign_key: true
      t.string :card_summary
      t.string :square_number
      t.string :square_link
      t.integer :price

      t.timestamps
    end
  end
end
