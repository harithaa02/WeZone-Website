from sqlalchemy.sql.expression import extract
from wezone.models import Employee,OTP,LoginMaster,Feature,Options,Mapping
import bcrypt, os, uuid, socket, helpers
from datetime import datetime
from helpers import send_mail ,Hash,generate_token
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy import func, extract

# --------------------------------------------------------------------user login--------------------------------------------------------------------

def login_user(request):
    helpers = Hash()
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        required_fields = ["email", "password"]
        for field in required_fields:
            if not data.get(field):  
                return {"error": f"The '{field}' field is required.", "msg": ""}
        user = request.ctx.session.query(Employee).filter(Employee.email == email).first()
        if not user:
            return {"error": "User not found", "msg": ""}
        if bcrypt.checkpw(password.encode("utf-8"), user.encrypted_password.encode("utf-8")):
            token = generate_token(user.email)
            hostname = socket.gethostname()
            ip_address = socket.gethostbyname(hostname)
            login_record = LoginMaster(
                ip_address=ip_address,
                login_time=datetime.utcnow(),
                org_user_id_ref=user.org_user_id
            )
            request.ctx.session.add(login_record)
            request.ctx.session.commit()
            user.auth_token = token
            request.ctx.session.commit()
            return {
                "msg": "Login successful",
                "error": "",
                "uuid": user.uuid,
                "auth_token": token
            }
        else:
            return {"error": "Invalid credentials", "msg": ""}
    except SQLAlchemyError as e:
        request.app.logger.error(f"Database error: {e}")
        return {"error": "A database error occurred", "msg": ""}
    except Exception as e:
        request.app.logger.error(f"Unexpected error: {e}")
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# -------------------------------------------------------------------get all users-------------------------------------------------------------------

def get_all_users(request):
    try:
        user = helpers.authorize_user(request)
        if user is None:
            token = request.headers.get("Authorization")
            if not token:
                return {"error": "Token is missing", "msg": ""}
            else:
                return {"error": "Token is invalid or expired", "msg": ""}
        if not user.is_admin:
            return {"error": "You are not authorized to perform this action.", "status": 403}
        users = request.ctx.session.query(Employee).all()
        result = [
            {
                "user_id": user.org_user_id,
                "uuid": user.uuid,
                "full_name": user.full_name,
                "email": user.email,
                "designation": user.designation,
                "date_of_birth": user.date_of_birth.strftime("%Y-%m-%d") if user.date_of_birth else None,
                "photo_image_url": user.photo_image_url,
                "hobbies": user.hobbies,
                "is_active": user.is_active,
                "is_admin": user.is_admin,
                "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S") if user.created_at else None,
                "updated_at": user.updated_at.strftime("%Y-%m-%d %H:%M:%S") if user.updated_at else None,
            }
            for user in users
        ]
        return {"msg": "Users retrieved successfully", "error": "", "data": result}
    except Exception as e:
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# ------------------------------------------------------------------get user by id------------------------------------------------------------------

def get_user_by_id(request, user_id):
    try:
        user = helpers.authorize_user(request)
        if user is None:
            token = request.headers.get("Authorization")
            if not token:
                return {"error": "Token is missing", "msg": ""}
            else:
                return {"error": "Token is invalid or expired", "msg": ""}
        if not user.is_admin:
            return {"error": "You are not authorized to perform this action.", "status": 403}
        users = request.ctx.session.query(Employee).all()
        user = request.ctx.session.query(Employee).filter(Employee.org_user_id == user_id).first()
        if not user:
            return {"error": "User not found", "msg": ""}
        result = {
            "user_id": user.org_user_id,
            "uuid": user.uuid,
            "full_name": user.full_name,
            "email": user.email,
            "designation": user.designation,
            "date_of_birth": user.date_of_birth.strftime("%Y-%m-%d") if user.date_of_birth else None,
            "photo_image_url": user.photo_image_url,
            "hobbies": user.hobbies,
            "is_active": user.is_active,
            "is_admin": user.is_admin,
            "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S") if user.created_at else None,
            "updated_at": user.updated_at.strftime("%Y-%m-%d %H:%M:%S") if user.updated_at else None,
        }
        return {"msg": "User retrieved successfully", "error": "", "data": result}
    except Exception as e:
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# --------------------------------------------------------------------create user--------------------------------------------------------------------

