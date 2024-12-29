
from flask import Flask, render_template
import os

app = Flask(__name__)

def get_photo_galleries():
    """
    Scans the static/photos directory and returns information about all photos galleries.
    Returns a list of directories containing gallery names and paths.
    """

    photos_dir = os.path.join(app.static_folder, 'photos')
    galleries = []

    print("Looking for photos in:", photos_dir)
    print("Does the directory exist?", os.path.exists(photos_dir))

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

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/projects/<project_id>')
def project_detail(project_id):
    return render_template('project_detail.html', project_id=project_id)

@app.route('/games')
def games():
    return render_template('games.html')

@app.route('/games/<game_id>')
def game_detail(game_id):
    return render_template('game_detail.html', game_id=game_id)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
