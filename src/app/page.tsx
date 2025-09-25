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
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-12 box-border">
      <h1 className="text-4xl font-extrabold mb-12 text-center">
        <span className="text-white">TODO</span>{" "}
        <span className="text-blue-600">LIST</span>
      </h1>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8 w-full max-w-3xl">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-5 py-4 rounded-2xl bg-gray-800 text-white text-base shadow-lg outline-none"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Complete' | 'Incomplete')}
          className="px-5 py-4 rounded-2xl bg-gray-800 text-white text-base shadow-lg outline-none"
        >
          <option value="All">All</option>
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-6 w-full max-w-3xl">
        {loading ? (
          <div className="text-gray-400">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-gray-400">No tasks found.</div>
        ) : (
          filteredTasks.slice(0, 4).map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between bg-white text-gray-900 p-5 rounded-2xl shadow-lg relative"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Tick / Cross */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    task.status === 'Complete' ? 'bg-green-500' : 'bg-red-500'
                  } text-white text-lg font-bold`}
                >
                  {task.status === 'Complete' ? '✔' : '✖'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg truncate">{task.name}</div>
                  <div
                    className="text-gray-500 text-sm truncate"
                    title={task.description || ''}
                  >
                    {task.description || 'No description'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleView(task._id)}
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 transition"
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
        className="mt-6 text-white underline text-base"
      >
        View All
      </button>

      {/* Add Todo */}
      <button
        onClick={() => router.push('/add-task')}
        className="mt-6 bg-blue-600 px-8 py-4 rounded-xl text-white font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition"
      >
        <span>Add Todo</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </main>
  );
}
