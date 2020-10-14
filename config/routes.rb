Rails.application.routes.draw do
    post "/card/nonce", to: "cards#nonce"
    post "/card/charge", to: "cards#charge"
    root to: "pages#index"
end
