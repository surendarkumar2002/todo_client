import React, { useEffect, useState } from "react";

const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const apiURL = "https://sever-backend-x0n2.onrender.com";

  // Edit
  const [editTitle, setEditTitle] = useState("");
  const [editdescription, setEditDescription] = useState("");

  const handleSubmit = () => {
    setError("");
    // check inputs
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiURL + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            // add item to list
            setTodos([...todos, { title, description }]);
            setTitle("");
            setDescription("");
            setMessage("Item added successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
            setTitle("");
            setDescription("");
          } else {
            // set error
            setError("Unable to create Todo Item");
          }
        })
        .catch(() => {
          setError("Unable to create Todo Item");
        });
    } else {
      setError("Title and description cannot be empty");
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiURL + "/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        setError("Unable to fetch Todo Items");
      });
  };

  const handleEdit=(item)=>{
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  }

  const handleUpdate=()=>{
    setError("");
    // check inputs
    if (editTitle.trim() !== "" && editdescription.trim() !== "") {
      fetch(apiURL + "/todos/"+editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({title: editTitle, description:editdescription }),
      })
        .then((res) => {
          if (res.ok) {
            // update item to list
          const updatedTodos=  todos.map((item)=>{
              if (item._id=== editId) {
                item.title=editTitle;
                item.description=editdescription;
              }
              return item;
            })

            setTodos(updatedTodos);
            setEditTitle("");
            setEditDescription("");
            setMessage("Item updated successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
            
            setEditId(-1);

          } else {
            // set error
            setError("Unable to create Todo Item");
          }
        })
        .catch(() => {
          setError("Unable to create Todo Item");
        });
    } else {
      setError("Title and description cannot be empty");
    }

  }
  const handleEditCancel=()=>{
    setEditId(-1);

  }

  const handleDelete=(id)=>{
    if (window.confirm("Are you sure want to delelte")) {
      fetch(apiURL+'/todos/'+id,{
        method:'DELETE'
      })
      .then(()=>{
        const updatedTodos=todos.filter((item)=> item._id !== id);
        setTodos(updatedTodos);
      })
    }
  }
  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>Todo Project with MERN Stack</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="title"
            className="form-control"
          />
          <input
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="description"
            className="form-control"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-lg-6">
        <ul className="list-group">
          {todos.map((item, index) => (
            <li
              key={index}
              className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
            >
              <div className="d-flex flex-column me-2">
                {editId === -1 || editId !== item._id ? (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                  </>
                ) : (
                  <>
                    <div className="form-group d-flex gap-2">
                      <input
                        type="text"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        placeholder="title"
                        className="form-control"
                      />
                      <input
                        type="text"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editdescription}
                        placeholder="description"
                        className="form-control"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="d-flex gap-2">
               {editId === -1 || editId!== item._id? <button
                  className="btn btn-warning"
                  onClick={()=>{handleEdit(item)}}
                >
                  Edit
                </button>: <button className="btn btn-warning" onClick={handleUpdate}> Update</button> }
                { editId === -1  ? <button className="btn btn-danger" onClick={()=>handleDelete(item._id)} >Delete</button>:
                <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}
              </div>
            </li>
          ))}
        </ul>
        </div>
       
      </div>
    </>
  );
};

export default Todo;
