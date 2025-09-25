'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '.././types/task';

export default function AddTaskPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Complete' | 'Incomplete'>('Incomplete');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Task name is required');

    setLoading(true);
    try {
      const res = await fetch(`/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, status }),
      });

      if (!res.ok) throw new Error('Failed to add task');

      setName('');
      setDescription('');
      setStatus('Incomplete');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#2b2b2b', color: '#fff' }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 36, color: '#f5f8f3' }}>
        Add <span style={{ color: '#2b79a9' }}>Todo</span>
      </h1>

      <button
        onClick={() => router.push('/')}
        style={{ marginBottom: 28, padding: '10px 20px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
      >
        ⬅ Home
      </button>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <input
          type="text"
          placeholder="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '14px 18px', borderRadius: 20, border: '1px solid #444', fontSize: 16, background: '#fff', color: '#111' }}
        />
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '14px 18px', borderRadius: 20, border: '1px solid #444', fontSize: 16, minHeight: 120, background: '#fff', color: '#111', resize: 'vertical' }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'Complete' | 'Incomplete')}
          style={{ padding: '14px 18px', borderRadius: 20, border: '1px solid #444', fontSize: 16, background: '#fff', color: '#111' }}
        >
          <option value="Incomplete">Incomplete</option>
          <option value="Complete">Complete</option>
        </select>
        <button type="submit" disabled={loading} style={{ padding: '14px 0', backgroundColor: '#2b79a9', color: '#fff', border: 'none', borderRadius: 20, fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Saving...' : 'Add Task'}
        </button>
      </form>
    </main>
  );
}
