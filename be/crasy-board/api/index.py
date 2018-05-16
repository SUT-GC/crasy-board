from flask import(
    Blueprint, 
    render_template, 
    abort,
    url_for,
    redirect
) 

index_page = Blueprint('index_page', __name__)

@index_page.route('/')
def say_hello():
    # return redirect(url_for('login_page.login'))
    return 
    