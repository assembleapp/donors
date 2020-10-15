# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_10_15_195056) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "charges", force: :cascade do |t|
    t.bigint "player_id", null: false
    t.string "card_summary"
    t.string "square_number"
    t.string "square_link"
    t.integer "price"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["player_id"], name: "index_charges_on_player_id"
  end

  create_table "games", force: :cascade do |t|
    t.bigint "player_id", null: false
    t.jsonb "snake"
    t.integer "pauses"
    t.integer "score"
    t.datetime "began"
    t.datetime "ended"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["player_id"], name: "index_games_on_player_id"
  end

  create_table "players", force: :cascade do |t|
    t.string "handle"
    t.string "email"
    t.string "card_square_number"
    t.string "card_summary"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "square_number"
  end

  create_table "sessions", force: :cascade do |t|
    t.bigint "player_id", null: false
    t.datetime "claimed"
    t.datetime "expires"
    t.uuid "code"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["player_id"], name: "index_sessions_on_player_id"
  end

  add_foreign_key "charges", "players"
  add_foreign_key "games", "players"
  add_foreign_key "sessions", "players"
end
