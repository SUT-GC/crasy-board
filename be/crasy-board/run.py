from flask import Flask
from api.login import (
    login_page,
)

from api.index import (
    index_page
)

app = Flask(__name__)

app.register_blueprint(login_page, url_prefix='/login')
app.register_blueprint(index_page, url_prefix='/index')

if __name__ == "__main__":
    app.run()