def create_user(request):
    try:
        user = helpers.authorize_user(request)
        if user is None:
            token = request.headers.get("Authorization")
            if not token:
                return {"error": "Token is missing", "msg": ""}
            else:
                return {"error": "Token is invalid or expired", "msg": ""}
        if not user.is_admin:
            return {"error": "You are not authorized to perform this action.", "status": 403}
        required_fields = ["full_name", "email", "password", "designation", "date_of_birth", "hobbies"]
        for field in required_fields:
            if not request.form.get(field):
                return {"error": f"The '{field}' field is required.", "msg": ""}
        full_name = request.form.get("full_name")
        email = request.form.get("email")
        password = request.form.get("password")
        designation = request.form.get("designation")
        date_of_birth = request.form.get("date_of_birth")
        hobbies = request.form.get("hobbies")
        if not email.endswith("@gaitglobal.com"):
            return {"error": "Invalid email domain. Must end with @gaitglobal.com", "msg": ""}
        existing_user = request.ctx.session.query(Employee).filter(Employee.email == email).first()
        if existing_user:
            return {"error": "User with this email already exists", "msg": ""}
        file = request.files.get("photo_image_url")
        unique_id = str(uuid.uuid4())
        base_folder_path = os.path.join(os.getcwd(), "static", "profile_pic")
        os.makedirs(base_folder_path, exist_ok=True)
        file_url = None
        if file:
            file_path = os.path.join(base_folder_path, f"{unique_id}_{file.name}")
            with open(file_path, "wb") as f:
                f.write(file.body)
                server_host = request.host.split(":")[0]
                server_port = request.host.split(":")[1]
                file_url = f"http://{server_host}:{server_port}/static/profile_pic/{unique_id}_{file.name}"
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        user_uuid = str(uuid.uuid4())
        new_user = Employee(
            uuid=user_uuid,
            full_name=full_name,
            email=email,
            created_by=1,
            encrypted_password=hashed_password,
            designation=designation,
            date_of_birth=datetime.strptime(date_of_birth, "%Y-%m-%d").date(),
            photo_image_url=file_url,
            hobbies=hobbies,
        )
        request.ctx.session.add(new_user)
        request.ctx.session.commit()
        request.ctx.session.refresh(new_user)
        return {"msg": "User created successfully", "error": "", "uuid": new_user.uuid}
    except Exception as e:
        request.ctx.session.rollback()
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# --------------------------------------------------------------------update user--------------------------------------------------------------------

def update_user(request, user_id):
    try:
        user = helpers.authorize_user(request)
        if user is None:
            token = request.headers.get("Authorization")
            if not token:
                return {"error": "Token is missing", "msg": ""}
            else:
                return {"error": "Token is invalid or expired", "msg": ""}
        if not user.is_admin:
            return {"error": "You are not authorized to perform this action.", "status": 403}
        target_user = request.ctx.session.query(Employee).filter(Employee.org_user_id == user_id).first()
        if not target_user:
            return {"error": "User not found", "msg": ""}
        data = request.form
        full_name = data.get("full_name", target_user.full_name)
        email = data.get("email", target_user.email)
        password = data.get("password")
        designation = data.get("designation", target_user.designation)
        date_of_birth = data.get("date_of_birth", target_user.date_of_birth.strftime("%Y-%m-%d"))
        hobbies = data.get("hobbies", target_user.hobbies)
        if email and not email.endswith("@gaitglobal.com"):
            return {"error": "Invalid email domain. Must end with @gaitglobal.com", "msg": ""}
        file = request.files.get("photo_image_url")
        file_url = target_user.photo_image_url
        if file:
            unique_id = str(uuid.uuid4())
            base_folder_path = os.path.join(os.getcwd(), "static", "profile_pic")
            os.makedirs(base_folder_path, exist_ok=True)
            file_path = os.path.join(base_folder_path, f"{unique_id}_{file.name}")
            with open(file_path, "wb") as f:
                f.write(file.body)
                server_host = request.host.split(":")[0]
                server_port = request.host.split(":")[1]
                file_url = f"http://{server_host}:{server_port}/static/profile_pic/{unique_id}_{file.name}"
        if password:
            hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            target_user.encrypted_password = hashed_password
        target_user.full_name = full_name
        target_user.email = email
        target_user.designation = designation
        target_user.date_of_birth = datetime.strptime(date_of_birth, "%Y-%m-%d").date()
        target_user.photo_image_url = file_url
        target_user.hobbies = hobbies
        request.ctx.session.commit()
        request.ctx.session.refresh(target_user)
        return {"msg": "User updated successfully", "error": "", "uuid": target_user.uuid}
    except Exception as e:
        request.ctx.session.rollback()
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# --------------------------------------------------------------------delete user--------------------------------------------------------------------

