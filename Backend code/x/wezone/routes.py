from sanic import Blueprint
from wezone.views import login_user, get_all_users, reset_password, get_user_by_id, create_user, update_user, delete_user, get_all_birthday, forget_password, reset_password, logout_user, create_shootout, get_all_shootouts, create_game, get_all_games, create_session, get_all_sessions, create_article, get_all_article, create_poll, get_all_polls, vote_poll, get_poll_results, dashboard
from sanic.response import json



bp_login = Blueprint("wezone", url_prefix="/login")

# --------------------------------------------------------------------user login--------------------------------------------------------------------

@bp_login.route("/", methods=["POST"], name="login_user")
async def user_login(request):
    try:
        result = login_user(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# -------------------------------------------------------------------get all users-------------------------------------------------------------------

@bp_login.route("/all", methods=["GET"], name="get_all_users")
async def get_all_users_route(request):
    try:
        result = get_all_users(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# ------------------------------------------------------------------get user by id------------------------------------------------------------------

@bp_login.route("/<user_id>", methods=["GET"], name="get_user_by_id")
async def get_user_by_id_route(request,user_id):
    try:
        result = get_user_by_id(request, user_id)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# --------------------------------------------------------------------create user--------------------------------------------------------------------

@bp_login.route("/create", methods=["POST"], name="create_user")
async def create_user_route(request):
    try:
        result = create_user(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# --------------------------------------------------------------------update user--------------------------------------------------------------------

@bp_login.route("/update/<user_id>", methods=["PUT"], name="update_user")
async def update_user_route(request, user_id):
    try:
        result = update_user(request, user_id)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# --------------------------------------------------------------------delete user--------------------------------------------------------------------

@bp_login.route("/delete/<user_id>", methods=["DELETE"], name="delete_user")
async def delete_user_route(request, user_id):
    try:
        result = delete_user(request, user_id)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# -----------------------------------------------------------------get all birthday-----------------------------------------------------------------

@bp_login.route("/users/birthday", methods=["GET"], name="get_all_birthday")
async def get_all_birthday_route(request):
    try:
        result = get_all_birthday(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# ------------------------------------------------------------------forgot password------------------------------------------------------------------

@bp_login.route("/forgot-password", methods=["POST"], name="forgot_password")
async def forgot_password_route(request):
    try:
        result = forget_password(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# ------------------------------------------------------------------reset password------------------------------------------------------------------

@bp_login.route("/reset-password", methods=["POST"], name="reset_password")
async def reset_password_route(request):
    try:
        result = reset_password(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# ------------------------------------------------------------------create shootout------------------------------------------------------------------

@bp_login.route("/shootouts", methods=["POST"], name="create_shootout")
async def create_shootout_route(request):
    try:
        result = create_shootout(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# -----------------------------------------------------------------get all shootouts-----------------------------------------------------------------

@bp_login.route("/shootouts", methods=["GET"], name="get_all_shootouts")
async def get_all_shootouts_route(request):
    try:
        result = get_all_shootouts(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# --------------------------------------------------------------------create poll--------------------------------------------------------------------

@bp_login.route("/poll/create", methods=["POST"], name="create_poll")
async def create_poll_route(request):
    try:
        result = create_poll(request)
        status_code = 201 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# -------------------------------------------------------------------get all polls-------------------------------------------------------------------

@bp_login.route("/polls", methods=["GET"], name="get_all_polls")
async def get_all_polls_route(request):
    try:
        result = get_all_polls(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# ---------------------------------------------------------------------vote poll---------------------------------------------------------------------

@bp_login.route("/vote", methods=["POST"], name="vote_poll")
async def vote_poll_route(request):
    try:
        result = vote_poll(request)
        status_code = 201 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# -----------------------------------------------------------------get poll results-----------------------------------------------------------------

@bp_login.route("/poll-results", methods=["GET"], name="get_poll_results")
def get_poll_results_route(request):
    try:
        result = get_poll_results(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# -----------------------------------------------------------------get all sessions-----------------------------------------------------------------

@bp_login.route("/sessions", methods=["GET"], name="get_all_sessions")
async def get_all_sessions_route(request):
    try:
        result = get_all_sessions(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# ------------------------------------------------------------------create session------------------------------------------------------------------

@bp_login.route("/sessions", methods=["POST"], name="create_session")
async def create_session_route(request):
    try:
        result = create_session(request)
        status_code = 201 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# ------------------------------------------------------------------create article------------------------------------------------------------------

@bp_login.route("/articles", methods=["POST"], name="create_article")
async def create_article_route(request):
    try:
        result = create_article(request)
        status_code = 201 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# ------------------------------------------------------------------get all article------------------------------------------------------------------

@bp_login.route("/article", methods=["GET"], name="get_all_article")
async def get_all_articles_route(request):
    try:
        result = get_all_article(request)  
        status_code = 200 if result else 404  
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# -------------------------------------------------------------------get all games-------------------------------------------------------------------

@bp_login.route("/games", methods=["GET"], name="get_all_games")
async def get_all_games_route(request):
    try:
        result = get_all_games(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# --------------------------------------------------------------------create game--------------------------------------------------------------------

@bp_login.route("/games", methods=["POST"], name="create_game")
async def create_game_route(request):
    try:
        result = create_game(request)
        status_code = 201 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# --------------------------------------------------------------------user logout--------------------------------------------------------------------

@bp_login.route("/logout", methods=["PUT"], name="logout_user")
async def user_logout(request):
    try:
        result = logout_user(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)

# ---------------------------------------------------------------------dashboard---------------------------------------------------------------------

@bp_login.route("/dashboard", methods=["GET"], name="dashboard")
async def dashboard_route(request):
    try:
        result = dashboard(request)
        status_code = 200 if not result.get("error") else 400
        return json({"result": result, "status": status_code}, status=status_code)
    except Exception as e:
        return json({"msg": "Internal server error", "error": str(e)}, status=500)