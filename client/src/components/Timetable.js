import React, { Component } from 'react';
import mainStyles from './Main.module.css';
import styles from './LeaveApplication.module.css';
import loginStyles from '../Login.module.css';
import tableStyles from './common/tableStyles.module.css';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateCurrentRouteTitle } from '../actions/utilActions';
import { getTimetable } from '../actions/timetableActions';
import classNames from 'classnames/bind';
import axios from 'axios';
//import Select, { createFilter } from 'react-select';
import Slot from './common/Slot';
import Spinner from './common/Spinner';

const cx = classNames.bind({ ...mainStyles, ...styles, ...loginStyles });

class Timetable extends Component {
  state = {
    isSubmitting: false,
    errors: {},
    classCode: '',
    isTableLoaded: false,
    isEntryVisible: false,
    isEditEntry: false,
    entryContent: {
      start: '',
      duration: '1',
      title: '',
      day: '',
      entry: [
        {
          courseCode: '',
          handlingStaff: '',
          additionalStaff: ''
        },
        {
          courseCode: '',
          handlingStaff: '',
          additionalStaff: ''
        }
      ]
    },
    timetable: [
      [
        {
          start: 1,
          duration: 4,
          courseCode: 'CA7001',
          handlingStaff: 'abcd',
          additionalStaff: ['1234', 'sjdfhsdf']
        }
      ],
      [
        {
          start: 1,
          duration: 4,
          courseCode: 'CA7001',
          handlingStaff: 'abcd',
          additionalStaff: ['1234', 'sjdfhsdf']
        }
      ],
      [
        {
          start: 1,
          duration: 1,
          courseCode: 'CA7001',
          handlingStaff: 'abcd',
          additionalStaff: ['1234', 'sjdfhsdf']
        },
        {
          start: 2,
          duration: 4,
          courseCode: 'CA7001',
          handlingStaff: 'abcd',
          additionalStaff: ['1234', 'sjdfhsdf']
        },
        {
          start: 6,
          duration: 3,
          courseCode: 'CA7001',
          handlingStaff: 'abcd',
          additionalStaff: ['1234', 'sjdfhsdf']
        }
      ],
      [
        {
          start: 1,
          duration: 4,
          courseCode: 'CA7001',
          handlingStaff: 'abcd',
          additionalStaff: ['1234', 'sjdfhsdf']
        }
      ],
      [
        {
          start: 1,
          duration: 4,
          courseCode: 'CA7001',
          handlingStaff: 'abcd',
          additionalStaff: ['1234', 'sjdfhsdf']
        }
      ]
    ],
    nameOfClass: ''
  };

