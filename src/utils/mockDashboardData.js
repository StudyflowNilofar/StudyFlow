import {
  Clock,
  CheckCircle2,
  CheckSquare,
  GraduationCap
} from 'lucide-react'

export const mockStudentProfile = {
  name: 'Alex Sharma',
  email: 'alex.sharma@college.edu',
  role: 'Student',
  department: 'Computer Science & Engineering',
  semester: 'Semester 6',
  streakDays: 5,
  avatarInitial: 'AS'
}

export const mockDashboardStats = [
  {
    id: 'planned-time',
    label: 'Daily Study Goal',
    value: '4.5 hrs',
    subtext: '3.2 hrs completed today',
    icon: Clock,
    trend: '71% of target',
    trendType: 'positive'
  },
  {
    id: 'topics-completed',
    label: 'Topics Mastered',
    value: '3 / 4',
    subtext: '75% daily target met',
    icon: CheckCircle2,
    trend: 'On track',
    trendType: 'positive'
  },
  {
    id: 'active-tasks',
    label: 'Pending Tasks',
    value: '5 Tasks',
    subtext: '2 high priority items',
    icon: CheckSquare,
    trend: '3 due today',
    trendType: 'warning'
  },
  {
    id: 'syllabus-progress',
    label: 'Syllabus Coverage',
    value: '68%',
    subtext: '48 of 70 units covered',
    icon: GraduationCap,
    trend: '+4% this week',
    trendType: 'positive'
  }
]

export const mockTodayTasks = [
  {
    id: 1,
    title: 'Binary Search Trees & Traversal Algorithms',
    subject: 'Data Structures',
    timeSlot: '10:00 AM - 11:30 AM',
    priority: 'High',
    completed: true
  },
  {
    id: 2,
    title: 'CPU Scheduling Algorithms & Gantt Charts',
    subject: 'Operating Systems',
    timeSlot: '01:00 PM - 02:30 PM',
    priority: 'High',
    completed: true
  },
  {
    id: 3,
    title: 'React Hooks & State Architecture',
    subject: 'Web Technology',
    timeSlot: '03:30 PM - 05:00 PM',
    priority: 'Medium',
    completed: true
  },
  {
    id: 4,
    title: 'BCNF & 3NF Normalization Practice Problems',
    subject: 'DBMS',
    timeSlot: '06:00 PM - 07:30 PM',
    priority: 'High',
    completed: false
  },
  {
    id: 5,
    title: 'Review Unit 3 Summary Notes',
    subject: 'Web Technology',
    timeSlot: '08:30 PM - 09:30 PM',
    priority: 'Low',
    completed: false
  }
]

export const mockSubjects = [
  {
    id: 'dsa',
    code: 'CS601',
    title: 'Data Structures & Algorithms',
    description: 'Trees, Graphs, Sorting algorithms, Dynamic Programming, and algorithmic complexity.',
    teacher: 'Prof. S. R. Kulkarni',
    topicsCovered: 18,
    totalTopics: 24,
    hoursSpent: 28.5,
    progress: 75,
    status: 'On Track',
    badgeColor: '#0284c7'
  },
  {
    id: 'os',
    code: 'CS602',
    title: 'Operating Systems',
    description: 'Process management, concurrency, CPU scheduling, virtual memory, and deadlocks.',
    teacher: 'Prof. A. N. Joshi',
    topicsCovered: 14,
    totalTopics: 20,
    hoursSpent: 22.0,
    progress: 70,
    status: 'On Track',
    badgeColor: '#0369a1'
  },
  {
    id: 'wt',
    code: 'CS603',
    title: 'Web Technology',
    description: 'Modern frontend development, React component architecture, REST APIs, and responsive design.',
    teacher: 'Dr. M. V. Patil',
    topicsCovered: 16,
    totalTopics: 22,
    hoursSpent: 25.0,
    progress: 72,
    status: 'On Track',
    badgeColor: '#0284c7'
  },
  {
    id: 'dbms',
    code: 'CS604',
    title: 'Database Management Systems',
    description: 'Relational algebra, SQL normalization (1NF-BCNF), indexing, and transaction management.',
    teacher: 'Prof. R. D. Mehta',
    topicsCovered: 11,
    totalTopics: 20,
    hoursSpent: 18.5,
    progress: 55,
    status: 'In Progress',
    badgeColor: '#0369a1'
  }
]

export const mockUpcomingActivities = [
  {
    id: 'act-1',
    title: 'Internal Assessment: DSA & Tree Algorithms',
    date: 'Wednesday, Aug 19',
    type: 'Exam',
    tag: 'Internal 1'
  },
  {
    id: 'act-2',
    title: 'OS Lab Assignment: Process Synchronization',
    date: 'Friday, Aug 21',
    type: 'Assignment',
    tag: 'Lab Report'
  },
  {
    id: 'act-3',
    title: 'Web Technology Project Sprint Review',
    date: 'Monday, Aug 24',
    type: 'Project',
    tag: 'Milestone 2'
  }
]

export const mockWeeklyProgress = [
  { day: 'Mon', hours: 4.0, target: 4.5 },
  { day: 'Tue', hours: 5.0, target: 4.5 },
  { day: 'Wed', hours: 4.5, target: 4.5 },
  { day: 'Thu', hours: 3.5, target: 4.5 },
  { day: 'Fri', hours: 4.8, target: 4.5 },
  { day: 'Sat', hours: 5.5, target: 5.0 },
  { day: 'Sun (Today)', hours: 3.2, target: 4.5 }
]
