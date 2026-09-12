"""
Firebase Sample Data Seeder
============================
Populates Firestore with YIT building data for immediate use.

Usage:
  1. Copy service-account.json to this directory (or set FIREBASE_* env vars)
  2. Run: python seed_data.py

This script is idempotent — safe to run multiple times.
"""

import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'admin-web', 'backend'))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

try:
    from firebase_init import initialize_firebase, get_firestore, get_auth
    initialize_firebase()
    db = get_firestore()
    auth_client = get_auth()
    FIREBASE_AVAILABLE = True
except Exception as e:
    print(f"⚠️  Firebase not available: {e}")
    FIREBASE_AVAILABLE = False

from datetime import datetime, timezone

NOW = datetime.now(timezone.utc).isoformat()
BUILDING_ID = os.getenv('DEFAULT_BUILDING_ID', 'yit-moodbidri-main')


# ── Building ────────────────────────────────────────────────────────────
BUILDING = {
    'id':        BUILDING_ID,
    'name':      'Yenepoya Institute of Technology',
    'shortName': 'YIT',
    'location':  'Moodbidri, Karnataka, India',
    'address':   'Deralakatte, Moodbidri, DK - 574225',
    'createdAt': NOW,
    'publishedVersion': 0,
    'draftVersion': 0,
}

# ── Floors ──────────────────────────────────────────────────────────────
FLOORS = [
    { 'id':'floor-0', 'name':'Ground Floor', 'number':0, 'elevation':0.0,   'description':'Main entrance, admin, canteen, auditorium', 'isActive':True },
    { 'id':'floor-1', 'name':'First Floor',  'number':1, 'elevation':3.5,   'description':'CS and ECE departments, seminar hall',       'isActive':True },
    { 'id':'floor-2', 'name':'Second Floor', 'number':2, 'elevation':7.0,   'description':'Computer labs, library, HOD offices',        'isActive':True },
    { 'id':'floor-3', 'name':'Third Floor',  'number':3, 'elevation':10.5,  'description':'Staff rooms, conference rooms',              'isActive':True },
]

