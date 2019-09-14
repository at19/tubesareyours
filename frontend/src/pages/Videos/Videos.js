import React, { useState, useRef, useContext, useEffect } from 'react'
import './Videos.css';
import VideoModal from '../../components/VideoModal/VideoModal';
import Backdrop from '../../components/Backdrop/Backdrop';
import FormInputGroup from '../../components/FormInputGroup/FormInputGroup';
import FormInputItem from '../../components/FormInputItem/FormInputItem';
import AuthContext from '../../contexts/auth-context';

function Videos() {
  const [creating, setCreating] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const urlElement = useRef(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchVideos();
  }, [])

  const onStartCreateVideoClick = () => {
    setCreating(true);
  }

  const onCancelClick = () => {
    setCreating(false);
  }

  const onConfirmClick = () => {
    setCreating(false);
    const url = urlElement.current.value;
    
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

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(res => {
      if(res.status !== 200 && res.status !== 201) {
        console.log(res);
        throw new Error("Failed");
      }
      return res.json();
    }).then(resData => {
      fetchVideos();
    })
  }

  const fetchVideos = () => {
    setLoading(true);

    const requestBody = {
      query: `
        query {
          videos {
            url
            date
            creator {
              name
            }
          }
        }
      `
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => {
      if(res.status !== 200 && res.status !== 201) {
        console.log(res);
        throw new Error("Failed");
      }
      return res.json();
    }).then(resData => {
      const videos = resData.data.videos;
      videos.sort((a, b) => (
        Date.parse(b.date) - Date.parse(a.date)
      ));
      setVideos(videos);
      setLoading(false);
    })
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
    </div>
  )
}

export default Videos;