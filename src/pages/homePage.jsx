import React, { useState, useEffect } from 'react'
import { getComments, postComments, updateComments, deleteComments, updateVote, postReply, updateReply, updateReplyVote, deleteReply } from '../service/api'
import '../styles/home.css'
import { Button, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../redux/user/actions';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

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
    <div style={{ zIndex: 1001 }} className={`absolute top-0 right-0 mt-10 mr-2 py-2 px-4 rounded-md shadow-md ${bgColor} ${textColor}`}>
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
  const updateCommentsReplies = (id,replyId) => {
    if (!commentsReplies) {
      handleShowToast("error", "Please enter text")
      return
    }
    setCommentsRepliesLoading(true)

    updateReply(id, replyId,{ 'content': commentsReplies }).then(res => {
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


  return (
    <>
      {showToast && (
        <Toast type={showToast.type} message={showToast.message} onClose={() => setShowToast(null)} />
      )}
      <header className="bg-indigo-700 md:py-4 py-2">
        <nav className="flex items-center justify-between container mx-auto px-4">
          <div className="flex-2 justify-start">
            <div className="items-center text-white uppercase font-bold text-xl md:flex hidden">
              COMMENTZ
            </div>
          </div>

          <div>
            <div className="mr-2 mb-2 sm:hidden flex">
              <Button
                variant="outlined"
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

      <div class="sm:h-screen h:5 flex flex-col  mt-2">

        <div className="parking-lot-container w-90 h-90 element mt-5">
          <div>
            {
              commentsList?.map(item => {
                return (
                  <div >
                    <h1>{item?.content}</h1>
                    <h5>{item?.score}</h5>
                    <Button onClick={() => {
                      setCommentData(item)
                      setComments(item?.content)
                    }}> update</Button>

                    <Button disabled={deleteCommentLoading === item?._id} onClick={() => {
                      deleteCommentsFun(item?._id)
                    }}> {deleteCommentLoading === item?._id ? "Loading" : "delete"}</Button>

                    <Button disabled={deleteCommentLoading === item?._id} onClick={() => {
                      setShowReply(item?._id)
                    }}> Reply</Button>

                    {showReply === item?._id ? <>
                      <textarea value={comments} name="comments" onChange={(e) => {
                        setCommentsReplies(e.target.value)
                      }} />
                      <Button color="primary" variant='outlined' disabled={commentsRepliesLoading} onClick={() => {
                        postCommentRepliesFun()
                      }}>{commentsRepliesLoading ? "Loading..." : "Reply"}</Button>
                    </> : null}


                    <div style={{ background: "grey" }}>
                      {
                        item?.replies?.map(replyItem => {
                          return (
                            <div>
                              <h1>{replyItem?.content}</h1>
                              <h5>{replyItem?.score}</h5>
                              <Button onClick={() => {
                                setCommentRepliesData(replyItem)
                                setCommentsReplies(replyItem?.content)
                              }}> update</Button>

                              <Button disabled={deleteCommentRepliesLoading === replyItem?._id} onClick={() => {
                                deleteCommentsRepliesFun(replyItem?._id)
                              }}> {deleteCommentRepliesLoading === replyItem?._id ? "Loading" : "delete"}</Button>

                              <Button disabled={deleteCommentRepliesLoading === replyItem?._id} onClick={() => {
                                setShowReply(replyItem?._id)
                              }}> Reply</Button>

                              {commentRepliesData?._id === replyItem?._id ? <>
                                <textarea value={commentsReplies} name="commentsReplies" onChange={(e) => {
                                  setCommentsReplies(e.target.value)
                                }} />
                                <Button color="primary" variant='outlined' disabled={commentsRepliesLoading} onClick={() => {
                                  updateCommentsReplies(item?._id,replyItem?._id)
                                }}>{commentsRepliesLoading ? "Loading..." : "Reply"}</Button>
                              </> : null}

                              {showReply === replyItem?._id ? <>
                                <textarea value={comments} name="comments" onChange={(e) => {
                                  setCommentsReplies(e.target.value)
                                }} />
                                <Button color="primary" variant='outlined' disabled={commentsRepliesLoading} onClick={() => {
                                  postCommentRepliesFun()
                                }}>{commentsRepliesLoading ? "Loading..." : "Reply"}</Button>
                              </> : null}
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
          <textarea value={comments} name="comments" onChange={(e) => {
            setComments(e.target.value)
          }} />
          <Button color="primary" variant='outlined' disabled={commentsLoading} onClick={commentData ? updateCommentsFun : postCommentFun}>{commentsLoading ? "Loading..." : commentData ? "Update" : "Send"}</Button>
        </div>
      </div>

    </>

  )
}

export default HomePage