import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { getFeedDetailFetch } from "../../../app/modules/detailSlice";
import { decodeMyTokenData, tokenChecker } from "../../../utils/token";
import instance from "../../../app/modules/instance";
import DetailCard from "./DetailCard";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StShadowBackgroundDiv } from "../../interface/styledCommon";

function FeedDetailContainer() {
  const inputRef = useRef();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [menuModal, setMenuModal] = useState(false);
  const [commentId, setCommentId] = useState("");

  //useEffect의 위치 선정 중요.
  useEffect(() => {
    //토큰체크 후 없으면 로그인페이지 이동
    if (tokenChecker() === false) {
      alert("로그인 후 이용해주세요.");
      navigate("/mypage");
    }
  }, []);

  const detailState = useSelector((state) => state.detail.data);
  console.log(detailState);

  useEffect(() => {
    dispatch(getFeedDetailFetch({ todoId: params.todoId }));
    setLoading(true);
  }, []);

  useEffect(() => {
    if (loading === true) {
      if (detailState.length === 0) {
        navigate("/todolists");
      }
    }
  }, []);

  const onClickGoToOtherspage = (e) => {
    e.preventDefault();
    console.log(e.target.id);
    navigate(`/otherspage/${e.target.id}`);
  };

  const onClickCommentGoToOtherspage = (e) => {
    e.preventDefault();
    navigate(`/otherspage/${e.target.id}`);
  };

  const onClickDeleteComment = (e) => {
    e.preventDefault();
    const deleteCommentFetch = async () => {
      try {
        const response = await instance.delete(`/comments/${commentId}`);
        if (response.data.message === "success") {
          dispatch(getFeedDetailFetch({ todoId: params.todoId }));
          setCommentId("");
          setMenuModal(false);
        }
      } catch (error) {
        return alert(error.response.data.errorMessage);
      }
    };
    deleteCommentFetch();
  };

  const setMyTodayChallenge = (e) => {
    e.preventDefault();
    const postFeedDetailFetch = async () => {
      try {
        const response = await instance.post(
          `/mytodos/${e.target.id}/challenged`
        );
        if (response.data.message === "success") {
          return navigate("/setuptodo");
        }
      } catch (error) {
        return alert(error.response.data.errorMessage);
      }
    };
    postFeedDetailFetch();
    // dispatch(postFeedDetailFetch(e.target.id))
  };

  const upLoadCommentData = (e) => {
    e.preventDefault();
    if (inputRef.current.value === "") {
      return alert("댓글을 입력해주세요");
    }
    const postCommentFetch = async () => {
      try {
        const response = await instance.post(`/comments/${params.todoId}`, {
          comment: inputRef.current.value,
        });
        if (response.data.message === "success") {
          return dispatch(getFeedDetailFetch({ todoId: params.todoId }));
        }
      } catch (error) {
        return alert(error.response.data.errorMessage);
      }
    };
    postCommentFetch();
    // dispatch(postCommentFetch({comment:inputRef.current.value, todoId:params.todoId }))
    inputRef.current.value = "";
  };

  const changeFollowState = (e) => {
    const putMyPageFollowFetch = async () => {
      try {
        const response = await instance.put(`/follows/${e.target.id}`);
        if (response.data.message === "success") {
          return dispatch(getFeedDetailFetch({ todoId: params.todoId }));
        }
      } catch (error) {
        return alert(error.response.data.errorMessage);
      }
    };
    putMyPageFollowFetch();
    // dispatch(putMyPageFollowFetch(e.target.id))
  };

  const myData = decodeMyTokenData();
  console.log(myData);

  function displayCardMenu(event) {
    event.stopPropagation();
    setMenuModal(!menuModal);
    setCommentId(event.target.id);
  }

  return (
    <div style={{ marginTop: "60px", marginBottom: "220px" }}>
      {menuModal === true ? (
        <StShadowBackgroundDiv>
          <StPopUpWhiteButton
            onClick={onClickDeleteComment}
            transform="translateY(76vh)">
            삭제
          </StPopUpWhiteButton>

          <StPopUpWhiteButton
            onClick={displayCardMenu}
            transform="translateY(77vh)">
            닫기
          </StPopUpWhiteButton>
        </StShadowBackgroundDiv>
      ) : (
        <></>
      )}

      {Object.keys(detailState).length === 0 ? (
        <></>
      ) : (
        <div>
          <StProfilWrap>
            <StUserIdBox>
              <StProfileBox>
                <StProfileImg
                  src={
                    detailState.todoInfo.profile !== "none"
                      ? detailState.todoInfo.profile
                      : "https://mimicimagestorage.s3.ap-northeast-2.amazonaws.com/profile/placeHolderImage.jpg"
                  }
                />
              </StProfileBox>
              <StNickname
                id={detailState.todoInfo.userId}
                onClick={onClickGoToOtherspage}>
                {detailState.todoInfo.nickname}
              </StNickname>
              <StMBTI>{detailState.todoInfo.mbti}</StMBTI>
              {myData.userId === detailState.todoInfo.userId ? (
                <></>
              ) : detailState.isFollowed === false ? (
                <StFollowBtn
                  id={detailState.todoInfo.userId}
                  onClick={changeFollowState}>
                  팔로우
                </StFollowBtn>
              ) : (
                <StFollowBtn
                  id={detailState.todoInfo.userId}
                  onClick={changeFollowState}>
                  언팔로우
                </StFollowBtn>
              )}
            </StUserIdBox>

            <DetailCard data={detailState.todoInfo} />

            {detailState.isTodayDone === "false" ? (
              <></>
            ) : (
              <StBtnGoToChallenge
                onClick={setMyTodayChallenge}
                id={detailState.todoInfo.todoId}>
                도전할래요!
              </StBtnGoToChallenge>
            )}
          </StProfilWrap>
          <div
            style={{
              width: "100%",
              background: "white",
              padding: "10px 0",
            }}>
            {detailState.comments?.map((x, index) => {
              return (
                <div key={index}>
                  <StCommentBox>
                    <StImgNickname>
                      <StProfileBox width="32px" height="32px">
                        <StProfileImg
                          width="auto"
                          height="32px"
                          borderRadius="16px"
                          src={
                            x.profile !== "none"
                              ? x.profile
                              : "https://mimicimagestorage.s3.ap-northeast-2.amazonaws.com/profile/placeHolderImage.jpg"
                          }
                        />
                      </StProfileBox>
                      <StNicknameComment
                        id={x.userId}
                        onClick={onClickCommentGoToOtherspage}>
                        {x.nickname}
                      </StNicknameComment>
                      <StChangeDeleteBtn>
                        {myData.userId === x.userId ? (
                          <StMenuBtn id={x.commentId} onClick={displayCardMenu}>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </StMenuBtn>
                        ) : (
                          <></>
                        )}
                      </StChangeDeleteBtn>
                    </StImgNickname>
                    <StComment>{x.comment}</StComment>
                  </StCommentBox>
                </div>
              );
            })}
          </div>

          <StWriteComment onSubmit={upLoadCommentData}>
            <StCommentProfileBox>
              <StProfileImg
                style={{
                  height: "50px",
                  width: "auto",
                  margin: "0",
                  padding: "0",
                }}
                src={
                  myData.profile !== "none"
                    ? myData.profile
                    : "https://mimicimagestorage.s3.ap-northeast-2.amazonaws.com/profile/placeHolderImage.jpg"
                }
              />
            </StCommentProfileBox>

            <StInput
              type="text"
              name="comment"
              placeholder="댓글 내용"
              ref={inputRef} //!ref를 참고하겠다.
            />
            <StCommentBtn type="submit">작성</StCommentBtn>
          </StWriteComment>
        </div>
      )}
    </div>
  );
}

