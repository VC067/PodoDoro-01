from flask import Flask, render_template, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from flask import send_from_directory

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pomofocus.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)  # Enable CORS

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'POST':
        task_content = request.json.get('content')
        if not task_content:
            return jsonify({'error': 'Task content is required'}), 400
        new_task = Task(content=task_content)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'message': 'Task created successfully', 'task': {'id': new_task.id, 'content': new_task.content, 'completed': new_task.completed}}), 201
    else:
        tasks = Task.query.all()
        return jsonify([{'id': task.id, 'content': task.content, 'completed': task.completed} for task in tasks])

@app.route('/api/tasks/<int:task_id>', methods=['PUT', 'DELETE'])
def handle_task(task_id):
    task = Task.query.get_or_404(task_id)
    if request.method == 'PUT':
        task_content = request.json.get('content')
        task_completed = request.json.get('completed')
        
        if task_content is not None:
            task.content = task_content
        if task_completed is not None:
            task.completed = task_completed
            
        db.session.commit()
        return jsonify({'message': 'Task updated successfully', 'task': {'id': task.id, 'content': task.content, 'completed': task.completed}})
    elif request.method == 'DELETE':
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
