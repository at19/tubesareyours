import React, { useState, useEffect, useCallback } from 'react';
import './Users.css';

import pRetry from 'p-retry';
import fetch from 'node-fetch';
import randomColor from 'randomcolor';

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

    const users = resData.data.users.map(user => ({ ...user, videoCount: user.createdVideos.length })).slice(0, -1);

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
    <div className="Users">{!loading ? (
      <>
        <section className="cards">
          {users.map(({ name, email, videoCount }, index) => {
            const color = randomColor();
            return (
              <article key={index} className="card">
                <div className="card__img" style={{ backgroundColor: color }}></div>
                <div className="card_link">
                  <div className="card__img--hover" style={{ backgroundColor: color }}></div>
                </div>
                <div className="card__info">
                  <h3 className="card__title">{name}</h3>
                  <span className="card__author">Videos uploaded: {videoCount}</span>
                </div>
              </article>
            )
          })}
        </section>
        <button className="pagination" disabled={(pageNumber === 0)} onClick={() => setPageNumber(pageNumber - 1)}>&larr; Prev</button>
        <button className="pagination" disabled={!(!loading && !reachedMaxPageNumber)} onClick={() => setPageNumber(pageNumber + 1)}>Next &rarr;</button>
      </>
    ) : (<div className="spinner">
      <span className="spinner__container"></span>
    </div>)
    }</div>
  )
}

export default Users;