import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Calendar,
  LogOut,
  BookOpen,
  Clock,
  MapPin,
  CheckCircle,
  Download,
  FileText,
  CreditCard,
  Menu,
  X,
  Loader2,
  User,
  LayoutDashboard,
  ChevronRight,
  Calculator,
  Bus,
  Bell,
  Plus,
  Trash2,
  Paperclip,
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

// --- CONFIGURATION ---
// In this environment, we leave the API key empty to let the platform handle it securely.
const apiKey = 'AIzaSyDr7htRNEaXH6AlOY9fp2rd0kakAA0zq-A'; 

// --- FIXED CONFIGURATION ---
// Replaced the crashing JSON.parse with a safe object for Demo Mode
const firebaseConfig = {
  apiKey: 'DEMO_KEY',
  authDomain: 'demo.firebaseapp.com',
  projectId: 'demo-project',
  storageBucket: 'demo.appspot.com',
  messagingSenderId: '000000000',
  appId: '1:00000000:web:00000000',
};

// Safe Initialization
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn('Firebase not fully configured. Running in Demo Mode.');
}

// Ensure appId is available
const appId = 'nirma-campus-mate-v1';

// --- BUS ROUTE DATA ---
const BUS_DATA = {
  firstShift: {
    label: 'First Shift (07:30 AM - 03:00 PM)',
    returnTime: '3:15 PM (Sat: 1:30 PM)',
    routes: [
      {
        id: 1,
        name: 'C.T.M',
        time: '6:30 AM',
        driver: 'Laljibhai (9974607407)',
        stops:
          "C.T.M Cross Road, Rabari colony, Rajendr park Soni's chal, Krisnanagar, Thakkar nagar, Naroda patiya, Galaxy, Indira Bridge, Tapovan circle, Vishwakarma College Gate, College",
      },
      {
        id: 2,
        name: 'VASNA',
        time: '6:45 AM',
        driver: 'Anilbhai (9974768484)',
        stops:
          'Ambar Tower, Juhapura, Vasna, Jivraj Mehta Hospital, Mansi, Golmor, College',
      },
      {
        id: 3,
        name: 'NIRMA HOUSE',
        time: '6:45 AM',
        driver: 'Ramanbhai (9879181682)',
        stops:
          'Navrangpura, Vijay Char Rasta, Helmet Circle, AEC, Chok-Pallav Char Rasta, Ranna park, K.K Nagar, Umiya Hall, Chandlodia, Gota, College',
      },
      {
        id: 4,
        name: 'GANDHINAGAR',
        time: '6:45 AM',
        driver: 'Dashrathbhai (9925901264)',
        stops:
          'GH-6, GH-5, GH-4, Sector 12,13, G-3, Pathika, CH-3, CH-2, GH-2, G-2, G-1, GH-1, GH-0, Sargasan, Adalaj, College',
      },
      {
        id: 5,
        name: 'ISHANPUR',
        time: '6:30 AM',
        driver: 'Babubhai (7574064144)',
        stops:
          'Ishanpur, Cadila Brige, Ishanpur Gam, Maninagar Cross Road, Krishna buag, Ram Buag, Mansi, Gormoh, College',
      },
      {
        id: 6,
        name: 'MANINAGAR',
        time: '6:30 AM',
        driver: 'Dharmesh (8141301581)',
        stops:
          'Kankaria, Dhor bajar, Vaikunth dham, Danilimda, Chandra ngar, Anjali, Dharnidhar, Manek buag, College',
      },
      {
        id: 7,
        name: 'BOPAL',
        time: '6:45 AM',
        driver: 'Ajitshih (9624538173)',
        stops:
          'Sobo Center, Gala GYM khana Road, Prince Corner, Bopal cross Road, Khyati circle, Bhadaj circle, Science city Road, Kargil, Bhagavat, College',
      },
      {
        id: 8,
        name: 'CIVIL',
        time: '6:40 AM',
        driver: 'Parbatbhai (9979082931)',
        stops:
          'Galaxy, Kotarpur, Hosol, Airport Road, Dafnala, Ghevar, Sanidev Temple, Subhas Bridge, Sabarmati Road, Chandkheda, College',
      },
      {
        id: 9,
        name: 'NEHRU NAGAR',
        time: '6:45 AM',
        driver: 'Bhemabhai (9979963491)',
        stops:
          'Nehru nagar, Shivrajani, Star bajar, Ramdev nagar, Iscon, Pakvan, Thaltej, Zydus, College',
      },
      {
        id: 10,
        name: 'PANCHVATI',
        time: '6:45 AM',
        driver: 'Bhupatbhai (7874858145)',
        stops:
          'Mahalaxmi, Parimal garden, C.N Vidhyalay, Panjara pur, IIM Road, 132 Ring road, Helmet, Gurukul, Sal Hospital, Surdhara circle, Sola bridge, College',
      },
      {
        id: 11,
        name: 'SYAMAL',
        time: '6:50 AM',
        driver: 'Kanubhai (9925280406)',
        stops:
          'Syamal, Sachin Tower, Anandnagar Road, Prahlad nagar, Karnavati, College',
      },
    ],
  },
  secondShift: {
    label: 'Second Shift (11:00 AM - 06:30 PM)',
    returnTime: '6:40 PM',
    routes: [
      {
        id: 1,
        name: 'NARODA-C.T.M.',
        time: '9:20 AM',
        stops:
          "C.T.M. Cross Road, Soni's chal, Krisnanagar, Naroda patia, Galaxy, Indira Bridge, Agora Mall, Tapovan circle, Visat, Chankheda, College",
      },
      {
        id: 2,
        name: 'GANDHINAGAR',
        time: '9:50 AM',
        stops:
          'GH-6, GH-5, GH-4, Sector 12,13, G-3, Pathika, CH-3, CH-2, GH-2, G-2, G-1, GH-1, GH-0, Sargasan, Adalaj, College',
      },
      {
        id: 3,
        name: 'MANINAGAR-ISHANPUR',
        time: '9:20 AM',
        stops:
          'Isanpur, Cadila Bridge, Isanpur Gam, Maninagar Cross Road, Krisna buag, Ram buag, Chandrnagar, anjali, College',
      },
      {
        id: 4,
        name: 'VASNA-SACHIN TOWER',
        time: '9:30 AM',
        stops:
          'Juhapura, Vasna, Jivraj Mehta Hospital, Syamal, Sachin Tower, Prahlad Nagar, Karnavati, Pakavan, College',
      },
      {
        id: 5,
        name: 'NIRMA HOUSE',
        time: '10:00 AM',
        stops:
          'Nirma house, Navrangpura, Vijay Char Rasta, Helmet, AEC, Pallav Char Rasta, Ranna Park, K.K nagar, Umiya Hall, Chandalodia, Gota, College',
      },
      {
        id: 6,
        name: 'BOPAL',
        time: '10:00 AM',
        stops:
          'Sobo Center, Gala GYM khana Road, Prince Corner, Bopal cross Road, Khyati circle, Bhadaj circle, Science city Road, Kargil, Bhagavat, College',
      },
    ],
  },
};

