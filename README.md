# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
import { useState, useEffect } from "react";

function App() {
  const [students, setStudents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("students") || "[]");
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [mark, setMark] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("name");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  function clearForm() {
    setName("");
    setDepartment("");
    setMark("");
    setEditId(null);
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const numericMark = Number(mark);

    if (!name.trim()) {
      setError("Student name is required.");
      return;
    }

    if (!department) {
      setError("Please select a department.");
      return;
    }

    if (
      mark.trim() === "" ||
      !Number.isFinite(numericMark) ||
      numericMark < 0 ||
      numericMark > 100
    ) {
      setError("Mark must be between 0 and 100.");
      return;
    }

    const student = {
      name: name.trim(),
      department,
      mark: numericMark
    };

    if (editId !== null) {
      setStudents((current) =>
        current.map((s) =>
          s._id === editId ? { ...s, ...student } : s
        )
      );
    } else {
      setStudents((current) => [
        ...current,
        { _id: `${Date.now()}-${Math.random()}`, ...student }
      ]);
    }

    clearForm();
  }

  function handleEdit(student) {
    setName(student.name);
    setDepartment(student.department);
    setMark(String(student.mark));
    setEditId(student._id);
    setError("");
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this student?")) return;

    setStudents((current) =>
      current.filter((student) => student._id !== id)
    );

    if (editId === id) clearForm();
  }

  const result = students
    .filter((s) =>
      (s.name || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((s) => filter === "All" || s.department === filter)
    .sort((a, b) =>
      sort === "mark"
        ? Number(a.mark) - Number(b.mark)
        : (a.name || "").localeCompare(b.name || "")
    );

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Student Management System</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="IT">IT</option>
        </select>

        <input
          type="number"
          placeholder="Mark"
          min="0"
          max="100"
          value={mark}
          onChange={(e) => setMark(e.target.value)}
          required
        />

        <button type="submit">
          {editId !== null ? "Update Student" : "Add Student"}
        </button>

        {editId !== null && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}
      </form>

      <br />

      <input
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="All">All Departments</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="IT">IT</option>
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="name">Sort by Name</option>
        <option value="mark">Sort by Mark</option>
      </select>

      <p>Total displayed: {result.length}</p>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Mark</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {result.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.department}</td>
              <td>{student.mark}</td>
              <td>
                <button
                  type="button"
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {result.length === 0 && (
            <tr>
              <td colSpan="4">No students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;