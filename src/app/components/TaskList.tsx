import { Task } from '../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) return <p>No tasks to display.</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </ul>
  );
}
