import { useEffect } from "react";
import { useState } from "react";
import { Calendar } from "react-calendar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"
import { getSetUpMyTodoFetch } from "../../../app/modules/mytodosSlice";

function SetToDoContainer () {
  // 선택된 달과 요일에 따라 값을 보여주기 위해 만든 배열
  const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const weekOfDayList = ["Sunday", "Monday", "Tuesday", "Wendesday", "Thursday", "Friday", "Saturday"]

  // 날짜를 적용해주는 상태
  const [calendar, setCalendar] = useState(new Date());
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 선택한 날짜에 따라 내용들을 다시 불러올 수 있도록 함.
  const myTodosState = useSelector(state => state.mytodos);

  // 기록 확인을 허용해주기 위해 필요한 3개월 전 날짜
  let mindate = new Date()
  mindate.setMonth(mindate.getMonth() -3)
  //   date:”yyyy-mm-dd”
  useEffect(() => {
    const selectYear = calendar.getFullYear();
    const selectMonth = calendar.getMonth() < 9 ? "0" + (calendar.getMonth() +1) : calendar.getMonth() + 1
    const selectDay = calendar.getDate() < 10 ? "0" + calendar.getDate() : calendar.getDate();
    const selectDate = {date: `${selectYear}-${selectMonth}-${selectDay}` }
    dispatch(getSetUpMyTodoFetch(selectDate));
  }, [calendar])

  console.log(myTodosState)
  // 도전하러 가기 클릭 시, 피드 선택 화면 출력
  function moveToSelectFeed () {
    navigate('/feed')
  }

  // 작성하러 가기 클릭 시, TODO 작성 화면 출력
  function moveToWriteTodo () {
    navigate('/mytodos')
  }

  // 팔로잉, 팔로워 클릭 시, 팔로잉/팔로워 리스트 화면 출력
  function moveToFollowList () {
    navigate('/follow')
  }

  return (
    <StCommonColumnContainer>
      <StMyProfileSec>
        <StMyImageBox>
          <StMyImage src="https://livedoor.blogimg.jp/youngjumpkatan/imgs/3/a/3a50d74c.jpg" />
        </StMyImageBox>
        <StMyProfileDiv>
          <h3 style={{margin:0, marginBottom:"0.5rem"}}>신도윤 님</h3>
          <p style={{margin:0, color:"gray"}}>ENFP</p>
        </StMyProfileDiv>
        <StMyFollowStat>
          <StFollowStatBtn onClick={moveToFollowList}>
            <span style={{marginBottom:"6px", fontSize:"20px"}}>10</span>
            <span style={{fontSize:"13px"}}>팔로잉</span>
          </StFollowStatBtn>
          <StFollowStatBtn onClick={moveToFollowList}>
            <span style={{marginBottom:"6px", fontSize:"20px"}}>15</span>
            <span style={{fontSize:"13px"}}>팔로워</span>
          </StFollowStatBtn>
        </StMyFollowStat>
      </StMyProfileSec>
      
      <CalendarContainer>
        {/* onchange를 통해 선택한 날짜를 저장 -> value를 통해 선택한 날짜를 받아옴. */}
        {/* maxDate를 통해 선택할 수 있는 최대 날짜(금일), minDate를 통해 선택할 수 있는 최소 날짜 설정 가능 */}
        <Calendar value={calendar} onChange={setCalendar} maxDate={new Date()} minDate={mindate}/>
      </CalendarContainer>

      <StTodayBox>
        <StCommonText margin="28px 0 0 0" fontSize="15px">TODAY</StCommonText>
        <StCommonRowBox>
          {/* getDay()는 배열인 관계로 0 = 일요일이기 때문에 앞서 weekOfDayList 배열을 만들어 이렇게 받아옴. */}
          <StDayWeekOfDaySpan>{weekOfDayList[calendar.getDay()]}</StDayWeekOfDaySpan>
          <span style={{color:"#979797", margin:"0 12px", fontSize:"20px", fontWeight:"600"}} >·</span>
          {/* 1~9는 숫자 앞에 0이 붙도록 설정 */}
          <StDayDateSpan>{ calendar.getDate() < 10 ? "0" + calendar.getDate() : calendar.getDate() }</StDayDateSpan>
          {/* getMonth()는 배열인 관계로 0 = 1월이기 때문에 앞서 monthList 배열을 만들어 이렇게 받아옴. */}
          <StDayMonthSpan>{monthList[calendar.getMonth()]}</StDayMonthSpan>
        </StCommonRowBox>
      </StTodayBox>

      <StCommonBorder margin="0 25px" />

      <StChallengeToDoBox>
        <StCommonText margin="0 0 14px 0" fontSize="18px">오늘의 TO DO</StCommonText>
        <StSetToDoBtn onClick={moveToSelectFeed}>도전하러 가기</StSetToDoBtn>
      </StChallengeToDoBox>

      <StMakingToDoBox>
        <StCommonText margin="0 0 14px 0" fontSize="18px">내가 만든 TO DO</StCommonText>
        <StSetToDoBtn onClick={moveToWriteTodo}>제안하러 가기</StSetToDoBtn>
      </StMakingToDoBox>

    </StCommonColumnContainer>
  )
}