def delete_user(request, user_id):
    try:
        user = helpers.authorize_user(request)
        if user is None:
            token = request.headers.get("Authorization")
            if not token:
                return {"error": "Token is missing", "msg": ""}
            else:
                return {"error": "Token is invalid or expired", "msg": ""}
        if not user.is_admin:
            return {"error": "You are not authorized to perform this action.", "status": 403}
        user = request.ctx.session.query(Employee).filter(Employee.org_user_id == user_id).first()
        if not user:
            return {"error": "User not found", "msg": ""}
        request.ctx.session.delete(user)
        request.ctx.session.commit()
        return {"msg": "User deleted successfully", "error": "", "uuid": user.uuid}
    except Exception as e:
        request.ctx.session.rollback()
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close() 

# -----------------------------------------------------------------get all birthday-----------------------------------------------------------------

def get_all_birthday(request):
    try:
        users = request.ctx.session.query(
            Employee.uuid,
            Employee.full_name,
            Employee.email,
            Employee.date_of_birth,
            Employee.photo_image_url,
        ).order_by(
            extract("month", Employee.date_of_birth).asc(),
            extract("day", Employee.date_of_birth).asc()
        ).all()
        result = [
            {
                "uuid": user.uuid,
                "full_name": user.full_name,
                "email": user.email,
                "date_of_birth": user.date_of_birth.strftime("%Y-%m-%d") if user.date_of_birth else None,
                "photo_image_url": user.photo_image_url,
            }
            for user in users
        ]
        return {"msg": "Users retrieved successfully", "error": "", "data": result}
    except Exception as e:
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# ------------------------------------------------------------------forgot password------------------------------------------------------------------

def forget_password(request):
    try:
        email = request.json.get("email")
        if not email:
            return {"error": "Email is required", "msg": ""}
        user = request.ctx.session.query(Employee).filter(Employee.email == email).first()
        if not user:
            return {"error": "User not found", "msg": ""}
        if user:
            send_mail(email, request.ctx.session, subject="OTP for Password Reset")
            return {"msg": "OTP sent successfully", "error": ""}
        return {"msg": "OTP sent successfully (check console)", "error": ""}
    except Exception as e:
        request.ctx.session.rollback()
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# ------------------------------------------------------------------reset password------------------------------------------------------------------

def reset_password(request):
    try:
        data = request.json
        email = data.get("email")
        otp = data.get("otp")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")
        if not all([email, otp, new_password, confirm_password]):
            return {"error": "All fields are required", "msg": ""}
        if new_password != confirm_password:
            return {"error": "Passwords do not match", "msg": ""}
        user = request.ctx.session.query(Employee).filter(Employee.email == email).first()
        if not user:
            return {"error": "User not found", "msg": ""}
        otp_record = request.ctx.session.query(OTP).filter(
            OTP.org_user_id_ref == user.org_user_id,
            OTP.otp == otp,
        ).first()
        if not otp_record:
            return {"error": "Invalid OTP", "msg": ""}
        elapsed_time = (datetime.utcnow() - otp_record.otp_time).total_seconds()
        if elapsed_time >180:  
            return {"error": "OTP expired", "msg": ""}
        hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        user.encrypted_password = hashed_password
        user.updated_at = datetime.utcnow()
        request.ctx.session.add(user)
        request.ctx.session.commit()
        request.ctx.session.delete(otp_record)
        request.ctx.session.commit()
        return {"msg": "Password reset successfully", "error": ""}
    except Exception as e:
        request.ctx.session.rollback()
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# ------------------------------------------------------------------create shootout------------------------------------------------------------------

