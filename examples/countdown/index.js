import {
  Component,
  parse,
  compile,
  register
} from '../../src/index';

class CountdownBase extends Component {
  getProps() {
    return {
      total: 0,
      doneFn: null
    };
  }

  getData() {
    return {
      lastTime: null,
      timer: null
    };
  }

  start() {
    this.data.lastTime = Date.now();

    this.data.timer = setInterval(() => {
      if (this.props.total <= 0) {
        this.stop();

        return;
      }

      this.updateTime();
      this.renderTime();
    }, 10);
  }

  stop() {
    clearInterval(this.data.timer);
    this.data.timer = null;
  }

  updateTime() {
    let lastTime = this.data.lastTime,
        now = Date.now();

    this.props.total -= now - lastTime;

    this.data.lastTime = now;

    if (this.props.total < 100) {
      this.props.total = 0;
    }
  }

  renderTime() {
    let ret = this.calcTime(this.props.total);

    this.updateDay(ret.day);
    this.updateHour(ret.hour);
    this.updateMinute(ret.minute);
    this.updateSecond(ret.second);
    this.updateMillisecond(ret.millisecond);
  }

  calcTime(time) {
    let day, hour, minute, second, millisecond;

    day = Math.floor(time / (1000 * 3600 * 24));
    time -= day * 1000 * 3600 * 24;

    hour = Math.floor(time / (1000 * 3600));
    time -= hour * 1000 * 3600;

    minute = Math.floor(time / (1000 * 60));
    time -= minute * 1000 * 60;

    second = Math.floor(time / 1000);
    time -= second * 1000;

    millisecond = time;

    return {
      day: day,
      hour: hour,
      minute: minute,
      second: second,
      millisecond: millisecond
    };
  }

  updateMillisecond() {
    // do something
    //
  }

  updateSecond() {
    // do something
    //
  }
  updateMinute() {
    // do something
    //
  }

  updateHour() {
    // do something
    //
  }

  updateDay() {
    // do something
    //
  }
}


class Countdown extends CountdownBase {
  getData() {
    return Object.assign(super.getData(), {
      second: '',
      minute: '',
      color: '',
      status: 1, // 1:running 0:stop
      logs: []
    });
  }

  init() {
    this.start();
  }

  updateSecond(second) {
    if (second < 10) {
      second = '0' + second;
    }

    this.data.second = second;
  }

  updateMinute(minute) {
    if (minute < 10) {
      minute = '0' + minute;
    }

    this.data.minute = minute;
  }

  start() {
    super.start();

    this.data.status = 1;
  }

  stop() {
    super.stop();

    this.data.status = 0;
  }

  toggleCountdown($event) {
    $event.stopPropagation();

    if (this.data.status === 1) {
      this.stop();
    } else {
      this.start();
    }
  }

  renderLog(logs) {
    return logs.map(({
      minute,
      second
    }) =>
      `<li x-component="TimeRecord"
        minute="${minute}"
        second="${second}"
        x-class="selected:this.data.selected"
        x-click="this.data.selected = !this.data.selected"
        class="time-record">
        ${minute}:${second}
      </li>`
    )
    .join('');
  }

  removeSelectedLog() {
    let logs = this.childs
      .filter(child => !child.data.selected)
      .map(child => ({
        minute: child.props.minute,
        second: child.props.second
      }));

    this.data.logs = logs;
  }

  createLog() {
    let {minute, second} = this.data;

    this.data.logs.push({
      minute,
      second
    });
  }
}


class TimeRecord extends Component {
  getData() {
    return {
      selected: false
    };
  }

  getProps() {
    return {
      minute: 0,
      second: 0
    };
  }
}

/*
 * register components with the unique name
 * then you can use in your html
 */
register('Countdown', Countdown);
register('TimeRecord', TimeRecord);

/*
 * parse the body node and bootstrap
 */
document.addEventListener('DOMContentLoaded', () => {
  compile(parse(document.body));
});