  componentDidMount = () => {
    this.props.updateCurrentRouteTitle('Timetable');
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.errors) {
      this.setState({
        ...this.state,
        errors: nextProps.errors,
        isSubmitting: false
      });
    }
  };

  formSubmitHandler = event => {
    this.setState({ ...this.state, isSubmitting: true });
    event.preventDefault();
  };

  entryOnChangeHandler = (event, index) => {
    let arr = this.state.entryContent.entry.slice(0);
    arr[index][event.target.name] = event.target.value;
    this.setState({
      ...this.state,
      entryContent: {
        ...this.state.entryContent,
        entry: arr
      }
    });
  };

  entryStartDurationHandler = event => {
    this.setState({
      ...this.state,
      entryContent: {
        ...this.state.entryContent,
        [event.target.name]: event.target.value
      }
    });
  };

  inputOnChangeHandler = event => {
    /* if (event.target.name === 'classCode') {
      if (event.target.value !== '') {
        let tempObj = {
          classCode: event.target.value
        };
        this.props.getTimetable(tempObj);
      }
    } */
    this.setState({ [event.target.name]: event.target.value });
  };

  testClickHandler = event => {
    event.preventDefault();
    let newTimetable = {};
    newTimetable.classCode = 'BT3G';
    newTimetable.classId = this.props.classes.classList.find(
      x => x.classCode === 'BT3G'
    )._id;
    let day = [];
    for (let i = 1; i <= 5; i++) {
      let today = [];
      for (let j = 1; j <= 8; j++) {
        let hour = {};
        hour.courseCode = this.props.courses.courseList.find(
          x => x.courseCode === 'CA7001'
        )._id;
        hour.handlingStaffId = this.props.staff.staffList.find(
          x => x.staffId === '12345'
        )._id;
        hour.additionalStaffId = [];
        hour.additionalStaffId.push(
          this.props.staff.staffList.find(x => x.staffId === '12345')._id
        );
        today.push(hour);
      }
      day.push(today);
    }
    newTimetable.timetable = day;
    console.log(newTimetable);
    axios
      .post('/api/timetable/add-timetable', newTimetable)
      .then(timetable => console.log(timetable))
      .catch(err => console.log(err));
  };

  addNewEntry = event => {
    this.setState({
      ...this.state,
      isEntryVisible: true,
      isEditEntry: false,
      entryContent: {
        title: `Add new entry - ${this.days[event.target.getAttribute('day')]}`,
        day: event.target.getAttribute('day'),
        start: event.target.getAttribute('hour'),
        duration: 1,
        entry: [
          {
            courseCode: '',
            handlingStaff: '',
            additionalStaff: ''
          }
        ]
      }
    });
    //this.props.newEntryHandler({});
  };

  editExistingEntry = event => {
    let row = parseInt(event.target.getAttribute('day'));
    let col = parseInt(event.target.getAttribute('hour'));

    //console.log(row);
    //console.log(
    //  this.state.timetable[row].find(x => x.start === parseInt(col)).start
    //);

    let start = this.state.timetable[row].find(x => x.start === parseInt(col))
      .start;
    let duration = this.state.timetable[row].find(
      x => x.start === parseInt(col)
    ).duration;
    let courseCode = this.state.timetable[row].find(
      x => x.start === parseInt(col)
    ).courseCode;
    let handlingStaff = this.state.timetable[row].find(
      x => x.start === parseInt(col)
    ).handlingStaff;
    let additionalStaff = this.state.timetable[row].find(
      x => x.start === parseInt(col)
    ).additionalStaff;

    this.setState({
      ...this.state,
      isEntryVisible: true,
      isEditEntry: true,
      entryContent: {
        title: `Edit entry - ${this.days[row]}`,
        day: event.target.getAttribute('day'),
        start,
        duration,
        entry: [
          {
            courseCode,
            handlingStaff,
            additionalStaff
          }
        ]
      }
    });
  };

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  newEntrySubmitHandler = event => {
    event.preventDefault();
    const newTimetable = this.state.timetable.slice(0);
    let newDay = newTimetable[this.state.entryContent.day].slice(0);

    let newHour = {
      start: parseInt(this.state.entryContent.start),
      duration:
        parseInt(this.state.entryContent.start) +
          parseInt(this.state.entryContent.duration) >
        8
          ? parseInt(this.state.entryContent.duration) -
            (parseInt(this.state.entryContent.start) +
              parseInt(this.state.entryContent.duration) -
              8) +
            1
          : parseInt(this.state.entryContent.duration),
      courseCode: this.state.entryContent.entry[0].courseCode,
      handlingStaff: this.state.entryContent.entry[0].handlingStaff,
      additionalStaff: this.state.entryContent.entry[0].additionalStaff
    };

    if (this.state.isEditEntry) {
      let toRemoveIndex = 0;
      newDay.map((x, index) => {
        if (x.start === this.state.entryContent.start) {
          toRemoveIndex = index;
          return;
        }
      });

      newDay[toRemoveIndex] = newHour;
      newTimetable[this.state.entryContent.day] = newDay;
      this.setState({
        ...this.state,
        timetable: newTimetable,
        isEntryVisible: false,
        isEditEntry: false,
        entryContent: {
          entry: []
        }
      });
    } else {
      /* if (toRemoveIndex !== -1) {
        newDay = newDay.filter((x, index) => index !== toRemoveIndex);
      } */
      let hourStart = parseInt(this.state.entryContent.start);
      let hourEnd =
        parseInt(this.state.entryContent.start) +
        parseInt(this.state.entryContent.duration);
      let toRemoveIndexes = [];
      let leftOverlap = -1;
      let rightOverlap = -1;
      newDay.map((hour, index) => {
        let tempStart = hour.start;
        let tempEnd = hour.start + hour.duration;
        if (tempStart >= hourStart && tempEnd <= hourEnd) {
          toRemoveIndexes.push(index);
        } else if (hourEnd >= tempStart && hourEnd < tempEnd) {
          leftOverlap = index;
        } else if (hourStart >= tempStart && hourStart < tempEnd) {
          rightOverlap = index;
        }
      });

      if (leftOverlap !== -1) {
        newDay[leftOverlap].duration =
          newDay[leftOverlap].duration - (hourEnd - newDay[leftOverlap].start);
        newDay[leftOverlap].start = hourEnd + 1 > 8 ? 8 : hourEnd;
      }

      if (rightOverlap !== -1) {
        newDay[rightOverlap].duration =
          newDay[rightOverlap].duration -
          (newDay[rightOverlap].start +
            newDay[rightOverlap].duration -
            hourStart);
      }

      if (toRemoveIndexes.length !== 0) {
        if (
          !window.confirm(
            'Your entry is overlapping with existing entries. Do you wish to proceed?'
          )
        )
          return;
      }

      for (let i = toRemoveIndexes.length - 1; i >= 0; i--)
        newDay.splice(toRemoveIndexes[i], 1);

      newDay.splice(newDay.length - 1, 0, newHour);
      newDay.sort((a, b) => a.start - b.start);
      newTimetable[this.state.entryContent.day] = newDay;
      this.setState({
        ...this.state,
        timetable: newTimetable,
        isEntryVisible: false,
        isEditEntry: false,
        entryContent: { entry: [] }
      });
    }
  };

  addAdditionalCourseClickHandler = event => {
    event.preventDefault();
    let arr = this.state.entryContent.entry.slice(0);
    arr.push({ courseCode: '', handlingStaff: '', additionalStaff: '' });
    this.setState({
      ...this.state,
      entryContent: { ...this.state.entryContent, entry: arr }
    });
  };

  render() {
    const errors = this.state.errors;
    const isDarkTheme = this.props.isDarkTheme;

    let slots = [];
    let row;
    for (row = 0; row < 5; row++) {
      let hours = [];
      hours.push(<td style={{ textAlign: 'left' }}>{this.days[row]}</td>);
      let tempIndex = 1;
      this.state.timetable[row].map((hour, index) => {
        if (hour.start !== tempIndex) {
          while (hour.start - tempIndex > 0) {
            hours.push(
              <td
                key={tempIndex}
                onClick={this.addNewEntry}
                day={row}
                hour={tempIndex}
                className={tableStyles.hoverableTd}
              />
            );
            tempIndex++;
          }
        }
        hours.push(
          <Slot
            onClick={this.editExistingEntry}
            day={row}
            hour={tempIndex}
            key={tempIndex}
            colSpan={
              hour.start + hour.duration - tempIndex === 0
                ? 1
                : hour.start + hour.duration - tempIndex
            }>
            {hour.courseCode}
          </Slot>
        );
        tempIndex +=
          hour.start + hour.duration - tempIndex === 0
            ? 1
            : hour.start + hour.duration - tempIndex;
      });
      while (tempIndex < 9) {
        hours.push(
          <td
            key={tempIndex}
            hour={tempIndex}
            day={row}
            onClick={this.addNewEntry}
            className={tableStyles.hoverableTd}
          />
        );
        tempIndex++;
      }
      slots.push(<tr>{hours}</tr>);
    }

    const filterConfig = {
      ignoreCase: true,
      ignoreAccents: true,
      trim: true,
      matchFrom: 'any'
    };

    const customStyles = {
      menu: (provided, state) => ({
        ...provided,
        minWidth: '100px'
      }),
      menuList: (provided, state) => ({
        ...provided,
        paddingBottom: 0,
        paddingTop: 0
      }),
      option: (provided, state) => ({
        backgroundColor: 'transparent',
        cursor: 'default',
        display: 'block',
        fontSize: 'inherit',
        textAlign: 'left',
        padding: '6px',
        boxSizing: 'border-box',
        overflowX: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        '&:hover': {
          backgroundColor: 'rgba(79, 84, 92, 0.1)'
        },
        color: '#4f545c'
      }),
      control: (provided, state) => ({
        alignItems: 'left',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        outline: '0 !important',
        position: 'relative',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.1)' : '#fff',
        color: '#fff',
        borderColor: state.isFocused ? '#7289da' : 'rgba(0, 0, 0, 0.3)',
        '&:hover': {
          borderColor: state.isFocused ? '#7289da' : '#040405'
        },
        borderRadius: '3px',
        borderStyle: 'solid',
        borderWidth: '1px',
        boxSizing: 'border-box',
        transition: 'background-color 0.15s ease, border 0.15s ease'
      }),
      singleValue: (provided, state) => ({
        overflow: 'hidden',
        marginLeft: 0,
        position: 'absolute',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        top: '50%',
        transform: 'translateY(-50%)'
      }),
      input: (provided, state) => ({
        color: isDarkTheme ? '#fff' : '#4f545c'
      }),
      clearIndicator: () => ({
        display: 'none'
      }),
      indicatorSeparator: () => ({
        display: 'none'
      }),
      singleValue: (provided, state) => ({
        ...provided,
        color: isDarkTheme ? 'hsla(0, 0%, 100%, 0.8)' : '#4f545c'
      }),
      dropdownIndicator: (provided, state) => ({
        display: 'flex',
        padding: '6px',
        color: isDarkTheme ? '#fff' : '#4f545c',
        opacity: '0.6'
      }),
      valueContainer: (provided, state) => ({
        ...provided,
        width: '50px'
      })
    };

    let classOptions = [];
    if (
      typeof this.props.courses === 'undefined' ||
      (Object.keys(this.props.courses).length === 0 &&
        this.props.courses.constructor === Object) ||
      this.props.courses.courseList === [] ||
      this.props.courses.loading
    ) {
      classOptions = [];
    } else {
      this.props.courses.courseList.map(item => {
        let temp = {
          value: item.courseCode,
          label: `${item.courseCode} - ${item.nameOfCourse}`
        };
        classOptions.push(temp);
      });
    }

    let entryStyles = [];
    entryStyles.push(styles.entry);
    entryStyles.push(mainStyles.marginBottom20);
    entryStyles.push(styles.formItemWrapper);

    if (this.state.isEntryVisible) {
      entryStyles.push(styles.entryVisible);
    }

    return (
      <div
        className={
          isDarkTheme
            ? `${mainStyles.scrollWrapper}`
            : `${mainStyles.scrollWrapper} ${mainStyles.lightTheme} ${
                styles.lightTheme
              }`
        }>
        <div className={mainStyles.contentWrapper}>
          <div className={mainStyles.body}>
            <div className={`${styles.formWrapper}`}>
              <div className={`${styles.formText} ${styles.formItemWrapper}`}>
                <div
                  style={{
                    flex: '1 1 auto',
                    marginLeft: 0,
                    marginRight: 0,
                    width: '100%'
                  }}>
                  <h4 className={styles.formTitle}>Timetable</h4>
                  <div className={styles.formSubtitle}>
                    Add/Change timetables from here.
                  </div>
                </div>
              </div>
              <form
                onSubmit={this.formSubmitHandler}
                className={styles.formBody}>
                <div
                  className={`${mainStyles.marginBottom20} ${
                    styles.formItemWrapper
                  }`}>
                  <h5
                    className={cx({
                      formFieldLabel: true,
                      marginBottom8: true,
                      errorLabel: errors.classCode
                    })}>
                    Class Code
                    {errors.category ? (
                      <span className={loginStyles.errorMessage}>
                        {' '}
                        - {errors.category}
                      </span>
                    ) : null}
                  </h5>
                  <div className={styles.inputWrapper}>
                    <select
                      onBlur={this.onBlur}
                      onChange={this.inputOnChangeHandler}
                      name="classCode"
                      value={this.state.classCode}
                      className={cx({
                        formInput: true,
                        formSelect: true,
                        formInputError: errors.classCode
                      })}>
                      <option disabled>Select class code</option>
                      {typeof this.props.classes === 'undefined' ||
                      (Object.keys(this.props.classes).length === 0 &&
                        this.props.classes.constructor === Object) ||
                      this.props.classes.classList === null ||
                      this.props.classes.loading ? (
                        <option>Loading...</option>
                      ) : (
                        this.props.classes.classList.map(item => (
                          <option
                            key={item.classCode}
                            value={item.classCode}>{`${item.classCode} - ${
                            item.nameOfClass
                          }`}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                <div className={entryStyles.join(' ')}>
                  <h5
                    className={cx({
                      formFieldLabel: true,
                      marginBottom8: true,
                      errorLabel: errors.classCode
                    })}>
                    Add Entry
                    {errors.category ? (
                      <span className={loginStyles.errorMessage}>
                        {' '}
                        - {errors.category}
                      </span>
                    ) : null}
                  </h5>
                  <div
                    className={`${styles.formItemRow} ${
                      mainStyles.marginBottom8
                    }`}>
                    <div className={styles.formItemRowChild}>
                      <h5
                        className={`${styles.formFieldLabel} ${
                          mainStyles.marginBottom8
                        }`}>
                        Start Hour
                      </h5>
                      <div className={styles.inputWrapper}>
                        <select
                          onBlur={this.onBlur}
                          onChange={this.entryStartDurationHandler}
                          name="start"
                          value={this.state.entryContent.start}
                          className={cx({
                            formInput: true,
                            formSelect: true,
                            formInputError: errors.classCode
                          })}>
                          <option disabled>Select class code</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                          <option>7</option>
                          <option>8</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formItemRowChild}>
                      <h5
                        className={`${styles.formFieldLabel} ${
                          mainStyles.marginBottom8
                        }`}>
                        Duration
                      </h5>
                      <div className={styles.inputWrapper}>
                        <input
                          className={`${styles.formInput}`}
                          type="text"
                          onChange={this.entryStartDurationHandler}
                          name="duration"
                          value={this.state.entryContent.duration}
                        />
                      </div>
                    </div>
                  </div>
                  {this.state.entryContent.entry.map((entry, index) => {
                    return (
                      <div
                        className={`${styles.formItemRow} ${
                          mainStyles.marginBottom8
                        }`}>
                        <div className={styles.formItemRowChild}>
                          <h5
                            className={`${styles.formFieldLabel} ${
                              mainStyles.marginBottom8
                            }`}>
                            Course Code
                          </h5>
                          <div className={styles.inputWrapper}>
                            <input
                              className={`${styles.formInput}`}
                              type="text"
                              onChange={e =>
                                this.entryOnChangeHandler(e, index)
                              }
                              name="courseCode"
                              value={
                                this.state.entryContent.entry[index].courseCode
                              }
                            />
                          </div>
                        </div>
                        <div className={styles.formItemRowChild}>
                          <h5
                            className={`${styles.formFieldLabel} ${
                              mainStyles.marginBottom8
                            }`}>
                            Handling Staff
                          </h5>
                          <div className={styles.inputWrapper}>
                            <input
                              className={`${styles.formInput}`}
                              type="text"
                              onChange={e =>
                                this.entryOnChangeHandler(e, index)
                              }
                              name="handlingStaff"
                              value={
                                this.state.entryContent.entry[index]
                                  .handlingStaff
                              }
                            />
                          </div>
                        </div>
                        <div className={styles.formItemRowChild}>
                          <h5
                            className={`${styles.formFieldLabel} ${
                              mainStyles.marginBottom8
                            }`}>
                            Additional Staff
                          </h5>
                          <div className={styles.inputWrapper}>
                            <input
                              className={`${styles.formInput}`}
                              type="text"
                              onChange={e =>
                                this.entryOnChangeHandler(e, index)
                              }
                              name="additionalStaff"
                              value={
                                this.state.entryContent.entry[index]
                                  .additionalStaff
                              }
                            />
                          </div>
                        </div>
                        <div
                          className={`${styles.formItemRowChild} ${
                            styles.flexColBottom
                          }`}>
                          <div className={styles.inputWrapper}>
                            {this.state.entryContent.entry.length ===
                            index + 1 ? (
                              <button
                                type="submit"
                                onClick={this.newEntrySubmitHandler}
                                className={styles.primaryButton}>
                                {this.state.isSubmitting ? (
                                  <Spinner
                                    isDarkTheme={isDarkTheme}
                                    isStripped={true}
                                  />
                                ) : (
                                  <div className={styles.contents}>
                                    {' '}
                                    {this.state.isEditEntry ? `Update` : `Add`}
                                  </div>
                                )}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div
                    styles={{ cursor: 'pointer' }}
                    onClick={this.addAdditionalCourseClickHandler}>
                    add additional course{' '}
                  </div>
                </div>

                <div
                  onClick={this.testClickHandler}
                  style={{ cursor: 'pointer' }}>
                  click me
                </div>
                <div
                  className={
                    isDarkTheme
                      ? `${mainStyles.marginBottom20} ${
                          styles.formItemWrapper
                        } ${tableStyles.timetable}`
                      : `${mainStyles.marginBottom20} ${
                          styles.formItemWrapper
                        } ${tableStyles.timetable} ${tableStyles.lightTheme}`
                  }>
                  {/* <h6 className={tableStyles.title}>
                    {this.props.classes.loading ||
                    this.props.classes.classList === null
                      ? 'Loading'
                      : this.state.nameOfClass}
                  </h6> */}
                  <table>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Day</th>
                        <th>Ⅰ</th>
                        <th>Ⅱ</th>
                        <th>Ⅲ</th>
                        <th>Ⅳ</th>
                        <th>Ⅴ</th>
                        <th>Ⅵ</th>
                        <th>Ⅶ</th>
                        <th>Ⅷ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots}
                      {/* <tr>
                        <td style={{ textAlign: 'left' }}>Monday</td>
                        <td>
                          <Select
                            options={classOptions}
                            isLoading={this.props.classes.loading}
                            isSearchable={true}
                            placeholder="Course"
                            isMulti={true}
                            styles={customStyles}
                            className={tableStyles.selectContainer}
                            filterOption={createFilter(filterConfig)}
                          />
                        </td>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left' }}>Tuesday</td>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left' }}>Wednesday</td>
                        <td />
                        <td />
                        <td />
                        <td /> 
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left' }}>Thursday</td>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left' }}>Friday</td>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr> */}
                    </tbody>
                  </table>
                </div>
                <div
                  className={`${mainStyles.marginBottom20} ${
                    styles.formItemWrapper
                  }`}>
                  <div
                    className={`${styles.inputWrapper} ${
                      mainStyles.marginTop8
                    }`}>
                    <button
                      style={{ borderRadius: '5px' }}
                      type="submit"
                      className={loginStyles.login}>
                      {this.state.isSubmitting ? (
                        <span className={loginStyles.spinner}>
                          <span className={loginStyles.spinnerInner}>
                            <span
                              className={`${loginStyles.pulsingEllipsisItem} ${
                                loginStyles.spinnerItem
                              }`}
                            />
                            <span
                              className={`${loginStyles.pulsingEllipsisItem} ${
                                loginStyles.spinnerItem
                              }`}
                            />
                            <span
                              className={`${loginStyles.pulsingEllipsisItem} ${
                                loginStyles.spinnerItem
                              }`}
                            />
                          </span>
                        </span>
                      ) : (
                        <div className={loginStyles.contents}>Add Class</div>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Timetable.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  classes: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    classList: PropTypes.array.isRequired
  }),
  courses: PropTypes.object.isRequired,
  timetable: PropTypes.object.isRequired,
  updateCurrentRouteTitle: PropTypes.func.isRequired,
  getTimetable: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  profile: state.profile,
  classes: state.classes,
  courses: state.courses,
  staff: state.staff,
  timetable: state.timetable
});

export default connect(
  mapStateToProps,
  { updateCurrentRouteTitle, getTimetable }
)(withRouter(Timetable));