def create_shootout(request):
    try:
        user = helpers.authorize_user(request)
        if user is None:
            token = request.headers.get("Authorization")
            if not token:
                return {"error": "Token is missing", "msg": ""}
            else:
                return {"error": "Token is invalid or expired", "msg": ""}
        if not user.is_admin:
            return {"error": "You are not authorized to perform this action.", "status": 403}
        name = request.form.get("name") or request.json.get("name")
        reason = request.form.get("reason") or request.json.get("reason")
        category = request.form.get("category") or request.json.get("category")
        event_date = request.form.get("event_date") or request.json.get("event_date")
        required_fields = {"name": name, "reason": reason, "category": category, "event_date": event_date}
        for field, value in required_fields.items():
            if not value:
                return {"error": f"The '{field}' field is required.", "msg": ""}
        from datetime import datetime
        try:
            event_date = datetime.fromisoformat(event_date)
        except ValueError:
            return {"error": "The 'event_date' field must be a valid ISO 8601 date.", "msg": ""}
        shootout = Feature(
            feature_name="shootouts",
            name=name,
            reason=reason,
            category=category,
            event_date=event_date,
        )
        request.ctx.session.add(shootout)
        request.ctx.session.commit()
        return {"msg": "Shootout created successfully", "error": ""}
    except Exception as e:
        request.ctx.session.rollback()
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# -----------------------------------------------------------------get all shootouts-----------------------------------------------------------------

def get_all_shootouts(request):
    try:
        shootouts = request.ctx.session.query(Feature).filter(Feature.feature_name == "shootouts").all()
        if not shootouts:
            return {"error": "No shootouts found.", "msg": ""}
        result = [
            {
                "name": shootout.name,
                "reason": shootout.reason,
                "category": shootout.category,
                "event_date": shootout.event_date.isoformat() if shootout.event_date else None,
            }
            for shootout in shootouts
        ]
        return {"msg": "Shootouts retrieved successfully", "error": "", "data": result}
    except Exception as e:
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# --------------------------------------------------------------------create poll--------------------------------------------------------------------#

def create_poll(request):
    try:
        user = helpers.authorize_user(request)
        if user is None:
            token = request.headers.get("Authorization")
            if not token:
                return {"error": "Token is missing", "msg": ""}
            else:
                return {"error": "Token is invalid or expired", "msg": ""}
        if not user.is_admin:
            return {"error": "You are not authorized to perform this action.", "status": 403}
        data = request.json
        question = data.get("question")
        answers = data.get("answer")  
        event_date = request.form.get("event_date") or request.json.get("event_date")
        if not question or not answers or len(answers) < 2:
            return {"error": "Question and at least two options are required"}
        if not event_date:
            return {"error": "Event date is required"}  
        poll = Feature(
            feature_name="poll",
            question=question,
            event_date=event_date,
            created_at=datetime.utcnow(),
        )
        request.ctx.session.add(poll)
        request.ctx.session.commit()  
        options_data = []
        for answer in answers:
            option = Options(
                answer=answer,
                question_id=poll.feature_id,  
                inserted_by=1,  
                created_at=datetime.utcnow(),
            )
            options_data.append(option)
            request.ctx.session.add(option)       
        request.ctx.session.commit()  
        return {
            "message": "Poll created successfully",
            "poll_id": poll.feature_id,
            "question": poll.question,
            "event_date": poll.event_date.strftime("%Y-%m-%d"), 
            "answers": [
                {"answer_id": opt.answer_id, "answer": opt.answer, "question_id": opt.question_id}
                for opt in options_data
            ],
        }
    except SQLAlchemyError as e:
        return {"error": f"Database error: {str(e)}"}
    except Exception as e:
        return {"error": f"Failed to create poll: {str(e)}"}
    finally:
        request.ctx.session.close()

# -------------------------------------------------------------------get all polls-------------------------------------------------------------------#

