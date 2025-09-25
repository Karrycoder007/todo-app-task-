'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from './types/task';

export default function HomePage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Complete' | 'Incomplete'>('All');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'All' && task.status !== filterStatus) return false;
    const search = searchTerm.toLowerCase();
    return task.name.toLowerCase().includes(search) || task.description?.toLowerCase().includes(search);
  });

  return (
    <main style={{ minHeight: '100vh', padding: 48, backgroundColor: '#2b2b2b', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 36, textAlign: 'center' }}>TODO <span style={{ color: '#2b79a9' }}>LIST</span></h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 28, width: '100%', maxWidth: 820 }}>
        <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '16px 20px', borderRadius: 20, border: 'none', background: '#1f1f1f', color: '#f5f8f3' }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'All' | 'Complete' | 'Incomplete')} style={{ padding: '16px 20px', borderRadius: 20, border: 'none', background: '#1f1f1f', color: '#f5f8f3' }}>
          <option value="All">All</option>
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>

      <div style={{ width: '100%', maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {loading ? <div>Loading tasks...</div> :
          filteredTasks.length === 0 ? <div>No tasks found</div> :
          filteredTasks.map(task => (
            <div key={task._id} style={{ padding: 20, borderRadius: 16, background: '#fff', color: '#111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{task.name}</div>
                <div style={{ fontSize: 14, color: '#666' }}>{task.description || 'No description'}</div>
              </div>
              <button onClick={() => router.push(`/update-task/${task._id}`)} style={{ backgroundColor: '#2b79a9', color: '#fff', padding: '6px 12px', borderRadius: 8 }}>VIEW</button>
            </div>
          ))
        }
      </div>

      <button onClick={() => router.push('/add-task')} style={{ marginTop: 24, padding: '14px 32px', borderRadius: 12, backgroundColor: '#2b79a9', color: '#fff', fontWeight: 700 }}>Add Task</button>
    </main>
  );
}
