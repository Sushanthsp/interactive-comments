import React, { useState, useEffect } from 'react'
import { getComments, postComments, updateComments, deleteComments, updateVote, postReply, updateReply, updateReplyVote, deleteReply } from '../service/api'
import '../styles/home.css'
import { Button, Grid, Modal } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../redux/user/actions';
import { useNavigate } from 'react-router-dom';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [deleteModal, setdeleteModal] = useState({ state: false, data: null })

  const handleModalClose = () => {
    setdeleteModal({ state: false, data: null })
    setdeleteModalReplies({ state: false, data: null })
  };

  const deleteCommentsFun = () => {
    setDeleteCommentLoading(true)
    deleteComments(deleteModal?.data).then(res => {
      if (res?.status) {
        handleShowToast("success", "Comments deleted successfully")
        getCommentFun()
        setdeleteModal({ state: false, data: null })
      }
    })
      .catch(err => {
        console.log(err)
      })
      .finally(res => {
        setDeleteCommentLoading(false)
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

  const [deleteCommentRepliesLoading, setDeleteCommentRepliesLoading] = useState(false)
  const [deleteModalReplies, setdeleteModalReplies] = useState({ state: false, data: null })

  const deleteCommentsRepliesFun = () => {
    setDeleteCommentRepliesLoading(true)
    deleteReply(deleteModalReplies?.data).then(res => {
      if (res?.status) {
        handleShowToast("success", "Comments deleted successfully")
        getCommentFun()
        setdeleteModalReplies({ state: false, data: null })
      }
    })
      .catch(err => {
        console.log(err)
      })
      .finally(res => {
        setDeleteCommentRepliesLoading(false)
      })
  }


  function formatDateAgo(date) {
    if (!moment(date).isValid()) {
      return 'Invalid input';
    }

    const timeElapsed = moment(date).fromNow();

    return timeElapsed;
  }

  const [voteLoading, setvoteLoading] = useState(false)
  const upVote = (num, dataId) => {
    console.log("dataId", dataId, num)
    setvoteLoading(true)
    updateVote(dataId?._id, { 'score': num + 1 }).then(res => {
      if (!res?.status)
        handleShowToast("error", res?.message)
      getCommentFun()
    })
      .catch(err => {
        console.log(err)
      })
      .finally(res => {
        setvoteLoading(false)
      })
  }

  const downVote = (num, dataId) => {
    setvoteLoading(true)
    updateVote(dataId?._id, { 'score': num - 1 }).then(res => {
      if (!res?.status)
        handleShowToast("error", res?.message)
      getCommentFun()
    })
      .catch(err => {
        console.log(err)
      })
      .finally(res => {
        setvoteLoading(false)
      })
  }


  const upVoteReply = (num, mainId, parentId) => {
    setvoteLoading(true)
    updateReplyVote(parentId?._id, mainId?._id, { 'score': num + 1 }).then(res => {
      console.log("res", res)
      if (!res?.status)
        handleShowToast("error", res?.message)
      getCommentFun()
    })
      .catch(err => {
        console.log("err", err)
      })
      .finally(res => {
        setvoteLoading(false)
      })
  }

  const downVoteReply = (num, mainId, parentId) => {
    setvoteLoading(true)
    updateReplyVote(parentId?._id, mainId?._id, { 'score': num - 1 }).then(res => {
      if (!res?.status)
        handleShowToast("error", res?.message)
      getCommentFun()
    })
      .catch(err => {
        console.log(err)
      })
      .finally(res => {
        setvoteLoading(false)
      })
  }

  return (
    <>
      {showToast && (
        <Toast type={showToast.type} message={showToast.message} onClose={() => setShowToast(null)} />
      )}
      <header className="fixed  top-0 right-0 w-full z-10 bg-indigo-700 md:py-4 py-2">
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
                <svg style={{ width: '24px', height: '24px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>


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
            marginBottom: '140px',
            marginTop: '105px'
          }}>
            {
              commentsList?.map(item => {
                return (
                  <div>

                    <div class="bg-gray-100 px-4 py-2 relative mb-5 custom-border" >
                      <div class="flex justify-between items-start">
                        <div class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" class="w-9 h-9 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>

                          <div class="flex flex-col">
                            <span class="font-bold">{item?.user?.name}</span>
                            <span class="text-gray-600 text-sm">{formatDateAgo(item?.createdAt)}</span>
                          </div>
                        </div>
                        <button onClick={() => showReply ? setShowReply(null) : setShowReply(item?._id)} className="bg-white   text-indigo-700 font-semibold py-2 px-4 rounded">
                          <ReplyIcon />
                        </button>
                      </div>
                      <div class="flex items-center mt-5">
                        <div class="flex flex-col items-center mr-4">
                          <button disabled={voteLoading} onClick={
                            () => {
                              upVote(item?.score, item)
                            }
                          } class="text-gray-600 hover:text-indigo-700 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                            </svg>

                          </button>
                          <span class="text-gray-600 font-bold text-lg">{item?.score}</span>
                          <button disabled={voteLoading} onClick={
                            () => {
                              downVote(item?.score, item)
                            }
                          } class="text-gray-600 hover:text-red-500 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                            </svg>

                          </button>
                        </div>
                        <div class="bg-gray-200 flex-grow px-4 py-2 rounded">
                          <p class="text-gray-800">{item?.content}</p>
                        </div>
                      </div>
                      {item?.user?._id === user?._id ? <div class="bottom-0 right-0 mr-4 mb-2 mt-2 flex justify-end">

                        <button onClick={() => {
                          setCommentData(item);
                          setComments(item?.content);
                        }} className="bg-white border text-indigo-700 font-semibold py-2 px-4 rounded">
                          <EditIcon />
                        </button>

                        <button disabled={deleteCommentLoading === item?._id} onClick={() => {
                          setdeleteModal({ state: true, data: item?._id })
                        }} className="bg-white border text-red-600 font-semibold py-2 px-4 rounded">
                          <DeleteIcon />
                        </button>

                      </div> : null}
                    </div>

                    {showReply === item?._id ?
                      <div className='custom-width' style={{ display: 'flex', flexDirection: 'row', bottom: 0, left: 0, right: 0, padding: '20px', backgroundColor: '#fff', margin: 'auto' }}>
                        <textarea
                          rows={3}
                          value={commentsReplies}
                          name="commentsReplies" onChange={(e) => {
                            setCommentsReplies(e.target.value)
                          }}
                          style={{ width: '100%', border: '2px solid #3f51b5', borderRadius: '4px', padding: '10px', resize: 'none', marginBottom: '10px', marginRight: '5px' }}
                        />
                        {

                          commentsRepliesLoading ?
                            <Button
                              color="primary"
                              variant='contained'

                              style={{ width: '100%', maxWidth: '80px', height: '40px' }}
                            >
                              Loading...
                            </Button>
                            :
                            <Button
                              color="primary"
                              variant='contained'
                              onClick={() => {
                                postCommentRepliesFun()
                              }}
                              style={{ width: '100%', maxWidth: '80px', height: '40px' }}
                            >
                              {commentsRepliesLoading ? "Loading..." : "Reply"}
                            </Button>
                        }

                      </div>
                      : null}


                    <div style={{ marginLeft: '25px' }}>
                      {
                        item?.replies?.map(replyItem => {
                          return (
                            <div>
                              <div class="bg-gray-100 px-4 py-2 mb-5 relative custom-border" >
                                <div class="flex justify-between items-start">
                                  <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" class="w-9 h-9 mr-2">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div class="flex flex-col">
                                      <span class="font-bold">{replyItem?.user?.name}</span>
                                      <span class="text-gray-600 text-sm">{formatDateAgo(replyItem?.createdAt)}</span>
                                    </div>
                                  </div>
                                  {/* <button onClick={() => {
                                    setShowReply(replyItem?._id)
                                  }} class="bg-indigo-700 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">Reply</button> */}
                                </div>
                                <div class="flex items-center mt-5">
                                  <div class="flex flex-col items-center mr-4">
                                    <button disabled={voteLoading} onClick={
                                      () => {
                                        upVoteReply(replyItem?.score, replyItem, item)
                                      }
                                    } class="text-gray-600 hover:text-indigo-700 focus:outline-none">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                                      </svg>

                                    </button>
                                    <span class="text-gray-600 font-bold text-lg">{replyItem?.score}</span>
                                    <button onClick={
                                      () => {
                                        downVoteReply(replyItem?.score, replyItem, item)
                                      }
                                    } class="text-gray-600 hover:text-red-500 focus:outline-none">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                                      </svg>

                                    </button>
                                  </div>
                                  <div class="bg-gray-200 flex-grow px-4 py-2 rounded">
                                    <p class="text-gray-800">{replyItem?.content}</p>
                                  </div>
                                </div>
                                {replyItem?.user?._id === user?._id ? <div class="bottom-0 right-0 mr-4 mb-2 mt-2 flex justify-end">
                                  <button onClick={() => {
                                    setCommentRepliesData(replyItem)
                                    setCommentsReplies(replyItem?.content)
                                  }} className="bg-white border text-indigo-700 font-semibold py-2 px-4 rounded">
                                    <EditIcon />
                                  </button>

                                  <button disabled={deleteCommentRepliesLoading === replyItem?._id} onClick={() => {
                                    setdeleteModalReplies({ state: true, data: replyItem?._id })
                                  }} className="bg-white border text-red-600 font-semibold py-2 px-4 rounded">
                                    <DeleteIcon />
                                  </button>

                                </div> : null}
                              </div>

                              {commentRepliesData?._id === replyItem?._id ?

                                <div className='custom-width' style={{ display: 'flex', flexDirection: 'row', bottom: 0, left: 0, right: 0, padding: '20px', backgroundColor: '#fff', margin: 'auto' }}>
                                  <textarea
                                    rows={3}
                                    value={commentsReplies} name="commentsReplies" onChange={(e) => {
                                      setCommentsReplies(e.target.value)
                                    }}
                                    style={{ width: '100%', border: '2px solid #3f51b5', borderRadius: '4px', padding: '10px', resize: 'none', marginBottom: '10px', marginRight: '5px' }}
                                  />
                                  <button disabled={commentsRepliesLoading} onClick={() => {
                                    updateCommentsReplies(item?._id, replyItem?._id)
                                  }} className="bg-indigo-700 border text-white font-semibold py-2 px-2 rounded" style={{ width: '100%', maxWidth: '80px', height: '40px' }}>
                                    {commentsRepliesLoading ? "Loading..." : "Update"}
                                  </button>

                                </div>

                                : null}

                              {showReply === replyItem?._id ?

                                <div className='custom-width' style={{ display: 'flex', flexDirection: 'row', bottom: 0, left: 0, right: 0, padding: '20px', backgroundColor: '#fff', margin: 'auto' }}>
                                  <textarea
                                    rows={3}
                                    value={commentsReplies} name="commentsReplies" onChange={(e) => {
                                      setCommentsReplies(e.target.value)
                                    }}
                                    style={{ width: '100%', border: '2px solid #3f51b5', borderRadius: '4px', padding: '10px', resize: 'none', marginBottom: '10px', marginRight: '5px' }}
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
              style={{ width: '100%', border: '2px solid #3f51b5', borderRadius: '4px', padding: '10px', resize: 'none', marginBottom: '10px', marginRight: '5px' }}
            />
            {commentsLoading ?
              <Button
                color="primary"
                variant='contained'

                style={{ width: '100%', maxWidth: '80px', height: '40px' }}
              >
                Loading...
              </Button> :
              <Button
                color="primary"
                variant='contained'

                onClick={commentData ? updateCommentsFun : postCommentFun}
                style={{ width: '100%', maxWidth: '80px', height: '40px' }}
              >
                {commentData ? "Update" : "Send"}
              </Button>}
          </div>
        </div>
      </div>


      <Modal
        open={deleteModal?.state}
        onClose={handleModalClose}
        className="flex justify-center items-center"
        style={{ height: '40vh', maxWidth: '700px', margin: 'auto' }}
      >
        {/* Modal Content */}
        <div className="bg-white p-8 rounded-lg flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-700">Are you sure you want to delete comment</h2>
          </div>
          <div className="flex justify-end mt-10">
            <Button
              variant="contained"
              onClick={() => deleteCommentLoading ? null : deleteCommentsFun()}
              className="mt-4 bg-indigo-700 text-white"
              style={{
                background: '#3f51b5',
                color: '#fff',
              }}
            >
              {deleteCommentLoading ? "Loading..." : "Delete"}
            </Button>
            <Button
              style={{ marginLeft: '5px' }}
              variant="outlined"
              color="primary"
              onClick={handleModalClose}
              className="mt-4 text-indigo-700"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteModalReplies?.state}
        onClose={handleModalClose}
        className="flex justify-center items-center"
        style={{ height: '40vh', maxWidth: '700px', margin: 'auto' }}
      >
        {/* Modal Content */}
        <div className="bg-white p-8 rounded-lg flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-700">Are you sure you want to delete comment</h2>
          </div>
          <div className="flex justify-end mt-10">
            <Button
              variant="contained"
              onClick={() => deleteCommentRepliesLoading ? null : deleteCommentsRepliesFun()}
              className="mt-4 bg-indigo-700 text-white"
              style={{
                background: '#3f51b5',
                color: '#fff',
              }}
            >
              {deleteCommentRepliesLoading ? "Loading..." : "Delete"}
            </Button>
            <Button
              style={{ marginLeft: '5px' }}
              variant="outlined"
              color="primary"
              onClick={handleModalClose}
              className="mt-4 text-indigo-700"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>

  )
}

export default HomePage