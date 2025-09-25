'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Task } from '../../types/task';

export default function UpdateTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id;

  const [task, setTask] = useState<Task | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Complete' | 'Incomplete'>('Incomplete');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      if (!taskId) return;
      try {
        const res = await fetch(`/api/tasks?id=${taskId}`);
        if (!res.ok) throw new Error('Failed to fetch task');
        const data: Task = await res.json();
        setTask(data);
        setName(data.name);
        setDescription(data.description || '');
        setStatus(data.status);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch task');
      }
    }
    fetchTask();
  }, [taskId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, status }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  if (!task)
    return <p style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading task...</p>;

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '48px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#2b2b2b',
        color: '#fff',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <h1
        style={{
          fontSize: 36,
          fontWeight: 800,
          letterSpacing: 1,
          marginBottom: 36,
          color: '#f5f8f3',
          textAlign: 'center',
        }}
      >
        <span style={{ color: '#f5f8f3' }}>Update</span>{' '}
        <span style={{ color: '#2b79a9' }}>Todo</span>
      </h1>

      {/* Home Button */}
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2ecc71',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 6px 12px rgba(46,204,113,0.25)',
          }}
        >
          ⬅ Home
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleUpdate}
        style={{
          width: '100%',
          maxWidth: 600,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {/* Name + Status */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <button
            type="button"
            onClick={() => setStatus(status === 'Complete' ? 'Incomplete' : 'Complete')}
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: '2px solid #111',
              backgroundColor: status === 'Complete' ? '#2ecc71' : '#fff',
              cursor: 'pointer',
              position: 'absolute',
              left: '-55px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              color: status === 'Complete' ? '#fff' : '#e74c3c',
              boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            }}
          >
            {status === 'Complete' ? '✔' : '✖'}
          </button>

          <input
            type="text"
            placeholder="Task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              flex: 1,
              minWidth: 0,
              padding: '14px 18px',
              borderRadius: 20,
              border: '1px solid #444',
              fontSize: 16,
              background: '#fff',
              color: '#111',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              marginLeft: '0.5rem',
            }}
          />
        </div>

        {/* Description */}
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: '14px 18px',
            borderRadius: 20,
            border: '1px solid #444',
            fontSize: 16,
            minHeight: 120,
            background: '#fff',
            color: '#111',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            resize: 'vertical',
          }}
        />

        {/* Update Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 0',
            backgroundColor: '#2b79a9',
            color: '#fff',
            border: 'none',
            borderRadius: 20,
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 10px 24px rgba(43,121,169,0.25)',
          }}
        >
          {loading ? 'Saving...' : 'Update Task'}
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: '14px 0',
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: 20,
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 10px 24px rgba(231,76,60,0.25)',
          }}
        >
          Delete Task
        </button>
      </form>
    </main>
  );
}
