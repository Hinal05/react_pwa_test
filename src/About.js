import React, { useEffect, useState } from 'react';
import {Table} from 'react-bootstrap';

const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

const createCollectionInIndexedDB = () => {
  if (!idb) {
    console.log("This browser doesn't support IndexedDB.");
    return;
  }
  console.log(idb);

  const request = idb.open('test-db', 2);

  request.onerror = (event) => {
    console.log('error', event);
    console.log('An error occured with IndexedDB.');
  }

  request.onupgradeneeded = (event) => {
    const db = request.result;
    if(!db.objectStoreNames.contains('userData')) {
      db.createObjectStore('userData', {
        keyPath: 'id',
      })
    }
  }

  request.onsuccess = () => {
    console.log('Database opened successfully');
  }
}

const About = () => {

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [allUsersData, setAllUsersData] = useState([]);

  const [addUser, setAddUser] = useState(false);
  const [editUser, setEditUser] = useState(false);

  const [selectedUser, setSelectedUser] = useState({});

  useEffect(() => {
    createCollectionInIndexedDB();
    getAllData();
  })


  const getAllData = () => {
    const dbPromise = idb.open("test-db", 2);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction('userData', 'readonly');
      const userData = tx.objectStore('userData');
      const users =  userData.getAll();
      users.onsuccess = (query) => {
        setAllUsersData(query.srcElement.result);
      }
      users.onerror = (query) => {
        alert('Error occured while loading initial data.');
      }
      tx.oncomplete = () => {
        db.close();
      }
    }
  }
  const handleSubmit = (event) => {
    const dbPromise = idb.open("test-db", 2);

    if (firstName && email && address) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const tx = db.transaction('userData', 'readwrite');
        const userData = tx.objectStore('userData');
        if (addUser) {
          const users = userData.put({
            id: allUsersData?.length + 1,
            firstName,
            email,
            address
          })
          users.onsuccess = () => {
            tx.oncomplete = () => {
              db.close();
            };
            getAllData();
            alert("user added!");
          }
          users.onerror = (event) => {
            console.log(event);
            alert("Error occured.");
          }
        } else {
          const users = userData.put({
            id: selectedUser.id,
            firstName,
            email,
            address
          })
          users.onsuccess = () => {
            tx.oncomplete = () => {
              db.close();
            };
            getAllData();
            alert("user updated!");
          }
          users.onerror = (event) => {
            console.log(event);
            alert("Error occured.");
          }
        }
      }
    }
  }

  const deleteUserHandler = (user) => {
    const dbPromise = idb.open("test-db", 2);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction('userData', 'readwrite');
      const userData = tx.objectStore('userData');
      const deletedUser =  userData.delete(user.id);
      deletedUser.onsuccess = (query) => {
        alert('User deleted!');
        getAllData();
      }
      deletedUser.onerror = (query) => {
        alert('Error occured while loading initial data.');
      }
      tx.oncomplete = () => {
        db.close();
      }
    }
  }

  return (
    <div>
      <button className='btn btn-primary my-2' onClick={() => {
        setAddUser(true);
        setEditUser(false);
        setSelectedUser({});
        setFirstName('');
        setEmail('');
        setAddress('');
      }}>Add</button>
      <div className='row'>
        <div className='col-6'>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allUsersData?.map(row => (
                <tr key={row?.id}>
                  <td>{row?.id}</td>
                  <td>{row?.firstName}</td>
                  <td>{row?.email}</td>
                  <td>{row?.address}</td>
                  <td>
                    <button className='btn btn-success' onClick={() => {
                      setAddUser(false);
                      setEditUser(true);
                      setSelectedUser(row);
                      setFirstName(row.firstName);
                      setEmail(row.email);
                      setAddress(row.address);
                      }}>Edit</button>
                    <button className='btn btn-danger ms-1' onClick={() => {
                      deleteUserHandler(row)
                    }}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        </div>
        <div className='col-6'>
          {addUser || editUser ? (<div className='card'>
            <h3>{editUser ? 'Update' : 'Add'} User</h3>
            <div className='form-group'>
              <label>Name</label>
              <input type="text" name="name" className="form-control" onChange={e => setFirstName(e.target.value)} value={firstName} />
            </div>
            <div className='form-group'>
              <label>Email</label>
              <input type="email" name="email" className="form-control" onChange={e => setEmail(e.target.value)} value={email} />
            </div>
            <div className='form-group'>
              <label>Address</label>
              <input type="text" name="address" className="form-control" onChange={e => setAddress(e.target.value)} value={address} />
            </div>
            <div className='form-group'>
              <button className='btn btn-primary mt-2' onClick={handleSubmit}>{editUser ? "Update" : "Add"}</button>
            </div>
          </div>) : null}
        </div>
      </div>
    </div>
  )
}

export default About;