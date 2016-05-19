class RemoveColumnFromPlayers < ActiveRecord::Migration
  def change
  	remove_column :players, :string, :string
  end
end
