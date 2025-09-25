// src/app/api/tasks/route.js
let tasks = [
    // Example initial data; in real app, replace with DB connection
    { _id: '1', name: 'Sample Task 1', description: 'This is a sample', status: 'Incomplete' },
    { _id: '2', name: 'Sample Task 2', description: '', status: 'Complete' },
];

// GET all tasks
export async function GET() {
    return new Response(JSON.stringify(tasks), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

// POST a new task
export async function POST(req) {
    const body = await req.json();
    const newTask = {...body, _id: Date.now().toString() };
    tasks.push(newTask);

    return new Response(JSON.stringify(newTask), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}

// PUT /tasks/:id
export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
        return new Response(JSON.stringify({ error: 'Task id is required' }), { status: 400 });
    }

    const body = await req.json();
    const index = tasks.findIndex((t) => t._id === id);
    if (index === -1) {
        return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 });
    }

    tasks[index] = {...tasks[index], ...body };
    return new Response(JSON.stringify(tasks[index]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

// DELETE /tasks/:id
export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
        return new Response(JSON.stringify({ error: 'Task id is required' }), { status: 400 });
    }

    const index = tasks.findIndex((t) => t._id === id);
    if (index === -1) {
        return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 });
    }

    const deleted = tasks.splice(index, 1)[0];
    return new Response(JSON.stringify(deleted), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}