export default SetToDoContainer;

const StCommonColumnContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 500px;

  margin:80px auto 128px auto;

  width:500px;
  box-sizing: border-box;
`

const StMyProfileSec = styled.div`
  display: flex;
  flex-direction: row;
  justify-content:flex-start;
  align-items: center;
  
  margin: 1rem 0;
`

const StMyImageBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: none;
  border-radius: 50%;
  margin: 0 26px;

  height: 80px;
  width: 80px;
  overflow: hidden;
`

const StMyImage = styled.img`
  height:96px;
  width: 96px;

`

const StMyProfileDiv = styled.div`
  display: flex;
  flex-direction: column;

  text-align: left;

  margin-right: 38px;
`

const StMyFollowStat = styled.div`
  display: flex;
  flex-direction: row;
`

const StFollowStatBtn = styled.button`
  background: none;

  display:flex;
  flex-direction:column;
  align-items: center;

  text-align:center;

  border: none;
  outline: none;
  margin:0 37px;

  cursor:pointer;
`

const CalendarContainer = styled.div`
  .react-calendar {
    width: 500px;
    /* max-width: 100%; */
    background: white;
    /* border: 1px solid #a0a096; */
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.125em;
  }
  .react-calendar--doubleView {
    width: 700px;
  }
  .react-calendar--doubleView .react-calendar__viewContainer {
    display: flex;
    margin: -0.5em;
  }
  .react-calendar--doubleView .react-calendar__viewContainer > * {
    width: 50%;
    margin: 0.5em;
  }
  .react-calendar,
  .react-calendar *,
  .react-calendar *:before,
  .react-calendar *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
  }
  .react-calendar button:enabled:hover {
    cursor: pointer;
  }
  .react-calendar__navigation {
    display: flex;
    height: 44px;
    margin-bottom: 1em;
  }
  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
  }
  .react-calendar__navigation button:disabled {
    background-color: #f0f0f0;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #e6e6e6;
  }
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75em;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }
  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75em;
    font-weight: bold;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #d10000;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575;
  }
  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
  }
  .react-calendar__tile {
    max-width: 100%;
    padding: 10px 6.6667px;
    background: none;
    text-align: center;
    line-height: 16px;
  }
  .react-calendar__tile:disabled {
    background-color: #f0f0f0;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #e6e6e6;
  }
  .react-calendar__tile--now {
    background: #ffff76;
  }
  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: #ffffa9;
  }
  .react-calendar__tile--hasActive {
    background: #76baff;
  }
  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: #a9d4ff;
  }
  .react-calendar__tile--active {
    background: #006edc;
    color: white;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #1087ff;
  }
  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: #e6e6e6;
  }

`

const StCommonText = styled.div`
  font-size: ${props=> props.fontSize};
  font-weight: 500;
  color: #000000;

  margin: ${props => props.margin};
  height: 32px;
`

const StTodayBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align:left;

  margin-left: 25px;
  margin-bottom: 10px;
`

const StCommonRowBox = styled.div`
  display: flex;
  flex-direction: row;
  
`

const StDayWeekOfDaySpan = styled.span`
  display: inline-block;

  font-size: 20px;
  font-weight: 600;
  color: #979797;

  height: 32px;
`

const StDayDateSpan = styled.span`
    display: inline-block;

  font-size: 20px;
  font-weight: 300;
  color: #979797;

  margin-right: 12px;

  height: 32px;
`

const StDayMonthSpan = styled.span`
  display: inline-block;

  font-size:20px;
  font-weight:300;
  color: #979797;

  height: 32px;
`

const StCommonBorder = styled.div`
  height: 1px;
  background: gray;
  margin: ${props => props.margin};
`

const StChallengeToDoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin: 20px 25px;
  
`

const StMakingToDoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin: 20px 25px;
  
`

const StSetToDoBtn = styled.button`
  background: none;

  display: block;

  font-size: 24px;
  font-weight: 600;
  color: #979797;

  border: 1px solid #979797;
  border-radius: 6px;
  outline: none;

  width: 450px;
  height: 102px;

  cursor:pointer;
`