import React, {useState, useEffect, useCallback} from 'react';
import './Users.css';
import List from '../../components/List/List';

import pRetry from 'p-retry';
import fetch from 'node-fetch';

const ENTRIES_PER_PAGE = 25;

function Users() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [reachedMaxPageNumber, setReachedMaxPageNumber] = useState(false);

  const runFetchUsers = useCallback(async () => {
    const requestBody = {
      query: `
        query {
          users(first: ${ENTRIES_PER_PAGE + 1}, offset: ${ENTRIES_PER_PAGE * pageNumber}) {
            name
            email
            createdVideos {
              _id
            }
          }
        }
      `
    }

    const response = await fetch('http://localhost:8000/graphql', {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      }
    });
 
    // Abort retrying if the resource doesn't exist
    if (response.status === 404) {
        throw new pRetry.AbortError(response.statusText);
    }
 
    return response.json();
  }, [pageNumber]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const resData = await pRetry(runFetchUsers);

    const users = resData.data.users.map(user => ({...user, videoCount: user.createdVideos.length})).slice(0, -1);

    if (users.length <= ENTRIES_PER_PAGE) {
      setReachedMaxPageNumber(true);
    }

    setUsers(users);
    setLoading(false);
  }, [runFetchUsers])

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers])

  return (
    <>
    <List>{!loading ?
      (users.map(({name, email, videoCount}, index) => (
        <div key={index}>
        <div>{name}</div>
        <div>{email}</div>
        <div>{`Video count: ${videoCount}`}</div></div>
      ))) : `LOADING`
    }</List>
    <button disabled={!(!loading && !reachedMaxPageNumber)} onClick={() => setPageNumber(pageNumber + 1)}>NEXT</button>
    <button disabled={pageNumber === 0} onClick={() => setPageNumber(pageNumber - 1)}>PREVIOUS</button>
    </>
  )
}

export default Users;