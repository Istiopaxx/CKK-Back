# Elevator Game

**Original** : 2019 블라인드 카카오 공채 코딩테스트 2차 문제
https://github.com/kakao-recruit/2019-blind-2nd-elevator

조금 변형하고 간소화하였습니다.
엘리베이터 제어 시스템을 구현하고 빠르게 수송하면 됩니다.

* * *

## 엘리베이터 시스템

엘리베이터 시스템은 다음과 같다.

#### Timestamp (시간)

- 엘리베이터 시스템은 가상의 시간을 사용하며 `timestamp`라 부른다.
- Timestamp는 0부터 시작하고 엘리베이터에 명령을 내릴 때 마다 1씩 증가한다.

#### Call (승객)

- 승객이 엘리베이터 탑승을 위해 보내는 요청, 방향 버튼을 누르는 행위를 call이라 표현한다.
  Call에는 탑승하려는 층과 목적지 층이 포함된다.
- 승객은 기다리는 층에서 엘리베이터 문이 열리면 탄다. 내리려는 층에서 엘리베이터 문이 열리면 내린다.

### 엘리베이터

- 엘리베이터는 여러 대가 존재하며 모두 사용할 수도 있고 일부만 사용해도 된다.
- 엘리베이터에 명령을 내려 각각의 엘리베이터를 층을 이동하거나 멈추고, 문을 열거나 닫을 수 있다.
- 엘리베이터는 정원이 있어 정해진 수 이상의 승객을 태울 수 없다.
- 엘리베이터에는 현재 상태를 표현하는 status가 있으며, 값으로는 `STOPPED`, `OPENED`, `UPWARD`, `DOWNWARD`가 있다.
- 사용할 수 있는 명령은 다음과 같다.

| 명령 | 설명 |
| ---- | ---- |
| `STOP` | 엘리베이터를 멈춘다. 현재 층에 머무르기 원하는 경우 `STOP` 명령을 통해 머무를 수 있다. |
| `UP` | 엘리베이터를 한 층 올린다. 최상층인 경우 현재 층을 유지한다. |
| `DOWN` | 엘리베이터를 한 층 내린다. 1층인 경우 1층을 유지한다. |
| `OPEN` | 엘리베이터의 문을 연다. 엘리베이터의 문이 열린 상태를 유지하기 위해서는 `OPEN` 명령을 사용한다. |
| `CLOSE` | 엘리베이터의 문을 닫는다. |

명령에 따른 status 전환을 그림과 표로 표현하면 아래와 같다.



| 명령 → <br> 다음 status ↘︎ <br> 현재 status ↓ | `STOP` | `OPEN` | `CLOSE` | `UP` | `DOWN` |
| :--: | :--: | :--: | :--: | :--: | :--: |
| `STOPPED` | `STOPPED` | `OPENED` | (오류) | `UPWARD` | `DOWNWARD` |
| `OPENED` | (오류) | `OPENED` | `STOPPED` | (오류) | (오류) |
| `UPWARD` | `STOPPED` | (오류) | (오류) | `UPWARD` | (오류) |
| `DOWNWARD` | `STOPPED` | (오류) | (오류) | (오류) | `DOWNWARD` |

* * *

## 제어 방법

- 제어는 HTTP API를 통해 이루어지며 데이터는 JSON 형식을 따른다.
- **Start API**로 엘리베이터 시스템 제어에 필요한 token과 엘리베이터 정보를 받을 수 있다.
  - Token의 유효 시간은 10분이다.
<!--
  - Token을 받은 후 10초 동안은 다시 새로운 token을 발급 받을 수 없다.
-->
  - 모든 승객의 수송을 완료하기 전에 token이 만료되면 수송은 실패로 처리한다.
  - 이후 모든 API 호출에는 token이 포함되어야 한다.
- **On Calls API**로 call의 목록과 각 엘리베이터의 상태를 받을 수 있다.
  - 현재 timestamp를 기준으로 미래에 발생하는 call은 포함하지 않는다. 따라서 `timestamp`가 바뀌면 call 목록이 늘어날 수 있다.
- **Action API**를 통해 각 엘리베이터에 명령을 실행할 수 있다.
  - 각 엘리베이터에 반드시 단 하나의 명령을 실행해야 한다.
- 각 API의 자세한 내용은 API REFERENCE 탭을 참조한다.

### 예시

제어 과정은 아래와 같은 의사코드로 표현할 수 있다.

```js
api.start()

loop
  api.on_calls()

  if is_finished?
    break

  foreach elevator : elevators
    switch elevator.status
      case 'STOPPED':
        // Do something : STOP, UP, DOWN, OPEN
      case 'UPWARD':
        // Do something : STOP, UP
      case 'DOWNWARD':
        // Do something : STOP, DOWN
      case 'OPENED':
        // Do something : OPEN, CLOSE, ENTER, EXIT
  end

  api.action()
end
```

예를 들어 1층에서 승객을 태워서 3층에 내려주는 엘리베이터 시스템의 상태와 명령을 표현하면 아래와 같다.

| Timestamp | Floor | Status | Command |
| - | - | --------- | ------- |
| 0 | 1 | `STOPPED` | `OPEN`  |
| 1 | 1 | `OPENED`  | `CLOSE` |
| 2 | 1 | `STOPPED` | `UP`    |
| 3 | 2 | `UPWARD`  | `UP`    |
| 4 | 3 | `UPWARD`  | `STOP`  |
| 5 | 3 | `STOPPED` | `OPEN`  |
| 6 | 3 | `OPENED`  | none    |

```text
   OPEN    CLOSE    UP     UP    STOP   OPEN
 0       1       2      3      4      5      6
| |     | |     | |    | |    |#|    |#|    :_:#
| |     | |     | |    |#|    | |    | |    | |
|_| #   :#:     |#|    | |    | |    | |    | |
```

이 경우 승객을 운반하기까지 걸린 최종 `timestamp`는 6 이다.