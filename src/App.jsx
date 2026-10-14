import { useState, useEffect } from "react";

function App() {
  const [books, setBooks] = useState(() =>
    JSON.parse(localStorage.getItem("books") || "[]")
  );

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  function clearForm() {
    setTitle("");
    setAuthor("");
    setPrice("");
    setEditId(null);
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Enter book title");
      return;
    }

    if (!author.trim()) {
      setError("Enter author name");
      return;
    }

    if (price === "" || Number(price) < 0) {
      setError("Enter a valid price");
      return;
    }

    const book = {
      title: title.trim(),
      author: author.trim(),
      price: Number(price)
    };

    if (editId !== null) {
      setBooks(books.map(b =>
        b.id === editId ? { ...b, ...book } : b
      ));
    } else {
      setBooks([...books, { id: Date.now(), ...book }]);
    }

    clearForm();
  }

  function editBook(b) {
    setTitle(b.title);
    setAuthor(b.author);
    setPrice(String(b.price));
    setEditId(b.id);
    setError("");
  }

  function deleteBook(id) {
    if (!window.confirm("Delete this book?")) return;

    setBooks(books.filter(b => b.id !== id));

    if (editId === id) clearForm();
  }

  return (
    <div>
      <h1>Book Management System</h1>

      <p>{error}</p>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Book Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Author Name"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          min="0"
          step="0.01"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />

        <button type="submit">
          {editId !== null ? "Update Book" : "Add Book"}
        </button>

        {editId !== null && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}
      </form>

      <h3>Book List</h3>

      <p>Total Books: {books.length}</p>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="4">No books found</td>
            </tr>
          ) : (
            books.map(b => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.price}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => editBook(b)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteBook(b.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