// --- GPA CALCULATOR DATA ---
const commonSem1 = [
  { name: 'Mathematics I', type: 'theory', credits: 3 },
  { name: 'CP', type: 'theoryLab', credits: 3 },
  { name: 'Physics', type: 'theoryLab', credits: 3 },
  { name: 'Env. Sc.', type: 'theory', credits: 3 },
  { name: 'Ele. Sc.', type: 'theoryLab', credits: 3 },
  { name: 'General Eng.', type: 'theoryLab', credits: 3 },
];
const commonSem2 = [
  { name: 'Mathematics II', type: 'theory', credits: 3 },
  { name: 'Chem./Web Dev.', type: 'theoryLab', credits: 3 },
  { name: 'EDW', type: 'theoryLab', credits: 3 },
  { name: 'Written Com.', type: 'theory', credits: 3 },
  { name: 'AI/ML', type: 'theoryLab', credits: 3 },
  { name: 'Stats.', type: 'theoryLab', credits: 3 },
  { name: 'Cont. India', type: 'theory', credits: 3 },
];

const GPA_DATA = {
  CSE: {
    semesters: {
      1: commonSem1,
      2: commonSem2,
      3: [
        { name: 'MFCS', type: 'theory', credits: 3 },
        { name: 'OOP', type: 'theoryLab', credits: 3 },
        { name: 'DE', type: 'theoryLab', credits: 3 },
        { name: 'Economics', type: 'theory', credits: 3 },
        { name: 'ICC', type: 'theory', credits: 3 },
        { name: 'DS', type: 'theoryLab', credits: 3 },
        { name: 'Community Sevice', type: 'Internship', credits: 3 },
      ],
      4: [
        { name: 'Comp. Architecture', type: 'theory', credits: 3 },
        { name: 'DBMS', type: 'theoryLab', credits: 3 },
        { name: 'OS', type: 'theoryLab', credits: 3 },
        { name: 'Java Prog.', type: 'theoryLab', credits: 3 },
        { name: 'DC', type: 'theoryLab', credits: 3 },
        { name: 'OB', type: 'theory', credits: 3 },
      ],
      5: [
        { name: 'Computer Networks', type: 'theoryLab', credits: 4 },
        { name: 'ML', type: 'theoryLab', credits: 4 },
        { name: 'DAA', type: 'theoryLab', credits: 4 },
        { name: 'Depart. Elec.', type: 'theoryLab', credits: 4 },
        { name: 'MnI', type: 'theoryLab', credits: 4 },
        { name: 'Full Stack', type: 'theoryLab', credits: 4 },
      ],
      6: [
        { name: 'CC', type: 'theoryLab', credits: 4 },
        { name: 'SE', type: 'theoryLab', credits: 4 },
        { name: 'Depart. Elec. 2', type: 'theoryLab', credits: 4 },
        { name: 'HP', type: 'theoryLab', credits: 4 },
        { name: 'Open Elective', type: 'theoryLab', credits: 4 },
        { name: 'Summer Internship', type: 'Internship', credits: 6 },
      ],
      7: [
        { name: 'PCD', type: 'theoryLab', credits: 4 },
        { name: 'RMS', type: 'theoryLab', credits: 4 },
        { name: 'Depart. Elec. 3', type: 'theoryLab', credits: 4 },
        { name: 'Open Elective 2', type: 'theoryLab', credits: 4 },
        { name: 'Open Elective 3', type: 'theoryLab', credits: 4 },
      ],
      8: [{ name: 'Project/Internship', type: 'Internship', credits: 12 }],
    },
  },
  'AI/ML': {
    semesters: {
      1: commonSem1,
      2: commonSem2,
      3: [
        { name: 'MFCS', type: 'theory', credits: 3 },
        { name: 'OOP', type: 'theoryLab', credits: 3 },
        { name: 'DE', type: 'theoryLab', credits: 3 },
        { name: 'Economics', type: 'theory', credits: 3 },
        { name: 'ICC', type: 'theory', credits: 3 },
        { name: 'DS', type: 'theoryLab', credits: 3 },
        { name: 'Community Sevice', type: 'Internship', credits: 3 },
      ],
      4: [
        { name: 'Comp. Architecture', type: 'theory', credits: 3 },
        { name: 'DBMS', type: 'theoryLab', credits: 3 },
        { name: 'OS', type: 'theoryLab', credits: 3 },
        { name: 'ML', type: 'theoryLab', credits: 3 },
        { name: 'DAA', type: 'theoryLab', credits: 3 },
        { name: 'OB', type: 'theory', credits: 3 },
      ],
    },
  },
  MECHANICAL: { semesters: { 1: commonSem1, 2: commonSem2 } },
  CIVIL: { semesters: { 1: commonSem1, 2: commonSem2 } },
  CHEMICAL: { semesters: { 1: commonSem1, 2: commonSem2 } },
  EE: { semesters: { 1: commonSem1, 2: commonSem2 } },
  EI: { semesters: { 1: commonSem1, 2: commonSem2 } },
  EC: { semesters: { 1: commonSem1, 2: commonSem2 } },
};

