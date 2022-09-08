import { StCommonColumnBox, StCommonRowBox } from "../interface/styledCommon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleCheck, faMessage, faStar } from "@fortawesome/free-regular-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useState } from "react";

function ChallengeCard ({ data }) {
  const [challengeComplete, setChallengeComplete] = useState(false)
  // const navigate = useNavigate();

  function changeStateChallenge (event) {
    event.stopPropagation();
    setChallengeComplete(!challengeComplete)
  }

  return (
    <StChallengeCardDiv  id={data.todoId}>
      {window.location.pathname !== "/feed" ?
      <StChallengeStateBtn onClick={changeStateChallenge}>
        {challengeComplete === false ?
          <FontAwesomeIcon style={{fontSize:"46px", marginRight:"19px"}} icon={faCircleCheck} /> :
            <FontAwesomeIcon style={{fontSize:"46px", marginRight:"19px"}} icon={faCircle} />}
      </StChallengeStateBtn> : <></>}
      <StCommonColumnBox width="100%">
        <StCommonRowBox>
          <StChallengeNameSpan>{data.todo.length < 10 ? data.todo : data.todo.substring(0, 10) + "..."}</StChallengeNameSpan>
          <StMenuBtn>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </StMenuBtn>
        </StCommonRowBox>
        <StCommonRowBox alignItems="center">
          <StNickNameSpan>낙낙 님</StNickNameSpan>
          <StCommonRowBox alignItems="center" style={{marginRight:"5px"}}>
            <FontAwesomeIcon style={{color:"#979797", margin:"0 4px"}} icon={faMessage} />
            <StCountSpan>{data.commentCounts}</StCountSpan>
          </StCommonRowBox>
          <StCommonRowBox alignItems="center" style={{marginLeft:"5px"}}>
            <FontAwesomeIcon style={{color:"#979797", margin:"0 0 0 0"}} icon={faStar} />
            <StCountSpan style={{marginRight:"4px"}}>{data.challengeConts}</StCountSpan>
          </StCommonRowBox>
        </StCommonRowBox>
        
      </StCommonColumnBox>
    </StChallengeCardDiv>
  )
}

export default ChallengeCard;


const StChallengeCardDiv = styled.div`
  background: #ffffff;

  display:flex;
  flex-direction: row;

  width: 100%;
  border:1px solid gray;
  border-radius: 6px;
  padding: 14px 20px 7px 20px;
  margin: 5px 25px;

  box-sizing: border-box;
  cursor:pointer;
`

const StChallengeStateBtn = styled.button`
  
  background: none;

  border:none;
  outline:none;

  cursor:pointer;
`

const StChallengeNameSpan = styled.span`
  font-size: 22px;
  font-weight: 600;
  color:#979797;
  line-height: 32px;

  margin-right:auto;
`

const StNickNameSpan = styled.span`
  font-weight: 500;
  font-size:16px;
  line-height: 32px;
  color: ${props=>props.color || "#979797"};

  margin-right:auto;
`

const StMenuBtn = styled.button`
  background: none;
  font-size:16px;
  line-height: 32px;
  color:#979797;

  border:none;
  outline:none;

  cursor:pointer;
`

const StCountSpan = styled.span`
  font-size: 13px;
  font-weight: 500;
  line-height: 32px;
  color:#979797;

  margin: 0 8px;
`