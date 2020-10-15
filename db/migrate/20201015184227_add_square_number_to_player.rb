class AddSquareNumberToPlayer < ActiveRecord::Migration[6.0]
  def change
    add_column :players, :square_number, :string
  end
end