def get_all_polls(request):
    try:
        polls = request.ctx.session.query(Feature).filter_by(feature_name="poll").all()
        if not polls:
            return {"message": "No polls available"}  
        poll_data = []
        for poll in polls:
            options = (
                request.ctx.session.query(Options)
                .filter_by(question_id=poll.feature_id)
                .all()
            )
            poll_data.append({
                "poll_id": poll.feature_id,
                "question": poll.question,
                "event_date": poll.event_date.strftime("%Y-%m-%d") if poll.event_date else None,  
                "options": [
                    {"answer_id": option.answer_id, "answer": option.answer}
                    for option in options
                ],
            })
        return {"polls": poll_data}
    except SQLAlchemyError as e:
        return {"error": f"Database error: {str(e)}"}
    except Exception as e:
        return {"error": f"Failed to retrieve polls: {str(e)}"}
    finally:
        request.ctx.session.close()

# ---------------------------------------------------------------------vote poll---------------------------------------------------------------------#

def vote_poll(request):
    try:
        user = helpers.authorize_user(request)
        if user is None:
            token = request.headers.get("Authorization")
            return {"error": "Token is missing" if not token else "Token is invalid or expired"}
        data = request.json
        answer_id = data.get("answer_id")
        if not answer_id:
            return {"error": "Answer ID is required"}
        option = request.ctx.session.query(Options).filter_by(answer_id=answer_id).first()
        if not option:
            return {"error": "Option not found for the given answer_id"}
        poll = request.ctx.session.query(Feature).filter_by(
            feature_id=option.question_id, feature_name="poll"
        ).first()
        if not poll:
            return {"error": "Poll not found for the given question_id"}
        vote = Mapping(
            option_id=answer_id, 
            voted_by=user.org_user_id,  
            created_at=datetime.utcnow(),
        )
        request.ctx.session.add(vote)
        request.ctx.session.commit()
        return {
            "message": "Vote cast successfully",
            "poll_id": poll.feature_id,
            "question": poll.question,
            "voted_option": {
                "answer_id": option.answer_id,
                "answer": option.answer
            },
        }
    except SQLAlchemyError as e:
        return {"error": f"Database error: {str(e)}"}
    except Exception as e:
        return {"error": f"Failed to cast vote: {str(e)}"}
    finally:
        request.ctx.session.close()

# -----------------------------------------------------------------get poll results-----------------------------------------------------------------

def get_poll_results(request):
    try:
        polls = request.ctx.session.query(Feature).filter_by(feature_name="poll").all()
        if not polls:
            return {"error": "No polls found"}
        all_poll_results = []
        for poll in polls:
            options = request.ctx.session.query(Options).filter_by(question_id=poll.feature_id).all()
            if not options:
                continue  
            vote_counts = request.ctx.session.query(
                Mapping.option_id, func.count(Mapping.id).label("vote_count")
            ).filter(Mapping.option_id.in_([option.answer_id for option in options])) \
             .group_by(Mapping.option_id).all()
            vote_count_dict = {vote.option_id: vote.vote_count for vote in vote_counts}
            result_options = [
                {"answer": option.answer, "votes": vote_count_dict.get(option.answer_id, 0)}
                for option in options
            ]
            poll_result = {
                "poll_id": poll.feature_id,
                "question": poll.question,
                "options": result_options,
            }
            all_poll_results.append(poll_result)
        return {"poll_results": all_poll_results}
    except Exception as e:
        return {"error": f"Failed to fetch poll results: {str(e)}"}
    finally:
        request.ctx.session.close()

# -----------------------------------------------------------------get all sessions-----------------------------------------------------------------

def get_all_sessions(request):
    try:
        sessions = request.ctx.session.query(
            Feature.feature_id,
            Feature.feature_name,
            Feature.name,
            Feature.title,
            Feature.file_upload_url,
            Feature.event_date,
        ).filter(Feature.feature_name == "session").order_by(Feature.event_date.asc()).all()
        result = [
            {
                "name": session.name,
                "title": session.title,
                "file_upload_url": session.file_upload_url,
                "event_date": session.event_date.isoformat() if session.event_date else None,
            }
            for session in sessions
        ]
        return {"msg": "Sessions retrieved successfully", "error": "", "data": result}   
    except Exception as e:
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# ------------------------------------------------------------------create session------------------------------------------------------------------

