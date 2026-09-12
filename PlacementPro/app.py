"""
PlacementPro — Streamlit Placement Management Dashboard
========================================================
Roles: TPO · Student · Alumni
"""

import streamlit as st
import pandas as pd

# ──────────────────────────────────────────────
# 1.  Page Config & Custom CSS
# ──────────────────────────────────────────────
st.set_page_config(
    page_title="PlacementPro",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded",
)

THEME_CSS = """
<style>
/* ── Google Font ─────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ── Root Variables ──────────────────────── */
:root {
    --primary:   #1E88E5;
    --primary-dark: #1565C0;
    --accent:    #42A5F5;
    --bg-dark:   #1a1f2e;
    --bg-card:   #222839;
    --bg-card-hover: #2a3148;
    --text:      #e0e6ed;
    --text-muted:#8a96a8;
    --border:    #2e3650;
    --success:   #66BB6A;
    --warning:   #FFA726;
    --danger:    #EF5350;
    --radius:    12px;
    --shadow:    0 4px 24px rgba(0,0,0,.35);
}

/* ── Global ──────────────────────────────── */
html, body, [data-testid="stAppViewContainer"], [data-testid="stApp"] {
    background: var(--bg-dark) !important;
    color: var(--text) !important;
    font-family: 'Inter', sans-serif !important;
}
[data-testid="stHeader"] { background: transparent !important; }

/* ── Sidebar ─────────────────────────────── */
section[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #151928 0%, #1a1f2e 100%) !important;
    border-right: 1px solid var(--border) !important;
}
section[data-testid="stSidebar"] .stMarkdown h1,
section[data-testid="stSidebar"] .stMarkdown h2,
section[data-testid="stSidebar"] .stMarkdown h3,
section[data-testid="stSidebar"] .stMarkdown p,
section[data-testid="stSidebar"] .stMarkdown label {
    color: var(--text) !important;
}

/* ── Bootstrap-style Card ────────────────── */
.card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem 1.75rem;
    margin-bottom: 1rem;
    box-shadow: var(--shadow);
    transition: transform .2s, box-shadow .2s;
}
.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,.45);
    background: var(--bg-card-hover);
}
.card h3 {
    margin: 0 0 .5rem 0;
    font-weight: 700;
    font-size: 1.15rem;
    color: var(--accent);
}
.card p, .card li { color: var(--text-muted); font-size: .92rem; }

/* ── Metric Card ─────────────────────────── */
.metric-card {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-radius: var(--radius);
    padding: 1.5rem 2rem;
    text-align: center;
    box-shadow: 0 6px 20px rgba(30,136,229,.35);
    margin-bottom: 1.25rem;
}
.metric-card .metric-value {
    font-size: 3rem;
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
}
.metric-card .metric-label {
    font-size: .95rem;
    color: rgba(255,255,255,.8);
    margin-top: .35rem;
}

/* ── Section Header ──────────────────────── */
.section-header {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text);
    margin: 1.5rem 0 .75rem 0;
    padding-bottom: .4rem;
    border-bottom: 2px solid var(--primary);
    display: inline-block;
}

/* ── Progress Bar ────────────────────────── */
.progress-container { margin-bottom: .85rem; }
.progress-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: .25rem;
    font-size: .88rem;
    color: var(--text-muted);
    font-weight: 500;
}
.progress-bar-bg {
    background: #2e3650;
    border-radius: 6px;
    height: 12px;
    overflow: hidden;
}
.progress-bar-fill {
    height: 100%;
    border-radius: 6px;
    transition: width .6s ease;
}

/* ── Referral Post ───────────────────────── */
.referral-card {
    background: var(--bg-card);
    border-left: 4px solid var(--primary);
    border-radius: 0 var(--radius) var(--radius) 0;
    padding: 1rem 1.25rem;
    margin-bottom: .75rem;
    box-shadow: var(--shadow);
}
.referral-card p { color: var(--text); margin: 0; font-size: .93rem; }
.referral-card .referral-time {
    color: var(--text-muted);
    font-size: .78rem;
    margin-top: .35rem;
}

/* ── Tag / Badge ─────────────────────────── */
.badge {
    display: inline-block;
    padding: .2rem .65rem;
    border-radius: 20px;
    font-size: .78rem;
    font-weight: 600;
    margin-right: .35rem;
    margin-bottom: .3rem;
}
.badge-blue   { background: rgba(30,136,229,.2); color: var(--accent); }
.badge-green  { background: rgba(102,187,106,.2); color: var(--success); }
.badge-orange { background: rgba(255,167,38,.2);  color: var(--warning); }

/* ── Live Dot ────────────────────────────── */
@keyframes pulse { 0%,100%{ opacity:1 } 50%{ opacity:.4 } }
.live-dot {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--success);
    margin-right: 6px;
    animation: pulse 1.4s infinite;
}

/* ── Streamlit widget overrides ──────────── */
.stButton > button {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 8px !important;
    padding: .55rem 1.6rem !important;
    font-weight: 600 !important;
    font-size: .92rem !important;
    transition: all .25s !important;
    box-shadow: 0 3px 12px rgba(30,136,229,.3) !important;
}
.stButton > button:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 20px rgba(30,136,229,.45) !important;
}

.stSelectbox label, .stMultiSelect label, .stSlider label, .stTextArea label {
    color: var(--text) !important;
    font-weight: 500 !important;
}

/* dataframe */
[data-testid="stDataFrame"] { border-radius: var(--radius); overflow: hidden; }

/* Toast overrides */
.stToast { background: var(--bg-card) !important; color: var(--text) !important; }
</style>
"""

