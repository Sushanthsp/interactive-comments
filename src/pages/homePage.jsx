import React, { useState, useEffect } from 'react'
import { getComments, postComments, updateComments, deleteComments, updateVote, postReply, updateReply, updateReplyVote, deleteReply } from '../service/api'
import '../styles/home.css'
import { Button, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../redux/user/actions';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
const moment = require('moment');

const Toast = ({ type, message, onClose }) => {
  let bgColor = '';
  let textColor = '';

  if (type === 'error') {
    bgColor = 'bg-red-600';
    textColor = 'text-white';
  } else if (type === 'success') {
    bgColor = 'bg-green-500';
    textColor = 'text-white';
  }

  return (
    <div style={{ zIndex: 1001 }} className={`fixed top-0 right-0 mt-10 mr-2 py-2 px-4 rounded-md shadow-md ${bgColor} ${textColor}`}>
      <p>{message}</p>
    </div>
  );
};


function HomePage() {
  const [slots, setSlots] = useState([]);
  const [showToast, setShowToast] = useState(null);

  const { loggedIn, user } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login')
    }
  }, [loggedIn])


  const handleShowToast = (type, message) => {
    setShowToast({ type, message });
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  const logout = () => {
    navigate('/')
    dispatch(actions.setLoggedIn(false))
    dispatch(actions.setUser(null))
    dispatch(actions.setToken(null))
  }


  //comments
  const [commentsList, setCommentsList] = useState([])
  const [loading, setLoading] = useState(false)

  const getCommentFun = () => {
    setLoading(true)
    getComments().then(res => {
      console.log("res", res?.data)
      setCommentsList(res?.data)
    })
      .finally(res => {
        setLoading(false)
      })
  }
  useEffect(() => {
    getCommentFun()
  }, [])

  const [comments, setComments] = useState(null)
  const [commentsLoading, setCommentsLoading] = useState(false)

  const postCommentFun = () => {
    if (!comments) {
      handleShowToast("error", "Please enter text")
      return
    }
    setCommentsLoading(true)

    postComments({ 'content': comments }).then(res => {
      if (res?.status) {
        handleShowToast("success", "Comments posted successfully")
        setComments('')
        getCommentFun()
      }
    })
      .catch(err => {
        console.log(err)
      })
      .finally(res => {
        setCommentsLoading(false)
      })

  }

  const [commentData, setCommentData] = useState(null)
  const updateCommentsFun = () => {
    if (!comments) {
      handleShowToast("error", "Please enter text")
      return
    }
    setCommentsLoading(true)

    updateComments(commentData?._id, { 'content': comments }).then(res => {
      if (res?.status) {
        handleShowToast("success", "Comments updated successfully")
        setComments('')
        setCommentData(null)
        getCommentFun()

      }
    })
      .catch(err => {
        console.log(err)
      })
      .finally(res => {
        setCommentsLoading(false)
      })

  }

  const [deleteCommentLoading, setDeleteCommentLoading] = useState(null)
  const deleteCommentsFun = (id) => {
    setDeleteCommentLoading(id)
    deleteComments(id).then(res => {
      if (res?.status) {
        handleShowToast("success", "Comments deleted successfully")
      }
    })
      .catch(err => {
        console.log(err)
      })
      .finally(res => {
        setDeleteCommentLoading(null)
      })
  }

  //replies

  const [showReply, setShowReply] = useState(null)
  const [commentsReplies, setCommentsReplies] = useState(null)
  const [commentsRepliesLoading, setCommentsRepliesLoading] = useState(false)

  const postCommentRepliesFun = () => {
    if (!commentsReplies) {
      handleShowToast("error", "Please enter text")
      return
    }
    setCommentsRepliesLoading(true)

    postReply(showReply, { 'content': commentsReplies }).then(res => {
      if (res?.status) {
        handleShowToast("success", "Comments posted successfully")
        setCommentsReplies(null)
        getCommentFun()
        setShowReply(null)
      }
    })
      .catch(err => {
        console.log(err)
      })
      .finally(res => {
        setCommentsRepliesLoading(false)
      })

  }

  const [commentRepliesData, setCommentRepliesData] = useState(null)
  const updateCommentsReplies = (id, replyId) => {
    if (!commentsReplies) {
      handleShowToast("error", "Please enter text")
      return
    }
    setCommentsRepliesLoading(true)

    updateReply(id, replyId, { 'content': commentsReplies }).then(res => {
      if (res?.status) {
        handleShowToast("success", "Replies updated successfully")
        setCommentsReplies(null)
        setCommentRepliesData(null)
        getCommentFun()

      }
    })
      .catch(err => {
        console.log(err)
      })
      .finally(res => {
        setCommentsRepliesLoading(false)
      })

  }

  const [deleteCommentRepliesLoading, setDeleteCommentRepliesLoading] = useState(null)
  const deleteCommentsRepliesFun = (id) => {
    setDeleteCommentRepliesLoading(id)
    deleteReply(id).then(res => {
      if (res?.status) {
        handleShowToast("success", "Comments deleted successfully")
        getCommentFun()
      }
    })
      .catch(err => {
        console.log(err)
      })
      .finally(res => {
        setDeleteCommentRepliesLoading(null)
      })
  }


  function formatDateAgo(date) {
    if (!moment(date).isValid()) {
      return 'Invalid input';
    }

    const timeElapsed = moment(date).fromNow();

    return timeElapsed;
  }

  return (
    <>
      {showToast && (
        <Toast type={showToast.type} message={showToast.message} onClose={() => setShowToast(null)} />
      )}
      <header className="bg-indigo-700 md:py-4 py-2">
        <nav className="flex items-center justify-between container mx-auto px-4">
          <div className="flex-2 justify-start">
            <div className="items-center text-white uppercase font-bold text-xl md:flex">
              COMMENTZ
            </div>
          </div>

          <div>
            <div className="mr-2 mb-2 sm:hidden flex">
              <Button
                variant="contained"
                color="secondary"
                onClick={logout}
                style={{
                  marginLeft: '10px',
                }}
              >
                <ExitToAppIcon color='secondary' />
              </Button>
            </div>

            <div className="mr-2 md:flex hidden">
              <Button
                onClick={logout}
                variant="contained"
                color="default"
                className="bg-white text-indigo-500 hover:bg-white-500 hover:text-black max-h-10"
              >
                Logout
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <div className="sm:h-screen h:5 flex flex-col mt-2 item-center m-auto custom-width" >
        <div className='custom-width '>
          <div style={{
            marginBottom: '140px'
          }}>
            {
              commentsList?.map(item => {
                return (
                  <div>

                    <div class="bg-gray-100 px-4 py-2 relative">
                      <div class="flex justify-between items-start">
                        <div class="flex items-center">
                          <img class="w-10 h-10 rounded-full mr-2" src="profile.jpg" alt="Profile Image" />
                          <div class="flex flex-col">
                            <span class="font-bold">{item?.user?.name}</span>
                            <span class="text-gray-600 text-sm">{formatDateAgo(item?.createdAt)}</span>
                          </div>
                        </div>
                        <button onClick={() => {
                          setShowReply(item?._id)
                        }} class="bg-indigo-700 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">Reply</button>
                      </div>
                      <div class="flex items-center mt-2">
                        <div class="flex flex-col items-center mr-4">
                          <button class="text-gray-600 hover:text-indigo-700 focus:outline-none">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 018-8V2a10 10 0 100 20v-2a8 8 0 01-8-8z"></path>
                            </svg>
                          </button>
                          <span class="text-gray-600 font-bold text-lg">{item?.score}</span>
                          <button class="text-gray-600 hover:text-red-500 focus:outline-none">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 018-8V2a10 10 0 100 20v-2a8 8 0 01-8-8z"></path>
                            </svg>
                          </button>
                        </div>
                        <div class="bg-gray-200 flex-grow px-4 py-2 rounded">
                          <p class="text-gray-800">{item?.content}</p>
                        </div>
                      </div>
                      <div class="bottom-0 right-0 mr-4 mb-2 mt-2 flex justify-end">
                        <button onClick={() => {
                          setCommentData(item)
                          setComments(item?.content)
                        }} class="bg-indigo-700 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded mr-2">Update</button>
                        <button disabled={deleteCommentLoading === item?._id} onClick={() => {
                          deleteCommentsFun(item?._id)
                        }} class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">{deleteCommentLoading === item?._id ? "Loading" : "delete"}</button>
                      </div>
                    </div>

                    {showReply === item?._id ?
                      <div className='custom-width' style={{ display: 'flex', flexDirection: 'row', bottom: 0, left: 0, right: 0, padding: '20px', backgroundColor: '#fff', margin: 'auto' }}>
                        <textarea
                          rows={3}
                          value={commentsReplies}
                          name="commentsReplies" onChange={(e) => {
                            setCommentsReplies(e.target.value)
                          }}
                          style={{ width: '100%', border: '1px solid indigo', borderRadius: '4px', padding: '10px', resize: 'none', marginBottom: '10px', marginRight: '5px' }}
                        />
                        <Button
                          color="primary"
                          variant='contained'
                          disabled={commentsRepliesLoading} onClick={() => {
                            postCommentRepliesFun()
                          }}
                          style={{ width: '100%', maxWidth: '80px', height: '40px' }}
                        >
                          {commentsRepliesLoading ? "Loading..." : "Reply"}
                        </Button>
                      </div>
                      : null}


                    <div style={{ background: "grey" }}>
                      {
                        item?.replies?.map(replyItem => {
                          return (
                            <div>

                              <div class="bg-gray-100 px-4 py-2 relative">
                                <div class="flex justify-between items-start">
                                  <div class="flex items-center">
                                    <img class="w-10 h-10 rounded-full mr-2" src="profile.jpg" alt="Profile Image" />
                                    <div class="flex flex-col">
                                      <span class="font-bold">{replyItem?.user?.name}</span>
                                      <span class="text-gray-600 text-sm">{formatDateAgo(replyItem?.createdAt)}</span>
                                    </div>
                                  </div>
                                  <button onClick={() => {
                                    setShowReply(replyItem?._id)
                                  }} class="bg-indigo-700 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">Reply</button>
                                </div>
                                <div class="flex items-center mt-2">
                                  <div class="flex flex-col items-center mr-4">
                                    <button class="text-gray-600 hover:text-indigo-700 focus:outline-none">
                                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 018-8V2a10 10 0 100 20v-2a8 8 0 01-8-8z"></path>
                                      </svg>
                                    </button>
                                    <span class="text-gray-600 font-bold text-lg">{replyItem?.score}</span>
                                    <button class="text-gray-600 hover:text-red-500 focus:outline-none">
                                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 018-8V2a10 10 0 100 20v-2a8 8 0 01-8-8z"></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <div class="bg-gray-200 flex-grow px-4 py-2 rounded">
                                    <p class="text-gray-800">{replyItem?.content}</p>
                                  </div>
                                </div>
                                <div class="bottom-0 right-0 mr-4 mb-2 mt-2 flex justify-end">
                                  <button onClick={() => {
                                    setCommentRepliesData(replyItem)
                                    setCommentsReplies(replyItem?.content)
                                  }} class="bg-indigo-700 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded mr-2">Update</button>
                                  <button disabled={deleteCommentRepliesLoading === replyItem?._id} onClick={() => {
                                    deleteCommentsRepliesFun(replyItem?._id)
                                  }} class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">{deleteCommentRepliesLoading === replyItem?._id ? "Loading" : "delete"}</button>
                                </div>
                              </div>

                              {commentRepliesData?._id === replyItem?._id ?

                                <div className='custom-width' style={{ display: 'flex', flexDirection: 'row', bottom: 0, left: 0, right: 0, padding: '20px', backgroundColor: '#fff', margin: 'auto' }}>
                                  <textarea
                                    rows={3}
                                    value={commentsReplies} name="commentsReplies" onChange={(e) => {
                                      setCommentsReplies(e.target.value)
                                    }}
                                    style={{ width: '100%', border: '1px solid indigo', borderRadius: '4px', padding: '10px', resize: 'none', marginBottom: '10px', marginRight: '5px' }}
                                  />
                                  <Button
                                    color="primary"
                                    variant='contained'
                                    disabled={commentsRepliesLoading} onClick={() => {
                                      updateCommentsReplies(item?._id, replyItem?._id)
                                    }}
                                    style={{ width: '100%', maxWidth: '80px', height: '40px' }}
                                  >
                                    {commentsRepliesLoading ? "Loading..." : "Reply"}
                                  </Button>
                                </div>

                                : null}

                              {showReply === replyItem?._id ?

                                <div className='custom-width' style={{ display: 'flex', flexDirection: 'row', bottom: 0, left: 0, right: 0, padding: '20px', backgroundColor: '#fff', margin: 'auto' }}>
                                  <textarea
                                    rows={3}
                                    value={commentsReplies} name="commentsReplies" onChange={(e) => {
                                      setCommentsReplies(e.target.value)
                                    }}
                                    style={{ width: '100%', border: '1px solid indigo', borderRadius: '4px', padding: '10px', resize: 'none', marginBottom: '10px', marginRight: '5px' }}
                                  />
                                  <Button
                                    color="primary"
                                    variant='contained'
                                    disabled={commentsRepliesLoading} onClick={() => {
                                      postCommentRepliesFun()
                                    }}
                                    style={{ width: '100%', maxWidth: '80px', height: '40px' }}
                                  >
                                    {commentsRepliesLoading ? "Loading..." : "Reply"}
                                  </Button>
                                </div>
                                : null}
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                )

              })
            }
          </div>
          <div className='custom-width' style={{ display: 'flex', flexDirection: 'row', position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', backgroundColor: '#fff', margin: 'auto' }}>
            <textarea
              value={comments}
              name="comments"
              rows={3}
              onChange={(e) => setComments(e.target.value)}
              style={{ width: '100%', border: '1px solid indigo', borderRadius: '4px', padding: '10px', resize: 'none', marginBottom: '10px', marginRight: '5px' }}
            />
            <Button
              color="primary"
              variant='contained'
              disabled={commentsLoading}
              onClick={commentData ? updateCommentsFun : postCommentFun}
              style={{ width: '100%', maxWidth: '80px', height: '40px' }}
            >
              {commentsLoading ? "Loading..." : commentData ? "Update" : "Send"}
            </Button>
          </div>
        </div>
      </div>

    </>

  )
}

export default HomePage