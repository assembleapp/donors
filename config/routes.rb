Rails.application.routes.draw do
    post "/card/nonce", to: "cards#nonce"
    post "/card/charge", to: "cards#charge"
    delete "/card", to: "cards#destroy"
    resources :sessions, only: [:create, :index]
    get "/session/:code", to: "sessions#claim"
    resources :games, only: [:index, :create]
    root to: "pages#index"
end