# ── Rooms ───────────────────────────────────────────────────────────────
ROOMS = [
    # Ground Floor
    { 'id':'r01', 'name':'Main Entrance',         'floorId':'floor-0', 'roomNumber':'G-00', 'department':'Administration', 'category':'ENTRANCE',   'coordinates':{'x':0,'y':0,'z':0},    'isAccessible':True, 'isActive':True },
    { 'id':'r02', 'name':'Principal Office',      'floorId':'floor-0', 'roomNumber':'G-01', 'department':'Administration', 'category':'OFFICE',     'coordinates':{'x':-3,'y':0,'z':0},   'isAccessible':True, 'isActive':True },
    { 'id':'r03', 'name':'Canteen',               'floorId':'floor-0', 'roomNumber':'G-10', 'department':'Facilities',     'category':'CANTEEN',    'coordinates':{'x':-5,'y':0,'z':0},   'isAccessible':True, 'isActive':True },
    { 'id':'r14', 'name':'Auditorium',            'floorId':'floor-0', 'roomNumber':'G-20', 'department':'Administration', 'category':'AUDITORIUM', 'coordinates':{'x':5,'y':0,'z':0},    'isAccessible':True, 'isActive':True },
    { 'id':'r17', 'name':'Restroom (Ground)',      'floorId':'floor-0', 'roomNumber':'G-30', 'department':'Facilities',    'category':'RESTROOM',   'coordinates':{'x':6,'y':0,'z':0},    'isAccessible':True, 'isActive':True },
    # First Floor
    { 'id':'r04', 'name':'CS Department Office',  'floorId':'floor-1', 'roomNumber':'1-01', 'department':'Computer Science','category':'OFFICE',    'coordinates':{'x':-3,'y':0,'z':3.5}, 'isAccessible':True, 'isActive':True },
    { 'id':'r05', 'name':'CS Classroom 1',        'floorId':'floor-1', 'roomNumber':'1-05', 'department':'Computer Science','category':'CLASSROOM', 'coordinates':{'x':-2,'y':0,'z':3.5}, 'isAccessible':True, 'isActive':True },
    { 'id':'r06', 'name':'CS Classroom 2',        'floorId':'floor-1', 'roomNumber':'1-06', 'department':'Computer Science','category':'CLASSROOM', 'coordinates':{'x':2,'y':0,'z':3.5},  'isAccessible':True, 'isActive':True },
    { 'id':'r07', 'name':'ECE Department Office', 'floorId':'floor-1', 'roomNumber':'1-10', 'department':'Electronics',    'category':'OFFICE',     'coordinates':{'x':3,'y':0,'z':3.5},  'isAccessible':True, 'isActive':True },
    { 'id':'r08', 'name':'Seminar Hall',          'floorId':'floor-1', 'roomNumber':'1-20', 'department':'Administration', 'category':'SEMINAR',    'coordinates':{'x':5,'y':0,'z':3.5},  'isAccessible':True, 'isActive':True },
    # Second Floor
    { 'id':'r09', 'name':'CS Lab 1',              'floorId':'floor-2', 'roomNumber':'2-01', 'department':'Computer Science','category':'LAB',       'coordinates':{'x':-5,'y':0,'z':7},   'isAccessible':True, 'isActive':True },
    { 'id':'r10', 'name':'CS Lab 2',              'floorId':'floor-2', 'roomNumber':'2-02', 'department':'Computer Science','category':'LAB',       'coordinates':{'x':-3,'y':0,'z':7},   'isAccessible':True, 'isActive':True },
    { 'id':'r11', 'name':'CS Lab 3 (AI Lab)',     'floorId':'floor-2', 'roomNumber':'2-03', 'department':'Computer Science','category':'LAB',       'coordinates':{'x':-1,'y':0,'z':7},   'isAccessible':True, 'isActive':True },
    { 'id':'r12', 'name':'Library',               'floorId':'floor-2', 'roomNumber':'2-10', 'department':'Library',        'category':'LIBRARY',   'coordinates':{'x':4,'y':0,'z':7},    'isAccessible':True, 'isActive':True },
    { 'id':'r13', 'name':'HOD CSE Office',        'floorId':'floor-2', 'roomNumber':'2-20', 'department':'Computer Science','category':'OFFICE',   'coordinates':{'x':-6,'y':0,'z':7},   'isAccessible':True, 'isActive':True },
    { 'id':'r18', 'name':'Restroom (Floor 2)',     'floorId':'floor-2', 'roomNumber':'2-30', 'department':'Facilities',    'category':'RESTROOM',   'coordinates':{'x':6,'y':0,'z':7},    'isAccessible':True, 'isActive':True },
    # Third Floor
    { 'id':'r15', 'name':'Staff Room',            'floorId':'floor-3', 'roomNumber':'3-01', 'department':'Administration', 'category':'OFFICE',    'coordinates':{'x':-3,'y':0,'z':10.5},'isAccessible':True, 'isActive':True },
    { 'id':'r16', 'name':'Conference Room',       'floorId':'floor-3', 'roomNumber':'3-05', 'department':'Administration', 'category':'OTHER',     'coordinates':{'x':3,'y':0,'z':10.5}, 'isAccessible':True, 'isActive':True },
]

