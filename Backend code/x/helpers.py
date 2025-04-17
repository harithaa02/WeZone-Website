import secrets, random, string, smtplib, traceback, bcrypt, jwt
from passlib.context import CryptContext
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from wezone.models import Employee,OTP
from datetime import datetime, timedelta, date



pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")
sender_password = 'xxql teat zhda gitm'
sender_email = "gistg001@gmail.com"
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256" 



def generate_token(UserName):
    try:
        expiration = datetime.utcnow() + timedelta(hours=8)
        payload = {
            "email": UserName,
            "exp": expiration
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return token
    except Exception as e:
        print(e)
        return str(e)



def decode_auth_token(request):
    token = request.headers.get('Authorization')
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception as e:
        print(f"Error decoding token: {e}")
        return None



def validate_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, "Token Expired"
    except jwt.InvalidTokenError:
        return None, "Invalid Token"



def authorize_user(request):
    decoded_token = decode_auth_token(request)
    if decoded_token is None:
        return None
    email = decoded_token.get('email')
    user = request.ctx.session.query(Employee).filter(Employee.email == email).first()
    if user:
        return user
    else:
        return None



def get_html(otp):
    html_body = f"""<html><body><div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">GLAD</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing GLAD. Use the following OTP to complete your Authentication procedures. OTP is valid for 3 minutes</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">{otp}</h2>
        <p style="font-size:0.9em;">Regards,<br />GLAD</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        </div>
    </div>
    </div></body></html>"""
    return html_body



def send_mail(recipient_email, request, subject):
    try:
        otp = generate_otp()
        message = MIMEMultipart()
        html_body = get_html(otp)
        message['Subject'] = subject
        message['From'] = sender_email 
        message['To'] = recipient_email
        message.attach(MIMEText(html_body, 'html'))
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)  
        server.sendmail(sender_email, recipient_email, message.as_string())
        server.quit()
        user = request.query(Employee).filter(Employee.email == recipient_email).first()
        if not user:
            raise ValueError(f"No user found with email: {recipient_email}")
        new_user = OTP(org_user_id_ref=user.org_user_id, otp=otp, otp_time=datetime.utcnow())
        request.add(new_user)
        request.commit()
        request.refresh(new_user)
        return True
    except Exception as e:
        traceback.print_exc()
        print(f"Error: {str(e)}")
        return False



def send_otp(recipient_email, otp):
    subject = "Your OTP for Authentication"
    html_body = get_html(otp)
    return send_mail(recipient_email, html_body, subject)



def send_password_mail(recipient_email, new_password):
    try:
        subject = "Your New Password"
        html_body = f"<p>Dear User,</p><p>Your account has been created successfully.</p><p>Your login password is: <b>{new_password}</b></p>"
        return send_mail(recipient_email, html_body, subject)
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return False



def generate_random_password(length=12):
    if length < 4:
        raise ValueError("Password length must be at least 4 characters.")
    alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?"
    return ''.join(secrets.choice(alphabet) for i in range(length))



class Hash:
    @staticmethod
    def hash_password(password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        return hashed_password.decode('utf-8')
    @staticmethod
    def verify_password(hashed_password, plain_password):
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))



def serialize_object(obj):
    if isinstance(obj, dict):
        return {k: serialize_object(v) for k, v in obj.items()}
    if not obj:
        return {}
    if hasattr(obj, 'dict'):
        serialized = {}
        for key, value in vars(obj).items():
            if key.startswith('_'):
                continue  
            if isinstance(value, datetime):
                serialized[key] = value.isoformat()  
            elif isinstance(value, date):
                serialized[key] = value.isoformat()
            elif isinstance(value, list):
                serialized[key] = [serialize_object(item) for item in value]
            elif isinstance(value, dict):
                serialized[key] = {k: serialize_object(v) for k, v in value.items()}
            elif hasattr(value, 'dict'):
                serialized[key] = serialize_object(value)
            else:
                serialized[key] = value
        return serialized
    else:
        return obj



def serialize_object_list(obj_list):
    return [serialize_object(item) for item in obj_list]



def send_login_email(recipient_email, request, subject):
    try:
        upassword = generate_random_password()
        message = MIMEMultipart()
        message['Subject'] = subject
        html_body = get_html_forusercreate(upassword)
        message.attach(MIMEText(html_body, 'html'))
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login("your_email@gmail.com", "your_password")
        server.sendmail("your_email@gmail.com", recipient_email, message.as_string())
        server.quit()
        user = request.query(Employee).filter(Employee.email == recipient_email).first()
        user.encrypted_password = Hash.hash_password(upassword)
        request.commit()
        return True
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return False



def get_html_forusercreate(upassword):
    html_body = f"""<html><body><div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">GLAD</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing Plus91. Use the following credentials to login.</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">{upassword}</h2>
        <p style="font-size:0.9em;">Regards,<br />GLAD</p>
        <hr style="border:none;border-top:1px solid #eee" />
    </div>
    </div></body></html>"""
    return html_body



def generate_otp():
    otp = ''.join(random.choice(string.digits) for _ in range(6))
    print(otp)
    return otp