export const mockEnrolledSubjects = [
  'Software Testing & QA (CS605)',
  'Data Structures & Algorithms (CS601)',
  'Operating Systems (CS602)',
  'Database Management Systems (CS604)',
  'Web Technology (CS603)',
  'Applied Mathematics (MTH601)'
]

export const mockInitialTasks = [
  {
    id: 'task-1',
    title: 'Revise QA vs QC differences & 7-parameter comparison matrix',
    subject: 'Software Testing & QA (CS605)',
    subjectCode: 'CS605',
    dueDate: 'Today, Aug 16',
    dueCategory: 'today',
    priority: 'High',
    completed: false,
    description: 'Focus on Pressman Chapter 19 and master the 10-mark university exam format.'
  },
  {
    id: 'task-2',
    title: 'Complete STQA Unit 1 Test Cases & V-Model Assignment',
    subject: 'Software Testing & QA (CS605)',
    subjectCode: 'CS605',
    dueDate: 'Tomorrow, Aug 17',
    dueCategory: 'tomorrow',
    priority: 'High',
    completed: false,
    description: 'Write test cases for Banking Payment Gateway module and prepare lab report.'
  },
  {
    id: 'task-3',
    title: 'Practice Newton-Raphson method numerical problems',
    subject: 'Applied Mathematics (MTH601)',
    subjectCode: 'MTH601',
    dueDate: 'Wednesday, Aug 19',
    dueCategory: 'upcoming',
    priority: 'Medium',
    completed: false,
    description: 'Solve 5 exercise problems from Grewal Chapter 4 on root finding algorithms.'
  },
  {
    id: 'task-4',
    title: 'Implement Binary Search Tree & Traversal algorithms in C++',
    subject: 'Data Structures & Algorithms (CS601)',
    subjectCode: 'CS601',
    dueDate: 'Yesterday, Aug 15',
    dueCategory: 'past',
    priority: 'High',
    completed: true,
    description: 'Implemented recursive and iterative inorder, preorder, and postorder traversals.'
  },
  {
    id: 'task-5',
    title: 'Prepare OS Process Scheduling Gantt charts (FCFS, SJF, Round Robin)',
    subject: 'Operating Systems (CS602)',
    subjectCode: 'CS602',
    dueDate: 'Yesterday, Aug 15',
    dueCategory: 'past',
    priority: 'Medium',
    completed: true,
    description: 'Calculated average waiting time and turnaround time for 4 process sets.'
  },
  {
    id: 'task-6',
    title: 'BCNF & 3NF Normalization practice problems for internal exam',
    subject: 'Database Management Systems (CS604)',
    subjectCode: 'CS604',
    dueDate: 'Friday, Aug 21',
    dueCategory: 'upcoming',
    priority: 'Low',
    completed: false,
    description: 'Practice loss-less join decomposition and functional dependency closures.'
  }
]
