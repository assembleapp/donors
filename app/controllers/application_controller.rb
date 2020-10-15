class ApplicationController < ActionController::Base
    private

    def session_hash
        code = request.headers["Authorization"].to_s
        return nil if code == "null"

        session = Session.find_by(code: code)
        return nil unless \
            session &&\
            session.claimed &&\
            session.claimed < Time.current &&\
            session.expires > Time.current

        session
    end
end