# ── Destinations ────────────────────────────────────────────────────────
DESTINATIONS = [
    { 'id':'dest-01', 'name':'CS Lab 1',         'floorId':'floor-2', 'category':'LAB',      'department':'Computer Science', 'roomNumber':'2-01', 'nodeId':'n-lab1',      'description':'Main computer science lab with 40 systems.',   'visitCount':45, 'isActive':True },
    { 'id':'dest-02', 'name':'CS Lab 2',         'floorId':'floor-2', 'category':'LAB',      'department':'Computer Science', 'roomNumber':'2-02', 'nodeId':'n-lab2',      'description':'Programming and software development lab.',    'visitCount':32, 'isActive':True },
    { 'id':'dest-03', 'name':'AI Lab',           'floorId':'floor-2', 'category':'LAB',      'department':'Computer Science', 'roomNumber':'2-03', 'nodeId':'n-lab1',      'description':'AI, Machine Learning, and Deep Learning lab.',  'visitCount':28, 'isActive':True },
    { 'id':'dest-04', 'name':'Library',          'floorId':'floor-2', 'category':'LIBRARY',  'department':'Library',          'roomNumber':'2-10', 'nodeId':'n-library',   'description':'College library with 10,000+ books and journals.','visitCount':67, 'isActive':True },
    { 'id':'dest-05', 'name':'Canteen',          'floorId':'floor-0', 'category':'CANTEEN',  'department':'Facilities',       'roomNumber':'G-10', 'nodeId':'n-canteen',   'description':'College canteen. Open 8AM–5PM.',               'visitCount':120,'isActive':True },
    { 'id':'dest-06', 'name':'Principal Office', 'floorId':'floor-0', 'category':'OFFICE',   'department':'Administration',   'roomNumber':'G-01', 'nodeId':'n-principal', 'description':'Office of the College Principal.',             'visitCount':15, 'isActive':True },
    { 'id':'dest-07', 'name':'HOD CSE Office',   'floorId':'floor-2', 'category':'OFFICE',   'department':'Computer Science', 'roomNumber':'2-20', 'nodeId':'n-hod',       'description':'Head of Department — Computer Science.',       'visitCount':22, 'isActive':True },
    { 'id':'dest-08', 'name':'Auditorium',       'floorId':'floor-0', 'category':'FACILITY', 'department':'Administration',   'roomNumber':'G-20', 'nodeId':'n-audi',      'description':'Main college auditorium. Capacity: 500 seats.','visitCount':18, 'isActive':True },
    { 'id':'dest-09', 'name':'Seminar Hall',     'floorId':'floor-1', 'category':'FACILITY', 'department':'Administration',   'roomNumber':'1-20', 'nodeId':'n-seminar',   'description':'Seminar hall for workshops and tech talks.',    'visitCount':12, 'isActive':True },
    { 'id':'dest-10', 'name':'Main Entrance',    'floorId':'floor-0', 'category':'OTHER',    'department':'Administration',   'roomNumber':'G-00', 'nodeId':'n-entrance',  'description':'YIT main college entrance.',                   'visitCount':200,'isActive':True },
    { 'id':'dest-11', 'name':'CS Department',    'floorId':'floor-1', 'category':'OFFICE',   'department':'Computer Science', 'roomNumber':'1-01', 'nodeId':'n-cs-dept',   'description':'Computer Science department office.',           'visitCount':30, 'isActive':True },
    { 'id':'dest-12', 'name':'Conference Room',  'floorId':'floor-3', 'category':'FACILITY', 'department':'Administration',   'roomNumber':'3-05', 'nodeId':'n-conf',      'description':'For faculty meetings and committee events.',    'visitCount':8,  'isActive':True },
]

