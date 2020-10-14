# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Game.destroy_all
Player.destroy_all

bob = Player.create!(
    handle: "b0bby",
    email: "bob@someplace.com",
)

Game.create!(
    player: bob,
    snake: "[[0,1],[0,2],[0,3],[-1,3]]",
    score: 4,
    pauses: 0,
    began: Time.current,
    ended: Time.current,
)