export default FeedDetailContainer;

const StCommentBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 30px auto 30px 20px;
`;
const StUserIdBox = styled.div`
  /* background-color:yellow; */
  display: flex;
  flex-direction: row;
  width: 90%;
  margin: 0px auto 10px 20px;
  align-items: center;
  cursor: pointer;
`;

const StProfilWrap = styled.div`
  background-color: #edecec;
  padding-top: 20px;
  padding-bottom: 10px;
`;

const StImgNickname = styled.div`
  /* background-color:green; */
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;

const StProfileBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ width, height }) => {
    return css`
      width: ${width || "50px"};
      height: ${height || "50px"};
    `;
  }}
  /* width:50px;
  height:50px; */
  border-radius:50%;
  overflow: hidden;
  margin: 10px;
`;

const StProfileImg = styled.img`
  /* background-color: gray; */
  /* border-radius: 15px; */
  cursor: pointer;
  /* width:30px;
  height:30px;
  margin:10px; */
  ${({ width, height, margin, borderRadius }) => {
    return css`
      width: ${width || "50px"};
      height: ${height || "50px"};
      /* margin: ${margin || "10px"}; */
      /* border-radius: ${borderRadius || "25px"}; */
    `;
  }}
`;
const StNickname = styled.div`
  /* background-color:red; */
  text-align: start;
  margin-right: 18px;
  font-weight: 500;
  font-size: 22px;
  /* margin-top:5px; */
  /* border:1px solid; */
