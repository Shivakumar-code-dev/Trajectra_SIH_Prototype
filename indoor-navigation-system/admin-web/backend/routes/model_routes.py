"""Model upload and management routes."""
from flask import Blueprint, request, jsonify, g
from middleware import verify_admin
from datetime import datetime, timezone
import uuid, os, tempfile

model_bp = Blueprint('models', __name__)

ALLOWED_EXTENSIONS = {'glb', 'gltf', 'obj', 'fbx', 'skp', 'dae', '3ds'}

def _db():
    from firebase_init import get_firestore
    return get_firestore()

def _bid():
    return os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@model_bp.route('/', methods=['GET'])
def get_models():
    db = _db()
    docs = db.collection('models').where('buildingId', '==', _bid()).stream()
    models = [{'id': d.id, **d.to_dict()} for d in docs]
    return jsonify({'models': models})


@model_bp.route('/active', methods=['GET'])
def get_active_model():
    db = _db()
    docs = list(db.collection('models')
                  .where('buildingId', '==', _bid())
                  .where('isActive', '==', True)
                  .where('status', '==', 'READY')
                  .limit(1).stream())
    if not docs:
        return jsonify({'model': None})
    d = docs[0]
    return jsonify({'model': {'id': d.id, **d.to_dict()}})


@model_bp.route('/upload', methods=['POST'])
@verify_admin
def upload_model():
    """Upload 3D model to Firebase Storage."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': f'Invalid file. Allowed: {ALLOWED_EXTENSIONS}'}), 400

    filename = file.filename
    ext = filename.rsplit('.', 1)[1].lower()
    model_id = f"model-{uuid.uuid4().hex[:10]}"
    version = request.form.get('version', '1.0')

    # Determine if conversion is needed
    needs_conversion = ext not in ('glb', 'gltf')
    status = 'PROCESSING' if needs_conversion else 'READY'

    try:
        # Upload to Firebase Storage
        from firebase_init import get_storage
        bucket = get_storage()

        storage_path = f"models/{_bid()}/{model_id}/{filename}"
        blob = bucket.blob(storage_path)

        file.seek(0)
        blob.upload_from_file(file, content_type=file.content_type or 'model/gltf-binary')
        blob.make_public()
        public_url = blob.public_url

        # If GLB/GLTF, it's ready immediately
        runtime_url = public_url if ext in ('glb', 'gltf') else ''

        model_data = {
            'buildingId':      _bid(),
            'filename':        filename,
            'originalFormat':  ext,
            'runtimeFormat':   'glb' if ext in ('glb', 'gltf') else '',
            'version':         version,
            'status':          status,
            'originalUrl':     public_url,
            'runtimeUrl':      runtime_url,
            'storagePath':     storage_path,
            'isActive':        False,  # Admin must activate after review
            'uploadedAt':      datetime.now(timezone.utc).isoformat(),
            'uploadedBy':      g.uid,
            'processingNotes': 'Conversion required' if needs_conversion else 'Ready for use',
        }

        _db().collection('models').document(model_id).set(model_data)

        return jsonify({
            'id': model_id,
            'model': model_data,
            'message': 'Model uploaded. Activate it from the model management page.' if not needs_conversion
                       else 'Model uploaded. Conversion required — see documentation for conversion workflow.'
        }), 201

    except Exception as e:
        return jsonify({'error': 'Upload failed', 'detail': str(e)}), 500


@model_bp.route('/<model_id>/activate', methods=['POST'])
@verify_admin
def activate_model(model_id):
    """Activate a model (deactivates all others)."""
    db = _db()

    # Deactivate all
    for doc in db.collection('models').where('buildingId', '==', _bid()).stream():
        doc.reference.update({'isActive': False})

    # Activate selected
    db.collection('models').document(model_id).update({
        'isActive': True,
        'activatedAt': datetime.now(timezone.utc).isoformat(),
        'activatedBy': g.uid,
    })
    return jsonify({'success': True, 'modelId': model_id})


@model_bp.route('/<model_id>', methods=['DELETE'])
@verify_admin
def delete_model(model_id):
    db = _db()
    db.collection('models').document(model_id).update({'isActive': False, 'status': 'DELETED'})
    return jsonify({'success': True})
