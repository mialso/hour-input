import React, { PropTypes } from 'react'
// import moment from 'moment'

const HourPicker = React.createClass({
  getInitialState () {
    return { minutes: 0, mouseMode: true, minutesReady: false, hours: 9, hoursReady: false, hoursString: '09', splitter: ':', minutesString: '00', background: 'none' }
  },
  propTypes: {
    placeholder: PropTypes.string
  },
  updateTime (newMinutes) {
    let hours = this.state.hours
    let minutes = this.state.minutes + newMinutes
    if (minutes < 0) {
      --hours
      minutes = 60 + minutes
    } else {
      if (minutes > 59) {
        ++hours
        minutes = minutes - 60
      }
    }
    this.updateHours(hours)
    this.updateMinutes(minutes)
  },
  updateHours (newHours, clean = false) {
    if (clean) {
      if (newHours.toString().length < 2 && newHours > 2) {
        this.setState({hours: newHours, hoursString: `0${newHours}`, hoursReady: false, splitter: ''})
      } else {
        this.setState({hours: newHours, hoursString: newHours.toString(), hoursReady: true, splitter: ''})
      }
      return
    }
    if (newHours > 23) newHours = 0
    if (newHours < 0) newHours = 23
    if (newHours.toString().length < 2) {
      if (this.state.mouseMode) {
        this.setState({hours: newHours, hoursString: `0${newHours.toString()}`, hoursReady: true})
      } else {
        // if (newHours === 0 && (this.state.hoursString === '0' || this.state.hoursString === '00')) {
        if (this.state.hoursString === '0') {
          this.setState({hours: 0, hoursString: `0${newHours}`, hoursReady: true, splitter: ':'})
          return
        }
        if (newHours <= 2) {
          if (this.state.hoursString.charAt(0) === '0' && newHours > 0) {
            this.setState({hours: newHours, hoursString: `0${newHours}`, splitter: ':', hoursReady: true})
          } else {
            this.setState({hours: newHours, hoursString: newHours.toString(), splitter: '', hoursReady: false})
          }
        }
        if (newHours > 2) this.setState({hours: newHours, hoursString: `0${newHours.toString()}`, splitter: ':', hoursReady: true})
      }
    } else {
      this.setState({hours: newHours, hoursString: newHours.toString(), hoursReady: true, splitter: ':'})
      console.log('hours set with splitter')
    }
  },
  updateMinutes (newMinutes, clean = false) {
    if (clean) {
      this.setState({minutes: 0, minutesReady: false, minutesString: ''})
      return
    }
    if (newMinutes > 59) newMinutes = 59
    if (newMinutes < 0) newMinutes = 0
    if (newMinutes.toString().length < 2) {
      if (this.state.mouseMode) {
        this.setState({minutes: newMinutes, minutesString: `0${newMinutes.toString()}`, minutesReady: true})
      } else {
        // if (newMinutes === 0 && this.state.minutesString === '0') {
        if (this.state.minutesString === '0') {
          this.setState({minutes: 0, minutesString: `0${newMinutes}`, minutesReady: true})
          return
        }
        if (!this.state.hoursReady) this.setState({minutesString: '', minutesReady: false})
        if (newMinutes < 6) {
          if (this.state.minutesString.charAt(0) === '0' && newMinutes > 0) {
            this.setState({minutes: newMinutes, minutesString: `0${newMinutes}`, minutesReady: true})
          } else {
            this.setState({minutes: newMinutes, minutesString: `${newMinutes.toString()}`, minutesReady: false})
          }
        }
        if (newMinutes >= 6) this.setState({minutes: newMinutes, minutesString: `0${newMinutes.toString()}`, minutesReady: true})
      }
    } else {
      this.setState({minutes: newMinutes, minutesReady: true, minutesString: `${newMinutes.toString()}`})
    }
  },
  updateTimeString () {
  },
  mouseWheelHandler (ev) {
    console.log(`mouse wheel handler: ${ev.deltaY}`)
    ev = ev || window.event
    if (ev.preventDefault) {
      ev.preventDefault()
    }
    ev.returnValue = false
    ev.deltaY < 0 ? this.updateTime(15) : this.updateTime(-15)
  },
  inputHandler (ev) {
    console.log(`input handler: ${ev.target.value}`)
    const data = ev.target.value.split(':')
    const hoursString = (this.state.hoursString.length === 2 && this.state.hoursString !== data[0]) ? data[0].replace(this.state.hoursString, '') : data[0]
    console.log(`hoursString=${hoursString}`)
    if (hoursString !== this.state.hoursString || !ev.target.value.includes(':')) {
      if (hoursString === '') {
        this.setState(
          {
            hours: 0,
            hoursString: '',
            hoursReady: false,
            minutes: 0,
            minutesString: '',
            minutesReady: false,
            splitter: ''
          }
        )
        return
      }
      const hours = Number.parseInt(hoursString)
      if (Number.isNaN(hours)) return
      console.log(`inputHandler hours=${hours}`)
      if (data.length < 2 || data[1] === '') {
        this.updateHours(hours, this.state.splitter === ':')
        this.updateMinutes(0, true)
        return
      }

      this.updateHours(hours)
    }
    const minutesString = (this.state.minutesString.length === 2 && this.state.minutesString !== data[0]) ? data[1].replace(this.state.minutesString, '') : data[1]
    console.log(`inputHandler minutesString=${minutesString}`)

    if (minutesString !== this.state.minutesString) {
      if (minutesString === '') {
        this.updateMinutes(0, true)
      } else {
        const minutes = Number.parseInt(minutesString)
        if (Number.isNaN(minutes)) return
        this.updateMinutes(minutes)
      }
    }
  },
  focusHandler (ev) {
    console.log('focus handler')
    ev.target.removeEventListener('wheel', this.mouseWheelHandler)
    ev.target.removeEventListener('mouseenter', this.mouseInHandler)
    ev.target.removeEventListener('mouseleave', this.mouseOutHandler)
    ev.target.addEventListener('input', this.inputHandler)
    this.setState({background: 'green', mouseMode: false})
  },
  blurHandler (ev) {
    console.log('blur handler')
    ev.target.addEventListener('wheel', this.mouseWheelHandler)
    ev.target.addEventListener('mouseenter', this.mouseInHandler)
    ev.target.addEventListener('mouseleave', this.mouseOutHandler)
    ev.target.removeEventListener('input', this.inputHandler)
    if (this.state.hoursString.length !== 2) {
      this.setState({hours: 0, hoursReady: true, hoursString: '00', splitter: ':'})
    }
    if (this.state.minutesString.length !== 2) {
      this.setState({minutes: 0, minutesString: '00', minutesReady: true, splitter: ':'})
    }
    this.setState({background: 'none', mouseMode: true})
  },
  mouseInHandler () {
    console.log('mouseInHandler')
    this.setState({background: 'pink'})
  },
  mouseOutHandler () {
    console.log('mouseOutHandler')
    this.setState({background: 'none'})
  },
  componentDidMount () {
    console.log('Hour picker did mount')
    const input = this.refs.timeInput
    input.addEventListener('wheel', this.mouseWheelHandler)
    input.addEventListener('mouseenter', this.mouseInHandler)
    input.addEventListener('mouseleave', this.mouseOutHandler)
  },
  render () {
    const { placeholder } = this.props
    return (
      <div>
        <input ref='timeInput' type='text' placeholder={placeholder} style={{background: this.state.background}}
          value={`${this.state.hoursString}${this.state.splitter}${this.state.minutesString}`}
          onFocus={this.focusHandler}
          onBlur={this.blurHandler}
          />
        <span>{this.state.mouseMode ? 'mouse mode' : 'input mode'}</span>
      </div>
    )
  }
})

export default HourPicker