def create_session(request):
    try:
        user = helpers.authorize_user(request)
        if user is None:
            token = request.headers.get("Authorization")
            if not token:
                return {"error": "Token is missing", "msg": ""}
            else:
                return {"error": "Token is invalid or expired", "msg": ""}
        if not user.is_admin:
            return {"error": "You are not authorized to perform this action.", "status": 403}
        name = request.form.get("name")
        title = request.form.get("title")
        event_date = request.form.get("event_date")  
        if event_date:
            try:
                event_date = datetime.strptime(event_date, "%Y-%m-%d").date()
            except ValueError:
                return {"error": "Invalid date format for event_date. Use 'YYYY-MM-DD'."}
        else:
            return {"error": "Event date (event_date) is required."}
        file = request.files.get("file_upload_url")
        unique_id = str(uuid.uuid4())
        base_folder_path = os.path.join(os.getcwd(), "static", "ppt_file")
        os.makedirs(base_folder_path, exist_ok=True)
        file_url = None
        if file:
            file_path = os.path.join(base_folder_path, f"{unique_id}_{file.name}")
            with open(file_path, "wb") as f:
                f.write(file.body)
                server_host = request.host.split(":")[0]
                server_port = request.host.split(":")[1]
                file_url = f"http://{server_host}:{server_port}/static/ppt_file/{unique_id}_{file.name}"
        required_fields = ["name", "title"]
        for field in required_fields:
            if not request.form.get(field):
                return {"error": f"The '{field}' field is required.", "msg": ""}
        new_feature = Feature(
            feature_name="session",
            name=name,
            title=title,
            file_upload_url=file_url,
            event_date=event_date,  
        )
        request.ctx.session.add(new_feature)
        request.ctx.session.commit()
        return {
            "msg": "Feature session created successfully",
            "error": "",
            "data": {"feature_id": new_feature.feature_id},
        }
    except IntegrityError:
        request.ctx.session.rollback()
        return {"error": "Session creation failed due to integrity constraints"}
    except Exception as e:
        request.ctx.session.rollback()
        return {"error": str(e)}
    finally:
        request.ctx.session.close()

# ------------------------------------------------------------------create article------------------------------------------------------------------

def create_article(request):
    try:
        user = helpers.authorize_user(request)
        if user is None:
            token = request.headers.get("Authorization")
            if not token:
                return {"error": "Token is missing", "msg": ""}
            else:
                return {"error": "Token is invalid or expired", "msg": ""}
        data = request.json
        name = data.get("name")
        title = data.get("title")
        article_content = data.get("article_content")
        event_date = data.get("event_date")
        required_fields = ["name", "title", "article_content", "event_date"]
        for field in required_fields:
            if not data.get(field):
                return {"error": f"The '{field}' field is required.", "msg": ""}
        try:
            parsed_date = datetime.strptime(event_date, "%Y-%m-%d").date()
        except ValueError:
            return {"error": "Invalid date format for 'event_date'. Use 'YYYY-MM-DD'.", "msg": ""}
        article = Feature(
            feature_name="Article",
            name=name,
            title=title,
            article_content=article_content,
            event_date=parsed_date
        )
        request.ctx.session.add(article)
        request.ctx.session.commit()
        return {"msg": "Article created successfully", "error": ""}
    except Exception as e:
        request.ctx.session.rollback()
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# ------------------------------------------------------------------get all article------------------------------------------------------------------

def get_all_article(request):
    try:
        articles = request.ctx.session.query(Feature).filter(Feature.feature_name == "Article").all()
        result = []
        for article in articles:
            result.append({
                "name": article.name,
                "title": article.title,
                "article_content": article.article_content,
                "event_date": article.event_date.isoformat() if article.event_date else None,
                "created_at": article.created_at.isoformat() if article.created_at else None
            })
        return result
    except Exception as e:
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# -------------------------------------------------------------------get all games-------------------------------------------------------------------

def get_all_games(request):
    try:
        games = request.ctx.session.query(
            Feature.feature_id,
            Feature.team_photo_url,
            Feature.team_members,
            Feature.game_name,
            Feature.source_location,
            Feature.event_date,
        ).filter(Feature.feature_name == "game").all()
        result = [
            {
                "team_photo_url": game.team_photo_url,
                "team_members": game.team_members.split(",") if game.team_members else [],
                "game_name": game.game_name,
                "location_name": game.source_location,
                "event_date": game.event_date.isoformat() if game.event_date else None,
            }
            for game in games
        ]
        return {"msg": "Games retrieved successfully", "error": "", "data": result}
    except Exception as e:
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# --------------------------------------------------------------------create game--------------------------------------------------------------------

