Rails.application.routes.draw do
    post "/card/nonce", to: "cards#nonce"
    post "/card/charge", to: "cards#charge"
    resources :games, only: [:index]
    root to: "pages#index"
end
