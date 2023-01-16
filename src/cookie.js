import React, {useEffect, useState} from 'react';
import { useCookies } from 'react-cookie';

export default function Cookie() {
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [cookies, setCookies] = useCookies(['user']);
  const handle = () => {
    setCookies('Name', name, 30);
    setCookies('Password', pwd, 30);
 };

  return (
    <div className='cookie-wrapper'>
      <h1>Cookie Demo</h1>
      <label>Name of the user:</label>
      <input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Password of the user:</label>
      <input
        type="password"
        placeholder="name"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <div>
        <button onClick={handle}>Set Cookie</button>
      </div>
      <br />
      {cookies.Name && (
        <div>
          Name: <span>{cookies.Name}</span>
        </div>
      )}
      {cookies.Password && (
        <div>
          Password: <span>{cookies.Password}</span>
        </div>
      )}
    </div>
  )
}