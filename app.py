
from flask import Flask, render_template
import os
import markdown
import logging

app = Flask(__name__)

def get_projects(projects_dir):
    """
    Each project should have a project.md file and thumbnail image.
    """
    projects_dir_os = os.path.join(app.static_folder, projects_dir)
    projects = []

    if os.path.exists(projects_dir_os):
        for project_name in os.listdir(projects_dir_os):
            project_path = os.path.join(projects_dir_os, project_name)

            if os.path.isdir(project_path):
                md_path = os.path.join(project_path, 'project.md')
                thumbnail = None

                # Look for thumbnail image
                for img_name in ['thumbnail.jpg', 'thumbnail.png', 'thumbnail.jpeg']:
                    img_path = os.path.join(project_path, img_name)
                    if os.path.exists(img_path):
                        thumbnail = img_name
                        break

                if os.path.exists(md_path) and thumbnail:

                    mod_time = os.path.getmtime(md_path)

                    projects.append({
                        'name': project_name,
                        'path': f'{projects_dir}/{project_name}',
                        'thumbnail': thumbnail,
                        'mod_time': mod_time
                    })

    return sorted(projects, key=lambda x: x['mod_time'], reverse=True)

def get_photo_galleries():
    """
    Scans the static/photos directory and returns information about all photos galleries.
    Returns a list of directories containing gallery names and paths.
    """

    photos_dir = os.path.join(app.static_folder, 'photos')
    galleries = []

    if os.path.exists(photos_dir):
        for gallery_name in os.listdir(photos_dir):
            gallery_path = os.path.join(photos_dir, gallery_name)
            if os.path.isdir(gallery_path):
                thumbnail = None
                for photo in os.listdir(gallery_path):
                    if photo.lower().endswith(('.png', '.jpg', '.jpeg')):
                        thumbnail = photo
                        break

                galleries.append({
                    'name': gallery_name,
                    'path': f'photos/{gallery_name}',
                    'thumbnail': thumbnail
                })
    
    return galleries

@app.route('/photos')
def photos():
    galleries = get_photo_galleries()
    return render_template('photos.html', galleries=galleries)

@app.route('/photos/<gallery_name>')
def photo_gallery(gallery_name):

    gallery_path = f'photos/{gallery_name}'
    gallery = { 'name': gallery_name, 'path': gallery_path}
    photos = []
    for photo in os.listdir(os.path.join(app.static_folder, gallery_path)):
        if photo.lower().endswith(('.png', '.jpg', '.jpeg')):
            photos.append(photo)

    return render_template('photo_gallery.html', gallery=gallery, photos=photos)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/main_projects')
def main_projects():
    projects = get_projects('main_projects')
    return render_template('main_projects.html', projects=projects)

@app.route('/minor_projects')
def minor_projects():
    projects = get_projects('minor_projects')
    return render_template('minor_projects.html', projects=projects)

@app.route('/project_detail/<project_dir>/<project_name>')
def project_detail(project_name, project_dir):
    project_path = os.path.join(app.static_folder, f'{project_dir}/{project_name}')
    md_path = os.path.join(project_path, 'project.md')

    #print("Path: " + md_path)
    project = { 'name': project_name, 'content': 'Project not found'}
    if os.path.exists(md_path):
        with open(md_path, 'r', encoding='utf-8') as md_file:
            md_content = md_file.read()

        html_content = markdown.markdown(
            md_content,
            extensions=[
                'fenced_code',  # Allows code blocks to be defined with ```
                'nl2br',        # Converts newlines to <br> tags
            ]
        )

        project = { 'name': project_name, 'content': html_content}
    else:
        logging.error(f"Project not found at {project_path}")

    return render_template('project_detail.html', project=project)

@app.route('/games')
def games():
    return render_template('games.html')

@app.route('/games/<game_id>')
def game_detail(game_id):
    return render_template('game_detail.html', game_id=game_id)

if __name__ == '__main__':
    use_directory_urls=False        # Use directory URLs instead of query parameters
    logging.basicConfig(level=logging.DEBUG)
    app.run(host='0.0.0.0', port=5000, debug=True)