def create_game(request):
    try:
        user = helpers.authorize_user(request)
        if user is None:
            token = request.headers.get("Authorization")
            if not token:
                return {"error": "Token is Required", "msg": ""}
            else:
                return {"error": "Token is invalid or expired", "msg": ""}
        if not user.is_admin:
            return {"error": "You are not authorized to perform this action.", "status": 403}
        team_members = request.form.get("team_members")
        game_name = request.form.get("game_name")
        location_name = request.form.get("location_name")
        event_date_str = request.form.get("event_date")  
        file = request.files.get("team_photo_url")
        required_fields = ["team_members", "game_name", "location_name", "event_date"]
        for field in required_fields:
            if not request.form.get(field):
                return {"error": f"The '{field}' field is required.", "msg": ""}
        try:
            event_date = datetime.strptime(event_date_str, "%Y-%m-%d").date()  
        except ValueError:
            return {"error": "Invalid date format for event_date. Use YYYY-MM-DD."}
        if not isinstance(team_members, str):
            return {"error": "team_members must be a string of comma-separated values"}
        file_url = None
        if file:
            unique_id = str(uuid.uuid4())
            base_folder_path = os.path.join(os.getcwd(), "static", "team_photos")
            os.makedirs(base_folder_path, exist_ok=True)
            file_path = os.path.join(base_folder_path, f"{unique_id}_{file.name}")
            with open(file_path, "wb") as f:
                f.write(file.body)
            server_host = request.host.split(":")[0]
            server_port = request.host.split(":")[1]
            file_url = f"http://{server_host}:{server_port}/static/team_photos/{unique_id}_{file.name}"
        team_members_str = ",".join(team_members.split(","))
        new_game = Feature(
            feature_name="game",
            team_photo_url=file_url,
            team_members=team_members_str,
            game_name=game_name,
            source_location=location_name,
            event_date=event_date,  
        )
        request.ctx.session.add(new_game)
        request.ctx.session.commit()
        request.ctx.session.refresh(new_game)
        return {"msg": "Game created successfully", "error": "", "data": {"id": new_game.feature_id}}
    except Exception as e:
        request.ctx.session.rollback()
        return {"error": str(e)}
    finally:
        request.ctx.session.close()

# --------------------------------------------------------------------user logout--------------------------------------------------------------------

def logout_user(request):
    try:
        token = request.headers.get("Authorization")
        if not token:
            return {"error": "Token is required", "msg": ""}
        token = token.split(" ")[1] if " " in token else token  
        decoded_token, error = helpers.validate_token(token)
        if error:
            return {"error": error, "msg": ""}
        email_from_token = decoded_token.get("email")
        if not email_from_token:
            return {"error": "Invalid token payload", "msg": ""}
        user = request.ctx.session.query(Employee).filter(Employee.email == email_from_token).first()
        if not user:
            return {"error": "Invalid token or user does not exist", "msg": ""}
        login_record = (
            request.ctx.session.query(LoginMaster)
            .filter(LoginMaster.org_user_id_ref == user.org_user_id, LoginMaster.logout_time == None)
            .order_by(LoginMaster.login_time.desc())
            .first()
        )
        if not login_record:
            return {"error": "No active login session found", "msg": ""}
        login_record.logout_time = datetime.utcnow()
        request.ctx.session.commit()
        user.auth_token = None
        request.ctx.session.commit()
        return {"msg": "Logout successful", "error": ""}
    except Exception as e:
        request.ctx.session.rollback()
        return {"error": str(e), "msg": ""}
    finally:
        request.ctx.session.close()

# ---------------------------------------------------------------------dashboard---------------------------------------------------------------------

def dashboard(request):
    try:
        birthday_users = get_all_birthday(request)
        shootouts = get_all_shootouts(request)
        sessions = get_all_sessions(request)
        games = get_all_games(request)
        return {
            "birthday_users": birthday_users["data"],
            "shootouts": shootouts,
            "sessions": sessions["data"],
            "games": games["data"]
        }
    except Exception as e:
        return {"error": str(e), "msg": "Error fetching dashboard data"}