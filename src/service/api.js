import request from "./request";

// auth
export const login = (data) => {
  return new Promise(async (resolve, reject) => {
    await request
      .post("/user/login", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
export const register = (data) => {
  return new Promise(async (resolve, reject) => {
    await request
      .post("/user/register", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const verifyOtp = (data) => {
  return new Promise(async (resolve, reject) => {
    await request
      .post("/user/verify-otp", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const postComments = (data) => {
  return new Promise(async (resolve, reject) => {
    await request
      .post("/user/comments", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const updateComments = (id,data) => {
  return new Promise(async (resolve, reject) => {
    await request
      .put(`/user/comments/${id}`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const updateVote = (id,data) => {
  return new Promise(async (resolve, reject) => {
    await request
      .put(`/user/comments/${id}`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const deleteComments = (id) => {
  return new Promise(async (resolve, reject) => {
    await request
      .delete(`/user/comments/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const getComments = () => {
  return new Promise(async (resolve, reject) => {
    await request
      .get(`/user/comments`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};


export const postReply= (id,data) => {
  return new Promise(async (resolve, reject) => {
    await request
    .put(`/user/comments/reply/${id}`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const updateReply= (id,replyId,data) => {
  return new Promise(async (resolve, reject) => {
    await request
    .put(`/user/comments/reply/${id}/${replyId}`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};

export const updateReplyVote= (id,replyId,data) => {
  return new Promise(async (resolve, reject) => {
    await request
    .put(`/user/comments/reply/${id}/${replyId}`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};


export const deleteReply = (id) => {
  return new Promise(async (resolve, reject) => {
    await request
      .delete(`/user/comments/reply/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        resolve(e.response.data);
      });
  });
};