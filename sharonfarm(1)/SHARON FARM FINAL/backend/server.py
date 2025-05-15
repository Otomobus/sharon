
from flask import Flask, request, redirect, render_template
from werkzeug.utils import secure_filename
import os
import re

app = Flask(__name__)
app.config['UPLOAD_FOLDER_PRODUCTS'] = 'static/uploads/products'
app.config['UPLOAD_FOLDER_PROJECTS'] = 'static/uploads/projects'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    title = request.form['title']
    description = request.form['description']
    category = request.form['category']

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        if category == 'product':
            upload_folder = app.config['UPLOAD_FOLDER_PRODUCTS']
            html_path = 'templates/products.html'
            static_path = '/static/uploads/products/' + filename
        elif category == 'project':
            upload_folder = app.config['UPLOAD_FOLDER_PROJECTS']
            html_path = 'templates/projects.html'
            static_path = '/static/uploads/projects/' + filename
        else:
            return "Invalid category", 400

        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        # Create new card HTML
        new_card = f"""
        <div class='card'>
            <img src='{static_path}' alt='{title}'>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
        """.strip()

        # Insert new card before the last </section>
        with open(html_path, 'r', encoding='utf-8') as f:
            html = f.read()

        updated_html = re.sub(r'(</section>)', new_card + r'\n\1', html, count=1, flags=re.DOTALL)

        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(updated_html)

        return redirect('/admin')

    return "File type not allowed", 400

@app.route('/admin')
def admin():
    return '''
    <form action="/upload" method="post" enctype="multipart/form-data">
        Title: <input type="text" name="title"><br>
        Description: <input type="text" name="description"><br>
        Category:
        <select name="category">
            <option value="product">Product</option>
            <option value="project">Project</option>
        </select><br>
        File: <input type="file" name="file"><br>
        <input type="submit" value="Upload">
    </form>
    '''

if __name__ == "__main__":
    app.run(debug=True)
