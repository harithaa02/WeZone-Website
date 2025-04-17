from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, Text
from connection import Base, schema
from datetime import datetime



class Employee(Base):
    __tablename__ = "org_users"
    __table_args__ = {'schema': schema}

    org_user_id = Column(Integer, primary_key=True)
    full_name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False, unique=True)
    encrypted_password = Column(Text, nullable=False)
    designation = Column(String(50), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    photo_image_url = Column(Text, nullable=True)
    hobbies = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_by = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow())
    updated_at = Column(DateTime, default=datetime.utcnow(), onupdate=datetime.utcnow())
    uuid = Column(Text, nullable=True)
    auth_token = Column(Text, nullable=True)

    def __repr__(self):
        return f"<Employee(org_user_id={self.org_user_id}, full_name={self.full_name}, email={self.email})>"



class OTP(Base):
    __tablename__ = "org_otps"
    __table_args__ = {'schema': schema}

    otp_id = Column(Integer, primary_key=True, index=True, unique=True)
    org_user_id_ref = Column(Integer, nullable=False)
    otp = Column(Integer, nullable=False)
    otp_time = Column(DateTime, nullable=False)

    def __repr__(self):
        return f"<OTP(otp_id={self.otp_id}, org_user_id_ref={self.org_user_id_ref}, otp={self.otp})>"



class LoginMaster(Base):
    __tablename__ = "org_login_master"
    __table_args__ = {'schema': schema}

    login_id = Column(Integer, primary_key=True)
    org_user_id_ref = Column(Integer, nullable=False)
    ip_address = Column(Text, default=None)
    login_time = Column(DateTime, default=None)
    logout_time = Column(DateTime, default=None)

    def __repr__(self):
        return f"<LoginMaster(login_id={self.login_id}, org_user_id_ref={self.org_user_id_ref})>"



class Feature(Base):
    __tablename__ = "org_features_with_data"
    __table_args__ = {'schema': schema}

    feature_id = Column(Integer, primary_key=True)
    feature_name = Column(String(50), nullable=False)
    question = Column(Text, nullable=True)
    category = Column(String(50), nullable=False)
    reason = Column(Text, nullable=True)
    file_upload_url = Column(Text, nullable=True)
    team_photo_url = Column(Text, nullable=True)
    game_name = Column(String(50), nullable=False)
    team_members = Column(Text, nullable=False)
    source_location = Column(Text, nullable=True)
    title = Column(String(50), nullable=False)
    article_content = Column(Text, nullable=True)
    created_by = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow())
    updated_at = Column(DateTime, default=datetime.utcnow(), onupdate=datetime.utcnow())
    name = Column(String(50), nullable=False)
    event_date = Column(Date, nullable=True)

    def __repr__(self):
        return f"<Feature(feature_id={self.feature_id}, feature_name={self.feature_name})>"



class Options(Base):
    __tablename__ = "org_poll_answers"
    __table_args__ = {'schema': schema}

    answer_id = Column(Integer, primary_key=True)
    answer = Column(String(50), nullable=False)
    question_id = Column(Integer, nullable=False)  
    inserted_by = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow())

    def __repr__(self):
        return f"<Options(answer_id={self.answer_id}, answer={self.answer})>"



class Mapping(Base):
    __tablename__ = "mapping_questions_answers"
    __table_args__ = {'schema': schema, 'extend_existing': True}  

    id = Column(Integer, primary_key=True)
    option_id = Column(Integer, nullable=False)  
    voted_by = Column(Integer, nullable=False)  
    created_at = Column(DateTime, default=datetime.utcnow())

    def __repr__(self):
        return f"<Mapping(id={self.id}, question_id={self.question_id}, option_id={self.option_id})>"