'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "./types/task";

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
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleView = (id: string) => router.push(`/update-task/${id}`);

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== 'All' && task.status !== filterStatus) return false;
    const search = searchTerm.toLowerCase();
    if (!task.name.toLowerCase().includes(search) && !task.description?.toLowerCase().includes(search)) return false;
    return true;
  });

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#1e1e2f',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 20px',
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Header */}
      <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 48, textAlign: 'center' }}>
        <span style={{ color: '#f5f8f3' }}>TODO</span>{' '}
        <span style={{ color: '#2b79a9' }}>LIST</span>
      </h1>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, width: '100%', maxWidth: 820 }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '14px 18px',
            borderRadius: 20,
            border: 'none',
            fontSize: 16,
            background: '#2a2a3d',
            color: '#fff',
            boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
            outline: 'none'
          }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Complete' | 'Incomplete')}
          style={{
            padding: '14px 18px',
            borderRadius: 20,
            border: 'none',
            fontSize: 16,
            background: '#2a2a3d',
            color: '#fff',
            boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
            outline: 'none'
          }}
        >
          <option value="All">All</option>
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>

      {/* Tasks */}
      <div style={{ width: '100%', maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {loading ? (
          <div style={{ color: '#ccc' }}>Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div style={{ color: '#ccc' }}>No tasks found.</div>
        ) : (
          filteredTasks.slice(0, 4).map((task) => (
            <div
              key={task._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                color: '#111',
                padding: 20,
                borderRadius: 20,
                boxShadow: '0 8px 20px rgba(0,0,0,0.45)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                {/* Tick / Cross */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: task.status === 'Complete' ? '#2ecc71' : '#e74c3c',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 18
                  }}
                >
                  {task.status === 'Complete' ? '✔' : '✖'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {task.name}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      color: '#666',
                      fontSize: 13,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={task.description || ''}
                  >
                    {task.description || 'No description'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleView(task._id)}
                style={{
                  marginLeft: 12,
                  backgroundColor: '#2b79a9',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 6px 12px rgba(43,121,169,0.25)'
                }}
              >
                VIEW
              </button>
            </div>
          ))
        )}
      </div>

      {/* View All */}
      <button
        onClick={() => router.push('/all')}
        style={{ marginTop: 24, textDecoration: 'underline', color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        View All
      </button>

      {/* Add Todo */}
      <button
        onClick={() => router.push('/add-task')}
        style={{
          marginTop: 24,
          backgroundColor: '#2b79a9',
          color: '#fff',
          border: 'none',
          padding: '14px 36px',
          borderRadius: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          boxShadow: '0 10px 24px rgba(43,121,169,0.25)'
        }}
      >
        <span>Add Todo</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </main>
  );
}
