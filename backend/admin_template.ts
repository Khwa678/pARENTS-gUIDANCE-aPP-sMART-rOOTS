export function getAdminPanelHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MindBloom Backend Administration Console</title>
  
  <!-- Font integration -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Space Grotesk', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
            stone: {
              50: '#faf9f6',
              100: '#f5f4f0',
              200: '#e9e7e1',
              300: '#dad7cd',
              400: '#a3a093',
              500: '#7a776c',
              600: '#5c5a51',
              700: '#47453e',
              800: '#33312c',
              900: '#1c1b18',
            },
            accent: {
              sage: '#8bad8b',
              moss: '#587458',
              terracotta: '#d4a373',
              sand: '#e6ccb2',
            }
          }
        }
      }
    }
  </script>
  
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  <style>
    body {
      background-color: #faf9f6;
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #faf9f6;
    }
    ::-webkit-scrollbar-thumb {
      background: #dad7cd;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #a3a093;
    }
  </style>
</head>
<body class="font-sans text-stone-800 antialiased min-h-screen flex flex-col">

  <!-- Header Section -->
  <header class="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white">
          <i data-lucide="shield-check" class="w-5 h-5 text-accent-sage"></i>
        </div>
        <div>
          <h1 class="text-lg font-display font-semibold text-stone-950 tracking-tight flex items-center gap-2">
            MindBloom Back-end Manager
            <span class="text-[10px] bg-accent-sage/15 text-accent-moss px-2 py-0.5 rounded-full font-bold uppercase tracking-widest font-sans">Active Control</span>
          </h1>
          <p class="text-xs text-stone-400">Server Local Database Control Deck &bull; data_db_backup.json</p>
        </div>
      </div>
      
      <!-- Quick Info / Status Bar -->
      <div class="flex items-center gap-3">
        <button onclick="refreshData()" class="p-2 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-full transition-all duration-250 flex items-center gap-1.5 text-xs font-bold px-3">
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5" id="refresh-icon"></i>
          <span>Reload Server State</span>
        </button>
        <button onclick="saveAllToServer()" class="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-xs flex items-center gap-1.5 transition-all duration-250">
          <i data-lucide="save" class="w-3.5 h-3.5"></i>
          <span>Save Changes to Server</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main System UI Layout -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
    
    <!-- Top Alert feedback center -->
    <div id="feedback-alert" class="hidden p-4 rounded-2xl border text-xs flex gap-3 items-start transition-all duration-300">
      <i id="feedback-icon" data-lucide="info" class="w-5 h-5 shrink-0"></i>
      <div class="flex-1">
        <strong id="feedback-title" class="block font-bold">Success</strong>
        <p id="feedback-desc" class="font-mono text-[11px] mt-0.5">Your updates have been securely synchronized.</p>
      </div>
      <button onclick="hideFeedback()" class="text-stone-400 hover:text-stone-750">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>

    <!-- Overview Statistics Dashboard Cards -->
    <section class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
        <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Total Parents</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-display font-bold text-stone-900" id="stat-parents">0</span>
          <i data-lucide="users" class="w-5 h-5 text-stone-300"></i>
        </div>
      </div>
      
      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
        <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Total Students</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-display font-bold text-stone-900" id="stat-students">0</span>
          <i data-lucide="graduation-cap" class="w-5 h-5 text-stone-300"></i>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
        <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">LMS Modules</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-display font-bold text-stone-900" id="stat-modules">0</span>
          <i data-lucide="book-open" class="w-5 h-5 text-stone-300"></i>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
        <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Daily Tasks</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-display font-bold text-stone-900" id="stat-tasks">0</span>
          <i data-lucide="calendar" class="w-5 h-5 text-stone-300"></i>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1 col-span-2 md:col-span-1">
        <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Cloud Sync (Supabase)</span>
        <div class="flex items-baseline justify-between">
          <span class="text-xs font-mono font-bold px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider" id="stat-database">Online</span>
          <i data-lucide="database" class="w-5 h-5 text-stone-300"></i>
        </div>
      </div>
    </section>

    <!-- Interactive Navigation Tabs -->
    <div class="border-b border-stone-200 pb-px">
      <nav class="flex space-x-6 md:space-x-10 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button onclick="switchTab('parents')" id="tab-parents" class="tab-btn border-b-2 font-bold text-xs uppercase tracking-widest pb-4 flex items-center gap-2 border-stone-950 text-stone-950">
          <i data-lucide="users" class="w-4 h-4"></i> Parents Core
        </button>
        <button onclick="switchTab('students')" id="tab-students" class="tab-btn border-b-2 font-bold text-xs uppercase tracking-widest pb-4 flex items-center gap-2 border-transparent text-stone-400 hover:text-stone-750">
          <i data-lucide="sliders" class="w-4 h-4"></i> Students Records
        </button>
        <button onclick="switchTab('modules')" id="tab-modules" class="tab-btn border-b-2 font-bold text-xs uppercase tracking-widest pb-4 flex items-center gap-2 border-transparent text-stone-400 hover:text-stone-750">
          <i data-lucide="book-open" class="w-4 h-4"></i> Course Modules & Lessons
        </button>
        <button onclick="switchTab('tasks')" id="tab-tasks" class="tab-btn border-b-2 font-bold text-xs uppercase tracking-widest pb-4 flex items-center gap-2 border-transparent text-stone-400 hover:text-stone-750">
          <i data-lucide="calendar" class="w-4 h-4"></i> Habitation Tasks
        </button>
        <button onclick="switchTab('system')" id="tab-system" class="tab-btn border-b-2 font-bold text-xs uppercase tracking-widest pb-4 flex items-center gap-2 border-transparent text-stone-400 hover:text-stone-750">
          <i data-lucide="server" class="w-4 h-4"></i> Backup & Database status
        </button>
      </nav>
    </div>

    <!-- Loading Overlay -->
    <div id="loading" class="py-24 text-center space-y-4 bg-white rounded-3xl border border-stone-200 shadow-xs">
      <i data-lucide="refresh-cw" class="w-10 h-10 text-stone-300 animate-spin mx-auto"></i>
      <p class="text-xs text-stone-500 font-mono">Retrieving central database records from the Docker host...</p>
    </div>

    <!-- Active Tab Panel Container -->
    <div id="content-container" class="hidden space-y-6">
      
      <!-- Panel 1: Parents Core -->
      <section id="panel-parents" class="panel-section hidden space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-display font-semibold text-stone-900 leading-tight">Parents Accounts Direct CRUD</h2>
            <p class="text-xs text-stone-500">Edit profile details, manage user login states, passwords, and override weekly module safety locks.</p>
          </div>
          <button onclick="openParentModal(null)" class="bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Register New Parent</span>
          </button>
        </div>
        
        <div class="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-stone-150">
              <thead class="bg-stone-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Parent Profile</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Email Address</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Active Ward / Child</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Level/Grade</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Unlocked Weeks List</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">State</th>
                  <th scope="col" class="px-6 py-4 text-right text-[10px] font-bold text-stone-500 uppercase tracking-wider">Control</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100 bg-white" id="parents-table-body">
                <!-- Javascript will inject table rows here -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Panel 2: Students Records -->
      <section id="panel-students" class="panel-section hidden space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-display font-semibold text-stone-900 leading-tight">Autonomous Student Roster</h2>
            <p class="text-xs text-stone-500">Administrate connection codes and course performance settings for children under Guidance.</p>
          </div>
          <button onclick="openStudentModal(null)" class="bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Enroll New Student</span>
          </button>
        </div>

        <div class="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-stone-150">
              <thead class="bg-stone-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Student ID</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Student Name</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Connected Guardians / Parents</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Class Grade</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Registration Cohort</th>
                  <th scope="col" class="px-6 py-4 text-right text-[10px] font-bold text-stone-500 uppercase tracking-wider">Control</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100 bg-white" id="students-table-body">
                <!-- Javascript will inject table rows here -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Panel 3: Course Modules & Lessons -->
      <section id="panel-modules" class="panel-section hidden space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-display font-semibold text-stone-900 leading-tight">Course Curriculum & Lesson Builder</h2>
            <p class="text-xs text-stone-500">Edit course titles, weekly parameters, and customize lessons (type, duration, description content, and video resources).</p>
          </div>
          <button onclick="addNewModule()" class="bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Add New Week Module</span>
          </button>
        </div>

        <!-- Weekly Modules and Lessons accordions -->
        <div class="space-y-4" id="modules-list-container">
          <!-- Javascript will inject interactive modules list here -->
        </div>
      </section>

      <!-- Panel 4: Daily Habits & Tasks -->
      <section id="panel-tasks" class="panel-section hidden space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-display font-semibold text-stone-900 leading-tight">Custom Habit & Daily Practice Tasks</h2>
            <p class="text-xs text-stone-500">Define daily co-regulation habits that generate brownie reward points for families throughout the week.</p>
          </div>
          <button onclick="openTaskModal(null)" class="bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Add New Daily Task</span>
          </button>
        </div>

        <div class="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-stone-150">
              <thead class="bg-stone-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Module Link</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Associated Day</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Task Title</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-stone-500 uppercase tracking-wider">Brownie Points Reward</th>
                  <th scope="col" class="px-6 py-4 text-right text-[10px] font-bold text-stone-500 uppercase tracking-wider">Control</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100 bg-white" id="tasks-table-body">
                <!-- Javascript will inject tables here -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Panel 5: Backup & Database Status -->
      <section id="panel-system" class="panel-section hidden space-y-6">
        <div>
          <h2 class="text-xl font-display font-semibold text-stone-900 leading-tight">Database Engine Diagnostics & Backups</h2>
          <p class="text-xs text-stone-500">Directly pull and push from the server filesystem and cloud Supabase tables securely.</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Backup actions -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 class="text-xs font-bold uppercase text-stone-400 tracking-wider">Local Backup Engine Control</h3>
            <div class="space-y-4">
              <p class="text-xs text-stone-600 leading-relaxed">
                MindBloom utilizes high-redundancy, fail-safe local JSON storage to preserve patient information independently. You can download this database at any time.
              </p>
              
              <div class="flex flex-wrap items-center gap-3">
                <a href="/api/backend-data/download" target="_blank" class="bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs px-5 py-3 rounded-full inline-flex items-center gap-1.5 transition-all">
                  <i data-lucide="download" class="w-4 h-4"></i>
                  <span>Download data_db_backup.json</span>
                </a>
                
                <button onclick="triggerLocalStateWipe()" class="border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs px-5 py-3 rounded-full flex items-center gap-1.5 transition-all">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                  <span>Deep-Wipe Storage Backup</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Supabase cloud tools status -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 class="text-xs font-bold uppercase text-stone-400 tracking-wider">Supabase Integration Sync</h3>
            <div class="space-y-4">
              <p class="text-xs text-stone-600 leading-relaxed">
                Replicate records securely to cloud storage. Bi-directional pull and push can be fired instantaneously from the client.
              </p>

              <div class="flex items-center gap-3">
                <button onclick="triggerSupabasePush()" class="bg-[#009473]/10 hover:bg-[#009473]/20 text-[#009473] font-bold text-xs px-5 py-3 rounded-full flex items-center gap-1.5 transition-all">
                  <i data-lucide="cloud-lightning" class="w-4 h-4"></i>
                  <span>Push State to Cloud Database</span>
                </button>
                <button onclick="triggerSupabasePull()" class="border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs px-5 py-3 rounded-full flex items-center gap-1.5 transition-all">
                  <i data-lucide="arrow-down" class="w-4 h-4"></i>
                  <span>Pull State from Cloud Database</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Display JSON Preview editor -->
        <div class="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div class="bg-stone-50 px-6 py-4 flex items-center justify-between border-b border-stone-200">
            <span class="text-xs font-display font-semibold text-stone-800">Raw DB JSON Live Data Inspection</span>
            <span class="text-[10px] text-stone-400 font-mono">Read-Only View</span>
          </div>
          <div class="p-6">
            <pre class="bg-stone-900 text-stone-200 font-mono text-[11px] p-4 rounded-xl overflow-x-auto max-h-[400px]" id="raw-json-inspector">Loading raw schema values...</pre>
          </div>
        </div>
      </section>

    </div>

  </main>

  <!-- Modal components -->

  <!-- 1. PARENT FORM MODAL -->
  <div id="parent-modal" class="hidden fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-[2rem] border border-stone-250/20 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-display font-bold text-stone-900" id="parent-modal-title">Parent Enrollment Form</h3>
        <button onclick="closeParentModal()" class="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-750">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="parent-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs" onsubmit="saveParentModal(event)">
        <input type="hidden" id="parent-modal-index">
        
        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Parent Full Name</label>
          <input type="text" id="parent-form-name" required class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Parent Login Phone</label>
          <input type="text" id="parent-form-phone" required class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400" placeholder="e.g. 6307686532">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Email Address</label>
          <input type="email" id="parent-form-email" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Parent Status</label>
          <select id="parent-form-status" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400">
            <option value="active">Active/Enrolled</option>
            <option value="suspended">Suspended Access</option>
            <option value="trial">Trial Period</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Student/Child Name</label>
          <input type="text" id="parent-form-student-name" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Student ID Link</label>
          <input type="text" id="parent-form-student-id" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400" placeholder="S101">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Class Grade</label>
          <input type="text" id="parent-form-grade" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400" placeholder="Grade 3">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">System Password</label>
          <input type="text" id="parent-form-password" required class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400" placeholder="password">
        </div>

        <!-- Weekly overrides checklists -->
        <div class="col-span-1 sm:col-span-2 space-y-2 mt-2 pt-4 border-t border-stone-100">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Weekly unlocks module override (Check to grant access)</label>
          <div class="grid grid-cols-4 sm:grid-cols-8 gap-2" id="parent-unlocks-checkboxes-container">
            <!-- Weeks 1 to 8 buttons injected by JS -->
          </div>
        </div>

        <div class="col-span-1 sm:col-span-2 flex justify-end gap-3 pt-6 border-t border-stone-100 mt-4">
          <button type="button" onclick="closeParentModal()" class="px-5 py-3 rounded-full hover:bg-stone-100 text-stone-600 font-bold transition-all">Cancel</button>
          <button type="submit" class="px-6 py-3 rounded-full bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all">Submit Details</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 2. STUDENT FORM MODAL -->
  <div id="student-modal" class="hidden fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-[2rem] border border-stone-250/20 max-w-lg w-full shadow-2xl p-6 sm:p-8 space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-display font-bold text-stone-900" id="student-modal-title">Student Enrollment Form</h3>
        <button onclick="closeStudentModal()" class="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-750">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="student-form" class="space-y-4 text-xs" onsubmit="saveStudentModal(event)">
        <input type="hidden" id="student-modal-index">
        
        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Student ID (Unique code)</label>
          <input type="text" id="student-form-id" required class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400" placeholder="e.g. S104">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Student Full Name</label>
          <input type="text" id="student-form-name" required class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Class Grade</label>
          <input type="text" id="student-form-grade" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400" placeholder="Grade 3">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Cohort Group</label>
          <input type="text" id="student-form-cohort" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400" placeholder="Spring 2026">
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-stone-100 mt-4">
          <button type="button" onclick="closeStudentModal()" class="px-5 py-3 rounded-full hover:bg-stone-100 text-stone-600 font-bold transition-all">Cancel</button>
          <button type="submit" class="px-6 py-3 rounded-full bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all">Enroll Student</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 3. LESSON FORM MODAL -->
  <div id="lesson-modal" class="hidden fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-[2rem] border border-stone-250/20 max-w-lg w-full shadow-2xl p-6 sm:p-8 space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-display font-bold text-stone-900" id="lesson-modal-title">Customize Lesson Asset</h3>
        <button onclick="closeLessonModal()" class="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-750">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="lesson-form" class="space-y-4 text-xs" onsubmit="saveLessonModal(event)">
        <input type="hidden" id="lesson-modal-mod-index">
        <input type="hidden" id="lesson-modal-les-index">
        
        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Lesson ID (Unique key)</label>
          <input type="text" id="lesson-form-id" required class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400" placeholder="e.g. l1-4">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Lesson Title</label>
          <input type="text" id="lesson-form-title" required class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Duration String</label>
          <input type="text" id="lesson-form-duration" required class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400" placeholder="e.g. 10:45">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Activity Type</label>
          <select id="lesson-form-type" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400">
            <option value="video">📹 Digital Secure Loop Video</option>
            <option value="reflection">💬 Parent Periodic Reflection Prompt</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Video Resource URL (Wistia/YouTube Link)</label>
          <input type="text" id="lesson-form-videoUrl" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400" placeholder="https://...">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Task Guidelines / Reflection Content Prompt</label>
          <textarea id="lesson-form-content" rows="3" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400" placeholder="Define co-regulation activities here..."></textarea>
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-stone-100 mt-4">
          <button type="button" onclick="closeLessonModal()" class="px-5 py-3 rounded-full hover:bg-stone-100 text-stone-600 font-bold transition-all">Cancel</button>
          <button type="submit" class="px-6 py-3 rounded-full bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all">Apply Lesson Settings</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 4. DAILY HABITS / TASK FORM MODAL -->
  <div id="task-modal" class="hidden fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-[2rem] border border-stone-250/20 max-w-lg w-full shadow-2xl p-6 sm:p-8 space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-display font-bold text-stone-900" id="task-modal-title">Daily Practice Task Settings</h3>
        <button onclick="closeTaskModal()" class="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-750">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="task-form" class="space-y-4 text-xs" onsubmit="saveTaskModal(event)">
        <input type="hidden" id="task-modal-index">
        
        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Associated Module (Select Link)</label>
          <select id="task-form-mid" required class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400">
            <!-- Options populated by data -->
          </select>
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Day Number of the Module Sequence (1 to 7)</label>
          <input type="number" id="task-form-day" required min="1" max="7" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Practice Title</label>
          <input type="text" id="task-form-title" required class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400">
        </div>

        <div class="space-y-1">
          <label class="block font-bold text-stone-500 uppercase tracking-wider">Brownie Points Reward (Amount)</label>
          <input type="number" id="task-form-points" required min="5" max="100" class="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400">
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-stone-100 mt-4">
          <button type="button" onclick="closeTaskModal()" class="px-5 py-3 rounded-full hover:bg-stone-100 text-stone-600 font-bold transition-all">Cancel</button>
          <button type="submit" class="px-6 py-3 rounded-full bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all">Add Practice Task</button>
        </div>
      </form>
    </div>
  </div>


  <!-- Core Administration Page Scripts -->
  <script>
    let db = null;
    let activeTab = 'parents';

    // Refresh metrics on dashboard
    async function refreshData() {
      const rIcon = document.getElementById('refresh-icon');
      if (rIcon) rIcon.classList.add('animate-spin');
      
      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('content-container').classList.add('hidden');
      
      try {
        const resp = await fetch('/api/backend-data');
        if (resp.ok) {
          const resJson = await resp.json();
          if (resJson.success && resJson.data) {
            db = resJson.data;
            
            // Standardize arrays
            if (!db.parents) db.parents = [];
            if (!db.students) db.students = [];
            if (!db.modules) db.modules = [];
            if (!db.daily_tasks) db.daily_tasks = [];
            
            showSuccessAlert('Loaded Live Database State Successfully!');
            renderDashboard();
          } else {
            showErrorAlert('Empty data received or could not load');
          }
        } else {
          throw new Error('HTTP status ' + resp.status);
        }
      } catch (err) {
        showErrorAlert('Failed to synchronize status: ' + err.message);
      } finally {
        if (rIcon) rIcon.classList.remove('animate-spin');
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('content-container').classList.remove('hidden');
      }
    }

    // Render statistics cards and the current tab's panel data
    function renderDashboard() {
      if (!db) return;
      
      // Update stats cards
      document.getElementById('stat-parents').innerText = db.parents.length;
      document.getElementById('stat-students').innerText = db.students.length;
      document.getElementById('stat-modules').innerText = db.modules.length;
      document.getElementById('stat-tasks').innerText = db.daily_tasks.length;
      
      // Render specific panel based on tab
      if (activeTab === 'parents') renderParentsTab();
      else if (activeTab === 'students') renderStudentsTab();
      else if (activeTab === 'modules') renderModulesTab();
      else if (activeTab === 'tasks') renderTasksTab();
      else if (activeTab === 'system') renderSystemTab();
      
      // Upgrade Lucide icons
      lucide.createIcons();
    }

    // Tab switcher
    function switchTab(tabId) {
      activeTab = tabId;
      
      // Reset tab titles classes
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-stone-950', 'text-stone-950');
        btn.classList.add('border-transparent', 'text-stone-400', 'hover:text-stone-750');
      });
      
      const activeBtn = document.getElementById('tab-' + tabId);
      if (activeBtn) {
        activeBtn.classList.remove('border-transparent', 'text-stone-400', 'hover:text-stone-750');
        activeBtn.classList.add('border-stone-950', 'text-stone-950');
      }
      
      // Toggle physical section panels
      document.querySelectorAll('.panel-section').forEach(s => s.classList.add('hidden'));
      const activeSection = document.getElementById('panel-' + tabId);
      if (activeSection) activeSection.classList.remove('hidden');
      
      renderDashboard();
    }

    // Display feedback notices
    function showSuccessAlert(msg) {
      const alertDiv = document.getElementById('feedback-alert');
      alertDiv.className = "p-4 rounded-2xl border text-xs flex gap-3 items-start transition-all duration-300 bg-emerald-50 border-emerald-100 text-emerald-800";
      
      document.getElementById('feedback-icon').setAttribute('data-lucide', 'shield-check');
      document.getElementById('feedback-title').innerText = "System Notification";
      document.getElementById('feedback-desc').innerText = msg;
      alertDiv.classList.remove('hidden');
      
      lucide.createIcons();
      setTimeout(hideFeedback, 6000);
    }

    function showErrorAlert(msg) {
      const alertDiv = document.getElementById('feedback-alert');
      alertDiv.className = "p-4 rounded-2xl border text-xs flex gap-3 items-start transition-all duration-300 bg-rose-50 border-rose-100 text-rose-800";
      
      document.getElementById('feedback-icon').setAttribute('data-lucide', 'alert-triangle');
      document.getElementById('feedback-title').innerText = "Process Error";
      document.getElementById('feedback-desc').innerText = msg;
      alertDiv.classList.remove('hidden');
      
      lucide.createIcons();
    }

    function hideFeedback() {
      document.getElementById('feedback-alert').classList.add('hidden');
    }

    // Save state back to server (POST /api/backend-data/save)
    async function saveAllToServer() {
      if (!db) return;
      try {
        const resp = await fetch('/api/backend-data/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(db)
        });
        
        const result = await resp.json();
        if (resp.ok && result.success) {
          showSuccessAlert('Successfully committed current changes to backup storage & high redundancy cache!');
          refreshData();
        } else {
          showErrorAlert(result.error || 'Server rejected save action.');
        }
      } catch (err) {
        showErrorAlert('Failed writing backup payload to disk: ' + err.message);
      }
    }


    /* Render panel functions */

    function renderParentsTab() {
      const body = document.getElementById('parents-table-body');
      body.innerHTML = '';
      
      if (db.parents.length === 0) {
        body.innerHTML = '<tr><td colspan="7" class="px-6 py-12 text-center text-xs text-stone-400 font-mono">No parent accounts currently found on the server backup database file.</td></tr>';
        return;
      }
      
      db.parents.forEach((p, idx) => {
        const unlockedList = p.unlockedWeeksList ? p.unlockedWeeksList.join(', ') : 'None';
        const stateColor = p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800';
        
        const trHtml = \`
          <tr class="hover:bg-stone-50/50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-stone-200 text-stone-700 font-black text-xs flex items-center justify-center font-display uppercase">
                  \${p.name ? p.name.substring(0, 2) : 'PT'}
                </div>
                <div>
                  <div class="text-xs font-bold text-stone-900">\${p.name}</div>
                  <div class="text-[9px] font-mono text-stone-400">#\${p.phone}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-xs text-stone-600 font-mono">\${p.email || 'No email declared'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-xs text-stone-600">\${p.studentName || 'Not Linked'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-xs font-mono text-stone-500">\${p.classGrade || 'Third Grade'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-xs">
              <span class="px-2 py-1 rounded-md bg-stone-100 font-mono font-bold text-stone-700">Week \${unlockedList}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-xs">
              <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider \${stateColor}">\${p.status || 'Active'}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-xs space-x-2">
              <button onclick="openParentModal(\${idx})" class="text-stone-700 hover:text-stone-950 font-bold px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg transition-all">Edit</button>
              <button onclick="deleteParent(\${idx})" class="text-rose-600 hover:text-rose-900 font-bold px-2.5 py-1.5 hover:bg-rose-50 rounded-lg transition-all">Delete</button>
            </td>
          </tr>
        \`;
        body.innerHTML += trHtml;
      });
    }

    function renderStudentsTab() {
      const body = document.getElementById('students-table-body');
      body.innerHTML = '';
      
      if (db.students.length === 0) {
        body.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-xs text-stone-400 font-mono">No distinct student enrollment items active yet.</td></tr>';
        return;
      }
      
      db.students.forEach((s, idx) => {
        // Find links
        const guardiansList = db.parents
          .filter(p => p.studentId === s.id)
          .map(p => p.name)
          .join(', ') || 'No guardian accounts detected';
          
        const trHtml = \`
          <tr class="hover:bg-stone-50/50">
            <td class="px-6 py-4 whitespace-nowrap text-xs font-mono font-bold text-stone-850">\${s.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-xs font-bold text-stone-900">\${s.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-xs text-stone-600">\${guardiansList}</td>
            <td class="px-6 py-4 whitespace-nowrap text-xs font-mono text-stone-500">\${s.classGrade || 'Primary'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-xs text-stone-500">\${s.batchCohort || 'Spring 2026'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-xs space-x-2">
              <button onclick="openStudentModal(\${idx})" class="text-stone-700 hover:text-stone-950 font-bold px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg transition-all">Edit</button>
              <button onclick="deleteStudent(\${idx})" class="text-rose-600 hover:text-rose-900 font-bold px-2.5 py-1.5 hover:bg-rose-50 rounded-lg transition-all">Delete</button>
            </td>
          </tr>
        \`;
        body.innerHTML += trHtml;
      });
    }

    function renderModulesTab() {
      const container = document.getElementById('modules-list-container');
      container.innerHTML = '';
      
      if (db.modules.length === 0) {
        container.innerHTML = '<div class="p-12 text-center text-xs text-stone-400 font-mono bg-white rounded-3xl border border-stone-200">No core weekly course modules constructed.</div>';
        return;
      }
      
      db.modules.forEach((mod, modIdx) => {
        let lessonsHtml = '';
        if (mod.lessons && mod.lessons.length > 0) {
          mod.lessons.forEach((l, lesIdx) => {
            lessonsHtml += \`
              <div class="p-4 bg-stone-50/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-stone-200/50 text-xs">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase tracking-wider bg-stone-200 text-stone-700">
                      \${l.type === 'video' ? '📹 Video' : '💬 Reflection'}
                    </span>
                    <strong class="font-bold text-stone-900 font-display">\${l.title}</strong>
                    <span class="text-stone-400 font-mono">(\${l.duration || '00:00'})</span>
                  </div>
                  \${l.videoUrl ? \`<div class="text-[10px] text-accent-moss font-mono break-all font-semibold">Url: \${l.videoUrl}</div>\` : ''}
                  \${l.content ? \`<div class="text-[10px] text-stone-500 leading-normal italic font-serif">"\${l.content}"</div>\` : ''}
                </div>
                
                <div class="flex items-center gap-2 self-end sm:self-auto">
                  <button onclick="openLessonModal(\${modIdx}, \${lesIdx})" class="px-2.5 py-1 rounded bg-white border border-stone-250 hover:bg-stone-50 font-bold text-[10px] uppercase tracking-wider">Modify</button>
                  <button onclick="deleteLesson(\${modIdx}, \${lesIdx})" class="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded font-bold text-[10px] uppercase tracking-wider">Remove</button>
                </div>
              </div>
            \`;
          });
        } else {
          lessonsHtml = '<p class="text-center text-stone-400 py-4 font-serif italic text-xs">This curriculum module contains zero active lessons yet.</p>';
        }
        
        const modHtml = \`
          <div class="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div class="px-6 py-5 bg-stone-50/50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-stone-900 text-white font-mono text-[10px] font-bold">Week \${mod.week}</span>
                  <span class="text-stone-400 font-mono text-[11px]">&bull; Module ID: \${mod.id}</span>
                </div>
                <h3 class="text-lg font-display font-bold text-stone-900 leading-tight">\${mod.title}</h3>
                <p class="text-xs text-stone-500 leading-normal">\${mod.description || 'No module details declared.'}</p>
              </div>
              
              <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button onclick="addNewLesson(\${modIdx})" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-950 font-bold text-xs rounded-full flex items-center gap-1">
                  <i data-lucide="plus-circle" class="w-4 h-4"></i> Add Lesson
                </button>
                <button onclick="editModuleDetails(\${modIdx})" class="px-4 py-2 border border-stone-250 hover:bg-stone-50 font-bold text-xs rounded-full">
                  Modify Week Meta
                </button>
                <button onclick="deleteModule(\${modIdx})" class="px-3 py-2 hover:bg-rose-50 text-rose-600 rounded-full">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
            
            <div class="p-6 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">Lectures & Content Sequence (\${mod.lessons ? mod.lessons.length : 0})</span>
                <span class="text-[10px] text-stone-400 italic">Order: Sequential</span>
              </div>
              <div class="space-y-3">
                \${lessonsHtml}
              </div>
            </div>
          </div>
        \`;
        container.innerHTML += modHtml;
      });
    }

    function renderTasksTab() {
      const body = document.getElementById('tasks-table-body');
      body.innerHTML = '';
      
      if (db.daily_tasks.length === 0) {
        body.innerHTML = '<tr><td colspan="5" class="px-6 py-12 text-center text-xs text-stone-400 font-mono">No parent daily habits or co-regulation tasks defined yet.</td></tr>';
        return;
      }
      
      db.daily_tasks.forEach((t, idx) => {
        const trHtml = \`
          <tr class="hover:bg-stone-50/50">
            <td class="px-6 py-4 whitespace-nowrap text-xs font-mono font-bold text-stone-700">\${t.moduleId || 'Global'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-xs font-mono text-stone-500">Day \${t.day || 1} of Sequence</td>
            <td class="px-6 py-4 text-xs font-bold text-stone-900">\${t.title}</td>
            <td class="px-6 py-4 whitespace-nowrap text-xs">
              <span class="px-2 py-1 rounded-md bg-accent-sage/10 text-accent-moss font-mono font-black font-semibold font-bold">+\${t.pointsReward || 10} Brownies</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-xs">
              <button onclick="deleteTask(\${idx})" class="text-rose-600 hover:text-rose-900 font-bold px-2.5 py-1.5 hover:bg-rose-50 rounded-lg transition-all">Remove</button>
            </td>
          </tr>
        \`;
        body.innerHTML += trHtml;
      });
    }

    function renderSystemTab() {
      // Dump raw JSON
      const rawIns = document.getElementById('raw-json-inspector');
      if (rawIns) {
        rawIns.innerText = JSON.stringify(db, null, 2);
      }
    }


    /* Modals logic opening and locking */

    // Parents modals CRUD
    function openParentModal(index) {
      document.getElementById('parent-form').reset();
      
      // Load unlocks layout
      buildParentUnlocks();
      
      if (index !== null) {
        document.getElementById('parent-modal-title').innerText = "Edit Parent Account Profile";
        document.getElementById('parent-modal-index').value = index;
        const p = db.parents[index];
        
        document.getElementById('parent-form-name').value = p.name || '';
        document.getElementById('parent-form-phone').value = p.phone || '';
        document.getElementById('parent-form-email').value = p.email || '';
        document.getElementById('parent-form-status').value = p.status || 'active';
        document.getElementById('parent-form-student-name').value = p.studentName || '';
        document.getElementById('parent-form-student-id').value = p.studentId || '';
        document.getElementById('parent-form-grade').value = p.classGrade || '';
        document.getElementById('parent-form-password').value = p.password || 'password';
        
        // Unlocks array
        const unlocked = p.unlockedWeeksList || [];
        unlocked.forEach(w => {
          const chk = document.getElementById('p-unlock-w-' + w);
          if (chk) chk.checked = true;
        });
      } else {
        document.getElementById('parent-modal-title').innerText = "Enroll New Parent Account";
        document.getElementById('parent-modal-index').value = '';
        
        // Select all by default
        for (let i = 1; i <= 8; i++) {
          const chk = document.getElementById('p-unlock-w-' + i);
          if (chk) chk.checked = true;
        }
      }
      
      document.getElementById('parent-modal').classList.remove('hidden');
    }

    function closeParentModal() {
      document.getElementById('parent-modal').classList.add('hidden');
    }

    function buildParentUnlocks() {
      const container = document.getElementById('parent-unlocks-checkboxes-container');
      container.innerHTML = '';
      for (let i = 1; i <= 8; i++) {
        container.innerHTML += \`
          <label class="flex items-center justify-center p-2.5 rounded-xl border border-stone-200/70 bg-stone-50 cursor-pointer hover:bg-stone-100 select-none gap-1">
            <input type="checkbox" id="p-unlock-w-\${i}" value="\${i}" class="rounded text-stone-900 focus:ring-stone-400">
            <span class="font-mono font-bold text-[11px]">W\${i}</span>
          </label>
        \`;
      }
    }

    function saveParentModal(e) {
      e.preventDefault();
      const idxStr = document.getElementById('parent-modal-index').value;
      
      // Read checkboxes
      const unlocked = [];
      for (let i = 1; i <= 8; i++) {
        if (document.getElementById('p-unlock-w-' + i).checked) {
          unlocked.push(i);
        }
      }
      
      const payload = {
        name: document.getElementById('parent-form-name').value.trim(),
        phone: document.getElementById('parent-form-phone').value.trim(),
        email: document.getElementById('parent-form-email').value.trim(),
        status: document.getElementById('parent-form-status').value,
        studentName: document.getElementById('parent-form-student-name').value.trim(),
        studentId: document.getElementById('parent-form-student-id').value.trim(),
        classGrade: document.getElementById('parent-form-grade').value.trim(),
        password: document.getElementById('parent-form-password').value.trim(),
        unlockedWeeksList: unlocked,
        batchCohort: 'Spring 2026',
        startDate: new Date().toISOString().substring(0, 10),
      };

      if (idxStr !== '') {
        // Save edit
        const index = parseInt(idxStr);
        db.parents[index] = { ...db.parents[index], ...payload };
        showSuccessAlert('Successfully updated parent account.');
      } else {
        // Create new
        db.parents.push(payload);
        showSuccessAlert('Enrolled new parent profile successfully.');
      }
      
      closeParentModal();
      renderDashboard();
    }

    function deleteParent(index) {
      if (confirm('Are you absolutely certain you want to delete parent: ' + db.parents[index].name + '?')) {
        db.parents.splice(index, 1);
        renderDashboard();
        showSuccessAlert('Parent account dropped successfully.');
      }
    }


    // Students modals CRUD
    function openStudentModal(index) {
      document.getElementById('student-form').reset();
      if (index !== null) {
        document.getElementById('student-modal-title').innerText = "Edit Student Profile";
        document.getElementById('student-modal-index').value = index;
        const s = db.students[index];
        document.getElementById('student-form-id').value = s.id || '';
        document.getElementById('student-form-id').disabled = true;
        document.getElementById('student-form-name').value = s.name || '';
        document.getElementById('student-form-grade').value = s.classGrade || '';
        document.getElementById('student-form-cohort').value = s.batchCohort || '';
      } else {
        document.getElementById('student-modal-title').innerText = "Register New Student";
        document.getElementById('student-modal-index').value = '';
        document.getElementById('student-form-id').disabled = false;
      }
      document.getElementById('student-modal').classList.remove('hidden');
    }

    function closeStudentModal() {
      document.getElementById('student-modal').classList.add('hidden');
    }

    function saveStudentModal(e) {
      e.preventDefault();
      const idxStr = document.getElementById('student-modal-index').value;
      const id = document.getElementById('student-form-id').value.trim();
      
      const payload = {
        id,
        name: document.getElementById('student-form-name').value.trim(),
        classGrade: document.getElementById('student-form-grade').value.trim(),
        batchCohort: document.getElementById('student-form-cohort').value.trim(),
      };

      if (idxStr !== '') {
        const index = parseInt(idxStr);
        db.students[index] = { ...db.students[index], ...payload };
        showSuccessAlert('Updated student registry successfully.');
      } else {
        // Check duplication
        const duplicate = db.students.find(s => s.id === id);
        if (duplicate) {
          alert('Error: Student with ID ' + id + ' already exists!');
          return;
        }
        db.students.push(payload);
        showSuccessAlert('Student enrolled successfully.');
      }
      closeStudentModal();
      renderDashboard();
    }

    function deleteStudent(index) {
      if (confirm('Drop student: ' + db.students[index].name + '?')) {
        db.students.splice(index, 1);
        renderDashboard();
        showSuccessAlert('Student profile deleted.');
      }
    }


    // Modules Curriculum Core Editor
    function addNewModule() {
      const weekNumber = db.modules.length + 1;
      const payload = {
        id: 'm' + weekNumber,
        title: 'New module: Root Guidance week ' + weekNumber,
        description: 'Provide week ' + weekNumber + ' guidelines and co-regulation activities here.',
        week: weekNumber,
        unlocked: true,
        progress: 0,
        lessons: []
      };
      db.modules.push(payload);
      showSuccessAlert('Added Week ' + weekNumber + ' Curriculum Module workspace. Double check to customize Details!');
      renderDashboard();
    }

    function editModuleDetails(index) {
      const m = db.modules[index];
      const newTitle = prompt('Enter New Title for week ' + m.week + ' module:', m.title);
      if (newTitle === null) return;
      
      const newDesc = prompt('Enter Description summary for week:', m.description || '');
      if (newDesc === null) return;
      
      db.modules[index].title = newTitle.trim() || m.title;
      db.modules[index].description = newDesc.trim() || m.description;
      
      showSuccessAlert('Week ' + m.week + ' parameters saved successfully.');
      renderDashboard();
    }

    function deleteModule(index) {
      if (confirm('Drop entire Week module ' + db.modules[index].title + '? Warning: This deletes associated lessons.')) {
        db.modules.splice(index, 1);
        renderDashboard();
        showSuccessAlert('Module deleted successfully.');
      }
    }


    // Lessons CRUD
    function addNewLesson(modIdx) {
      document.getElementById('lesson-form').reset();
      document.getElementById('lesson-modal-title').innerText = "Create New Lesson";
      document.getElementById('lesson-modal-mod-index').value = modIdx;
      document.getElementById('lesson-modal-les-index').value = '';
      
      const m = db.modules[modIdx];
      const prefix = 'l' + m.week + '-' + (m.lessons ? m.lessons.length + 1 : 1);
      document.getElementById('lesson-form-id').value = prefix;
      document.getElementById('lesson-form-id').disabled = false;
      
      document.getElementById('lesson-modal').classList.remove('hidden');
    }

    function openLessonModal(modIdx, lesIdx) {
      document.getElementById('lesson-form').reset();
      document.getElementById('lesson-modal-title').innerText = "Edit Lesson Resources";
      document.getElementById('lesson-modal-mod-index').value = modIdx;
      document.getElementById('lesson-modal-les-index').value = lesIdx;
      
      const l = db.modules[modIdx].lessons[lesIdx];
      document.getElementById('lesson-form-id').value = l.id || '';
      document.getElementById('lesson-form-id').disabled = true;
      document.getElementById('lesson-form-title').value = l.title || '';
      document.getElementById('lesson-form-duration').value = l.duration || '10:00';
      document.getElementById('lesson-form-type').value = l.type || 'video';
      document.getElementById('lesson-form-videoUrl').value = l.videoUrl || '';
      document.getElementById('lesson-form-content').value = l.content || '';
      
      document.getElementById('lesson-modal').classList.remove('hidden');
    }

    function closeLessonModal() {
      document.getElementById('lesson-modal').classList.add('hidden');
    }

    function saveLessonModal(e) {
      e.preventDefault();
      const modIdx = parseInt(document.getElementById('lesson-modal-mod-index').value);
      const lesIdxStr = document.getElementById('lesson-modal-les-index').value;
      const lid = document.getElementById('lesson-form-id').value.trim();
      
      const payload = {
        id: lid,
        title: document.getElementById('lesson-form-title').value.trim(),
        duration: document.getElementById('lesson-form-duration').value.trim() || '10:00',
        type: document.getElementById('lesson-form-type').value,
        videoUrl: document.getElementById('lesson-form-videoUrl').value.trim() || undefined,
        content: document.getElementById('lesson-form-content').value.trim() || undefined,
        completed: false
      };

      if (!db.modules[modIdx].lessons) db.modules[modIdx].lessons = [];

      if (lesIdxStr !== '') {
        const lesIdx = parseInt(lesIdxStr);
        db.modules[modIdx].lessons[lesIdx] = { ...db.modules[modIdx].lessons[lesIdx], ...payload };
        showSuccessAlert('Lesson details modified.');
      } else {
        db.modules[modIdx].lessons.push(payload);
        showSuccessAlert('Lesson generated successfully under Week ' + db.modules[modIdx].week);
      }
      closeLessonModal();
      renderDashboard();
    }

    function deleteLesson(modIdx, lesIdx) {
      if (confirm('Delete lesson ' + db.modules[modIdx].lessons[lesIdx].title + '?')) {
        db.modules[modIdx].lessons.splice(lesIdx, 1);
        renderDashboard();
        showSuccessAlert('Lesson deleted.');
      }
    }


    // Daily practice tasks Crud
    function openTaskModal(index) {
      document.getElementById('task-form').reset();
      
      // Populate module dropdown
      const sel = document.getElementById('task-form-mid');
      sel.innerHTML = '';
      db.modules.forEach(m => {
        sel.innerHTML += \`<option value="\${m.id}">Week \${m.week} &bull; \${m.title}</option>\`;
      });
      
      document.getElementById('task-modal').classList.remove('hidden');
    }

    function closeTaskModal() {
      document.getElementById('task-modal').classList.add('hidden');
    }

    function saveTaskModal(e) {
      e.preventDefault();
      const payload = {
        id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        moduleId: document.getElementById('task-form-mid').value,
        day: parseInt(document.getElementById('task-form-day').value),
        title: document.getElementById('task-form-title').value.trim(),
        pointsReward: parseInt(document.getElementById('task-form-points').value)
      };

      db.daily_tasks.push(payload);
      showSuccessAlert('Daily practice rule generated successfully!');
      closeTaskModal();
      renderDashboard();
    }

    function deleteTask(index) {
      if (confirm('Delete daily rule: ' + db.daily_tasks[index].title + '?')) {
        db.daily_tasks.splice(index, 1);
        renderDashboard();
        showSuccessAlert('Daily rule removed.');
      }
    }


    /* DIAGNOSTICS DESTRUCTIVE AND CLOUD PINGS */

    async function triggerLocalStateWipe() {
      if (confirm('WARNING!!! This will wipe out all temporary storage backups on the server. Are you sure you wish to restart with empty seeds?')) {
        const password = prompt('Enter administration bypass token (default: password) to proceed:');
        if (password === 'password' || password === 'admin') {
          // Send empty payload
          try {
            db.parents = [];
            db.students = [];
            db.daily_tasks = [];
            db.reflections = [];
            db.live_sessions = [];
            db.passwordResetRequests = [];
            
            await saveAllToServer();
            showSuccessAlert('Deep Storage completely formatted. Reloading...');
          } catch(err) {
            alert('Format error: ' + err.message);
          }
        } else {
          alert('Bypass token rejected.');
        }
      }
    }

    async function triggerSupabasePush() {
      if (!confirm('Replicate current local backup dataset up to Supabase? This overwrites existing cloud schemas.')) return;
      try {
        const resp = await fetch('/api/supabase/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parents: db.parents,
            students: db.students,
            reflections: db.reflections,
            daily_tasks: db.daily_tasks,
            live_sessions: db.live_sessions
          })
        });
        const r = await resp.json();
        if (resp.ok && r.success) {
          showSuccessAlert('Cloud Ledger updated! Successfully synchronised content on PostgreSQL Database!');
        } else {
          alert('Database connection error: ' + (r.error || 'Server refused push connection'));
        }
      } catch (err) {
        alert('Supabase link failed: ' + err.message);
      }
    }

    async function triggerSupabasePull() {
      if (!confirm('Import all master records from the Supabase PostgreSQL database? Any local unsaved edits will be overwritten.')) return;
      try {
        const resp = await fetch('/api/supabase/pull');
        const r = await resp.json();
        if (resp.ok && r.success) {
          db = r.data;
          renderDashboard();
          showSuccessAlert('Cloud Sync Completed! Replaced backend cache with Supabase dataset.');
        } else {
          alert('Database connection output failed: ' + (r.message || r.error));
        }
      } catch (err) {
        alert('Cloud sync request crashed: ' + err.message);
      }
    }

    // Auto load data on document ready
    document.addEventListener("DOMContentLoaded", function() {
      refreshData();
    });
  </script>

</body>
</html>`;
}
