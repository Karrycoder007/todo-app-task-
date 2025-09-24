'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "../types/task";

export default function HomePage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Complete' | 'Incomplete'>('All');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/tasks');
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

  const handleView = (id: string) => {
    router.push(`/update-task/${id}`);
  };

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
        backgroundColor: '#2b2b2b',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <h1
        style={{
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: 2,
          margin: '12px 0 48px',
          textAlign: 'center',
          lineHeight: 1,
          color: '#f5f8f3',
        }}
      >
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
            padding: '16px 20px',
            borderRadius: 20,
            border: 'none',
            background: '#1f1f1f',
            color: '#f5f8f3',
            fontSize: 16,
            boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
          }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Complete' | 'Incomplete')}
          style={{
            padding: '16px 20px',
            borderRadius: 20,
            border: 'none',
            background: '#1f1f1f',
            color: '#f5f8f3',
            fontSize: 16,
            boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
          }}
        >
          <option value="All">All</option>
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>

      {/* Cards container */}
      <div
        style={{
          width: '100%',
          maxWidth: 820,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          alignItems: 'center',
        }}
      >
        {loading ? (
          <div style={{ color: '#ddd' }}>Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div style={{ color: '#ddd' }}>No tasks found.</div>
        ) : (
          filteredTasks.slice(0, 4).map((task) => (
            <div
              key={task._id}
              style={{
                width: '100%',
                background: '#ffffff',
                color: '#111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '22px 26px',
                borderRadius: 20,
                boxShadow: '0 8px 20px rgba(0,0,0,0.45)',
                boxSizing: 'border-box',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1 }}>
                {/* Status circle */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    minWidth: 42,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    background: task.status === 'Complete' ? '#2ecc71' : '#ffffff',
                    border: task.status === 'Complete' ? 'none' : '2px solid #111',
                  }}
                >
                  {task.status === 'Complete' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M6 6l12 12M18 6L6 18" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.4 }}>{task.name}</div>
                  <div
                    style={{
                      marginTop: 6,
                      color: '#666',
                      fontSize: 13,
                      lineHeight: '16px',
                      maxWidth: 520,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={task.description || ''}
                  >
                    {task.description || 'No description'}
                  </div>
                </div>
              </div>

              {/* VIEW button */}
              <div style={{ marginLeft: 20 }}>
                <button
                  onClick={() => handleView(task._id)}
                  style={{
                    background: '#2b79a9',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    boxShadow: '0 6px 12px rgba(43,121,169,0.25)',
                  }}
                  aria-label={`View ${task.name}`}
                >
                  VIEW
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All link */}
      <div style={{ marginTop: 28 }}>
        <button
          onClick={() => router.push('/all')}
          style={{
            background: 'transparent',
            color: '#ffffff',
            textDecoration: 'underline',
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            padding: '8px 12px',
          }}
        >
          View All
        </button>
      </div>

      {/* Add Todo big button */}
      <div style={{ marginTop: 18 }}>
        <button
          onClick={() => router.push('/add-task')}
          style={{
            background: '#2b79a9',
            color: '#fff',
            border: 'none',
            padding: '14px 36px',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 700,
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 24px rgba(43,121,169,0.25)',
          }}
        >
          <span>Add Todo</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </main>
  );
}