st.markdown(THEME_CSS, unsafe_allow_html=True)

# ──────────────────────────────────────────────
# 2.  Sample Data
# ──────────────────────────────────────────────
@st.cache_data
def load_students() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "Name": [
                "Aarav Sharma", "Diya Patel", "Rohan Mehta", "Ananya Gupta",
                "Vikram Singh", "Sneha Reddy", "Arjun Nair", "Priya Iyer",
                "Karan Kapoor", "Neha Joshi", "Amit Verma", "Kavya Das",
                "Rahul Tiwari", "Ishita Bose", "Siddharth Rao", "Meera Kulkarni",
                "Aditya Chauhan", "Pooja Saxena", "Nikhil Bansal", "Riya Agarwal",
            ],
            "Branch": [
                "CSE", "ECE", "CSE", "IT", "ME", "CSE", "ECE", "IT",
                "CSE", "ME", "IT", "CSE", "ECE", "CSE", "ME", "IT",
                "CSE", "ECE", "IT", "CSE",
            ],
            "CGPA": [
                9.1, 8.4, 7.6, 8.9, 6.5, 9.3, 7.8, 8.1,
                8.7, 7.0, 7.9, 9.0, 6.8, 8.5, 7.2, 8.3,
                9.4, 7.5, 8.0, 8.8,
            ],
            "Backlogs": [
                0, 0, 1, 0, 2, 0, 1, 0,
                0, 3, 1, 0, 2, 0, 1, 0,
                0, 1, 0, 0,
            ],
            "Skills": [
                "Python, ML, SQL",
                "Embedded C, MATLAB",
                "Java, Spring Boot",
                "Python, Django, React",
                "AutoCAD, SolidWorks",
                "Python, TensorFlow, AWS",
                "VHDL, IoT",
                "JavaScript, Node.js",
                "Python, Flask, Docker",
                "CATIA, Ansys",
                "Java, Angular, MySQL",
                "Python, PyTorch, GCP",
                "C++, Arduino",
                "Python, NLP, Streamlit",
                "MATLAB, FEM",
                "React, TypeScript, MongoDB",
                "Python, Deep Learning, Kubernetes",
                "Signal Processing, C",
                "Python, REST API, PostgreSQL",
                "Python, Data Science, Tableau",
            ],
        }
    )


@st.cache_data
def load_drives() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "Company": [
                "Google", "Infosys", "Tesla", "TCS",
                "Amazon", "Wipro", "Microsoft", "Deloitte",
            ],
            "Role": [
                "SDE Intern", "Systems Engineer", "Mechanical Intern", "Developer",
                "SDE-1", "Graduate Trainee", "Data Scientist", "Analyst",
            ],
            "Min_CGPA": [8.5, 7.0, 7.5, 6.5, 8.0, 6.0, 8.5, 7.0],
            "Branches": [
                "CSE,IT", "CSE,ECE,IT", "ME", "CSE,ECE,IT,ME",
                "CSE", "CSE,ECE,IT,ME", "CSE,IT", "CSE,ECE,IT",
            ],
            "Max_Backlogs": [0, 1, 1, 2, 0, 3, 0, 1],
        }
    )


