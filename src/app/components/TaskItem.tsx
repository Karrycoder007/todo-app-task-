'use client';
import { Task } from '../types/task';
import { useRouter } from 'next/navigation';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem',
        borderBottom: '1px solid #ccc',
      }}
    >
      {/* Status Icon */}
      <span
        style={{
          fontSize: '1.5rem',
          marginRight: '0.5rem',
          color: task.status === 'Complete' ? 'green' : 'red',
        }}
      >
        {task.status === 'Complete' ? '✔️' : '❌'}
      </span>

      {/* Task Name & Description */}
      <div style={{ flex: 1 }}>
        <strong>{task.name}</strong>
        <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#555' }}>
          {task.description || 'No description'}
        </p>
      </div>

      {/* View Button */}
      <button
        onClick={() => router.push(`/update-task/${task._id}`)}
        style={{ padding: '0.3rem 0.6rem', cursor: 'pointer' }}
      >
        View
      </button>
    </li>
  );
}