`;

const StMBTI = styled.div`
  font-weight: 500;
  font-size: 18px;
  color: #5e5c5c;
`;
const StFollowBtn = styled.button`
  background: none;
  border: none;
  margin-left: auto;
  font-family: "IBM Plex Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #ff6d53;
  :hover {
  }
  cursor: pointer;
`;

const StNicknameComment = styled.div`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
`;
const StComment = styled.div`
  align-items: flex-start;
  text-align: start;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  margin-left: 40px;
  margin-right: 50px;
  word-wrap: break-word;
`;

const StChangeDeleteBtn = styled.div`
  text-align: right;
  margin-left: auto;
`;

const StCommentProfileBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  margin: 10px;
  padding: 0;
  border-radius: 50%;
  overflow: hidden;
`;

const StMenuBtn = styled.button`
  background: none;
  font-size: 16px;
  line-height: 32px;
  color: ${(props) => props.color};

  border: none;
  outline: none;
  margin-left: auto;

  cursor: pointer;
`;

const StWriteComment = styled.form`
  background-color: white;
  border-top: 1px solid #c7c7c7;
  position: fixed;
  display: flex;
  align-items: center;
  width: 500px;
  height: 70px;
  bottom: 0;
  z-index: 7;
  padding: 4px 0;
`;
const StItem = styled.div`
  /* background-color:blue; */
  display: flex;
  flex-direction: row;
  border-radius: 1px solid red;
`;

const StInputWrap = styled.div`
  margin-top: 5px;
  margin-bottom: 75px;
`;

const StInput = styled.input`
  /* background-color:red; */
  margin-left: auto;
  margin-right: 15px;

  border: 1px solid #979797;
  border-radius: 6px;
  width: 90%;
  max-width: 320px;
  height: 55px;
  padding-left: 20px;
  padding-right: 70px;
  font-weight: 500;
  font-size: 18px;
  ::placeholder {
    font-weight: 500;
    font-size: 18px;
  }
`;

const StCommentBtn = styled.button`
  color: #ff6d53;
  z-index: 8;
  width: 60px;
  height: 32px;
  font-weight: 500;
  position: absolute;
  font-size: 18px;
  background-color: white;
  border: none;
  margin-top: 5px;
  padding: 0;
  right: 0;
  transform: translateX(-40%) translateY(-10%);
  cursor: pointer;
`;
const StBtnGoToChallenge = styled.button`
  background: #ff6d53;
  border-radius: 6px;
  border: none;
  width: 450px;
  height: 70px;
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  margin: 10px;
`;

const StPopUpWhiteButton = styled.button`
  background: #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 22px;
  font-weight: 500;
  color: #979797;

  border: none;
  outline: none;
  margin: 0 25px;
  border-radius: 6px;

  width: 90%;
  height: 70px;
  transform: ${(props) => props.transform};
  cursor: pointer;
`;