students = load_students()
drives = load_drives()

# ──────────────────────────────────────────────
# 3.  Sidebar
# ──────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🎓 PlacementPro")
    st.caption("Placement Management Dashboard")
    st.divider()
    role = st.radio(
        "Select your role",
        ["🏢 TPO", "🎒 Student", "🤝 Alumni"],
        index=0,
    )
    st.divider()
    st.markdown(
        "<p style='text-align:center;color:var(--text-muted);font-size:.75rem;'>"
        "v1.0 · Built with Streamlit</p>",
        unsafe_allow_html=True,
    )

# ──────────────────────────────────────────────
# 4.  TPO View
# ──────────────────────────────────────────────
if role == "🏢 TPO":
    st.markdown("<div class='section-header'>🏢 TPO — Criteria Engine</div>", unsafe_allow_html=True)
    st.write("")

    # Filters
    col1, col2, col3 = st.columns(3)
    with col1:
        min_cgpa = st.slider("Minimum CGPA", 0.0, 10.0, 7.0, 0.1)
    with col2:
        branches = st.multiselect(
            "Branches",
            options=sorted(students["Branch"].unique()),
            default=sorted(students["Branch"].unique()),
        )
    with col3:
        max_backlogs = st.slider("Maximum Backlogs Allowed", 0, 5, 1)

    # Filter
    filtered = students[
        (students["CGPA"] >= min_cgpa)
        & (students["Branch"].isin(branches))
        & (students["Backlogs"] <= max_backlogs)
    ]

    # Metric
    c1, c2, c3 = st.columns([1, 1, 1])
    with c1:
        st.markdown(
            f"""
            <div class='metric-card'>
                <div class='metric-value'>{len(filtered)}</div>
                <div class='metric-label'>Eligible Students</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with c2:
        st.markdown(
            f"""
            <div class='metric-card' style='background:linear-gradient(135deg,#43A047,#2E7D32)'>
                <div class='metric-value'>{len(students)}</div>
                <div class='metric-label'>Total Registered</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with c3:
        pct = round(len(filtered) / len(students) * 100, 1) if len(students) > 0 else 0
        st.markdown(
            f"""
            <div class='metric-card' style='background:linear-gradient(135deg,#FF7043,#E64A19)'>
                <div class='metric-value'>{pct}%</div>
                <div class='metric-label'>Eligibility Rate</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    # Eligible students table
    st.markdown("<div class='section-header'>📋 Eligible Students</div>", unsafe_allow_html=True)
    st.dataframe(
        filtered.reset_index(drop=True),
        use_container_width=True,
        height=350,
    )

    # Notify button
    if st.button("📧  Notify Eligible Students", use_container_width=True):
        if len(filtered) > 0:
            st.toast(f"✅ Notifications sent to {len(filtered)} students!", icon="📧")
            st.success(f"Successfully notified **{len(filtered)}** eligible students via email.")
        else:
            st.warning("No eligible students to notify with the current criteria.")

# ──────────────────────────────────────────────
# 5.  Student View
# ──────────────────────────────────────────────
elif role == "🎒 Student":
    st.markdown("<div class='section-header'>🎒 Student Dashboard</div>", unsafe_allow_html=True)
    st.write("")

    # Student selector
    student_name = st.selectbox("Select your profile", students["Name"].tolist())
    student = students[students["Name"] == student_name].iloc[0]

    # Student info card
    skills_badges = "".join(
        f"<span class='badge badge-blue'>{s.strip()}</span>" for s in student["Skills"].split(",")
    )
    st.markdown(
        f"""
        <div class='card'>
            <h3>👤 {student['Name']}</h3>
            <p style='margin:.25rem 0'>
                <span class='badge badge-green'>{student['Branch']}</span>
                <span class='badge badge-orange'>CGPA: {student['CGPA']}</span>
                <span class='badge {"badge-green" if student["Backlogs"] == 0 else "badge-orange"}'>
                    Backlogs: {student['Backlogs']}
                </span>
            </p>
            <p style='margin-top:.5rem'>{skills_badges}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # ── Live Feed ──
    st.markdown(
        "<div class='section-header'><span class='live-dot'></span>Live Placement Feed</div>",
        unsafe_allow_html=True,
    )

    eligible_drives = drives[
        (drives["Min_CGPA"] <= student["CGPA"])
        & (drives["Max_Backlogs"] >= student["Backlogs"])
        & (drives["Branches"].apply(lambda b: student["Branch"] in b.split(",")))
    ]

    if eligible_drives.empty:
        st.info("No active drives match your profile right now. Check back soon!")
    else:
        for _, d in eligible_drives.iterrows():
            branch_badges = "".join(
                f"<span class='badge badge-blue'>{b.strip()}</span>" for b in d["Branches"].split(",")
            )
            st.markdown(
                f"""
                <div class='card'>
                    <h3>🏢 {d['Company']} — {d['Role']}</h3>
                    <p>Min CGPA: <strong>{d['Min_CGPA']}</strong> &nbsp;·&nbsp;
                       Max Backlogs: <strong>{d['Max_Backlogs']}</strong></p>
                    <p>{branch_badges}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )

    # ─── Skill Gap Analysis ───
    st.markdown("<div class='section-header'>📊 Skill Gap Analysis</div>", unsafe_allow_html=True)

    # Simulated proficiency data
    skill_proficiency = {
        "Python": 85,
        "Java": 55,
        "SQL": 70,
        "JavaScript": 40,
        "Machine Learning": 65,
        "Cloud (AWS/GCP)": 30,
        "Docker / DevOps": 45,
        "Communication": 78,
    }

    colors = [
        "#1E88E5", "#42A5F5", "#66BB6A", "#FFA726",
        "#AB47BC", "#26C6DA", "#EF5350", "#8D6E63",
    ]

    for i, (skill, pct) in enumerate(skill_proficiency.items()):
        color = colors[i % len(colors)]
        st.markdown(
            f"""
            <div class='progress-container'>
                <div class='progress-label'>
                    <span>{skill}</span><span>{pct}%</span>
                </div>
                <div class='progress-bar-bg'>
                    <div class='progress-bar-fill' style='width:{pct}%;background:{color}'></div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

# ──────────────────────────────────────────────
# 6.  Alumni View
# ──────────────────────────────────────────────
elif role == "🤝 Alumni":
    st.markdown("<div class='section-header'>🤝 Alumni — Job Referral Board</div>", unsafe_allow_html=True)
    st.write("")

    # Initialise session state
    if "referrals" not in st.session_state:
        st.session_state.referrals = []

    # Post form
    st.markdown(
        "<div class='card'><h3>📝 Post a Referral</h3></div>",
        unsafe_allow_html=True,
    )
    with st.form("referral_form", clear_on_submit=True):
        ref_company = st.text_input("Company Name", placeholder="e.g. Google")
        ref_text = st.text_area(
            "Referral Details",
            placeholder="Describe the role, requirements, and how students can apply…",
            height=140,
        )
        submitted = st.form_submit_button("🚀  Post Referral", use_container_width=True)
        if submitted:
            if ref_company.strip() and ref_text.strip():
                from datetime import datetime
                st.session_state.referrals.insert(
                    0,
                    {
                        "company": ref_company.strip(),
                        "text": ref_text.strip(),
                        "time": datetime.now().strftime("%d %b %Y, %I:%M %p"),
                    },
                )
                st.toast("✅ Referral posted successfully!", icon="🚀")
            else:
                st.warning("Please fill in both the company name and referral details.")

    # Display posted referrals
    st.markdown("<div class='section-header'>📌 Recent Referrals</div>", unsafe_allow_html=True)

    if not st.session_state.referrals:
        st.info("No referrals posted yet. Be the first to help out! 🎉")
    else:
        for ref in st.session_state.referrals:
            st.markdown(
                f"""
                <div class='referral-card'>
                    <p><strong>🏢 {ref['company']}</strong></p>
                    <p>{ref['text']}</p>
                    <p class='referral-time'>🕒 {ref['time']}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )
