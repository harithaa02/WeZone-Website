from sanic import Sanic
from sanic_ext import Extend
from sqlalchemy.orm import scoped_session
from contextvars import ContextVar
from connection import Base, engine, SessionLocal
from wezone.routes import bp_login



app = Sanic('__main__')
app.config.CORS_ORIGINS = "*"
Extend(app)
app.static('/static','./static')
app.blueprint(bp_login)
Base.metadata.create_all(engine)
_base_model_session_ctx = ContextVar("session")
connection_key = 0
 


@app.middleware("request")
def inject_session(request):
    request.ctx.session = scoped_session(SessionLocal)
    global connection_key
    connection_key += 1    
    print(f"Connection opened. Total open connections: {connection_key}")
    request.ctx.session_ctx_token = _base_model_session_ctx.set(
        request.ctx.session)



@app.middleware("response")
def close_session(request, response):
    if hasattr(request.ctx, "session_ctx_token"):  
        _base_model_session_ctx.reset(request.ctx.session_ctx_token)
        if request.ctx.session is not None:
            request.ctx.session.close()    
            global connection_key
            if connection_key > 0:
                connection_key -= 1
                print(f"Connection closed. Total open connections: {connection_key}")
            else:
                print("No open connections to close.")
        else:
            print("Warning: Session is None, no need to close.")