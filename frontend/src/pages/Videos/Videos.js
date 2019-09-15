import React, { useState, useRef, useContext, useEffect, useCallback } from 'react'
import './Videos.css';
import { Link } from 'react-router-dom';

import VideoModal from '../../components/VideoModal/VideoModal';
import Backdrop from '../../components/Backdrop/Backdrop';
import AuthContext from '../../contexts/auth-context';

import pRetry from 'p-retry';
import fetch from 'node-fetch';
import randomColor from 'randomcolor';
import daysjs from 'dayjs';

const ENTRIES_PER_PAGE = 25;

function Videos() {
  const [creating, setCreating] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [reachedMaxPageNumber, setReachedMaxPageNumber] = useState(false);
  const urlElement = useRef(null);
  const authContext = useContext(AuthContext);

  const runFetchVideos = useCallback(async () => {
    const requestBody = {
      query: `
        query {
          videos(first: ${ENTRIES_PER_PAGE + 1}, offset: ${ENTRIES_PER_PAGE * pageNumber}) {
            url
            date
            creator {
              name
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

  const fetchVideos = useCallback(async () => {
    setLoading(true);

    const resData = await pRetry(runFetchVideos);

    const videos = resData.data.videos.slice(0, -1);

    if (videos.length <= ENTRIES_PER_PAGE) {
      setReachedMaxPageNumber(true);
    }

    videos.sort((a, b) => (
      Date.parse(b.date) - Date.parse(a.date)
    ));
    setVideos(videos);
    setLoading(false);
  }, [runFetchVideos])

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos])

  const onStartCreateVideoClick = () => {
    setCreating(true);
  }

  const onCancelClick = () => {
    setCreating(false);
  }

  const onConfirmClick = async () => {
    setCreating(false);
    const url = urlElement.current.value;

    const runCreateVideo = async () => {
      const requestBody = {
        query: `
        mutation {
          createVideo(videoInput: { url: "${url}" }) {
            _id
            url
            date
            creator {
              _id
              name
            }
          }
        }
      `
      }

      const token = authContext.token;

      const response = await fetch('http://localhost:8000/graphql', {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      // Abort retrying if the resource doesn't exist
      if (response.status === 404) {
        throw new pRetry.AbortError(response.statusText);
      }

      return response.json();
    }

    await pRetry(runCreateVideo);

    fetchVideos();
  }

  return (
    <div className="Videos">
      {creating && (
        <>
          <Backdrop onBackdropClick={onCancelClick} />
          <VideoModal
            title="Add Video" canCancel canConfirm
            onCancel={onCancelClick}
            onConfirm={onConfirmClick}
          >
            <form className="new-video-form">
              {/* <FormInputGroup className="form-control">
                <FormInputItem itemId="url" itemType="text" itemLabel="URL" itemRef={urlElement} />
              </FormInputGroup> */}
              <input type="text" placeholder="Enter the URL" ref={urlElement} />
            </form>
          </VideoModal>
        </>
      )}
      {authContext.token && <div className="Videos__control">
        <h2>Share your videos</h2>
        <button className="btn" onClick={onStartCreateVideoClick}>Add Video</button>
      </div>}
      {!loading ? (
        <section className="cards">
          {videos.map(({ url, date, creator }, index) => {
            const color = randomColor();
            return (
              <article key={index} className="card card--video">
                <div className="card__img" style={{ backgroundColor: color }}></div>
                <a href={url} className="card_link">
                  <div className="card__img--hover" style={{ backgroundColor: color }}></div>
                </a>
                <div className="card__info">
                  <h3 className="card__title"><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></h3>
                  <span className="card__date">{daysjs(date).format("MMM DD YYYY")}</span>
                  <span className="card__by">by <Link to="/users" className="card__author" title="author">{creator.name}</Link></span>
                </div>
              </article>
            )
          })}
        </section>
      )
        : (<div className="Videos__loading">
          <span className="spinner"></span>
        </div>)
      }
      <div className="pagination">
        <button disabled={pageNumber === 0} onClick={() => setPageNumber(pageNumber - 1)}>&larr; Prev</button>
        <button disabled={!(!loading && !reachedMaxPageNumber)} onClick={() => setPageNumber(pageNumber + 1)}>Next &rarr;</button>
      </div>
    </div>
  )
}

export default Videos;