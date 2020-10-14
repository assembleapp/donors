Rails.application.routes.draw do
    post "/card-nonce", to: "cards#nonce"
    root to: "pages#index"
end