# ── Navigation Nodes ────────────────────────────────────────────────────
NODES = [
    # Ground Floor
    { 'id':'n-entrance',   'floorId':'floor-0', 'x':0.0,   'y':0.0,  'z':0.0, 'type':'ENTRANCE',   'label':'Main Entrance',   'isAccessible':True, 'isActive':True },
    { 'id':'n-cor-g1',     'floorId':'floor-0', 'x':0.0,   'y':5.0,  'z':0.0, 'type':'CORRIDOR',   'label':'Corridor G1',     'isAccessible':True, 'isActive':True },
    { 'id':'n-cor-g2',     'floorId':'floor-0', 'x':-4.0,  'y':8.0,  'z':0.0, 'type':'CORRIDOR',   'label':'Corridor G2',     'isAccessible':True, 'isActive':True },
    { 'id':'n-cor-g3',     'floorId':'floor-0', 'x':4.0,   'y':8.0,  'z':0.0, 'type':'CORRIDOR',   'label':'Corridor G3',     'isAccessible':True, 'isActive':True },
    { 'id':'n-canteen',    'floorId':'floor-0', 'x':-6.0,  'y':11.0, 'z':0.0, 'type':'DESTINATION','label':'Canteen',         'isAccessible':True, 'isActive':True },
    { 'id':'n-audi',       'floorId':'floor-0', 'x':6.0,   'y':11.0, 'z':0.0, 'type':'DESTINATION','label':'Auditorium',      'isAccessible':True, 'isActive':True },
    { 'id':'n-principal',  'floorId':'floor-0', 'x':0.0,   'y':11.0, 'z':0.0, 'type':'ROOM',       'label':'Principal Office','isAccessible':True, 'isActive':True },
    { 'id':'n-stair-g',    'floorId':'floor-0', 'x':7.0,   'y':6.0,  'z':0.0, 'type':'STAIRCASE',  'label':'Staircase G',    'isAccessible':False,'isActive':True },
    { 'id':'n-elev-g',     'floorId':'floor-0', 'x':-7.0,  'y':6.0,  'z':0.0, 'type':'ELEVATOR',   'label':'Elevator G',     'isAccessible':True, 'isActive':True },
    # First Floor
    { 'id':'n-stair-1',    'floorId':'floor-1', 'x':7.0,   'y':6.0,  'z':3.5, 'type':'STAIRCASE',  'label':'Staircase 1',    'isAccessible':False,'isActive':True },
    { 'id':'n-cor-1a',     'floorId':'floor-1', 'x':4.0,   'y':6.0,  'z':3.5, 'type':'CORRIDOR',   'label':'Corridor 1A',    'isAccessible':True, 'isActive':True },
    { 'id':'n-cor-1b',     'floorId':'floor-1', 'x':0.0,   'y':6.0,  'z':3.5, 'type':'CORRIDOR',   'label':'Corridor 1B',    'isAccessible':True, 'isActive':True },
    { 'id':'n-cs-dept',    'floorId':'floor-1', 'x':-4.0,  'y':9.0,  'z':3.5, 'type':'DESTINATION','label':'CS Department',  'isAccessible':True, 'isActive':True },
    { 'id':'n-seminar',    'floorId':'floor-1', 'x':4.0,   'y':9.0,  'z':3.5, 'type':'DESTINATION','label':'Seminar Hall',   'isAccessible':True, 'isActive':True },
    { 'id':'n-stair-12',   'floorId':'floor-1', 'x':7.0,   'y':3.0,  'z':3.5, 'type':'STAIRCASE',  'label':'Staircase 1→2', 'isAccessible':False,'isActive':True },
    { 'id':'n-elev-1',     'floorId':'floor-1', 'x':-7.0,  'y':6.0,  'z':3.5, 'type':'ELEVATOR',   'label':'Elevator 1',    'isAccessible':True, 'isActive':True },
    # Second Floor
    { 'id':'n-stair-2',    'floorId':'floor-2', 'x':7.0,   'y':6.0,  'z':7.0, 'type':'STAIRCASE',  'label':'Staircase 2',   'isAccessible':False,'isActive':True },
    { 'id':'n-cor-2a',     'floorId':'floor-2', 'x':4.0,   'y':6.0,  'z':7.0, 'type':'CORRIDOR',   'label':'Corridor 2A',   'isAccessible':True, 'isActive':True },
    { 'id':'n-cor-2b',     'floorId':'floor-2', 'x':0.0,   'y':6.0,  'z':7.0, 'type':'CORRIDOR',   'label':'Corridor 2B',   'isAccessible':True, 'isActive':True },
    { 'id':'n-lab1',       'floorId':'floor-2', 'x':-5.0,  'y':9.0,  'z':7.0, 'type':'DESTINATION','label':'CS Lab 1',      'isAccessible':True, 'isActive':True },
    { 'id':'n-lab2',       'floorId':'floor-2', 'x':-2.0,  'y':11.0, 'z':7.0, 'type':'DESTINATION','label':'CS Lab 2',      'isAccessible':True, 'isActive':True },
    { 'id':'n-library',    'floorId':'floor-2', 'x':4.0,   'y':9.0,  'z':7.0, 'type':'DESTINATION','label':'Library',       'isAccessible':True, 'isActive':True },
    { 'id':'n-hod',        'floorId':'floor-2', 'x':-6.0,  'y':4.0,  'z':7.0, 'type':'ROOM',       'label':'HOD CSE',       'isAccessible':True, 'isActive':True },
    { 'id':'n-elev-2',     'floorId':'floor-2', 'x':-7.0,  'y':6.0,  'z':7.0, 'type':'ELEVATOR',   'label':'Elevator 2',   'isAccessible':True, 'isActive':True },
    # Third Floor
    { 'id':'n-stair-3',    'floorId':'floor-3', 'x':7.0,   'y':6.0,  'z':10.5,'type':'STAIRCASE',  'label':'Staircase 3',   'isAccessible':False,'isActive':True },
    { 'id':'n-cor-3a',     'floorId':'floor-3', 'x':3.0,   'y':6.0,  'z':10.5,'type':'CORRIDOR',   'label':'Corridor 3A',   'isAccessible':True, 'isActive':True },
    { 'id':'n-staff',      'floorId':'floor-3', 'x':-3.0,  'y':9.0,  'z':10.5,'type':'ROOM',       'label':'Staff Room',    'isAccessible':True, 'isActive':True },
    { 'id':'n-conf',       'floorId':'floor-3', 'x':4.0,   'y':9.0,  'z':10.5,'type':'DESTINATION','label':'Conference Room','isAccessible':True,'isActive':True },
    { 'id':'n-elev-3',     'floorId':'floor-3', 'x':-7.0,  'y':6.0,  'z':10.5,'type':'ELEVATOR',   'label':'Elevator 3',   'isAccessible':True, 'isActive':True },
]