// --- MOCK DATABASE ---
const MOCK_DB = {
  '4BCEE': {
    timetable: {
      MON: [
        {
          time: '07:45',
          end: '08:40',
          sub: 'CA',
          room: 'W307',
          instructor: 'TU',
        },
        {
          time: '08:40',
          end: '09:35',
          sub: 'DBMS',
          room: 'W307',
          instructor: 'MS',
        },
        {
          time: '10:45',
          end: '11:40',
          sub: 'DC',
          room: 'W306',
          instructor: 'USB',
        },
      ],
      TUE: [
        {
          time: '07:45',
          end: '08:40',
          sub: 'OS',
          room: 'W5013',
          instructor: 'SRN',
        },
        {
          time: '09:50',
          end: '10:45',
          sub: 'OS',
          room: 'W306',
          instructor: 'CT',
        },
        {
          time: '10:45',
          end: '11:40',
          sub: 'JP',
          room: 'W306',
          instructor: 'CFJG',
        },
      ],
      WED: [
        {
          time: '08:40',
          end: '09:35',
          sub: 'DBMS Lab',
          room: 'LAB-1',
          instructor: 'MS',
        },
      ],
      THU: [
        {
          time: '10:45',
          end: '11:40',
          sub: 'Maths',
          room: 'W306',
          instructor: 'MATH',
        },
      ],
      FRI: [
        {
          time: '07:45',
          end: '08:40',
          sub: 'EVS',
          room: 'W307',
          instructor: 'EVS',
        },
      ],
    },
    attendance: [
      { name: 'DBMS', code: '2CS401', pct: 88 },
      { name: 'OS', code: '2CS402', pct: 92 },
      { name: 'Computer Architecture', code: '2CS403', pct: 79 },
    ],
    results: [
      { sub: 'DBMS', type: 'Mid-Sem', marks: '24/30' },
      { sub: 'OS', type: 'Class Test', marks: '12/15' },
    ],
  },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [nextLecture, setNextLecture] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'model',
      text: 'How can I help you with your MIS, LMS, or timetable today?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    // If Firebase isn't set up, we skip straight to ready state
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);

      // Check admin status from local storage on auth state change
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);

      setAuthLoading(false);
      if (u) {
        calculateLiveStatus('4BCEE');
      }
    });
    return () => unsubscribe();
  }, []);

  const calculateLiveStatus = (branch) => {
    const now = new Date();
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const day = days[now.getDay()];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const branchData = MOCK_DB[branch];
    const schedule = branchData?.timetable?.[day] || [];

    const current = schedule.find((l) => timeStr >= l.time && timeStr < l.end);
    const next = schedule.find((l) => l.time > timeStr);

    setCurrentLecture(current);
    setNextLecture(next);
  };

  const handleLogin = async (asAdmin = false) => {
    setAuthLoading(true);

    // Set UI admin state preference
    if (asAdmin) {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
    } else {
      localStorage.removeItem('isAdmin');
      setIsAdmin(false);
    }

    try {
      // DEMO LOGIN SIMULATION
      // We simulate a network delay and set a user manually
      if (auth && firebaseConfig.apiKey !== 'DEMO_KEY') {
        await signInAnonymously(auth);
      } else {
        // Fake Delay for effect
        setTimeout(() => {
          setUser({
            uid: asAdmin ? 'admin-123' : 'student-123',
            email: asAdmin ? 'admin@nirma.ac.in' : 'student@nirma.ac.in',
            isAnonymous: true,
          });
          calculateLiveStatus('4BCEE');
          setAuthLoading(false);
        }, 800);
      }
    } catch (error) {
      console.error('Login failed, falling back to demo user:', error);
      setUser({ uid: 'demo-user', isAnonymous: true });
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    if (auth) await signOut(auth);
    setUser(null);
  };

  // --- UI COMPONENTS ---
  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => {
        setView(id);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
        view === id
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
          : 'text-gray-500 hover:bg-blue-50'
      }`}
    >
      <Icon size={20} /> <span className="font-medium">{label}</span>
    </button>
  );

  // --- RENDER LOGIC ---

  if (!splashComplete) {
    return <StartupScreen onComplete={() => setSplashComplete(true)} />;
  }

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-blue-600">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r p-6 z-20 shadow-sm">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            NU Mate
          </h1>
        </div>
        <nav className="space-y-2 flex-1">
          <SidebarItem
            id="dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
          />
          <SidebarItem id="updates" icon={Bell} label="Updates" />
          <SidebarItem id="mis" icon={User} label="MIS Portal" />
          <SidebarItem id="lms" icon={BookOpen} label="LMS Portal" />
          <SidebarItem id="gpa" icon={Calculator} label="GPA Calculator" />
          <SidebarItem id="bus" icon={Bus} label="Bus Routes" />
          <SidebarItem id="fees" icon={CreditCard} label="Fees & Finance" />
          <SidebarItem id="chat" icon={MessageSquare} label="AI Support" />
        </nav>

        <div className="mt-auto space-y-2">
          {isAdmin && (
            <div className="px-3 py-2 bg-yellow-50 text-yellow-700 text-xs rounded-lg border border-yellow-100 font-bold text-center">
              Logged in as Admin
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} /> <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 md:hidden p-6 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <BookOpen size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">NU Mate</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-500"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="space-y-2">
          <SidebarItem
            id="dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
          />
          <SidebarItem id="updates" icon={Bell} label="Updates" />
          <SidebarItem id="mis" icon={User} label="MIS Portal" />
          <SidebarItem id="lms" icon={BookOpen} label="LMS Portal" />
          <SidebarItem id="gpa" icon={Calculator} label="GPA Calculator" />
          <SidebarItem id="bus" icon={Bus} label="Bus Routes" />
          <SidebarItem id="fees" icon={CreditCard} label="Fees & Finance" />
          <SidebarItem id="chat" icon={MessageSquare} label="AI Support" />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} /> <span className="font-medium">Sign Out</span>
          </button>
        </nav>
      </div>

      <main className="flex-1 overflow-hidden flex flex-col relative w-full">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded text-white">
              <BookOpen size={16} />
            </div>
            <h1 className="font-bold text-gray-800">NU Mate</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="text-gray-600" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full scroll-smooth">
          <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {view === 'dashboard' && (
              <Dashboard
                current={currentLecture}
                next={nextLecture}
                branch="4BCEE"
              />
            )}
            {view === 'updates' && (
              <UpdatesSection isAdmin={isAdmin} user={user} />
            )}
            {view === 'mis' && <MISSection data={MOCK_DB['4BCEE']} />}
            {view === 'lms' && <LMSSection />}
            {view === 'gpa' && <GPACalculatorSection />}
            {view === 'bus' && <BusRouteSection />}
            {view === 'fees' && <FeesSection />}
            {view === 'chat' && (
              <ChatSection
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- VIEW COMPONENTS ---

function StartupScreen({ onComplete }) {
  const videoRef = useRef(null);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={onComplete}
        // className="w-full h-full object-cover opacity-80"
        src="/Exclusively For Nirma University Students Prepared by INDX Coders.mp4"
      >
        <source
          src="/Exclusively For Nirma University Students Prepared by INDX Coders.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter animate-in fade-in zoom-in duration-1000 drop-shadow-2xl"></h1>
        <p className="text-white/70 text-lg mt-2 font-medium tracking-widest uppercase animate-in slide-in-from-bottom-4 duration-1000 delay-300"></p>
      </div>

      <button
        onClick={onComplete}
        className="absolute bottom-10 right-10 z-50 cursor-pointer text-white/60 hover:text-white text-xs font-bold border border-white/20 px-5 py-2 rounded-full backdrop-blur-md transition-all hover:bg-white/10 uppercase tracking-wider"
      >
        Skip Intro
      </button>
    </div>
  );
}

function UpdatesSection({ isAdmin, user }) {
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State for Admins
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Ensure strict auth check before querying
    if (!user || !user.uid) return;

    // --- MOCK LOGIC FOR DEMO ---
    // If Firebase isn't configured, use mock data
    if (firebaseConfig.apiKey === 'DEMO_KEY') {
      setTimeout(() => {
        const mockUpdates = [
          {
            id: 'mock-1',
            title: 'Welcome to NU Mate Demo',
            content:
              'This is a demonstration of the campus update system. Admins can post updates here that appear in real-time.',
            timestamp: { seconds: Date.now() / 1000 },
            author: 'System Admin',
          },
          {
            id: 'mock-2',
            title: 'Bus Schedule Change',
            content:
              'Route 5 (Ishanpur) will depart 10 minutes early tomorrow due to road construction.',
            timestamp: { seconds: Date.now() / 1000 - 86400 },
            author: 'Transport Dept',
          },
        ];
        setUpdates(mockUpdates);
        setIsLoading(false);
      }, 500);
      return;
    }

    // --- REAL FIREBASE LOGIC ---
    const updatesRef = collection(
      db,
      'artifacts',
      appId,
      'public',
      'data',
      'updates'
    );

    const unsubscribe = onSnapshot(
      updatesRef,
      (snapshot) => {
        const fetchedUpdates = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        fetchedUpdates.sort(
          (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
        );
        setUpdates(fetchedUpdates);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching updates:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) {
        alert('File is too large. Please select a file under 500KB.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment({
          name: file.name,
          data: reader.result,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setUploading(true);

    // DEMO MODE HANDLER
    if (firebaseConfig.apiKey === 'DEMO_KEY') {
      setTimeout(() => {
        const newMock = {
          id: `mock-${Date.now()}`,
          title: newTitle,
          content: newContent,
          timestamp: { seconds: Date.now() / 1000 },
          attachment: attachment,
        };
        setUpdates([newMock, ...updates]);
        setNewTitle('');
        setNewContent('');
        setAttachment(null);
        setIsFormOpen(false);
        setUploading(false);
        alert('Update posted! (Demo Mode)');
      }, 1000);
      return;
    }

    try {
      const updatesRef = collection(
        db,
        'artifacts',
        appId,
        'public',
        'data',
        'updates'
      );
      await addDoc(updatesRef, {
        title: newTitle,
        content: newContent,
        timestamp: serverTimestamp(),
        author: 'Admin',
        authorEmail: user.email || 'Admin',
        attachment: attachment,
      });
      setNewTitle('');
      setNewContent('');
      setAttachment(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding update:', error);
      alert(`Failed to post update. Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this update?')) {
      // DEMO MODE
      if (firebaseConfig.apiKey === 'DEMO_KEY') {
        setUpdates(updates.filter((u) => u.id !== id));
        return;
      }
      // REAL FIREBASE
      try {
        await deleteDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'updates', id)
        );
      } catch (error) {
        console.error('Error deleting update:', error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="text-blue-600" /> Campus Updates
          </h2>
          <p className="text-gray-500">
            Latest news, notices, and event details.
          </p>
        </div>
        {isAdmin && !isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Post Update
          </button>
        )}
      </header>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-[24px] border border-blue-100 shadow-xl relative animate-in fade-in zoom-in-95 duration-300">
          <button
            onClick={() => setIsFormOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
          <h3 className="font-bold text-lg mb-4 text-gray-800">
            Draft New Update
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Title
              </label>
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 ring-blue-500 outline-none"
                placeholder="e.g., Mid-Sem Exam Schedule"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Content
              </label>
              <textarea
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 h-32 focus:ring-2 ring-blue-500 outline-none resize-none"
                placeholder="Write the details here..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Attachment (Optional)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Paperclip size={16} />{' '}
                  {attachment ? 'Change File' : 'Attach Document'}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
                {attachment && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                    <CheckCircle size={14} /> {attachment.name}
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="text-red-500 ml-1 hover:bg-red-100 rounded p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Supported: PDF, Images (Max 500KB)
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={16} /> Posting...
                  </span>
                ) : (
                  'Publish Update'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">
            <Loader2 className="animate-spin mx-auto mb-2" /> Loading updates...
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Bell size={24} />
            </div>
            <h3 className="font-bold text-gray-400">No updates yet</h3>
            <p className="text-sm text-gray-400">
              Check back later for university news.
            </p>
          </div>
        ) : (
          updates.map((update) => (
            <div
              key={update.id}
              className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800 pr-8">
                  {update.title}
                </h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase">
                  {update.timestamp
                    ? new Date(
                        update.timestamp.seconds * 1000
                      ).toLocaleDateString()
                    : 'Just now'}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                {update.content}
              </p>

              {update.attachment && (
                <div className="bg-blue-50 p-3 rounded-xl flex items-center justify-between group/file hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                      <FileText size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-gray-700 truncate max-w-[200px]">
                        {update.attachment.name}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Document
                      </p>
                    </div>
                  </div>
                  <a
                    href={update.attachment.data}
                    download={update.attachment.name}
                    className="bg-white text-blue-600 p-2 rounded-lg hover:scale-105 transition-transform shadow-sm"
                    title="Download"
                  >
                    <Download size={16} />
                  </a>
                </div>
              )}

              {isAdmin && (
                <button
                  onClick={() => handleDelete(update.id)}
                  className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Update"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Dashboard({ current, next, branch }) {
  const today = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][
    new Date().getDay()
  ];
  const schedule = MOCK_DB[branch]?.timetable[today] || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hello, Student 👋</h2>
        <p className="text-gray-500">Here's what's happening today.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 rounded-[32px] text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <p className="text-blue-100 text-sm font-bold tracking-wider mb-2">
            CURRENTLY HAPPENING
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-1">
            {current ? current.sub : 'No Class'}
          </h2>
          <p className="text-blue-100 text-lg mb-6">
            {current
              ? `with Prof. ${current.instructor}`
              : 'Enjoy your free time!'}
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
              <MapPin size={16} /> {current?.room || 'Campus'}
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
              <Clock size={16} /> Ends {current?.end || '--:--'}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
            UP NEXT
          </p>
          {next ? (
            <>
              <h3 className="text-2xl font-bold text-gray-800">{next.sub}</h3>
              <div className="flex items-center gap-2 text-gray-500 mt-2 mb-6">
                <Clock size={16} /> <span>Starts at {next.time}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <MapPin size={16} /> <span>{next.room}</span>
              </div>
              <div className="mt-auto pt-4 border-t border-dashed">
                <p className="text-xs text-gray-400 font-medium">INSTRUCTOR</p>
                <p className="text-sm font-bold text-gray-700">
                  Prof. {next.instructor}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">All Done!</h3>
              <p className="text-gray-500 text-sm">
                No more lectures scheduled for today.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
          <Calendar size={20} className="text-blue-600" /> Today's Full Schedule
        </h3>
        <div className="space-y-4">
          {schedule.length > 0 ? (
            schedule.map((item, i) => (
              <div
                key={i}
                className="flex items-center p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 hover:scale-[1.01] transition-all cursor-default border border-transparent hover:border-blue-100"
              >
                <div className="w-20 font-mono text-sm font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
                  {item.time}
                </div>
                <div className="w-px h-8 bg-gray-200 mx-4 group-hover:bg-blue-200"></div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-lg">{item.sub}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {item.room}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} /> {item.instructor}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className="text-gray-300 group-hover:text-blue-400"
                  size={20}
                />
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-gray-400">
              No classes scheduled for today.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MISSection({ data }) {
  if (!data)
    return (
      <div className="p-8 text-center text-gray-500">Data unavailable</div>
    );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl font-bold text-gray-800">MIS Portal</h2>
        <p className="text-gray-500">Attendance & Results Overview</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.attendance.map((a, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow"
          >
            <div className="inline-flex justify-center items-center w-10 h-10 rounded-full bg-gray-50 mb-3 text-gray-400">
              <FileText size={18} />
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase mb-2 tracking-wide truncate px-2">
              {a.name}
            </p>
            <p
              className={`text-3xl font-black ${
                a.pct < 85 ? 'text-red-500' : 'text-emerald-500'
              }`}
            >
              {a.pct}%
            </p>
            <p className="text-[10px] text-gray-400 mt-1 font-mono">{a.code}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
            <FileText size={20} className="text-blue-600" /> Exam Results
          </h3>
          <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">
            Sem 3
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 uppercase text-[10px] font-bold tracking-wider">
              <tr className="border-b border-gray-100">
                <th className="pb-4 pl-2">Subject</th>
                <th className="pb-4">Exam Type</th>
                <th className="pb-4 text-right pr-2">Marks</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {data.results.map((r, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 pl-2 font-bold text-gray-800">{r.sub}</td>
                  <td className="py-4 text-gray-500">{r.type}</td>
                  <td className="py-4 text-right pr-2 font-mono font-bold text-blue-600">
                    {r.marks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-3xl text-white shadow-lg flex items-center justify-between">
        <div>
          <h3 className="font-bold flex items-center gap-2">
            <Download size={18} className="text-blue-400" /> Download Marksheets
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            PDF format, official transcripts.
          </p>
        </div>
        <button className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors">
          Select Sem
        </button>
      </div>
    </div>
  );
}

function LMSSection() {
  const materials = [
    'Unit 1: Introduction to DBMS.pdf',
    'Lab Assignment 4.docx',
    'CA Review Slides.pptx',
  ];
  return (
    <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
          <BookOpen size={20} className="text-blue-600" /> Course Materials
        </h3>
        <div className="space-y-3">
          {materials.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-sm group cursor-pointer hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                  <FileText size={16} />
                </div>
                <span className="text-gray-700 font-medium group-hover:text-blue-700 truncate">
                  {m}
                </span>
              </div>
              <Download
                size={16}
                className="text-gray-300 group-hover:text-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
            <Clock size={20} className="text-red-500" /> Deadlines
          </h3>
          <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-bold text-red-600 uppercase tracking-wide">
                DBMS Mini Project
              </p>
              <span className="bg-red-200 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">
                HIGH PRIORITY
              </span>
            </div>
            <p className="text-lg font-black text-gray-800 mb-4">
              Tonight, 11:59 PM
            </p>
            <button className="w-full bg-red-500 text-white py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2">
              Submit Assignment <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="bg-blue-600 p-6 rounded-[32px] text-white shadow-lg shadow-blue-200">
          <h3 className="font-bold mb-2">LMS Announcements</h3>
          <p className="text-sm text-blue-100 mb-4">
            Class rescheduled for tomorrow's CA Lecture.
          </p>
          <button className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}

function GPACalculatorSection() {
  const [branch, setBranch] = useState('CSE');
  const [semester, setSemester] = useState('1');
  const [courses, setCourses] = useState([]);

  // Initialize courses when branch or semester changes
  useEffect(() => {
    if (GPA_DATA[branch] && GPA_DATA[branch].semesters[semester]) {
      const initCourses = GPA_DATA[branch].semesters[semester].map((c) => ({
        ...c,
        a20: '',
        ct20: '',
        sess50: '',
        lf100: '',
        le40: '',
      }));
      setCourses(initCourses);
    } else {
      setCourses([]);
    }
  }, [branch, semester]);

  const updateField = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value === '' ? '' : Number(value);
    setCourses(newCourses);
  };

  const calculateTotalMarks = (course, seeScore) => {
    let finalMarks = 0;
    const a20 = Number(course.a20) || 0;
    const ct20 = Number(course.ct20) || 0;
    const sess50 = Number(course.sess50) || 0;
    const lf100 = Number(course.lf100) || 0;
    const le40 = Number(course.le40) || 0;

    if (course.type === 'theory') {
      // Rule for Theory: CE (60%) + SEE (40%)
      const ceComponentScore =
        (a20 / 20) * 0.3 + (ct20 / 20) * 0.3 + (sess50 / 50) * 0.4;
      const ceComponentOutOf100 = ceComponentScore * 100;
      finalMarks = ceComponentOutOf100 * 0.6 + seeScore * 0.4;
    } else {
      // Rule for Theory+Lab: CE (30%) + LPW (30%) + SEE (40%)
      const ceComponentOutOf100 =
        ((a20 / 20) * 0.2 + (ct20 / 20) * 0.2 + (sess50 / 50) * 0.6) * 100;
      const lpwComponentOutOf100 =
        ((lf100 / 100) * 0.6 + (le40 / 40) * 0.4) * 100;
      finalMarks =
        ceComponentOutOf100 * 0.3 + lpwComponentOutOf100 * 0.3 + seeScore * 0.4;
    }
    return Math.ceil(finalMarks);
  };

  const findRequiredSEE = (course, targetMark) => {
    // If credit only or internship, no calculation needed
    if (!['theory', 'theoryLab'].includes(course.type)) return 'N/A';

    for (let see = 0; see <= 100; see++) {
      if (calculateTotalMarks(course, see) >= targetMark) {
        return see;
      }
    }
    return 'N/P'; // Not Possible
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl font-bold text-gray-800">
          GPA Target Calculator
        </h2>
        <p className="text-gray-500">
          Estimate required Semester End Exam (SEE) scores.
        </p>
      </header>

      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 ring-blue-500 outline-none"
            >
              {Object.keys(GPA_DATA).map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 ring-blue-500 outline-none"
            >
              {Object.keys(GPA_DATA[branch]?.semesters || {}).map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Table */}
        <div className="overflow-x-auto">
          {courses.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No courses data found.
            </div>
          ) : (
            <table className="w-full text-sm min-w-[1000px]">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider text-center">
                <tr>
                  <th rowSpan="2" className="p-3 text-left rounded-tl-xl">
                    Subject
                  </th>
                  <th rowSpan="2" className="p-3">
                    Cred
                  </th>
                  <th
                    colSpan="3"
                    className="p-3 border-b border-gray-200 bg-blue-50/50 text-blue-600"
                  >
                    Internal (CE)
                  </th>
                  <th
                    colSpan="2"
                    className="p-3 border-b border-gray-200 bg-purple-50/50 text-purple-600"
                  >
                    Lab (LPW)
                  </th>
                  <th
                    colSpan="3"
                    className="p-3 border-b border-gray-200 bg-green-50/50 text-green-600 rounded-tr-xl"
                  >
                    Req. SEE for Grade
                  </th>
                </tr>
                <tr>
                  <th className="p-2 bg-blue-50/30 text-[10px]">Assign (20)</th>
                  <th className="p-2 bg-blue-50/30 text-[10px]">Test (20)</th>
                  <th className="p-2 bg-blue-50/30 text-[10px]">Sess (50)</th>
                  <th className="p-2 bg-purple-50/30 text-[10px]">
                    File (100)
                  </th>
                  <th className="p-2 bg-purple-50/30 text-[10px]">Exam (40)</th>
                  <th className="p-2 bg-green-50/30 text-green-700">O (10)</th>
                  <th className="p-2 bg-green-50/30 text-green-700">A+ (9)</th>
                  <th className="p-2 bg-green-50/30 text-green-700">A (8)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((c, i) => {
                  const isGraded = ['theory', 'theoryLab'].includes(c.type);
                  const isTheory = c.type === 'theory';
                  const reqO = findRequiredSEE(c, 91);
                  const reqAPlus = findRequiredSEE(c, 81);
                  const reqA = findRequiredSEE(c, 71);

                  return (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium text-gray-800">
                        {c.name}{' '}
                        <span className="text-[10px] text-gray-400 block font-normal">
                          {c.type}
                        </span>
                      </td>
                      <td className="p-3 text-center text-gray-500">
                        {c.credits}
                      </td>

                      {isGraded ? (
                        <>
                          <td className="p-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              placeholder="-"
                              className="w-12 text-center bg-gray-50 border rounded p-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                              value={c.a20}
                              onChange={(e) =>
                                updateField(i, 'a20', e.target.value)
                              }
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              placeholder="-"
                              className="w-12 text-center bg-gray-50 border rounded p-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                              value={c.ct20}
                              onChange={(e) =>
                                updateField(i, 'ct20', e.target.value)
                              }
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="50"
                              placeholder="-"
                              className="w-12 text-center bg-gray-50 border rounded p-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                              value={c.sess50}
                              onChange={(e) =>
                                updateField(i, 'sess50', e.target.value)
                              }
                            />
                          </td>

                          {isTheory ? (
                            <>
                              <td className="p-2 text-center text-gray-300 text-xs italic bg-gray-50/50">
                                N/A
                              </td>
                              <td className="p-2 text-center text-gray-300 text-xs italic bg-gray-50/50">
                                N/A
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="-"
                                  className="w-12 text-center bg-gray-50 border rounded p-1 text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                                  value={c.lf100}
                                  onChange={(e) =>
                                    updateField(i, 'lf100', e.target.value)
                                  }
                                />
                              </td>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="40"
                                  placeholder="-"
                                  className="w-12 text-center bg-gray-50 border rounded p-1 text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                                  value={c.le40}
                                  onChange={(e) =>
                                    updateField(i, 'le40', e.target.value)
                                  }
                                />
                              </td>
                            </>
                          )}

                          <td
                            className={`p-3 text-center font-bold ${
                              reqO === 'N/P'
                                ? 'text-red-400 bg-red-50'
                                : 'text-green-600'
                            }`}
                          >
                            {reqO}
                          </td>
                          <td
                            className={`p-3 text-center font-bold ${
                              reqAPlus === 'N/P'
                                ? 'text-red-400 bg-red-50'
                                : 'text-green-600'
                            }`}
                          >
                            {reqAPlus}
                          </td>
                          <td
                            className={`p-3 text-center font-bold ${
                              reqA === 'N/P'
                                ? 'text-red-400 bg-red-50'
                                : 'text-green-600'
                            }`}
                          >
                            {reqA}
                          </td>
                        </>
                      ) : (
                        <td
                          colSpan="8"
                          className="p-3 text-center text-xs text-gray-400 italic bg-gray-50"
                        >
                          Credit-only / Internship Course
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-xs text-yellow-700 flex gap-2 items-start">
          <div className="mt-0.5">
            <CheckCircle size={14} />
          </div>
          <p>
            <strong>Disclaimer:</strong> This calculator is for estimation only.
            Official marks may vary based on university rounding policies. 'N/P'
            means Not Possible to achieve that grade with current internal
            marks.
          </p>
        </div>
      </div>
    </div>
  );
}

function BusRouteSection() {
  const [shift, setShift] = useState('firstShift');
  const currentData = BUS_DATA[shift];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bus className="text-blue-600" /> University Bus Routes
          </h2>
          <p className="text-gray-500">
            Transport Arrangement Effect 07/07/2025
          </p>
        </div>

        {/* Shift Toggle */}
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1 self-start">
          <button
            onClick={() => setShift('firstShift')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              shift === 'firstShift'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            First Shift
          </button>
          <button
            onClick={() => setShift('secondShift')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              shift === 'secondShift'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Second Shift
          </button>
        </div>
      </header>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-lg shadow-blue-200">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
              SHIFT TIMINGS
            </p>
            <h3 className="text-2xl font-bold">{currentData.label}</h3>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-blue-200" />
              <span className="text-sm font-bold">Return Time</span>
            </div>
            <p className="text-lg font-mono font-bold">
              {currentData.returnTime}
            </p>
          </div>
        </div>
        {shift === 'firstShift' && (
          <div className="mt-4 pt-4 border-t border-white/10 text-xs text-blue-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
            Note: 1st, 3rd & 5th Saturday Only First Shift & Return Time: 1.30
            p.m.
          </div>
        )}
      </div>

      {/* Routes Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {currentData.routes.map((route) => (
          <div
            key={route.id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {route.id}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{route.name}</h3>
                  <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit mt-1">
                    {route.time}
                  </p>
                </div>
              </div>
            </div>

            {route.driver && (
              <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 border-b border-gray-50 pb-3">
                <User size={14} />{' '}
                <span>
                  Driver:{' '}
                  <span className="font-bold text-gray-700">
                    {route.driver}
                  </span>
                </span>
              </div>
            )}

            <div className="text-sm text-gray-600 leading-relaxed">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                STOPS
              </span>
              {route.stops}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeesSection() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] animate-in zoom-in duration-500">
      <div className="max-w-md w-full bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CreditCard size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Tuition Fees</h2>
        <p className="text-gray-500 text-sm mt-1">
          Academic Year 2025-26 (Even Term)
        </p>

        <div className="my-8 p-8 bg-gray-50 rounded-[30px] border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Total Amount Due
          </p>
          <p className="text-4xl font-black text-gray-900 tracking-tight">
            ₹1,15,000
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-600 bg-green-50 py-1 px-3 rounded-full w-fit mx-auto">
            <CheckCircle size={12} /> No late fees applied
          </div>
        </div>

        <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2">
          Pay Now <ChevronRight size={16} />
        </button>
        <div className="text-[10px] text-gray-400 mt-6 flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div> Secure
          payment powered by NU Finance
        </div>
      </div>
    </div>
  );
}

function ChatSection({
  chatHistory,
  setChatHistory,
  isLoading,
  setIsLoading,
  inputMessage,
  setInputMessage,
}) {
  const chatEndRef = useRef(null);

  // Scroll to bottom whenever chatHistory updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const msg = { role: 'user', text: inputMessage };
    setChatHistory((p) => [...p, msg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use the environment's proxy and supported model
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are NU Mate, a helpful university assistant. The student is in branch 4BCEE. Context: MIS, LMS, Timetable, and Fees. Answer the student's question politely and concisely: ${inputMessage}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await resp.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const responseText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I couldn't process that.";
      setChatHistory((p) => [...p, { role: 'model', text: responseText }]);
    } catch (e) {
      console.error(e);
      setChatHistory((p) => [
        ...p,
        {
          role: 'model',
          text: "I'm having trouble connecting to the network right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col h-[75vh] overflow-hidden">
      <div className="p-4 border-b flex items-center gap-3 bg-gray-50/50">
        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <MessageSquare size={16} />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm">
            AI Support Assistant
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-medium">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>{' '}
            Online
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {chatHistory.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t bg-gray-50 flex gap-2">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about your schedule, results, or fees..."
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-blue-500 outline-none transition-shadow"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-blue-600 disabled:bg-blue-300 text-white p-3 rounded-xl transition-colors hover:bg-blue-700"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-sm w-full bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl text-center border border-white/20 z-10">
        <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-200 rotate-3 hover:rotate-6 transition-transform">
          <BookOpen className="text-white" size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
          NU Campus Mate
        </h1>
        <p className="text-gray-500 text-sm mb-10 leading-relaxed">
          Your entire academic life, streamlined in one pocket-friendly app.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => onLogin(false)}
            className="group w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all active:scale-95 shadow-xl"
          >
            <div className="bg-white p-1 rounded-full">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-4 h-4"
                alt="G"
              />
            </div>
            <span>Sign In as Student</span>
          </button>

          <button
            onClick={() => onLogin(true)}
            className="w-full text-gray-500 hover:text-gray-800 text-sm font-semibold transition-colors"
          >
            Login as Admin
          </button>
        </div>

        <p className="text-[10px] text-gray-400 mt-6">
          By signing in, you agree to the Campus Terms of Service.
        </p>
      </div>
    </div>
  );
}
