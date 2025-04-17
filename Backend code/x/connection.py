from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base



DATABASE = "gait"
USER = "gait_web_internal_user"
PASSWORD = "W$ebIU$#gait"
HOST = "gait-snapshot-restored.cogrzb6b27pe.ap-southeast-2.rds.amazonaws.com"
PORT = "5432"
SCHEMA = "gait_web_internal_db"
SQLALCHEMY_DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={'options': f'-csearch_path={SCHEMA}'})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)  
Base = declarative_base()
schema = SCHEMA
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


