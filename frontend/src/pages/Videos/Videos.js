import React, { useState, useRef, useContext, useEffect, useCallback } from 'react'
import './Videos.css';
import VideoModal from '../../components/VideoModal/VideoModal';
import Backdrop from '../../components/Backdrop/Backdrop';
import FormInputGroup from '../../components/FormInputGroup/FormInputGroup';
import FormInputItem from '../../components/FormInputItem/FormInputItem';
import AuthContext from '../../contexts/auth-context';

import pRetry from 'p-retry';
import fetch from 'node-fetch';

const ENTRIES_PER_PAGE = 25;

function Videos() {
  const [creating, setCreating] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const urlElement = useRef(null);
  const authContext = useContext(AuthContext);

  const runFetchVideos = useCallback(async () => {
    const requestBody = {
      query: `
        query {
          videos(first: ${ENTRIES_PER_PAGE}, offset: ${ENTRIES_PER_PAGE * pageNumber}) {
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

    const videos = resData.data.videos;
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
          <Backdrop />
          <VideoModal
            title="Add Video" canCancel canConfirm
            onCancel={onCancelClick}
            onConfirm={onConfirmClick}
          >
            <form>
              <FormInputGroup className="form-control">
                <FormInputItem itemId="url" itemType="text" itemLabel="URL" itemRef={urlElement} />
              </FormInputGroup>
            </form>
          </VideoModal>
        </>
      )}
      {authContext.token && <div className="videos-control">
        <p>Share your videos</p>
        <button className="btn" onClick={onStartCreateVideoClick}>Share Video</button>
      </div>}
      {!loading ?
        (videos.map(({url, date, creator}, index) => (
          <div key={index}>
          <div>{url}</div>
          <div>{date}</div>
          <div>{`By ${creator.name}`}</div></div>
        ))) : `LOADING`
      }
          <button disabled={videos.length < 25} onClick={() => setPageNumber(pageNumber + 1)}>NEXT</button>
    <button disabled={pageNumber === 0} onClick={() => setPageNumber(pageNumber - 1)}>PREVIOUS</button>
    </div>
  )
}

export default Videos;