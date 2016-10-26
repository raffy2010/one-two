import {
  Component,
  parse,
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
    return {
      secondNode: null,
      minuteNode: null
    };
  }

  init() {
    this.data.secondNode = this.node.querySelector('.second_node');
    this.data.minuteNode = this.node.querySelector('.minute_node');

    this.start();
  }

  updateSecond(second) {
    if (second < 10) {
      second = '0' + second;

    }

    this.data.secondNode.innerHTML = second;
  }

  updateMinute(minute) {
    if (minute < 10) {
      minute = '0' + minute;
    }

    this.data.minuteNode.innerHTML = minute;
  }
}


/*
 * register components with the unique name
 * then you can use in your html
 */
register('Countdown', Countdown);

/*
 * parse the body node and bootstrap
 */
document.addEventListener('DOMContentLoaded', () => {
  parse(document.body);
});



