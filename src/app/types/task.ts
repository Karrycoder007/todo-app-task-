export interface Task {
    _id: string;             // MongoDB ID
    name: string;            // Task name
    status: 'Complete' | 'Incomplete'; // Task status
  }
  