# ── Navigation Edges ────────────────────────────────────────────────────
EDGES = [
    # Ground floor
    {'id':'e-g01','startNodeId':'n-entrance','endNodeId':'n-cor-g1','distance':5,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-0'},
    {'id':'e-g02','startNodeId':'n-cor-g1','endNodeId':'n-cor-g2','distance':8,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-0'},
    {'id':'e-g03','startNodeId':'n-cor-g1','endNodeId':'n-cor-g3','distance':8,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-0'},
    {'id':'e-g04','startNodeId':'n-cor-g2','endNodeId':'n-canteen','distance':6,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-0'},
    {'id':'e-g05','startNodeId':'n-cor-g2','endNodeId':'n-principal','distance':5,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-0'},
    {'id':'e-g06','startNodeId':'n-cor-g3','endNodeId':'n-audi','distance':6,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-0'},
    {'id':'e-g07','startNodeId':'n-cor-g1','endNodeId':'n-stair-g','distance':10,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-0'},
    {'id':'e-g08','startNodeId':'n-cor-g2','endNodeId':'n-elev-g','distance':8,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-0'},
    # Floor 1
    {'id':'e-1a','startNodeId':'n-stair-1','endNodeId':'n-cor-1a','distance':5,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-1'},
    {'id':'e-1b','startNodeId':'n-cor-1a','endNodeId':'n-cor-1b','distance':8,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-1'},
    {'id':'e-1c','startNodeId':'n-cor-1b','endNodeId':'n-cs-dept','distance':6,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-1'},
    {'id':'e-1d','startNodeId':'n-cor-1a','endNodeId':'n-seminar','distance':7,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-1'},
    {'id':'e-1e','startNodeId':'n-stair-1','endNodeId':'n-stair-12','distance':4,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-1'},
    {'id':'e-1f','startNodeId':'n-elev-1','endNodeId':'n-cor-1b','distance':6,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-1'},
    # Floor 2
    {'id':'e-2a','startNodeId':'n-stair-2','endNodeId':'n-cor-2a','distance':5,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-2'},
    {'id':'e-2b','startNodeId':'n-cor-2a','endNodeId':'n-cor-2b','distance':8,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-2'},
    {'id':'e-2c','startNodeId':'n-cor-2b','endNodeId':'n-lab1','distance':6,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-2'},
    {'id':'e-2d','startNodeId':'n-cor-2b','endNodeId':'n-lab2','distance':7,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-2'},
    {'id':'e-2e','startNodeId':'n-cor-2a','endNodeId':'n-library','distance':6,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-2'},
    {'id':'e-2f','startNodeId':'n-cor-2b','endNodeId':'n-hod','distance':5,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-2'},
    {'id':'e-2g','startNodeId':'n-elev-2','endNodeId':'n-cor-2b','distance':6,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-2'},
    # Floor 3
    {'id':'e-3a','startNodeId':'n-stair-3','endNodeId':'n-cor-3a','distance':5,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-3'},
    {'id':'e-3b','startNodeId':'n-cor-3a','endNodeId':'n-staff','distance':6,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-3'},
    {'id':'e-3c','startNodeId':'n-cor-3a','endNodeId':'n-conf','distance':5,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-3'},
    {'id':'e-3d','startNodeId':'n-elev-3','endNodeId':'n-cor-3a','distance':6,'isWalkable':True,'isFloorTransition':False,'floorId':'floor-3'},
    # FLOOR TRANSITIONS — Stairs
    {'id':'e-t-g1','startNodeId':'n-stair-g','endNodeId':'n-stair-1','distance':8,'isWalkable':True,'isFloorTransition':True,'transitionType':'STAIR','floorId':'multi'},
    {'id':'e-t-12','startNodeId':'n-stair-12','endNodeId':'n-stair-2','distance':8,'isWalkable':True,'isFloorTransition':True,'transitionType':'STAIR','floorId':'multi'},
    {'id':'e-t-23','startNodeId':'n-stair-2','endNodeId':'n-stair-3','distance':8,'isWalkable':True,'isFloorTransition':True,'transitionType':'STAIR','floorId':'multi'},
    # FLOOR TRANSITIONS — Elevator
    {'id':'e-elev-g1','startNodeId':'n-elev-g','endNodeId':'n-elev-1','distance':10,'isWalkable':True,'isFloorTransition':True,'transitionType':'ELEVATOR','floorId':'multi','isAccessible':True},
    {'id':'e-elev-12','startNodeId':'n-elev-1','endNodeId':'n-elev-2','distance':10,'isWalkable':True,'isFloorTransition':True,'transitionType':'ELEVATOR','floorId':'multi','isAccessible':True},
    {'id':'e-elev-23','startNodeId':'n-elev-2','endNodeId':'n-elev-3','distance':10,'isWalkable':True,'isFloorTransition':True,'transitionType':'ELEVATOR','floorId':'multi','isAccessible':True},
]

# ── QR Checkpoints ──────────────────────────────────────────────────────
QR_CHECKPOINTS = [
    {'id':'qr-entrance','label':'Main Entrance',    'floorId':'floor-0','nodeId':'n-entrance','qrData':'yit-nav://checkpoint/qr-entrance','isActive':True,'scanCount':45},
    {'id':'qr-canteen', 'label':'Near Canteen',     'floorId':'floor-0','nodeId':'n-canteen', 'qrData':'yit-nav://checkpoint/qr-canteen', 'isActive':True,'scanCount':23},
    {'id':'qr-stair-g', 'label':'Ground Staircase', 'floorId':'floor-0','nodeId':'n-stair-g','qrData':'yit-nav://checkpoint/qr-stair-g','isActive':True,'scanCount':18},
    {'id':'qr-cor-g1',  'label':'Ground Corridor',  'floorId':'floor-0','nodeId':'n-cor-g1', 'qrData':'yit-nav://checkpoint/qr-cor-g1', 'isActive':True,'scanCount':12},
    {'id':'qr-stair-1', 'label':'Floor 1 Staircase','floorId':'floor-1','nodeId':'n-stair-1','qrData':'yit-nav://checkpoint/qr-stair-1','isActive':True,'scanCount':9},
    {'id':'qr-cs-dept', 'label':'CS Dept Entry',    'floorId':'floor-1','nodeId':'n-cs-dept','qrData':'yit-nav://checkpoint/qr-cs-dept','isActive':True,'scanCount':17},
    {'id':'qr-stair-2', 'label':'Floor 2 Staircase','floorId':'floor-2','nodeId':'n-stair-2','qrData':'yit-nav://checkpoint/qr-stair-2','isActive':True,'scanCount':15},
    {'id':'qr-lab1',    'label':'CS Lab 1 Entry',   'floorId':'floor-2','nodeId':'n-lab1',   'qrData':'yit-nav://checkpoint/qr-lab1',   'isActive':True,'scanCount':32},
    {'id':'qr-library', 'label':'Library Entry',    'floorId':'floor-2','nodeId':'n-library','qrData':'yit-nav://checkpoint/qr-library','isActive':True,'scanCount':28},
    {'id':'qr-stair-3', 'label':'Floor 3 Staircase','floorId':'floor-3','nodeId':'n-stair-3','qrData':'yit-nav://checkpoint/qr-stair-3','isActive':True,'scanCount':6},
]


def seed():
    if not FIREBASE_AVAILABLE:
        print("❌ Firebase not configured. Export data to JSON instead.")
        export_json()
        return

    building_ref = db.collection('buildings').document(BUILDING_ID)

    print(f"\n🌱 Seeding Firebase: {BUILDING_ID}\n")

    # Building
    building_ref.set(BUILDING, merge=True)
    print(f"  ✅ Building: {BUILDING['name']}")

    # Floors
    for f in FLOORS:
        fid = f.pop('id')
        building_ref.collection('floors').document(fid).set({**f,'createdAt':NOW}, merge=True)
        f['id'] = fid
    print(f"  ✅ Floors: {len(FLOORS)}")

    # Rooms
    for r in ROOMS:
        rid = r.pop('id')
        building_ref.collection('rooms').document(rid).set({**r,'createdAt':NOW}, merge=True)
        r['id'] = rid
    print(f"  ✅ Rooms: {len(ROOMS)}")

    # Destinations
    for d in DESTINATIONS:
        did = d.pop('id')
        building_ref.collection('destinations').document(did).set({**d,'createdAt':NOW}, merge=True)
        d['id'] = did
    print(f"  ✅ Destinations: {len(DESTINATIONS)}")

    # Nodes
    for n in NODES:
        nid = n.pop('id')
        building_ref.collection('nodes').document(nid).set({**n,'createdAt':NOW}, merge=True)
        n['id'] = nid
    print(f"  ✅ Navigation Nodes: {len(NODES)}")

    # Edges
    for e in EDGES:
        eid = e.pop('id')
        building_ref.collection('edges').document(eid).set({**e,'createdAt':NOW}, merge=True)
        e['id'] = eid
    print(f"  ✅ Navigation Edges: {len(EDGES)}")

    # QR Checkpoints
    for q in QR_CHECKPOINTS:
        qid = q.pop('id')
        building_ref.collection('qr_checkpoints').document(qid).set({**q,'createdAt':NOW}, merge=True)
        q['id'] = qid
    print(f"  ✅ QR Checkpoints: {len(QR_CHECKPOINTS)}")

    print(f"\n🎉 Seed complete!\n")


def export_json():
    import json
    out = {
        'building': BUILDING, 'floors': FLOORS, 'rooms': ROOMS,
        'destinations': DESTINATIONS, 'nodes': NODES, 'edges': EDGES,
        'qr_checkpoints': QR_CHECKPOINTS,
    }
    path = os.path.join(os.path.dirname(__file__), 'sample_data.json')
    with open(path, 'w') as f:
        json.dump(out, f, indent=2)
    print(f"📄 Sample data exported to: {path}")


if __name__ == '__main__':
    seed()
